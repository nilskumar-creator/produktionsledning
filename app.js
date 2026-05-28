/* ===== Delade interaktiva komponenter för lärsidan ===== */

/* ---------- Lokal framstegsmarkering (endast i webbläsaren) ---------- */
function markDone(moduleId){
  try{
    const done = JSON.parse(localStorage.getItem('pl_done')||'[]');
    if(!done.includes(moduleId)){ done.push(moduleId); localStorage.setItem('pl_done', JSON.stringify(done)); }
  }catch(e){}
}
function getDone(){
  try{ return JSON.parse(localStorage.getItem('pl_done')||'[]'); }catch(e){ return []; }
}

/* ---------- Beläggningskurva (Modul 2) ---------- */
function occupancyLab(mountId){
  const wf = r => (r/100)/(1-r/100);
  const W=600,H=260,padL=44,padR=16,padT=16,padB=32;
  const px = r => padL + (r-30)/(99-30)*(W-padL-padR);
  const py = f => (H-padB) - (Math.min(f,20)/20)*(H-padT-padB);
  const host = document.getElementById(mountId);
  host.innerHTML = `
    <div style="background:linear-gradient(180deg,#fcfbf8,#f7f1e7);border-radius:16px;border:1px solid var(--line);padding:14px 14px 6px">
      <svg id="${mountId}-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet"></svg>
    </div>
    <div class="metrics">
      <div class="metric" id="${mountId}-mU"><div class="lab2">Beläggning</div><div class="val" id="${mountId}-vU">85%</div></div>
      <div class="metric" id="${mountId}-mW"><div class="lab2">Relativ väntetid</div><div class="val" id="${mountId}-vW">5,7×</div></div>
      <div class="metric" id="${mountId}-mS"><div class="lab2">Läge</div><div class="val" id="${mountId}-vS" style="font-size:20px">Ansträngt</div></div>
    </div>
    <div class="ctrl"><label>Beläggningsgrad <b id="${mountId}-lab">85%</b></label>
      <input type="range" class="hot" id="${mountId}-slider" min="30" max="99" value="85" step="1"></div>
    <div class="verdict" id="${mountId}-verdict"></div>`;
  const svg=document.getElementById(`${mountId}-svg`);
  // static curve
  let path='';
  for(let r=30;r<=99;r++){ path+=(r===30?`M${px(r)},${py(wf(r))}`:` L${px(r)},${py(wf(r))}`); }
  let grid='';
  for(let r=30;r<=99;r+=10){ grid+=`<line x1="${px(r)}" y1="${padT}" x2="${px(r)}" y2="${H-padB}" stroke="#e9dfce"/><text x="${px(r)}" y="${H-padB+18}" fill="#a99c87" font-size="11" text-anchor="middle" font-family="Outfit">${r}%</text>`; }
  grid+=`<text x="${padL-8}" y="${padT+9}" fill="#a99c87" font-size="11" text-anchor="end" font-family="Outfit">hög</text><text x="${padL-8}" y="${H-padB}" fill="#a99c87" font-size="11" text-anchor="end" font-family="Outfit">låg</text>`;
  const dz=px(90);
  svg.innerHTML = grid + `<rect x="${dz}" y="${padT}" width="${(W-padR)-dz}" height="${H-padB-padT}" fill="#e8543f" opacity="0.06"/>`
    + `<path d="${path}" fill="none" stroke="#0f8a8a" stroke-width="3.5" stroke-linecap="round"/>`
    + `<circle id="${mountId}-dot" r="9" fill="#fff" stroke="#ff6b5e" stroke-width="4"/>`;
  const sl=document.getElementById(`${mountId}-slider`);
  function upd(){
    const r=+sl.value, f=wf(r);
    document.getElementById(`${mountId}-lab`).textContent=r+'%';
    document.getElementById(`${mountId}-vU`).textContent=r+'%';
    document.getElementById(`${mountId}-vW`).textContent=f.toFixed(1).replace('.',',')+'×';
    const dot=document.getElementById(`${mountId}-dot`); dot.setAttribute('cx',px(r)); dot.setAttribute('cy',py(f));
    const mW=document.getElementById(`${mountId}-mW`), mS=document.getElementById(`${mountId}-mS`);
    const vS=document.getElementById(`${mountId}-vS`), vd=document.getElementById(`${mountId}-verdict`);
    mW.className='metric'; mS.className='metric';
    let label,t,c,bg,bd;
    if(r<=75){label='Luftigt';mW.classList.add('ok');mS.classList.add('ok');t='<b>Gott om luft.</b> Systemet hinner återhämta sig mellan topparna. Väntetiderna är korta och stabila.';c='#1f6b46';bg='#e3f5ec';bd='#bce5cf';}
    else if(r<=88){label='Ansträngt';mW.classList.add('warn');mS.classList.add('warn');t='<b>Här börjar det svaja.</b> Varje störning märks tydligare och tar längre tid att jobba ikapp.';c='#8a5a09';bg='#fff3da';bd='#f3dca5';}
    else{label='Kritiskt';mW.classList.add('danger');mS.classList.add('danger');t='<b>Klippkanten.</b> Nu skenar väntetiderna — ingen luft kvar att återhämta sig i, så köerna byggs på varandra.';c='#a33222';bg='#fdeae6';bd='#f6c4ba';}
    vS.textContent=label; vd.innerHTML=t; vd.style.color=c; vd.style.background=bg; vd.style.borderColor=bd;
    mW.classList.add('pop'); setTimeout(()=>mW.classList.remove('pop'),350);
  }
  sl.addEventListener('input',upd); upd();
}

