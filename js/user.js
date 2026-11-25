document.addEventListener("DOMContentLoaded",()=>{
  const user=requireRole("user");if(!user)return;wireLogout();
  document.getElementById("userName").textContent=`Voter · ${user.name}`;
  const sections=document.querySelectorAll(".dash-section"),links=document.querySelectorAll(".side-link");
  function showSection(id){sections.forEach(s=>s.classList.toggle("active",s.id===id));links.forEach(l=>l.classList.toggle("active",l.dataset.section===id));renderAll()}
  links.forEach(l=>l.addEventListener("click",()=>showSection(l.dataset.section)));

  let selected=null;
  function renderAll(){renderVote();renderStatus();renderResults()}
  function renderVote(){
    const e=activeElection(), hero=document.getElementById("electionHero"), area=document.getElementById("votingArea");
    if(!e){hero.innerHTML='<h2>No active election</h2><p>The administrator has not opened an election yet.</p>';area.innerHTML="";return}
    const already=votesFor(e.id).some(v=>v.userId===user.id),cs=candidatesFor(e.id);
    hero.innerHTML=`<span class="eyebrow" style="color:#aebaff">ACTIVE ELECTION</span><h2>${e.title}</h2><p>Voting date: ${e.date} · Choose one candidate</p>`;
    if(already){area.innerHTML='<div class="card panel"><div class="success-box"><strong>✓ Your vote has been recorded.</strong><span>Thank you for participating. You cannot vote again in this election.</span></div></div>';return}
    area.innerHTML=cs.length?`<div class="vote-grid">${cs.map(c=>`<label class="vote-card" data-candidate="${c.id}"><input type="radio" name="candidate" value="${c.id}"><div class="candidate-symbol">${c.symbol}</div><h3>${c.name}</h3><p>${c.position}</p><span class="vote-check">✓</span></label>`).join("")}</div><div class="vote-submit"><button id="submitVote" class="btn btn-primary" disabled>Review & submit ballot →</button></div>`:'<div class="card empty-state">Candidates have not been added yet.</div>';
    document.querySelectorAll(".vote-card").forEach(card=>card.addEventListener("click",()=>{
      selected=card.dataset.candidate;document.querySelectorAll(".vote-card").forEach(x=>x.classList.remove("selected"));card.classList.add("selected");document.getElementById("submitVote").disabled=false;
    }));
    const submit=document.getElementById("submitVote");if(submit)submit.onclick=()=>openConfirm(e,selected);
  }
  function renderStatus(){
    const e=activeElection(),box=document.getElementById("statusCard");if(!e){box.innerHTML='<div class="card panel empty-state">No active election.</div>';return}
    const v=votesFor(e.id).find(v=>v.userId===user.id);
    box.innerHTML=v?`<div class="card status-card"><div class="success-box"><strong>✓ Ballot submitted successfully</strong><span>Your participation is recorded for this election.</span></div><div class="status-detail"><div class="detail-box"><small>Election</small><b>${e.title}</b></div><div class="detail-box"><small>Submitted</small><b>${new Date(v.timestamp).toLocaleString()}</b></div></div></div>`:`<div class="card status-card"><div class="detail-box"><small>Current election</small><b>${e.title}</b><p>You have not voted yet. Go to Cast Vote to participate.</p></div></div>`;
  }
  function renderResults(){
    const e=activeElection(),board=document.getElementById("userResults");if(!e){board.innerHTML='<div class="empty-state">No active election.</div>';return}
    const hasVoted=votesFor(e.id).some(v=>v.userId===user.id);
    if(!hasVoted){board.innerHTML='<div class="empty-state">Results will appear here after you cast your ballot.</div>';return}
    const cs=candidatesFor(e.id),vs=votesFor(e.id),max=Math.max(1,...cs.map(c=>vs.filter(v=>v.candidateId===c.id).length));
    board.innerHTML=cs.map((c,i)=>{const n=vs.filter(v=>v.candidateId===c.id).length;return `<div class="result-row"><div class="rank">${i+1}</div><div><div class="result-name">${c.name}<small>${c.position}</small></div><div class="result-track"><div style="width:${n/max*100}%"></div></div></div><div class="vote-count">${n}</div></div>`}).join("");
  }
  function openConfirm(e,candidateId){
    if(!candidateId)return;const c=candidatesFor(e.id).find(x=>x.id===candidateId);selected=candidateId;
    document.getElementById("confirmText").textContent=`You are selecting ${c.name} for ${c.position}. Once submitted, your demo ballot cannot be changed.`;
    document.getElementById("confirmModal").classList.remove("hidden");
  }
  function closeModal(){document.getElementById("confirmModal").classList.add("hidden")}
  document.getElementById("modalClose").onclick=closeModal;document.getElementById("cancelVote").onclick=closeModal;
  document.getElementById("confirmVote").onclick=()=>{
    const e=activeElection();if(!e||!selected)return;
    const votes=getData(STORAGE_KEYS.VOTES);
    if(votes.some(v=>v.electionId===e.id&&v.userId===user.id)){toast("You have already voted.","error");closeModal();renderAll();return}
    votes.push({id:makeId("v"),electionId:e.id,userId:user.id,candidateId:selected,timestamp:new Date().toISOString()});
    saveData(STORAGE_KEYS.VOTES,votes);closeModal();selected=null;toast("Vote submitted successfully.");renderAll();showSection("status");
  };
  renderAll();
});
