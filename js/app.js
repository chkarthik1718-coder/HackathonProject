document.addEventListener("DOMContentLoaded",()=>{
  const session=getSession();
  if(session){ location.href=session.role==="admin"?"admin.html":"user.html"; return; }
  const tabs=document.querySelectorAll("[data-auth-tab]");
  const login=document.getElementById("loginForm"), signup=document.getElementById("signupForm");
  function showTab(name){
    tabs.forEach(t=>t.classList.toggle("active",t.dataset.authTab===name));
    login.classList.toggle("hidden",name!=="login"); signup.classList.toggle("hidden",name!=="signup");
  }
  tabs.forEach(t=>t.addEventListener("click",()=>showTab(t.dataset.authTab)));
  document.querySelectorAll(".password-toggle").forEach(btn=>btn.addEventListener("click",()=>{
    const input=document.getElementById(btn.dataset.target);
    input.type=input.type==="password"?"text":"password"; btn.textContent=input.type==="password"?"Show":"Hide";
  }));
  login.addEventListener("submit",e=>{
    e.preventDefault();
    const username=document.getElementById("loginUsername").value.trim();
    const password=document.getElementById("loginPassword").value;
    const user=getData(STORAGE_KEYS.USERS).find(u=>u.username.toLowerCase()===username.toLowerCase() && u.password===password);
    if(!user){toast("Invalid username or password.","error");return}
    setSession(user); location.href=user.role==="admin"?"admin.html":"user.html";
  });
  signup.addEventListener("submit",e=>{
    e.preventDefault();
    const name=document.getElementById("signupName").value.trim();
    const username=document.getElementById("signupUsername").value.trim();
    const password=document.getElementById("signupPassword").value;
    const confirm=document.getElementById("signupConfirm").value;
    const users=getData(STORAGE_KEYS.USERS);
    if(password!==confirm){toast("Passwords do not match.","error");return}
    if(users.some(u=>u.username.toLowerCase()===username.toLowerCase())){toast("Username already exists.","error");return}
    const user={id:makeId("u"),name,username,password,role:"user",createdAt:new Date().toISOString().slice(0,10)};
    users.push(user);saveData(STORAGE_KEYS.USERS,users);setSession(user);location.href="user.html";
  });
});
