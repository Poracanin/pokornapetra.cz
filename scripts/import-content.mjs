import fs from 'node:fs';
import path from 'node:path';
const source=path.resolve('../podklady');
const overrides={
 '236529':{slug:'vila-stehelceves',title:'Vila ve Stehelčevsi',headline:'Prostor pro život. I vaše velké plány.',location:'Stehelčeves, okres Kladno',type:'dum',area:318,layout:'4+kk',teaser:'Nízkoenergetická vila se zahradou, bazénem a samostatným prostorem pro podnikání.'},
 '236012':{slug:'byt-praha-prosek',title:'Světlý byt 3+1 s lodžií',headline:'Váš nový domov nad zeleným Prosekem.',location:'Praha 9 – Prosek, Vysočanská',type:'byt',area:74,layout:'3+1',teaser:'Zrekonstruovaný byt s prosklenou lodžií, výtahem a parkem Přátelství za rohem.'},
 '235448':{slug:'chalupa-orlik',title:'Chalupa u Orlíku',headline:'Místo, kde můžete trochu zpomalit.',location:'Orlík nad Vltavou, Staré Sedlo',type:'chalupa',area:154,layout:'2 jednotky',teaser:'Dům se dvěma bytovými jednotkami, uzavřenou zahradou a stodolou nedaleko Orlické přehrady.'}
};
const records=[];
for(const folder of fs.readdirSync(path.join(source,'inzeraty/aktualni'))){
 const dir=path.join(source,'inzeraty/aktualni',folder);if(!fs.statSync(dir).isDirectory())continue;
 const d=JSON.parse(fs.readFileSync(path.join(dir,'data.json'),'utf8'));
 const imageDir=`dist/assets/properties/${d.id}`;fs.mkdirSync(imageDir,{recursive:true});
 const photos=d.fotky.filter(p=>p.stazeno).map((p,i)=>{const ext=path.extname(p.soubor);const dest=`${imageDir}/${i+1}${ext}`;fs.copyFileSync(path.join(dir,p.soubor),dest);return '/'+dest.slice(5)});
 records.push({...overrides[d.id],id:d.id,order:d.poradi_na_profilu,price:Number(d.cena.replace(/\D/g,'')),description:d.popis,parameters:d.parametry,media:d.media,priceNote:d.poznamka_k_cene,source:d.url,photos});
}
records.sort((a,b)=>a.order-b.order);fs.mkdirSync('content',{recursive:true});fs.writeFileSync('content/properties.json',JSON.stringify(records,null,2));
fs.copyFileSync(path.join(source,'profil/fotky/petra-pokorna-portret.png'),'dist/assets/petra-pokorna.png');
const raw=fs.readFileSync(path.join(source,'reference/reference.md'),'utf8');
const reviews=[...raw.matchAll(/## \d+\. (.*?) — (.*?)\n\n([\s\S]*?)(?=\n##|$)/g)].map(m=>({name:m[1],date:m[2],text:m[3].trim()}));
fs.writeFileSync('content/reviews.json',JSON.stringify(reviews,null,2));
console.log(`Imported ${records.length} listings, ${records.reduce((n,r)=>n+r.photos.length,0)} photos and ${reviews.length} reviews.`);
