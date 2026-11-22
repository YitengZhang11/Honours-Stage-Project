const DATA_KEY = "fitplan-data-v1";
const SESSION_KEY = "fitplan-session-v1";
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const exercises = [
  { id: "squat", name: "Bodyweight squat", level: "Beginner", group: "Strength", description: "A lower-body movement using your own body weight.", steps: ["Stand with feet about shoulder-width apart.", "Bend at the hips and knees as if sitting back into a chair.", "Keep your chest comfortable and knees tracking in the direction of your toes.", "Press through your feet to return to standing."] },
  { id: "pushup", name: "Incline push-up", level: "Beginner", group: "Strength", description: "A push-up variation performed against a stable raised surface.", steps: ["Place hands on a secure bench or wall, slightly wider than your shoulders.", "Step back so your body forms a straight line.", "Bend your elbows and bring your chest towards the surface.", "Press through your hands to return to the start."] },
  { id: "lunge", name: "Reverse lunge", level: "Beginner", group: "Strength", description: "A controlled single-leg movement for balance and lower-body strength.", steps: ["Stand tall with feet hip-width apart.", "Step one foot back and lower only as far as comfortable.", "Keep your front knee aligned with your foot.", "Push through the front foot and return; repeat on the other side."] },
  { id: "plank", name: "Forearm plank", level: "Intermediate", group: "Core", description: "A static exercise that challenges trunk stability.", steps: ["Rest on your forearms and toes, with elbows below shoulders.", "Keep your body in a comfortable straight line.", "Breathe steadily and avoid holding your breath.", "Stop when you can no longer keep a steady position."] },
  { id: "bridge", name: "Glute bridge", level: "Beginner", group: "Strength", description: "A floor-based hip extension movement.", steps: ["Lie on your back with knees bent and feet flat.", "Gently brace your middle and press through both feet.", "Lift your hips to a comfortable height without arching your back.", "Lower with control."] },
  { id: "jacks", name: "Step jack", level: "Beginner", group: "Cardio", description: "A lower-impact alternative to a jumping jack.", steps: ["Stand tall with arms by your sides.", "Step one foot out while raising your arms comfortably.", "Step back to the middle and lower your arms.", "Alternate sides at a steady pace."] },
  { id: "deadbug", name: "Dead bug", level: "Beginner", group: "Core", description: "A controlled floor exercise coordinating opposite arm and leg movement.", steps: ["Lie on your back with arms pointing up and knees bent.", "Keep your back in a comfortable neutral position.", "Slowly lower one arm and the opposite leg only as far as controlled.", "Return and alternate sides."] },
  { id: "calfraise", name: "Standing calf raise", level: "Beginner", group: "Strength", description: "A standing movement raising and lowering the heels.", steps: ["Stand near a stable support for balance if needed.", "Rise onto the balls of both feet.", "Pause briefly at a comfortable height.", "Lower your heels slowly."] },
  { id: "mountain", name: "Slow mountain climber", level: "Intermediate", group: "Cardio", description: "A controlled alternating knee drive from a high plank position.", steps: ["Begin in a high plank with hands below shoulders.", "Bring one knee towards your chest without rounding sharply.", "Return that foot and change sides.", "Move slowly enough to maintain control."] },
  { id: "wallsit", name: "Wall sit", level: "Beginner", group: "Strength", description: "A static lower-body hold against a wall.", steps: ["Stand with your back against a clear wall.", "Walk your feet forward and slide down to a comfortable position.", "Keep your knees aligned over your feet and breathe normally.", "Press through your feet to stand back up."] },
  { id: "bird-dog", name: "Bird dog", level: "Beginner", group: "Core", description: "A floor-based balance and trunk-control exercise.", steps: ["Start on hands and knees with hands below shoulders.", "Extend one arm and the opposite leg only as far as you can control.", "Keep your trunk steady and hips facing the floor.", "Return and alternate sides."] },
  { id: "hinge", name: "Hip hinge practice", level: "Beginner", group: "Mobility", description: "A movement pattern practising bending at the hips.", steps: ["Stand with feet hip-width apart and knees soft.", "Push your hips backwards while keeping your spine comfortable.", "Stop when you feel a gentle stretch at the back of your legs.", "Press your hips forward to stand tall."] }
];
let db = loadData();
let authMode = "login";
let reminderTimers = new Map();

