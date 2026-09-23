import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {calculateMortgage} from '../src/mortgage.js';
const root=path.resolve('dist');const files=fs.readdirSync(root,{recursive:true}).filter(x=>x.endsWith('.html'));const errors=[];let links=0;
for(const filename of files){const html=fs.readFileSync(path.join(root,filename),'utf8');if((html.match(/<h1[ >]/g)||[]).length!==1)errors.push(`${filename}: expected one h1`);if(!html.includes('<html lang="cs">'))errors.push(`${filename}: language missing`);
 for(const [,attr,value]of html.matchAll(/\b(href|src)="([^"]+)"/g)){if(!value.startsWith('/')||value.startsWith('//'))continue;let target=decodeURIComponent(value.split('?')[0].split('#')[0]);let f=path.join(root,target);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f))errors.push(`${filename}: missing ${value}`);links++;}
}
const base=calculateMortgage({price:5000000,deposit:1000000,rate:4.5,years:30});assert.equal(Math.round(base.monthly),20267);assert.ok(Math.abs(base.monthly-20267.4124)<.01);
assert.equal(calculateMortgage({price:5000000,deposit:1000000,rate:0,years:20}).monthly,4000000/240);
assert.equal(calculateMortgage({price:5000000,deposit:5000000,rate:4.5,years:30}).monthly,0);
for(const input of [{price:NaN,deposit:0,rate:4.5,years:30},{price:1000000,deposit:2000000,rate:4.5,years:30},{price:1000000,deposit:0,rate:-1,years:30},{price:1000000,deposit:0,rate:4.5,years:0}])assert.throws(()=>calculateMortgage(input),RangeError);
if(errors.length){console.error(errors.join('\n'));process.exit(1)}console.log(`PASS: ${files.length} pages, ${links} local links/assets, mortgage example + zero interest + zero loan + 4 invalid cases.`);
