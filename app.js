const K='genshin_tracker_v5';
const D={targetName:'TSARITZA',targetDate:'2026-12-16',metaWishes:270,gems:243,wishes:68,pity:34,guaranteed:false,history:[],incomes:[]};
let d=(()=>{try{return {...D,...JSON.parse(localStorage.getItem(K))}}catch{return {...D}}})();
const $=x=>document.getElementById(x);
const fmt=x=>Number(x).toLocaleString('es-NI');
const today=()=>{let x=new Date();return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`};
const date=s=>{let[a,b,c]=s.split('-').map(Number);return new Date(a,b-1,c)};
const pretty=s=>date(s).toLocaleDateString('es-NI',{day:'numeric',month:'long',year:'numeric'});
const days=()=>Math.max(0,Math.ceil((date(d.targetDate)-date(today()))/86400000));
const eff=()=>d.wishes+d.pity+d.gems/160;
const sources={daily:'📅 Diarias',abyss:'🌌 Abismo',theater:'🎭 Teatro Imaginario',stygian:'🔥 Estigia',events:'🎉 Eventos',update:'🔄 Actualización',livestream:'📺 Livestream',anniversary:'🎂 Aniversario',quests:'📖 Misiones',exploration:'🗺️ Exploración',other:'✨ Otros'};
function save(){localStorage.setItem(K,JSON.stringify(d))}
function calc(){let e=eff(),mw=Math.max(0,d.metaWishes-e),mg=mw*160,dy=days(),q=dy?Math.ceil(mg/dy):Math.ceil(mg),t=d.history.filter(x=>x.date===today()).reduce((s,x)=>s+x.gems,0);return{e,mw,mg,dy,q,t,a:t-q}}
function render(){
 let x=calc(), pct=Math.min(100,x.e/d.metaWishes*100);
 $('targetTop').textContent=d.targetName;$('targetName').textContent=d.targetName;$('targetDate').textContent=pretty(d.targetDate);
 $('gems').textContent=fmt(d.gems);$('wishes').textContent=fmt(d.wishes);$('pity').textContent=`${d.pity}/90`;$('guarantee').textContent=d.guaranteed?'GARANTIZADO':'50/50';
 $('effective').textContent=`${x.e.toFixed(1)} deseos`;$('metaLabel').textContent=d.metaWishes;$('pct').textContent=`${pct.toFixed(1)}%`;$('bar').style.width=`${pct}%`;
 $('days').textContent=x.dy;$('missingGems').textContent=`Faltan ${fmt(Math.ceil(x.mg))} 💎`;$('missingWishes').textContent=`${x.mw.toFixed(1)} deseos`;
 $('quota').innerHTML=`${fmt(x.q)} <span>💎</span>`;$('formula').textContent=`${fmt(Math.ceil(x.mg))} restantes ÷ ${x.dy} días`;
 $('base').textContent=`${fmt(x.q)} 💎`;$('ahead').textContent=`${x.a>=0?'+':''}${fmt(x.a)} 💎`;$('ahead').style.color=x.a>=0?'var(--green)':'var(--red)';
 $('aheadDays').textContent=x.q?(x.a/x.q).toFixed(1):'0.0';$('today').textContent=`${fmt(x.t)} 💎`;$('todayMissing').textContent=`${fmt(Math.max(0,x.q-x.t))} 💎`;
 $('pityLeft').textContent=`${Math.max(0,90-d.pity)} tiros`;$('reserve').textContent=`${d.metaWishes} deseos`;
 renderHistory();renderIncome();
}
function renderHistory(){
 let box=$('historyList');
 if(!d.history.length){box.innerHTML='<div class="empty">Todavía no hay registros.</div>';return}
 let g={};[...d.history].reverse().forEach(x=>(g[x.date]??=[]).push(x));
 box.innerHTML=Object.entries(g).map(([day,a])=>{
   let total=a.reduce((s,x)=>s+x.gems,0);
   return `<article class="history-day"><div class="between"><div><div class="history-date">${pretty(day)}</div><div class="history-sub">${a.length} registro(s)</div></div><div class="history-total">+${fmt(total)} 💎</div></div><div class="history-list">${a.reverse().map(x=>`<div class="history-item"><span>${x.note}</span><b>+${fmt(x.gems)} 💎</b></div>`).join('')}</div></article>`
 }).join('')
}
function renderIncome(){
 let total=0;
 Object.keys(sources).forEach(k=>{
   let n=d.incomes.filter(x=>x.source===k).reduce((s,x)=>s+x.gems,0);total+=n;
   if($('sum-'+k)) $('sum-'+k).textContent=`${fmt(n)} 💎`;
 });
 $('incomeTotal').textContent=`${fmt(total)} 💎`;
}
function modal(title,body,actions){$('mt').textContent=title;$('mb').innerHTML=body;$('ma').innerHTML=actions;$('dlg').showModal()}
function closeDialog(){ $('dlg').close() }
window.closeDialog=closeDialog;
$('x').onclick=closeDialog;

$('add').onclick=()=>modal('Registrar saldo actual',
 `<div class="field"><label>Protogemas actuales</label><input id="v" type="number" min="0" value="${d.gems}"></div>
 <div class="notice">Introduce exactamente el saldo que aparece en el juego. El tracker calcula automáticamente la diferencia.</div>`,
 `<button type="button" onclick="close()">Cancelar</button><button class="confirm" type="button" onclick="addBalance()">Guardar</button>`);
window.addBalance=()=>{
 let v=+$('v').value;if(!Number.isFinite(v)||v<d.gems)return alert('El saldo nuevo debe ser válido y no menor al anterior.');
 let gain=v-d.gems;d.gems=v;d.history.push({date:today(),gems:gain,note:'Saldo actual registrado'});save();closeDialog();render()
};

$('addIncome').onclick=()=>modal('Registrar ingreso por fuente',
 `<div class="field"><label>Fuente</label><select id="src">${Object.entries(sources).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></div>
 <div class="field"><label>Protogemas estimadas/obtenidas</label><input id="iv" type="number" min="0" value="60"></div>
 <div class="field"><label>Nota (opcional)</label><input id="inote" placeholder="Ej. reinicio 1-15"></div>
 <div class="notice">Esto alimenta el panel de fuentes. No cambia tu saldo actual.</div>`,
 `<button type="button" onclick="close()">Cancelar</button><button class="confirm" type="button" onclick="addIncome()">Guardar</button>`);
window.addIncome=()=>{
 let v=+$('iv').value;if(!Number.isFinite(v)||v<0)return alert('Cantidad inválida.');
 d.incomes.push({date:today(),source:$('src').value,gems:v,note:$('inote').value||'Ingreso registrado'});save();closeDialog();render()
};

$('config').onclick=()=>modal('Configuración',
 `<div class="field"><label>Objetivo</label><input id="n" value="${d.targetName}"></div>
 <div class="field"><label>Fecha límite</label><input id="dt" type="date" value="${d.targetDate}"></div>
 <div class="field"><label>Meta de seguridad (deseos efectivos)</label><input id="mw" type="number" min="1" value="${d.metaWishes}"></div>
 <div class="field"><label>Protogemas</label><input id="gm" type="number" min="0" value="${d.gems}"></div>
 <div class="field"><label>Deseos</label><input id="ws" type="number" min="0" value="${d.wishes}"></div>
 <div class="field"><label>Pity (0–89)</label><input id="py" type="number" min="0" max="89" value="${d.pity}"></div>
 <div class="field"><label>Próximo 5★</label><select id="gu"><option value="0" ${!d.guaranteed?'selected':''}>50/50</option><option value="1" ${d.guaranteed?'selected':''}>Garantizado</option></select></div>`,
 `<button type="button" onclick="close()">Cancelar</button><button class="confirm" type="button" onclick="cfg()">Guardar</button>`);
window.cfg=()=>{
 d.targetName=$('n').value||'OBJETIVO';d.targetDate=$('dt').value;d.metaWishes=Math.max(1,+$('mw').value);
 d.gems=Math.max(0,+$('gm').value);d.wishes=Math.max(0,+$('ws').value);d.pity=Math.max(0,Math.min(89,+$('py').value));d.guaranteed=$('gu').value==='1';
 save();closeDialog();render()
};

$('pityBtn').onclick=()=>modal('Actualizar pity',
 `<div class="field"><label>Pity actual (0–89)</label><input id="py2" type="number" min="0" max="89" value="${d.pity}"></div>
 <div class="field"><label>Próximo 5★</label><select id="gu2"><option value="0" ${!d.guaranteed?'selected':''}>50/50</option><option value="1" ${d.guaranteed?'selected':''}>Garantizado</option></select></div>`,
 `<button type="button" onclick="close()">Cancelar</button><button class="confirm" type="button" onclick="updPity()">Guardar</button>`);
window.updPity=()=>{d.pity=Math.max(0,Math.min(89,+$('py2').value));d.guaranteed=$('gu2').value==='1';save();closeDialog();render()};

$('close').onclick=()=>modal('Cerrar día',
 `<div class="notice">¿Quieres cerrar ${pretty(today())}? El cierre se guarda como un registro visual y no altera tu saldo.</div>`,
 `<button type="button" onclick="close()">Cancelar</button><button class="confirm" type="button" onclick="closeDay()">Cerrar día</button>`);
window.closeDay=()=>{d.history.push({date:today(),gems:0,note:'🔒 Día cerrado'});save();closeDialog();render()};

$('undo').onclick=()=>{if(!d.history.length)return alert('No hay registros para deshacer.');d.history.pop();save();render()};
$('clear').onclick=()=>{if(confirm('¿Limpiar todo el historial?')){d.history=[];save();render()}};

$('export').onclick=()=>{
 const blob=new Blob([JSON.stringify(d,null,2)],{type:'application/json'}),a=document.createElement('a');
 a.href=URL.createObjectURL(blob);a.download=`genshin-tracker-backup-${today()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)
};
$('import').onclick=()=>$('file').click();
$('file').onchange=e=>{
 const f=e.target.files[0];if(!f)return;let r=new FileReader();
 r.onload=()=>{try{let x=JSON.parse(r.result);if(!confirm('Importar este respaldo y reemplazar los datos actuales?'))return;d={...D,...x,incomes:x.incomes||[]};save();render();alert('Respaldo importado correctamente.')}catch{alert('El archivo no es un respaldo JSON válido.')}};
 r.readAsText(f);e.target.value=''
};
$('reset').onclick=()=>{if(confirm('Esto borrará el tracker local. ¿Continuar?')){d={...D,history:[],incomes:[]};save();render()}};

document.querySelectorAll('.tab').forEach(btn=>btn.onclick=()=>{
 document.querySelectorAll('.tab,.tab-panel').forEach(x=>x.classList.remove('active'));
 btn.classList.add('active');$(btn.dataset.tab).classList.add('active');
});
document.querySelectorAll('.income-card').forEach(card=>card.onclick=()=>{
 const src=card.dataset.source, items=d.incomes.filter(x=>x.source===src);
 const total=items.reduce((s,x)=>s+x.gems,0);
 modal(sources[src], `<div class="source-total">${fmt(total)} 💎</div>`+
   (items.length?items.slice().reverse().map(x=>`<div class="income-row"><span>${pretty(x.date)}<small>${x.note||''}</small></span><b>+${fmt(x.gems)} 💎</b></div>`).join(''):'<div class="empty">Todavía no hay registros para esta fuente.</div>'),
   `<button type="button" class="confirm" onclick="close()">Cerrar</button>`);
});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
render();