const STORAGE_KEYS = {
  USERS: "votesphere_users",
  SESSION: "votesphere_session",
  ELECTIONS: "votesphere_elections",
  CANDIDATES: "votesphere_candidates",
  VOTES: "votesphere_votes"
};

const seedData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([
      { id:"u-admin", name:"System Administrator", username:"admin", password:"admin123", role:"admin", createdAt:"2026-01-10" },
      { id:"u-demo", name:"Demo Voter", username:"voter", password:"voter123", role:"user", createdAt:"2026-01-12" }
    ]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ELECTIONS)) {
    localStorage.setItem(STORAGE_KEYS.ELECTIONS, JSON.stringify([
      { id:"e-1", title:"Student Council Election 2026", date:"2026-09-30", status:"active", createdAt:"2026-09-20" }
    ]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CANDIDATES)) {
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify([
      { id:"c-1", electionId:"e-1", name:"Aarav Sharma", position:"President", symbol:"★" },
      { id:"c-2", electionId:"e-1", name:"Diya Reddy", position:"President", symbol:"◆" },
      { id:"c-3", electionId:"e-1", name:"Rahul Kumar", position:"President", symbol:"●" }
    ]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.VOTES)) localStorage.setItem(STORAGE_KEYS.VOTES, "[]");
};

const getData = key => JSON.parse(localStorage.getItem(key) || "[]");
const saveData = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const makeId = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
const activeElection = () => getData(STORAGE_KEYS.ELECTIONS).find(e => e.status === "active");
const candidatesFor = electionId => getData(STORAGE_KEYS.CANDIDATES).filter(c => c.electionId === electionId);
const votesFor = electionId => getData(STORAGE_KEYS.VOTES).filter(v => v.electionId === electionId);

seedData();
