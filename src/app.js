import './motion.js';

const menuButton=document.querySelector('.menu-toggle');
const menu=document.querySelector('#navigation');
function closeMenu(){menuButton?.setAttribute('aria-expanded','false');menu?.classList.remove('is-open');}
menuButton?.addEventListener('click',()=>{const opened=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!opened));menu?.classList.toggle('is-open',!opened)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuButton?.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus()}});
document.addEventListener('click',e=>{if(menu&&!menu.contains(e.target)&&!menuButton.contains(e.target))closeMenu()});

import {calculateMortgage} from './mortgage.js';
const currency=n=>new Intl.NumberFormat('cs-CZ',{maximumFractionDigits:0}).format(n)+' Kč';
const params=new URLSearchParams(location.search);
const filters=document.querySelector('#property-filters');
if(filters){
 const cards=[...document.querySelectorAll('[data-property]')],results=document.querySelector('#property-results');
 const names=['offer','city','type','price'];
 for(const name of names){const value=params.get(name);if(value!==null){const control=filters.elements.namedItem(name);if(name==='offer'){if(['all','prodej','pronajem'].includes(value))control.value=value}else if([...control.options].some(o=>o.value===value))control.value=value;}}
 const sort=document.querySelector('#property-sort');if(['asc','desc'].includes(params.get('sort')))sort.value=params.get('sort');
 function updateFilters(){
  const data=new FormData(filters),offer=data.get('offer'),city=data.get('city'),type=data.get('type'),max=Number(data.get('price'));
  let count=0;cards.forEach(card=>{const match=offer!=='pronajem'&&(!city||card.dataset.city===city)&&(!type||card.dataset.type===type)&&(!max||Number(card.dataset.price)<=max);card.hidden=!match;if(match)count++});
  const ordered=[...cards];if(sort.value==='asc')ordered.sort((a,b)=>Number(a.dataset.price)-Number(b.dataset.price));if(sort.value==='desc')ordered.sort((a,b)=>Number(b.dataset.price)-Number(a.dataset.price));ordered.forEach(card=>results.append(card));
  document.querySelector('#result-count').textContent=count===1?'1 nemovitost':count>=2&&count<=4?`${count} nemovitosti`:`${count} nemovitostí`;
  document.querySelector('#empty-properties').hidden=count>0;
  document.querySelector('#reset-filters').hidden=!((offer&&offer!=='all')||city||type||max||sort.value!=='default');
  const query=new URLSearchParams();for(const name of names){const value=data.get(name);if(value&&value!=='all')query.set(name,value)}if(sort.value!=='default')query.set('sort',sort.value);history.replaceState(null,'',location.pathname+(query.size?'?'+query:''));
 }
 filters.addEventListener('submit',e=>{e.preventDefault();updateFilters()});filters.addEventListener('change',updateFilters);sort.addEventListener('change',updateFilters);
 const reset=()=>{filters.reset();sort.value='default';updateFilters()};document.querySelector('#reset-filters').addEventListener('click',reset);document.querySelector('[data-reset-filters]').addEventListener('click',reset);updateFilters();
}
const articleInputs=document.querySelectorAll('[name="article-category"]');
articleInputs.forEach(input=>input.addEventListener('change',()=>{let count=0;document.querySelectorAll('[data-article]').forEach(card=>{card.hidden=input.value!=='Vše'&&card.dataset.category!==input.value;if(!card.hidden)count++});document.querySelector('#article-count').textContent=count===1?'1 článek':`${count} články`;}));
const gallery=document.querySelector('#gallery-dialog');
if(gallery){
 const {photos,title}=JSON.parse(document.querySelector('#gallery-data').textContent);let index=0,trigger;
 const show=i=>{index=(i+photos.length)%photos.length;document.querySelector('#gallery-image').src=photos[index];document.querySelector('#gallery-image').alt=`${title} – fotografie ${index+1} z ${photos.length}`;document.querySelector('#gallery-count').textContent=`${index+1} / ${photos.length}`;};
 document.querySelectorAll('[data-gallery-open]').forEach(button=>button.addEventListener('click',()=>{trigger=button;show(Number(button.dataset.galleryOpen));gallery.showModal()}));
 document.querySelector('[data-gallery-close]').addEventListener('click',()=>gallery.close());
 document.querySelector('[data-gallery-prev]').addEventListener('click',()=>show(index-1));document.querySelector('[data-gallery-next]').addEventListener('click',()=>show(index+1));
 gallery.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();show(index-1)}if(e.key==='ArrowRight'){e.preventDefault();show(index+1)}});
 gallery.addEventListener('click',e=>{if(e.target===gallery)gallery.close()});gallery.addEventListener('close',()=>trigger?.focus());
 let touchX;gallery.addEventListener('touchstart',e=>touchX=e.changedTouches[0].screenX,{passive:true});gallery.addEventListener('touchend',e=>{const diff=e.changedTouches[0].screenX-touchX;if(Math.abs(diff)>60)show(index+(diff<0?1:-1))},{passive:true});
}
const mortgage=document.querySelector('#mortgage-form');
if(mortgage){
 const ids=['price','deposit','rate','years'];const controls=Object.fromEntries(ids.map(id=>[id,mortgage.elements.namedItem(id)]));
 const read=()=>Object.fromEntries(ids.map(id=>[id,controls[id].value===''?NaN:Number(controls[id].value)]));
 const ranges=Object.fromEntries(ids.map(id=>[id,mortgage.querySelector(`[data-range="${id}"]`)]));
 function paintRanges(){for(const id of ids){const input=ranges[id];input.style.setProperty('--range-progress',`${100*(Number(input.value)-Number(input.min))/(Number(input.max)-Number(input.min))}%`);}}
 function update(){
  const values=read(),error=document.querySelector('#calculator-error'),contact=document.querySelector('#mortgage-contact');
  if(Number.isFinite(values.price)&&values.price>=100000&&values.price<=50000000){controls.deposit.max=String(values.price);ranges.deposit.max=String(values.price);mortgage.querySelector('[data-range="deposit"] + .range-limits span:last-child').textContent=currency(values.price)}
  for(const id of ids)if(Number.isFinite(values[id]))ranges[id].value=String(values[id]);paintRanges();
  try{const result=calculateMortgage(values);error.hidden=true;document.querySelector('#mobile-payment').textContent=currency(result.monthly);controls.deposit.setCustomValidity('');document.querySelector('#monthly-payment').textContent=new Intl.NumberFormat('cs-CZ',{maximumFractionDigits:0}).format(result.monthly);document.querySelector('#loan-amount').textContent=currency(result.principal);document.querySelector('#total-payment').textContent=currency(result.total);document.querySelector('#total-interest').textContent=currency(result.interest);document.querySelector('.result-caption').textContent=result.principal===0?'Při těchto hodnotách úvěr nepotřebujete.':'Každý měsíc blíž k vlastnímu.';contact.href='/kontakt/?'+new URLSearchParams({tema:'financovani',cena:values.price,vlastni:values.deposit,sazba:values.rate,roky:values.years});return result;}
  catch(err){error.textContent=err.message;error.hidden=false;document.querySelector('#mobile-payment').textContent='Zkontrolujte hodnoty';document.querySelector('#monthly-payment').textContent='—';for(const id of ['loan-amount','total-payment','total-interest'])document.getElementById(id).textContent='—';contact.href='/kontakt/?tema=financovani';if(values.deposit>values.price)controls.deposit.setCustomValidity('Vlastní prostředky nemohou převýšit cenu nemovitosti.');return null;}
 }
 for(const id of ids){controls[id].addEventListener('input',update);ranges[id].addEventListener('input',()=>{controls[id].value=ranges[id].value;update()})}
 mortgage.addEventListener('submit',e=>e.preventDefault());mortgage.addEventListener('reset',()=>setTimeout(()=>{controls.deposit.max='5000000';ranges.deposit.max='5000000';update()},0));
 const fromListing=Number(params.get('cena'));if(fromListing>=100000&&fromListing<=50000000){controls.price.value=fromListing;controls.deposit.value=Math.round(fromListing*.2)}update();
 if(document.modelContext?.registerTool){const lifecycle=new AbortController();Promise.resolve(document.modelContext.registerTool({name:'configure_mortgage_calculator',title:'Nastavit hypoteční kalkulačku',description:'Nastaví modelové hodnoty viditelné kalkulačky a vrátí orientační výsledek. Nevytváří žádost o úvěr.',inputSchema:{type:'object',properties:{price:{type:'number',minimum:100000,maximum:50000000},deposit:{type:'number',minimum:0},rate:{type:'number',minimum:0,maximum:15},years:{type:'integer',minimum:1,maximum:40}},required:ids,additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){const result=calculateMortgage(input);for(const id of ids)controls[id].value=input[id];update();return {monthlyPayment:Math.round(result.monthly),loan:result.principal,currency:'CZK'};}},{signal:lifecycle.signal})).catch(()=>{});window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true})}
}
const contactForm=document.querySelector('#contact-form');
if(contactForm){
 const topic=contactForm.elements.topic;const selected=params.get('tema');if([...topic.options].some(o=>o.value===selected))topic.value=selected;
 const property=JSON.parse(document.querySelector('#contact-properties').textContent).find(p=>p.id===params.get('nemovitost'));
 if(property){topic.value='prohlidka';contactForm.elements.message.value=`Dobrý den, mám zájem o prohlídku nemovitosti „${property.title}“ (ID ${property.id}). Prosím o domluvení termínu. Děkuji.`}
 if(selected==='financovani'){
  const price=Number(params.get('cena')),deposit=Number(params.get('vlastni')),rate=Number(params.get('sazba')),years=Number(params.get('roky'));
  try{const r=calculateMortgage({price,deposit,rate,years});contactForm.elements.message.value=`Dobrý den, ráda/rád bych probral/a možnosti financování.\n\nModelový výpočet:\nCena nemovitosti: ${currency(price)}\nVlastní prostředky: ${currency(deposit)}\nÚroková sazba: ${rate.toLocaleString('cs-CZ')} %\nDoba splácení: ${years} let\nOrientační splátka: ${currency(r.monthly)} měsíčně.\n\nProsím o kontakt. Děkuji.`}catch{}
 }
 contactForm.addEventListener('submit',e=>{e.preventDefault();if(!contactForm.reportValidity())return;const data=new FormData(contactForm);const subject=`${topic.selectedOptions[0].textContent}${property?' – '+property.title:''}`;const message=`${String(data.get('message')).trim()}\n\n${String(data.get('name')).trim()}\nE-mail: ${data.get('email')}${data.get('phone')?'\nTelefon: '+data.get('phone'):''}`;document.querySelector('#open-email').href='mailto:petra.pokorna@bidli.cz?'+new URLSearchParams({subject,body:message}).toString().replace(/\+/g,'%20');document.querySelector('#prepared-message').value=`Komu: petra.pokorna@bidli.cz\nPředmět: ${subject}\n\n${message}`;const ready=document.querySelector('#email-ready');ready.hidden=false;document.querySelector('#copy-status').textContent='';ready.scrollIntoView({behavior:'smooth',block:'center'});});
 contactForm.addEventListener('input',()=>document.querySelector('#email-ready').hidden=true);
 document.querySelector('#copy-message').addEventListener('click',async()=>{const prepared=document.querySelector('#prepared-message');try{await navigator.clipboard.writeText(prepared.value);document.querySelector('#copy-status').textContent='Zpráva je zkopírovaná. Vložte ji do svého e-mailu.'}catch{prepared.focus();prepared.select();document.querySelector('#copy-status').textContent='Text je vybraný. Zkopírujte jej pomocí Ctrl+C nebo ⌘C.'}});
}
