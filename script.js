document.addEventListener('DOMContentLoaded',()=>{
  // Tabs
  document.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click',()=>{
      // If the tab has an external href target, navigate to it.
      if(btn.dataset.href){
        window.location.href = btn.dataset.href;
        return;
      }

      document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.target);
      if(target) target.classList.add('active');
    })
  })

  // Ballast
  const bCalc = ()=>{
    const L = parseFloat(document.getElementById('b-length').value)||0;
    const W = parseFloat(document.getElementById('b-width').value)||0;
    const D = parseFloat(document.getElementById('b-depth').value)||0;
    const rho = parseFloat(document.getElementById('b-density').value)||1600;
    const vol = L*W*D; // m3
    const mass = vol*rho; // kg
    const out = document.getElementById('b-output');
    out.innerHTML = `<strong>Volume:</strong> ${vol.toFixed(3)} m³<br><strong>Mass:</strong> ${mass.toFixed(1)} kg (${(mass/1000).toFixed(3)} t)`;
    storeState('ballast',{volume:vol,mass:mass});
    updateSummary();
  }

  document.getElementById('b-calc').addEventListener('click',bCalc);
  document.getElementById('b-clear').addEventListener('click',()=>{
    document.getElementById('b-length').value='';
    document.getElementById('b-width').value='';
    document.getElementById('b-depth').value='';
    document.getElementById('b-density').value='1600';
    document.getElementById('b-output').textContent='';
    storeState('ballast',null);
    updateSummary();
  });

  // Materials
  document.getElementById('m-calc').addEventListener('click',()=>{
    const area = parseFloat(document.getElementById('m-area').value)||0;
    const cov = parseFloat(document.getElementById('m-coverage').value)||1;
    const price = parseFloat(document.getElementById('m-price').value)||0;
    const units = Math.ceil(area / cov);
    const total = units * price;
    document.getElementById('m-output').innerHTML = `<strong>Units needed:</strong> ${units}<br><strong>Total cost:</strong> ${total.toFixed(2)}`;
    storeState('materials',{area:area,units:units,total:total});
    updateSummary();
  });

  // Fasteners
  document.getElementById('f-calc').addEventListener('click',()=>{
    const sleepers = parseInt(document.getElementById('f-sleepers').value)||0;
    const bolts = parseInt(document.getElementById('f-bolts').value)||0;
    const cost = parseFloat(document.getElementById('f-cost').value)||0;
    const totalBolts = sleepers * bolts;
    const totalCost = totalBolts * cost;
    document.getElementById('f-output').innerHTML = `<strong>Total bolts:</strong> ${totalBolts}<br><strong>Total cost:</strong> ${totalCost.toFixed(2)}`;
    storeState('fasteners',{bolts:totalBolts,cost:totalCost});
    updateSummary();
  });

  // State helpers
  function storeState(key,obj){
    const s = JSON.parse(localStorage.getItem('rail_calc')||"{}");
    if(obj===null) { delete s[key]; } else { s[key]=obj }
    localStorage.setItem('rail_calc',JSON.stringify(s));
  }

  function updateSummary(){
    const s = JSON.parse(localStorage.getItem('rail_calc')||"{}");
    const parts = [];
    if(s.ballast) parts.push(`<div><strong>Ballast:</strong> ${s.ballast.volume.toFixed(3)} m³ / ${(s.ballast.mass/1000).toFixed(3)} t</div>`);
    if(s.materials) parts.push(`<div><strong>Materials:</strong> ${s.materials.units} units — ${s.materials.total.toFixed(2)}</div>`);
    if(s.fasteners) parts.push(`<div><strong>Fasteners:</strong> ${s.fasteners.bolts} bolts — ${s.fasteners.cost.toFixed(2)}</div>`);
    document.getElementById('s-content').innerHTML = parts.length?parts.join(''):'No calculations yet. Use the calculators above.';
  }

  // hydrate summary on load
  updateSummary();
});
