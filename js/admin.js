document.addEventListener("DOMContentLoaded",()=>{
  const user=requireRole("admin"); if(!user)return; wireLogout();
  document.getElementById("adminName").textContent=`Admin · ${user.name}`;
  const sections=document.querySelectorAll(".dash-section"), links=document.querySelectorAll(".side-link");
  function showSection(id){sections.forEach(s=>s.classList.toggle("active",s.id===id));links.forEach(l=>l.classList.toggle("active",l.dataset.section===id));renderAll();}
  links.forEach(l=>l.addEventListener("click",()=>showSection(l.dataset.section)));
  document.querySelectorAll("[data-jump]").forEach(b=>b.addEventListener("click",()=>showSection(b.dataset.jump)));

  function renderAll(){renderStats();renderLive();renderElections();renderCandidates();renderVoters();renderResults();}
  function renderStats(){
    const users=getData(STORAGE_KEYS.USERS), elections=getData(STORAGE_KEYS.ELECTIONS), candidates=getData(STORAGE_KEYS.CANDIDATES), votes=getData(STORAGE_KEYS.VOTES);
    const active=activeElection(), participation=users.filter(u=>u.role==="user").length ? Math.round(votes.length/users.filter(u=>u.role==="user").length*100):0;
    document.getElementById("adminStats").innerHTML=[
      ["♙","Registered voters",users.filter(u=>u.role==="user").length],
      ["▣","Total elections",elections.length],
      ["♢","Candidates",candidates.length],
      ["✓","Participation",`${Math.min(participation,100)}%`]
    ].map(x=>`<div class="stat-card"><span class="stat-icon">${x[0]}</span><small>${x[1]}</small><strong>${x[2]}</strong></div>`).join("");
  }
  function renderLive(){
    const e=activeElection(), users=getData(STORAGE_KEYS.USERS).filter(u=>u.role==="user"), votes=e?votesFor(e.id):[];
    document.getElementById("adminLive").innerHTML=e?`<div class="metric-row"><b>${e.title}</b><span>${votes.length}/${users.length} votes</span></div><div class="live-meter"><div style="width:${users.length?Math.min(100,votes.length/users.length*100):0}%"></div></div><div class="metric-row"><span>Election date</span><b>${e.date}</b></div>`:`<div class="empty-state">No active election.</div>`;
  }
  function renderElections(){
    const list=document.getElementById("electionList"), es=getData(STORAGE_KEYS.ELECTIONS);
    list.innerHTML=es.length?es.map(e=>`<div class="election-item"><div><span class="tag ${e.status==="closed"?"closed":""}">${e.status.toUpperCase()}</span><h3>${e.title}</h3><p>Scheduled date: ${e.date}</p></div><div>${e.status==="active"?'<button class="btn btn-danger-outline close-election" data-id="'+e.id+'">Close election</button>':'<button class="btn btn-outline reopen-election" data-id="'+e.id+'">Set active</button>'}</div></div>`).join(""):`<div class="empty-state card">No elections created yet.</div>`;
    document.querySelectorAll(".close-election").forEach(b=>b.onclick=()=>setElectionStatus(b.dataset.id,"closed"));
    document.querySelectorAll(".reopen-election").forEach(b=>b.onclick=()=>setElectionStatus(b.dataset.id,"active"));
  }
  function setElectionStatus(id,status){
    const es=getData(STORAGE_KEYS.ELECTIONS);
    es.forEach(e=>{if(status==="active")e.status="closed";if(e.id===id)e.status=status});
    saveData(STORAGE_KEYS.ELECTIONS,es);toast(status==="active"?"Election activated.":"Election closed.");renderAll();
  }
  document.getElementById("electionForm").addEventListener("submit",e=>{
    e.preventDefault();const es=getData(STORAGE_KEYS.ELECTIONS);
    es.forEach(x=>x.status="closed");
    es.push({id:makeId("e"),title:document.getElementById("electionTitle").value.trim(),date:document.getElementById("electionDate").value,status:"active",createdAt:new Date().toISOString().slice(0,10)});
    saveData(STORAGE_KEYS.ELECTIONS,es);e.target.reset();toast("Election created and activated.");renderAll();
  });
  function renderCandidates(){
    const e=activeElection(), list=document.getElementById("candidateList"), cs=e?candidatesFor(e.id):[];
    list.innerHTML=cs.length?cs.map(c=>`<div class="candidate-card"><div class="candidate-symbol">${c.symbol||"•"}</div><h3>${c.name}</h3><p>${c.position}</p></div>`).join(""):`<div class="empty-state card">Add candidates to the active election.</div>`;
  }
  document.getElementById("candidateForm").addEventListener("submit",e=>{
    e.preventDefault();const election=activeElection();if(!election){toast("Create an active election first.","error");return}
    const cs=getData(STORAGE_KEYS.CANDIDATES);cs.push({id:makeId("c"),electionId:election.id,name:document.getElementById("candidateName").value.trim(),position:document.getElementById("candidatePosition").value.trim(),symbol:document.getElementById("candidateSymbol").value.trim()||"•"});
    saveData(STORAGE_KEYS.CANDIDATES,cs);e.target.reset();toast("Candidate added.");renderAll();
  });
  function renderVoters(){
    const users=getData(STORAGE_KEYS.USERS).filter(u=>u.role==="user"), votes=getData(STORAGE_KEYS.VOTES);
    document.getElementById("voterTable").innerHTML=users.length?`<div class="table-wrap"><table><thead><tr><th>Name</th><th>Username</th><th>Registered</th><th>Status</th></tr></thead><tbody>${users.map(u=>`<tr><td><b>${u.name}</b></td><td>${u.username}</td><td>${u.createdAt}</td><td><span class="role-pill">${votes.some(v=>v.userId===u.id)?"VOTED":"NOT VOTED"}</span></td></tr>`).join("")}</tbody></table></div>`:`<div class="empty-state">No registered voters.</div>`;
  }
  function renderResults(){
    const e=activeElection(), board=document.getElementById("resultBoard");if(!e){board.innerHTML='<div class="empty-state">No active election.</div>';return}
    const cs=candidatesFor(e.id),vs=votesFor(e.id),max=Math.max(1,...cs.map(c=>vs.filter(v=>v.candidateId===c.id).length));
    board.innerHTML=cs.length?cs.map((c,i)=>{const n=vs.filter(v=>v.candidateId===c.id).length;return `<div class="result-row"><div class="rank">${i+1}</div><div><div class="result-name">${c.name}<small>${c.position}</small></div><div class="result-track"><div style="width:${n/max*100}%"></div></div></div><div class="vote-count">${n} vote${n===1?"":"s"}</div></div>`}).join(""):'<div class="empty-state">No candidates yet.</div>';
  }
  document.getElementById("resetVotesBtn").addEventListener("click",()=>{if(confirm("Reset all demo votes? This cannot be undone.")){saveData(STORAGE_KEYS.VOTES,[]);toast("Demo votes reset.");renderAll()}});
  renderAll();
});
