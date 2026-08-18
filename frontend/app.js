let tickets = [];
const $ = id => document.getElementById(id);

async function loadTickets(){
  try{
    const r = await fetch("/api/tickets");
    tickets = await r.json();
    updateStats(); render();
  }catch(e){ console.error(e); }
}
function updateStats(){
  $("openCount").textContent = tickets.filter(t=>t.status==="Open").length;
  $("progressCount").textContent = tickets.filter(t=>t.status==="In Progress").length;
  $("criticalCount").textContent = tickets.filter(t=>t.priority==="Critical").length;
  $("resolvedCount").textContent = tickets.filter(t=>t.status==="Resolved").length;
}
function render(){
  const q = $("search").value.toLowerCase();
  const f = $("filter").value;
  const list = tickets.filter(t => (!f || t.status===f) && `${t.title} ${t.description} ${t.assignee}`.toLowerCase().includes(q));
  $("ticketRows").innerHTML = list.map(t=>`
    <tr>
      <td>${escapeHtml(t.title)}<span class="sub">${escapeHtml(t.description||"No description")}</span></td>
      <td><span class="priority ${t.priority}">${t.priority}</span></td>
      <td><span class="badge ${t.status.replace(" ","-")}">${t.status}</span></td>
      <td>${escapeHtml(t.assignee)}</td>
      <td>${new Date(t.created_at).toLocaleDateString()}</td>
      <td><div class="actions"><button class="iconbtn" onclick="editTicket(${t.id})">✎</button><button class="iconbtn" onclick="deleteTicket(${t.id})">⌫</button></div></td>
    </tr>`).join("") || `<tr><td colspan="6" style="text-align:center;padding:35px;color:#9aa1af">No tickets found.</td></tr>`;
}
function openModal(ticket){
  $("modal").classList.add("show");
  $("modalTitle").textContent = ticket ? "Edit ticket" : "Create ticket";
  $("ticketId").value = ticket?.id || "";
  $("title").value = ticket?.title || "";
  $("description").value = ticket?.description || "";
  $("priority").value = ticket?.priority || "Medium";
  $("status").value = ticket?.status || "Open";
  $("assignee").value = ticket?.assignee || "";
}
function closeModal(){ $("modal").classList.remove("show"); }
async function saveTicket(e){
  e.preventDefault();
  const id = $("ticketId").value;
  const body = {title:$("title").value,description:$("description").value,priority:$("priority").value,status:$("status").value,assignee:$("assignee").value||"Unassigned"};
  const r = await fetch(id ? `/api/tickets/${id}` : "/api/tickets",{method:id?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  if(!r.ok){ alert((await r.json()).error || "Save failed"); return; }
  closeModal(); loadTickets();
}
function editTicket(id){ openModal(tickets.find(t=>t.id===id)); }
async function deleteTicket(id){
  if(!confirm("Delete this ticket?")) return;
  await fetch(`/api/tickets/${id}`,{method:"DELETE"});
  loadTickets();
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
loadTickets();
