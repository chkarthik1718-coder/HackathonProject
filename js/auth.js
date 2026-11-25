function getSession(){ return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || "null"); }
function setSession(user){ localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({id:user.id, name:user.name, username:user.username, role:user.role})); }
function clearSession(){ localStorage.removeItem(STORAGE_KEYS.SESSION); }
function currentUser(){
  const s=getSession(); if(!s) return null;
  return getData(STORAGE_KEYS.USERS).find(u=>u.id===s.id) || null;
}
function requireRole(role){
  const u=currentUser();
  if(!u){ location.href="index.html"; return null; }
  if(u.role!==role){ location.href=u.role==="admin"?"admin.html":"user.html"; return null; }
  return u;
}
function logout(){ clearSession(); location.href="index.html"; }
function toast(message, type=""){
  const el=document.getElementById("toast"); if(!el)return;
  el.textContent=message; el.className=`toast show ${type}`;
  clearTimeout(window.__toastTimer); window.__toastTimer=setTimeout(()=>el.className="toast",2800);
}
function wireLogout(){ const b=document.getElementById("logoutBtn"); if(b)b.addEventListener("click",logout); }