function loadData() {
  try { return Object.assign({ account: null, profile: {}, plans: [], logs: [], goal: 3, reminders: [] }, JSON.parse(localStorage.getItem(DATA_KEY) || "{}")); }
  catch { return { account: null, profile: {}, plans: [], logs: [], goal: 3, reminders: [] }; }
}
function saveData() { localStorage.setItem(DATA_KEY, JSON.stringify(db)); }
function byId(id) { return document.getElementById(id); }
function esc(value) { return String(value ?? "").replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]; }); }
function localDate(date) { const d = date || new Date(); return [d.getFullYear(), String(d.getMonth()+1).padStart(2,"0"), String(d.getDate()).padStart(2,"0")].join("-"); }
function formatDate(value) { if (!value) return ""; return new Date(value + "T12:00:00").toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" }); }
function mondayStart(date) { const d = new Date(date); d.setHours(0,0,0,0); d.setDate(d.getDate() - ((d.getDay()+6)%7)); return d; }
function currentWeekLogs() { const start = mondayStart(new Date()); return db.logs.filter(log => new Date(log.date + "T12:00:00") >= start); }
function planName(planId) { const plan = db.plans.find(item => item.id === planId); return plan ? plan.exerciseName + " · " + plan.day : "Independent workout"; }
function exerciseName(id) { const item = exercises.find(ex => ex.id === id); return item ? item.name : "Exercise"; }
function setStatus(id, text, kind) { const node = byId(id); if (node) { node.textContent = text; node.className = "form-status" + (kind ? " " + kind : ""); } }
function getCurrentUser() { return sessionStorage.getItem(SESSION_KEY) === "active" && db.account ? db.account.username : ""; }
function showApp() {
  if (!db.account || !getCurrentUser()) return;
  byId("auth-section").hidden = true; byId("app-section").hidden = false; byId("account-actions").hidden = false;
  byId("welcome-name").textContent = db.profile.name || db.account.username;
  fillProfile(); renderAll();
}
function showAuth() { byId("auth-section").hidden = false; byId("app-section").hidden = true; byId("account-actions").hidden = true; }
function setAuthMode(mode) {
  authMode = mode;
  const registering = mode === "register";
  byId("auth-name-wrap").hidden = !registering; byId("auth-name").hidden = !registering; byId("auth-name").required = registering;
  byId("auth-submit").textContent = registering ? "Create account" : "Log in";
  byId("show-login").classList.toggle("active", !registering); byId("show-register").classList.toggle("active", registering);
  byId("auth-password").autocomplete = registering ? "new-password" : "current-password";
  setStatus("auth-status", "");
}
function bytesToBase64(bytes) { return btoa(String.fromCharCode.apply(null, Array.from(bytes))); }
function base64ToBytes(text) { return Uint8Array.from(atob(text), c => c.charCodeAt(0)); }
async function passwordDigest(password, salt) {
  if (!window.crypto || !crypto.subtle) throw new Error("Secure browser cryptography is unavailable. Open the HTTPS PWA.");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: salt, iterations: 120000, hash: "SHA-256" }, key, 256);
  return bytesToBase64(new Uint8Array(bits));
}
async function handleAuth(event) {
  event.preventDefault(); const username = byId("auth-username").value.trim().toLowerCase(); const password = byId("auth-password").value;
  try {
    if (authMode === "register") {
      if (db.account) throw new Error("This device already has a demo account. Log in or delete its local data first.");
      const salt = crypto.getRandomValues(new Uint8Array(16));
      db.account = { username: username, salt: bytesToBase64(salt), digest: await passwordDigest(password, salt) };
      db.profile = { name: byId("auth-name").value.trim(), age: "", height: "", weight: "", goal: "" };
      db.plans = []; db.logs = []; db.goal = 3; db.reminders = []; saveData();
    } else {
      if (!db.account || db.account.username !== username) throw new Error("No matching local account was found on this device.");
      const digest = await passwordDigest(password, base64ToBytes(db.account.salt));
      if (digest !== db.account.digest) throw new Error("The password does not match this local account.");
    }
    sessionStorage.setItem(SESSION_KEY, "active"); byId("auth-password").value = ""; showApp();
  } catch (error) { setStatus("auth-status", error.message, "error"); }
}
function fillProfile() {
  byId("profile-name").value = db.profile.name || ""; byId("profile-age").value = db.profile.age || "";
  byId("profile-height").value = db.profile.height || ""; byId("profile-weight").value = db.profile.weight || "";
  byId("profile-goal").value = db.profile.goal || ""; byId("goal-target").value = String(db.goal || 3);
}
function switchView(name) {
  document.querySelectorAll(".app-view").forEach(view => { view.hidden = view.id !== "view-" + name; });
  document.querySelectorAll(".nav-button").forEach(button => button.classList.toggle("active", button.dataset.view === name));
  if (name === "dashboard") drawChart();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function renderExerciseOptions() {
  byId("plan-exercise").innerHTML = exercises.map(ex => "<option value=\"" + esc(ex.id) + "\">" + esc(ex.name) + "</option>").join("");
  byId("log-plan").innerHTML = "<option value=\"\">Choose a planned session (optional)</option>" + db.plans.map(p => "<option value=\"" + esc(p.id) + "\">" + esc(p.day + " · " + p.exerciseName) + "</option>").join("");
}
function renderPlans() {
  const ordered = db.plans.slice().sort((a,b) => weekdays.indexOf(a.day)-weekdays.indexOf(b.day) || a.time.localeCompare(b.time));
  byId("plan-total").textContent = ordered.length + (ordered.length === 1 ? " session" : " sessions");
  byId("planned-count").textContent = String(ordered.length);
  byId("plan-list").innerHTML = ordered.length ? ordered.map(p => "<article class=\"list-item\"><div><strong>" + esc(p.day) + " · " + esc(p.time || "Any time") + "</strong><p>" + esc(p.exerciseName) + " · " + esc(p.duration) + " min · " + esc(p.sets) + " × " + esc(p.reps) + " reps</p></div><div class=\"item-actions\"><button class=\"text-button\" data-action=\"edit-plan\" data-id=\"" + esc(p.id) + "\" type=\"button\">Edit</button><button class=\"text-button danger-text\" data-action=\"delete-plan\" data-id=\"" + esc(p.id) + "\" type=\"button\">Delete</button></div></article>").join("") : "<p class=\"empty-state\">No sessions yet. Add the first one using the form.</p>";
  const today = weekdays[(new Date().getDay()+6)%7]; const next = ordered.find(p => weekdays.indexOf(p.day) >= weekdays.indexOf(today)) || ordered[0];
  byId("next-workout").innerHTML = next ? "<div class=\"next-card\"><span class=\"pill\">" + esc(next.day) + " · " + esc(next.time || "Any time") + "</span><h3>" + esc(next.exerciseName) + "</h3><p>" + esc(next.duration) + " minutes · " + esc(next.sets) + " sets of " + esc(next.reps) + " reps</p></div>" : "Add a session to your weekly plan to see it here.";
  renderExerciseOptions();
}
function renderLibrary(filter) {
  const q = (filter || "").trim().toLowerCase(); const matches = exercises.filter(ex => [ex.name,ex.group,ex.level,ex.description].join(" ").toLowerCase().includes(q));
  byId("exercise-total").textContent = matches.length + " exercises";
  byId("exercise-list").innerHTML = matches.length ? matches.map(ex => "<article class=\"exercise-card\"><div class=\"exercise-art\" aria-hidden=\"true\"><span>" + esc(ex.name.split(" ").map(part => part[0]).join("").slice(0,2)) + "</span></div><div class=\"exercise-meta\"><span class=\"pill\">" + esc(ex.group) + "</span><span class=\"difficulty\">" + esc(ex.level) + "</span></div><h2>" + esc(ex.name) + "</h2><p>" + esc(ex.description) + "</p><details><summary>View instructions</summary><ol>" + ex.steps.map(step => "<li>" + esc(step) + "</li>").join("") + "</ol></details></article>").join("") : "<p class=\"empty-state\">No exercises match that search. Try another word.</p>";
}
function renderLogs() {
  const logs = db.logs.slice().sort((a,b) => b.date.localeCompare(a.date));
  byId("log-total").textContent = String(logs.length) + " logged";
  byId("log-list").innerHTML = logs.length ? logs.map(log => "<article class=\"list-item\"><div><strong>" + esc(formatDate(log.date)) + " · " + esc(log.title) + "</strong><p>" + esc(log.duration) + " min" + (log.notes ? " · " + esc(log.notes) : "") + "</p></div><div class=\"item-actions\"><button class=\"text-button danger-text\" data-action=\"delete-log\" data-id=\"" + esc(log.id) + "\" type=\"button\">Delete</button></div></article>").join("") : "<p class=\"empty-state\">Your completed sessions will appear here.</p>";
}
function renderGoal() {
  const done = currentWeekLogs().length; const target = Number(db.goal || 3); const percent = Math.min(100, Math.round(done/target*100));
  byId("goal-count").textContent = done + " / " + target; byId("goal-foot").textContent = done >= target ? "Weekly target reached" : (target-done) + " more to reach your goal";
  byId("goal-progress").innerHTML = "<p><strong>" + done + " of " + target + " sessions</strong> this week</p><div class=\"progress-track\" role=\"progressbar\" aria-valuemin=\"0\" aria-valuemax=\"" + target + "\" aria-valuenow=\"" + Math.min(done,target) + "\"><span style=\"width:" + percent + "%\"></span></div><p class=\"small-note\">" + percent + "% of this week's target</p>";
}
function drawChart() {
  const canvas = byId("progress-chart"); if (!canvas) return; const rect = canvas.getBoundingClientRect(); if (!rect.width) return;
  const ratio = window.devicePixelRatio || 1; canvas.width = rect.width*ratio; canvas.height = 180*ratio; const ctx = canvas.getContext("2d"); ctx.scale(ratio,ratio);
  const days = []; const counts = []; const today = new Date();
  for (let i=6;i>=0;i--) { const day = new Date(today); day.setDate(today.getDate()-i); const key = localDate(day); days.push(day.toLocaleDateString(undefined,{weekday:"short"})); counts.push(db.logs.filter(log => log.date === key).length); }
  const max = Math.max(3, ...counts); const left=24, top=12, chartHeight=125, chartWidth=rect.width-44, slot=chartWidth/7, barWidth=Math.min(28,slot*0.55);
  ctx.clearRect(0,0,rect.width,180); ctx.font="12px system-ui"; ctx.textAlign="center";
  for (let i=0;i<7;i++) { const x=left+slot*i+slot/2; const h=counts[i] ? counts[i]/max*chartHeight : 3; ctx.fillStyle=counts[i] ? "#2e806c" : "#e5ece8"; ctx.beginPath(); ctx.roundRect(x-barWidth/2,top+chartHeight-h,barWidth,h,6); ctx.fill(); ctx.fillStyle="#687771"; ctx.fillText(days[i],x,164); if(counts[i]) {ctx.fillStyle="#183b32";ctx.fillText(String(counts[i]),x,top+chartHeight-h-7);} }
  byId("chart-caption").textContent = counts.reduce((sum,n)=>sum+n,0) ? "Completed sessions in the last seven days." : "No sessions logged in the last seven days yet.";
}
function renderReminders() {
  db.reminders = db.reminders.filter(r => !r.cancelled);
  byId("reminder-list").innerHTML = db.reminders.length ? db.reminders.slice().sort((a,b)=>a.when.localeCompare(b.when)).map(r => "<article class=\"list-item\"><div><strong>" + esc(new Date(r.when).toLocaleString()) + "</strong><p>" + esc(r.message) + (r.fired ? " · sent while app was open" : new Date(r.when)<new Date() ? " · time passed while app was closed" : "") + "</p></div>" + (r.fired || new Date(r.when)<new Date() ? "" : "<button class=\"text-button danger-text\" data-action=\"cancel-reminder\" data-id=\""+esc(r.id)+"\" type=\"button\">Cancel</button>") + "</article>").join("") : "<p class=\"empty-state\">No reminders scheduled.</p>";
}
function renderDashboard() {
  byId("today-label").textContent = new Date().toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"long"});
  byId("weekly-count").textContent = String(currentWeekLogs().length); renderGoal(); drawChart();
}
function renderAll() { renderPlans(); renderLibrary(byId("exercise-search").value); renderLogs(); renderReminders(); renderDashboard(); }
function resetPlanForm() { byId("plan-form").reset(); byId("plan-id").value=""; byId("plan-form-title").textContent="Add a session"; byId("cancel-plan-edit").hidden=true; }
function handlePlanSubmit(event) {
  event.preventDefault(); const id=byId("plan-id").value; const ex=exercises.find(item=>item.id===byId("plan-exercise").value);
  const item={id:id||crypto.randomUUID(),day:byId("plan-day").value,exerciseId:ex.id,exerciseName:ex.name,sets:Number(byId("plan-sets").value),reps:Number(byId("plan-reps").value),duration:Number(byId("plan-duration").value),time:byId("plan-time").value||"18:00"};
  if(!item.day||!item.duration||!Number.isFinite(item.duration)){setStatus("plan-status","Please choose a day and enter a valid duration.","error");return;}
  db.plans=db.plans.filter(p=>p.id!==item.id);db.plans.push(item);saveData();resetPlanForm();setStatus("plan-status","Session saved to your weekly plan.","success");renderAll();
}
function editPlan(id) { const p=db.plans.find(item=>item.id===id);if(!p)return;byId("plan-id").value=p.id;byId("plan-day").value=p.day;byId("plan-exercise").value=p.exerciseId;byId("plan-sets").value=p.sets;byId("plan-reps").value=p.reps;byId("plan-duration").value=p.duration;byId("plan-time").value=p.time;byId("plan-form-title").textContent="Edit session";byId("cancel-plan-edit").hidden=false;byId("plan-form").scrollIntoView({behavior:"smooth",block:"start"}); }
function handleLogSubmit(event) { event.preventDefault();const plan=db.plans.find(p=>p.id===byId("log-plan").value);const log={id:crypto.randomUUID(),date:byId("log-date").value,title:plan?plan.exerciseName+" · "+plan.day:"Independent workout",planId:plan?plan.id:"",duration:Number(byId("log-duration").value),notes:byId("log-notes").value.trim()};if(!log.date||!log.duration){setStatus("log-status","Add a date and a valid duration.","error");return;}db.logs.push(log);saveData();byId("log-form").reset();byId("log-date").value=localDate();setStatus("log-status","Workout recorded. Your progress has been updated.","success");renderAll(); }
function handleProfileSubmit(event) {event.preventDefault();db.profile={name:byId("profile-name").value.trim(),age:byId("profile-age").value,height:byId("profile-height").value,weight:byId("profile-weight").value,goal:byId("profile-goal").value.trim()};saveData();byId("welcome-name").textContent=db.profile.name;setStatus("profile-status","Profile updated on this device.","success");}
function handleGoalSubmit(event) {event.preventDefault();db.goal=Number(byId("goal-target").value);saveData();setStatus("goal-status","Weekly goal saved.","success");renderAll();}
function scheduleLocalReminder(reminder) {
  const wait=new Date(reminder.when).getTime()-Date.now();if(wait<=0||wait>2147480000)return;
  if(reminderTimers.has(reminder.id))clearTimeout(reminderTimers.get(reminder.id));
  const timer=setTimeout(async function(){const current=db.reminders.find(r=>r.id===reminder.id);if(!current||current.cancelled)return;current.fired=true;saveData();const message=current.message;setStatus("reminder-status","Reminder due: "+message,"success");if("Notification" in window&&Notification.permission==="granted"){try{if("serviceWorker" in navigator){const reg=await navigator.serviceWorker.ready;await reg.showNotification("FitPlan workout reminder",{body:message,icon:"./icon-192.png",badge:"./icon-192.png",tag:"fitplan-"+current.id});}else new Notification("FitPlan workout reminder",{body:message});}catch(error){setStatus("reminder-status","Reminder due, but the browser could not display a notification: "+error.message,"error");}}renderReminders();renderDashboard();},wait);
  reminderTimers.set(reminder.id,timer);
}
function handleReminderSubmit(event) {event.preventDefault();const when=new Date(byId("reminder-date").value);if(!Number.isFinite(when.getTime())||when<=new Date()){setStatus("reminder-status","Choose a future date and time.","error");return;}const reminder={id:crypto.randomUUID(),when:when.toISOString(),message:byId("reminder-message").value.trim(),fired:false};db.reminders.push(reminder);saveData();scheduleLocalReminder(reminder);byId("reminder-form").reset();byId("reminder-message").value="Time for your planned workout!";setStatus("reminder-status","Reminder saved. It can fire while this app is open; background delivery needs Web Push.","success");renderReminders();}
function restoreReminderTimers(){db.reminders.forEach(reminder=>{if(!reminder.fired&&!reminder.cancelled&&new Date(reminder.when)>new Date())scheduleLocalReminder(reminder);});}
function handleActions(event) {const button=event.target.closest("[data-action]");if(!button)return;const id=button.dataset.id;switch(button.dataset.action){case "edit-plan":editPlan(id);break;case "delete-plan":if(confirm("Delete this planned session?")){db.plans=db.plans.filter(p=>p.id!==id);saveData();renderAll();}break;case "delete-log":if(confirm("Delete this workout record?")){db.logs=db.logs.filter(log=>log.id!==id);saveData();renderAll();}break;case "cancel-reminder":if(confirm("Cancel this reminder?")){const timer=reminderTimers.get(id);if(timer)clearTimeout(timer);db.reminders=db.reminders.filter(r=>r.id!==id);saveData();renderReminders();}break;}}
function setInitialDates(){byId("log-date").value=localDate();const future=new Date(Date.now()+3600000);future.setMinutes(0,0,0);future.setHours(future.getHours()+1);byId("reminder-date").value=[localDate(future),String(future.getHours()).padStart(2,"0"),String(future.getMinutes()).padStart(2,"0")].join("T");}

