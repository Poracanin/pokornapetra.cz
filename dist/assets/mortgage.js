export function calculateMortgage({price,deposit,rate,years}){
 if(![price,deposit,rate,years].every(Number.isFinite)||price<100000||price>50000000||deposit<0||deposit>price||rate<0||rate>15||!Number.isInteger(years)||years<1||years>40)throw new RangeError('Zkontrolujte zadané hodnoty. Vlastní prostředky nemohou převýšit cenu nemovitosti.');
 const principal=price-deposit,months=years*12,r=rate/1200;
 const monthly=principal===0?0:r===0?principal/months:principal*r/(-Math.expm1(-months*Math.log1p(r)));
 return {principal,months,monthly,total:monthly*months,interest:Math.max(0,monthly*months-principal)};
}