/* ---------- Lilles lag-labb (Modul 1) ---------- */
function littleLab(mountId){
  const host=document.getElementById(mountId);
  host.innerHTML=`
    <div class="ctrl"><label>Inflöde (remisser/vecka) — λ <b id="${mountId}-vL">15</b></label>
      <input type="range" id="${mountId}-L" min="5" max="40" value="15" step="1"></div>
    <div class="ctrl"><label>Genomloppstid (veckor) — W <b id="${mountId}-vW">8</b></label>
      <input type="range" id="${mountId}-W" min="1" max="20" value="8" step="1"></div>
    <div style="text-align:center;background:#fff;border:1.5px solid var(--line);border-radius:16px;padding:20px;margin-top:8px">
      <div style="font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#8a7d6a;font-weight:600">Patienter i systemet — L</div>
      <div id="${mountId}-out" style="font-family:'Fraunces',serif;font-weight:900;font-size:52px;color:var(--teal);line-height:1.1" class="pop">120</div>
      <div style="font-size:14px;color:#6d6151;margin-top:4px">L = λ × W = <span id="${mountId}-eq">15 × 8</span></div>
    </div>
    <div class="verdict" id="${mountId}-v" style="color:#1b4a4a;background:#eef7f7;border-color:var(--teal)"></div>`;
  const L=document.getElementById(`${mountId}-L`), Wc=document.getElementById(`${mountId}-W`);
  function upd(){
    const lam=+L.value, w=+Wc.value, prod=lam*w;
    document.getElementById(`${mountId}-vL`).textContent=lam;
    document.getElementById(`${mountId}-vW`).textContent=w;
    const out=document.getElementById(`${mountId}-out`); out.textContent=prod; out.classList.remove('pop');void out.offsetWidth; out.classList.add('pop');
    document.getElementById(`${mountId}-eq`).textContent=`${lam} × ${w}`;
    const v=document.getElementById(`${mountId}-v`);
    if(prod>200) v.innerHTML='Stor väntelista. Vill du krympa den måste antingen inflödet ner eller genomloppstiden kortas — det finns ingen tredje knapp i formeln.';
    else if(prod<60) v.innerHTML='Liten väntelista och kort väntan. Kanske finns utrymme att ta emot fler patienter.';
    else v.innerHTML='Hanterbar nivå. Lägg märke till att om du drar ner W (kortare genomloppstid) så sjunker L direkt — det är så flödesförbättring krymper väntelistan.';
  }
  L.addEventListener('input',upd); Wc.addEventListener('input',upd); upd();
}

/* ---------- Quizmotor (per modul) ---------- */
function buildQuiz(mountId, questions){
  const host=document.getElementById(mountId);
  let html='';
  questions.forEach((it,qi)=>{
    html+=`<div class="qitem" data-qi="${qi}"><div class="qq">${qi+1}. ${it.q}</div><div class="opts">`;
    it.opts.forEach((o,oi)=>{ html+=`<button class="opt" data-oi="${oi}">${o}</button>`; });
    html+=`</div><div class="explain">${it.e}</div></div>`;
  });
  host.innerHTML=html;
  host.querySelectorAll('.qitem').forEach((item,qi)=>{
    const correct=questions[qi].a;
    const opts=item.querySelectorAll('.opt');
    opts.forEach((btn,oi)=>{
      btn.addEventListener('click',()=>{
        if(item.dataset.answered) return; item.dataset.answered='1';
        opts.forEach((b,i)=>{ b.classList.add('locked'); if(i===correct){b.classList.add('correct');b.insertAdjacentHTML('beforeend','<span class="mark">✓</span>');} });
        if(oi!==correct){ btn.classList.add('wrong'); btn.insertAdjacentHTML('beforeend','<span class="mark">✗</span>'); }
        item.querySelector('.explain').classList.add('show');
      });
    });
  });
}

/* ---------- Bygg toppmeny ---------- */
function buildNav(current){
  const mods=[
    ['index.html','Start'],['modul0.html','0'],['modul1.html','1'],['modul2.html','2'],
    ['modul3.html','3'],['modul4.html','4'],['modul5.html','5'],['modul6.html','6'],['modul7.html','7']
  ];
  let links=mods.map(([href,label])=>{
    const cls = label==='Start'?'home':'';
    const act = href===current?'style="background:#d6f0ef;color:var(--teal-dk)"':'';
    return `<a class="${cls}" href="${href}" ${act}>${label}</a>`;
  }).join('');
  return `<div class="topbar"><div class="inner">
    <div class="brand"><a href="index.html">Produktionsledning<span class="dot">.</span></a></div>
    <nav class="navlinks">${links}</nav>
  </div></div>`;
}