byId("show-login").addEventListener("click",()=>setAuthMode("login"));
byId("show-register").addEventListener("click",()=>setAuthMode("register"));
byId("auth-form").addEventListener("submit",handleAuth);
byId("logout-button").addEventListener("click",()=>{sessionStorage.removeItem(SESSION_KEY);showAuth();});
document.querySelectorAll(".nav-button").forEach(button=>button.addEventListener("click",()=>switchView(button.dataset.view)));
document.querySelectorAll("[data-go]").forEach(button=>button.addEventListener("click",()=>switchView(button.dataset.go)));
byId("plan-form").addEventListener("submit",handlePlanSubmit);byId("cancel-plan-edit").addEventListener("click",resetPlanForm);
byId("exercise-search").addEventListener("input",event=>renderLibrary(event.target.value));
byId("log-form").addEventListener("submit",handleLogSubmit);byId("profile-form").addEventListener("submit",handleProfileSubmit);byId("goal-form").addEventListener("submit",handleGoalSubmit);byId("reminder-form").addEventListener("submit",handleReminderSubmit);
document.addEventListener("click",handleActions);window.addEventListener("resize",drawChart);
byId("reset-data").addEventListener("click",()=>{if(confirm("Delete all local FitPlan demo data from this browser? This cannot be undone.")){for(const timer of reminderTimers.values())clearTimeout(timer);localStorage.removeItem(DATA_KEY);sessionStorage.removeItem(SESSION_KEY);db={account:null,profile:{},plans:[],logs:[],goal:3,reminders:[]};showAuth();setAuthMode("login");setStatus("auth-status","Local demo data deleted.","success");}});
byId("permission-button").addEventListener("click",async()=>{if(!("Notification" in window)){setStatus("reminder-status","Notifications are not supported in this browser. Try the installed Home Screen app on iPhone.","error");return;}try{const permission=await Notification.requestPermission();setStatus("reminder-status","Notification permission: "+permission+". A permission prompt alone does not confirm reminder delivery.",permission==="granted"?"success":"error");}catch(error){setStatus("reminder-status","Could not request notification permission: "+error.message,"error");}});
function getServerBase(){const raw=byId("server-url").value.trim();if(!raw)throw new Error("Enter your HTTPS push server URL first.");const url=new URL(raw);if(url.protocol!=="https:")throw new Error("The push server must use HTTPS.");return url.href.replace(/\/$/,"");}
async function readJson(response){const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(payload.error||"Request failed with status "+response.status);return payload;}
function decodeVapidKey(value){const padded=value.replace(/-/g,"+").replace(/_/g,"/");const raw=atob(padded+"=".repeat((4-padded.length%4)%4));return Uint8Array.from(raw,c=>c.charCodeAt(0));}
byId("subscribe-button").addEventListener("click",async()=>{setStatus("push-status","Connecting to the test server…");try{if(!("serviceWorker" in navigator)||!("PushManager" in window))throw new Error("Web Push is unavailable here. Open the installed iPhone Home Screen app.");if(Notification.permission!=="granted"){const permission=await Notification.requestPermission();if(permission!=="granted")throw new Error("Notification permission was not granted.");}const base=getServerBase();const keyData=await readJson(await fetch(base+"/api/vapid-public-key"));const registration=await navigator.serviceWorker.ready;let subscription=await registration.pushManager.getSubscription();if(!subscription)subscription=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:decodeVapidKey(keyData.publicKey)});const saved=await readJson(await fetch(base+"/api/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(subscription)}));setStatus("push-status","Device subscribed. Server has "+saved.subscriptionCount+" test subscription(s).", "success");}catch(error){setStatus("push-status","Subscription failed: "+error.message,"error");}});
byId("send-test-button").addEventListener("click",async()=>{setStatus("push-status","Sending a test push…");try{const base=getServerBase();const token=byId("test-token").value;if(!token)throw new Error("Enter the private test token configured on your push server.");const result=await readJson(await fetch(base+"/api/send-test",{method:"POST",headers:{Authorization:"Bearer "+token}}));setStatus("push-status","Server accepted the push for "+result.sent+" device(s). Check iPhone Notification Centre.","success");}catch(error){setStatus("push-status","Push failed: "+error.message,"error");}});
renderExerciseOptions();renderLibrary("");setInitialDates();restoreReminderTimers();
if("serviceWorker" in navigator){navigator.serviceWorker.register("./service-worker.js",{scope:"./"}).catch(error=>console.error("Service worker registration failed",error));}
if(getCurrentUser())showApp();else showAuth();
