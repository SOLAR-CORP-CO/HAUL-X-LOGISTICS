import { useMemo, useState, type FormEvent } from "react";
type Enquiry = { reference:string; customer_name:string; email:string; pickup:string; delivery:string; cargo_category:string; transport_mode:string; shipment_type:string; packaging_type:string; quantity:number; weight_kg:number; notes:string; status:string; created_at:string };
const ADMIN_EMAIL = "pritammajumder0416@gmail.com";
const statuses = ["new","under_review","quoted","confirmed","completed","cancelled"];
export default function AdminPage() {
  const [email,setEmail] = useState("");
  const [opened,setOpened] = useState(false);
  const [rows,setRows] = useState<Enquiry[]>([]);
  const [filter,setFilter] = useState("all");
  const [query,setQuery] = useState("");
  const [error,setError] = useState("");
  function signIn(event:FormEvent) {
    event.preventDefault();
    if(email.trim().toLowerCase() !== ADMIN_EMAIL) { setError("This email is not authorised."); return; }
    setError("");
    setRows(JSON.parse(localStorage.getItem("haulx-enquiries") || "[]"));
    setOpened(true);
  }
  function refresh() { setRows(JSON.parse(localStorage.getItem("haulx-enquiries") || "[]")); }
  function update(reference:string,status:string) {
    const next = rows.map(row => row.reference === reference ? {...row,status} : row);
    setRows(next); localStorage.setItem("haulx-enquiries",JSON.stringify(next));
  }
  const visible = useMemo(()=>rows.filter(row=>(filter==="all"||row.status===filter) && (query==="" || [row.reference,row.customer_name,row.email,row.pickup,row.delivery].join(" ").toLowerCase().includes(query.toLowerCase()))),[rows,filter,query]);
  return <div className="admin-page">
    <header className="admin-top"><a href="/">HAUL <i>X</i></a><span>OPERATIONS / ADMIN</span></header>
    {!opened ? <main className="admin-login"><span className="admin-eyebrow">PRIVATE WORKSPACE</span><h1>Admin access</h1><p>Enter your authorised email to open the enquiry dashboard.</p><form onSubmit={signIn}><label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com" required /></label><button type="submit">Open dashboard <span>↗</span></button></form>{error && <p className="admin-error">{error}</p>}<a className="admin-back" href="/">← Back to HAUL X</a></main> :
    <main className="admin-dashboard"><div className="admin-heading"><div><span className="admin-eyebrow">HAUL X / OPERATIONS</span><h1>Enquiry dashboard</h1><p>{rows.length} enquiries in this browser</p></div><button className="admin-logout" onClick={()=>setOpened(false)}>Sign out</button></div>
      <div className="admin-stats"><article><small>Total enquiries</small><strong>{rows.length}</strong></article><article><small>New</small><strong>{rows.filter(x=>x.status==="new").length}</strong></article><article><small>In progress</small><strong>{rows.filter(x=>["under_review","quoted","confirmed"].includes(x.status)).length}</strong></article><article><small>Completed</small><strong>{rows.filter(x=>x.status==="completed").length}</strong></article></div>
      <div className="admin-toolbar"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name, email or reference…" /><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All statuses</option>{statuses.map(x=><option key={x} value={x}>{x.replace("_"," ")}</option>)}</select><button onClick={refresh}>Refresh</button></div>
      <div className="admin-list">{visible.map(row=><article className="admin-enquiry" key={row.reference}><div className="admin-enquiry-head"><div><strong>{row.customer_name}</strong><span>{row.reference}</span></div><select value={row.status} onChange={e=>update(row.reference,e.target.value)}>{statuses.map(x=><option key={x} value={x}>{x.replace("_"," ")}</option>)}</select></div><p>{row.email} · {row.pickup} → {row.delivery}</p><div className="admin-details">{row.cargo_category} · {row.transport_mode} · {row.shipment_type} · {row.quantity} packages · {row.weight_kg} kg</div><div className="admin-details">Packaging: {row.packaging_type}{row.notes ? " · "+row.notes : ""}</div><small>{new Date(row.created_at).toLocaleString()}</small></article>)}{visible.length===0 && <div className="admin-empty"><strong>No enquiries found</strong><p>Try another filter or submit a test enquiry from the main page.</p></div>}</div>
      <p className="admin-warning">Local demo storage: enquiries appear here only when submitted in this same browser on this device. This email-only screen is not secure.</p>
    </main>}
  </div>;
}
