"use client";

import { useEffect, useState, FormEvent, ReactNode } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

/* ── types ──────────────────────────────────────────── */
type SiteProject = {
  id: string;
  category: "design" | "it" | "photo" | "web";
  title: string;
  description: string;
  tags: string[];
  emoji?: string | null;
  gradient?: string | null;
  image?: string | null;
  gallery?: string[] | null;
  liveUrl?: string | null;
  codeUrl?: string | null;
  sortOrder: number;
};

type Experience = {
  id: string;
  title: string;
  company: string;
  dateRange: string;
  tasks: string[];
  tags: string[];
  sortOrder: number;
};

type Endorsement = {
  id: string;
  name: string;
  role: string;
  company: string;
  message: string;
  phone?: string | null;
};

type Skill = {
  id: string;
  name: string;
  level: number;
  category: "design" | "it" | "web" | "photo";
  icon?: string | null;
  emoji?: string | null;
  sortOrder: number;
};

type Section = "overview" | "projects" | "experience" | "endorsements" | "skills";

/* ── icon SVGs ──────────────────────────────────────── */
const Icons = {
  grid: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
  folder: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>,
  image: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>,
  star: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  cpu: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>,
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  edit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
  logout: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
  home: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  x: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  briefcase: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
};

/* ── main component ─────────────────────────────────── */
export default function AdminPage() {
  const { data: session, status } = useSession();

  const [projects, setProjects] = useState<SiteProject[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [endorsements, setEndorsements] = useState<Endorsement[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  /* forms */
  const [projForm, setProjForm] = useState<Partial<SiteProject>>({ category: "design", title: "", description: "", tags: [], emoji: "", gradient: "", image: "", gallery: [], liveUrl: "", codeUrl: "", sortOrder: 0 });
  const [expForm, setExpForm] = useState<Partial<Experience>>({ title: "", company: "", dateRange: "", tasks: [], tags: [], sortOrder: 0 });
  const [endForm, setEndForm] = useState<Partial<Endorsement>>({ name: "", role: "", company: "", message: "", phone: "" });
  const [skillForm, setSkillForm] = useState<Partial<Skill>>({ name: "", level: 80, category: "design", icon: "", emoji: "", sortOrder: 0 });

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  async function fetchAll() {
    try {
      const [pR, eR, endR, skR] = await Promise.all([
        fetch("/api/projects"), fetch("/api/experience"), fetch("/api/endorsements"), fetch("/api/skills"),
      ]);
      if (pR.ok) setProjects(await pR.json());
      if (eR.ok) setExperience(await eR.json());
      if (endR.ok) setEndorsements(await endR.json());
      if (skR.ok) setSkills(await skR.json());
    } catch { /* ignore */ }
  }

  useEffect(() => {
    if (status === "authenticated" && isAdmin) void fetchAll();
  }, [status, isAdmin]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function handleSave(url: string, body: object, resetFn: () => void, label: string, isUpdate = false) {
    setSaving(true); setError(null);
    try {
      const res = await fetch(isUpdate ? `${url}/${editingId}` : url, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(`Failed to save ${label}`);
      resetFn(); setEditingId(null); await fetchAll(); showToast(`${label} ${isUpdate ? "updated" : "created"}`);
    } catch (err: any) { setError(err.message); } finally { setSaving(false); }
  }

  async function handleDelete(resource: string, id: string) {
    if (!confirm("Delete this item?")) return;
    try {
      const res = await fetch(`/api/${resource}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      await fetchAll(); showToast("Item deleted");
    } catch { alert("Failed to delete item"); }
  }

  const startEdit = (item: any, section: Section) => {
    setEditingId(item.id);
    if (section === "projects") setProjForm(item);
    if (section === "experience") setExpForm(item);
    if (section === "endorsements") setEndForm(item);
    if (section === "skills") setSkillForm(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setProjForm({ category: "design", title: "", description: "", tags: [], emoji: "", gradient: "", image: "", gallery: [], liveUrl: "", codeUrl: "", sortOrder: 0 });
    setExpForm({ title: "", company: "", dateRange: "", tasks: [], tags: [], sortOrder: 0 });
    setEndForm({ name: "", role: "", company: "", message: "", phone: "" });
    setSkillForm({ name: "", level: 80, category: "design", icon: "", emoji: "", sortOrder: 0 });
  };

  const navItems: { key: Section; label: string; icon: ReactNode }[] = [
    { key: "overview", label: "Overview", icon: Icons.grid },
    { key: "projects", label: "Projects", icon: Icons.folder },
    { key: "experience", label: "Experience", icon: Icons.briefcase },
    { key: "endorsements", label: "Endorsements", icon: Icons.star },
    { key: "skills", label: "Skills", icon: Icons.cpu },
  ];

  /* ── guard screens ─────────────────────────────── */
  if (status === "loading") return <FullScreen><Spinner /><p style={{ marginTop: 12, color: "#8892a4" }}>Loading session…</p></FullScreen>;
  if (!session) return (<FullScreen><div className="admin-guard-card"><div className="guard-icon-wrap">{Icons.home}</div><h2>Admin Area</h2><p>You must sign in as an admin to access this page.</p><button className="admin-btn admin-btn--primary" onClick={() => signIn(undefined, { callbackUrl: "/admin" })}>Go to login</button></div></FullScreen>);
  if (!isAdmin) return (<FullScreen><div className="admin-guard-card admin-guard-card--error"><h2>Access Denied</h2><p>Your account does not have admin permissions.</p><button className="admin-btn admin-btn--ghost" onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button></div></FullScreen>);

  return (
    <>
      <AdminStyles />
      <div className="admin-layout">
        <div className={`admin-overlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />
        <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="admin-sidebar-brand"><div className="admin-sidebar-logo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg></div><div><h2>RS Dashboard</h2><span>Portfolio CMS</span></div></div>
          <nav className="admin-nav">{navItems.map((item) => (<button key={item.key} className={`admin-nav-item ${activeSection === item.key ? "admin-nav-item--active" : ""}`} onClick={() => { setActiveSection(item.key); setSidebarOpen(false); cancelEdit(); }}>{item.icon}{item.label}</button>))}</nav>
          <div className="admin-sidebar-footer"><div className="admin-user-info"><div className="admin-user-email">{(session.user as any)?.email}</div><div className="admin-user-badge">ADMIN</div></div><button className="admin-nav-item" onClick={() => signOut({ callbackUrl: "/" })}>{Icons.logout} Sign out</button><a href="/" className="admin-nav-item" style={{ textDecoration: "none" }}>{Icons.home} View site</a></div>
        </aside>

        <main className="admin-main">
          <div className="admin-topbar"><div><button className="admin-hamburger" onClick={() => setSidebarOpen(true)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg></button><h1>{navItems.find((i) => i.key === activeSection)?.label ?? "Overview"}</h1><p>Manage your portfolio content database</p></div></div>
          {error && (<div className="admin-error">{error}<button style={{ marginLeft: "auto", background: "none", border: "none", color: "#fca5a5", cursor: "pointer", padding: 4 }} onClick={() => setError(null)}>{Icons.x}</button></div>)}

          {/* ═══ OVERVIEW ═══ */}
          {activeSection === "overview" && (
            <div className="admin-stats">
              <StatCard label="Total Projects" count={projects.length} color="#6c63ff" icon={Icons.folder} />
              <StatCard label="Experience Items" count={experience.length} color="#ff6584" icon={Icons.briefcase} />
              <StatCard label="Endorsements" count={endorsements.length} color="#f59e0b" icon={Icons.star} />
              <StatCard label="Skills" count={skills.length} color="#10b981" icon={Icons.cpu} />
            </div>
          )}

          {/* ═══ PROJECTS ═══ */}
          {activeSection === "projects" && (
            <CrudSection title={editingId ? "Edit Project" : "Add Project"} desc="Manage portfolio projects with categories, tags, and galleries." icon={Icons.folder}>
              <form className="admin-form" onSubmit={(e) => { e.preventDefault(); handleSave("/api/projects", projForm, cancelEdit, "Project", !!editingId); }}>
                <div className="admin-input-group"><label>Title</label><input className="admin-input" value={projForm.title} onChange={(e) => setProjForm({ ...projForm, title: e.target.value })} required /></div>
                <div className="admin-input-group"><label>Category</label><select className="admin-input" value={projForm.category} onChange={(e) => setProjForm({ ...projForm, category: e.target.value as any })}><option value="design">Design</option><option value="it">IT</option><option value="photo">Photography</option><option value="web">Web</option></select></div>
                <div className="admin-input-group admin-input-full"><label>Description</label><textarea className="admin-input admin-textarea" value={projForm.description} onChange={(e) => setProjForm({ ...projForm, description: e.target.value })} required /></div>
                <div className="admin-input-group"><label>Tags (comma separated)</label><input className="admin-input" value={projForm.tags?.join(", ")} onChange={(e) => setProjForm({ ...projForm, tags: e.target.value.split(",").map(s => s.trim()).filter(s => s) })} /></div>
                <div className="admin-input-group"><label>Emoji</label><input className="admin-input" value={projForm.emoji || ""} onChange={(e) => setProjForm({ ...projForm, emoji: e.target.value })} /></div>
                <div className="admin-input-group"><label>Main Image URL</label><input className="admin-input" value={projForm.image || ""} onChange={(e) => setProjForm({ ...projForm, image: e.target.value })} /></div>
                <div className="admin-input-group"><label>Gallery URLs (comma separated)</label><input className="admin-input" value={projForm.gallery?.join(", ")} onChange={(e) => setProjForm({ ...projForm, gallery: e.target.value.split(",").map(s => s.trim()).filter(s => s) })} /></div>
                <div className="admin-input-group"><label>Live URL</label><input className="admin-input" value={projForm.liveUrl || ""} onChange={(e) => setProjForm({ ...projForm, liveUrl: e.target.value })} /></div>
                <div className="admin-input-group"><label>Code URL</label><input className="admin-input" value={projForm.codeUrl || ""} onChange={(e) => setProjForm({ ...projForm, codeUrl: e.target.value })} /></div>
                <div className="admin-input-group"><label>Sort Order</label><input type="number" className="admin-input" value={projForm.sortOrder} onChange={(e) => setProjForm({ ...projForm, sortOrder: parseInt(e.target.value) })} /></div>
                <div className="admin-form-actions admin-input-full">
                  <button type="submit" disabled={saving} className="admin-btn admin-btn--primary">{saving ? "Saving…" : editingId ? "Update Project" : "Create Project"}</button>
                  {editingId && <button type="button" onClick={cancelEdit} className="admin-btn admin-btn--ghost">Cancel</button>}
                </div>
              </form>
              <ItemList items={projects} renderItem={(p) => (
                <><div className="admin-item-content"><div className="admin-item-category">{p.category}</div><div className="admin-item-title">{p.title}</div><div className="admin-item-desc">{p.description}</div></div>
                  <div className="admin-item-actions"><button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => startEdit(p, "projects")}>{Icons.edit} Edit</button><button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => handleDelete("projects", p.id)}>{Icons.trash} Delete</button></div></>
              )} />
            </CrudSection>
          )}

          {/* ═══ EXPERIENCE ═══ */}
          {activeSection === "experience" && (
            <CrudSection title={editingId ? "Edit Experience" : "Add Experience"} desc="Manage your career timeline." icon={Icons.briefcase}>
              <form className="admin-form" onSubmit={(e) => { e.preventDefault(); handleSave("/api/experience", expForm, cancelEdit, "Experience", !!editingId); }}>
                <div className="admin-input-group"><label>Position Title</label><input className="admin-input" value={expForm.title} onChange={(e) => setExpForm({ ...expForm, title: e.target.value })} required /></div>
                <div className="admin-input-group"><label>Company</label><input className="admin-input" value={expForm.company} onChange={(e) => setExpForm({ ...expForm, company: e.target.value })} required /></div>
                <div className="admin-input-group"><label>Date Range (e.g., 2021 – 2023)</label><input className="admin-input" value={expForm.dateRange} onChange={(e) => setExpForm({ ...expForm, dateRange: e.target.value })} required /></div>
                <div className="admin-input-group"><label>Sort Order</label><input type="number" className="admin-input" value={expForm.sortOrder} onChange={(e) => setExpForm({ ...expForm, sortOrder: parseInt(e.target.value) })} /></div>
                <div className="admin-input-group admin-input-full"><label>Tasks (one per line)</label><textarea className="admin-input admin-textarea" value={expForm.tasks?.join("\n")} onChange={(e) => setExpForm({ ...expForm, tasks: e.target.value.split("\n").filter(s => s) })} /></div>
                <div className="admin-input-group admin-input-full"><label>Tags (comma separated)</label><input className="admin-input" value={expForm.tags?.join(", ")} onChange={(e) => setExpForm({ ...expForm, tags: e.target.value.split(",").map(s => s.trim()).filter(s => s) })} /></div>
                <div className="admin-form-actions admin-input-full">
                  <button type="submit" disabled={saving} className="admin-btn admin-btn--primary">{saving ? "Saving…" : editingId ? "Update Entry" : "Create Entry"}</button>
                  {editingId && <button type="button" onClick={cancelEdit} className="admin-btn admin-btn--ghost">Cancel</button>}
                </div>
              </form>
              <ItemList items={experience} renderItem={(ex) => (
                <><div className="admin-item-content"><div className="admin-item-title">{ex.title}</div><div className="admin-item-meta">{ex.company} · {ex.dateRange}</div></div>
                  <div className="admin-item-actions"><button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => startEdit(ex, "experience")}>{Icons.edit} Edit</button><button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => handleDelete("experience", ex.id)}>{Icons.trash} Delete</button></div></>
              )} />
            </CrudSection>
          )}

          {/* ═══ ENDORSEMENTS ═══ */}
          {activeSection === "endorsements" && (
            <CrudSection title={editingId ? "Edit Endorsement" : "Add Endorsement"} desc="Manage professional references." icon={Icons.star}>
              <form className="admin-form" onSubmit={(e) => { e.preventDefault(); handleSave("/api/endorsements", endForm, cancelEdit, "Endorsement", !!editingId); }}>
                <div className="admin-input-group"><label>Name</label><input className="admin-input" value={endForm.name} onChange={(e) => setEndForm({ ...endForm, name: e.target.value })} required /></div>
                <div className="admin-input-group"><label>Role</label><input className="admin-input" value={endForm.role} onChange={(e) => setEndForm({ ...endForm, role: e.target.value })} required /></div>
                <div className="admin-input-group"><label>Company</label><input className="admin-input" value={endForm.company} onChange={(e) => setEndForm({ ...endForm, company: e.target.value })} required /></div>
                <div className="admin-input-group"><label>Phone (optional)</label><input className="admin-input" value={endForm.phone || ""} onChange={(e) => setEndForm({ ...endForm, phone: e.target.value })} /></div>
                <div className="admin-input-group admin-input-full"><label>Message</label><textarea className="admin-input admin-textarea" value={endForm.message} onChange={(e) => setEndForm({ ...endForm, message: e.target.value })} required /></div>
                <div className="admin-form-actions admin-input-full">
                  <button type="submit" disabled={saving} className="admin-btn admin-btn--primary">{saving ? "Saving…" : editingId ? "Update Endorsement" : "Create Endorsement"}</button>
                  {editingId && <button type="button" onClick={cancelEdit} className="admin-btn admin-btn--ghost">Cancel</button>}
                </div>
              </form>
              <ItemList items={endorsements} renderItem={(en) => (
                <><div className="admin-item-content"><div className="admin-item-title">{en.name}</div><div className="admin-item-meta">{en.role} · {en.company}</div></div>
                  <div className="admin-item-actions"><button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => startEdit(en, "endorsements")}>{Icons.edit} Edit</button><button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => handleDelete("endorsements", en.id)}>{Icons.trash} Delete</button></div></>
              )} />
            </CrudSection>
          )}

          {/* ═══ SKILLS ═══ */}
          {activeSection === "skills" && (
            <CrudSection title={editingId ? "Edit Skill" : "Add Skill"} desc="Manage technical proficiencies." icon={Icons.cpu}>
              <form className="admin-form" onSubmit={(e) => { e.preventDefault(); handleSave("/api/skills", skillForm, cancelEdit, "Skill", !!editingId); }}>
                <div className="admin-input-group"><label>Skill Name</label><input className="admin-input" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} required /></div>
                <div className="admin-input-group"><label>Category</label><select className="admin-input" value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value as any })}><option value="design">Design</option><option value="it">IT</option><option value="web">Web</option><option value="photo">Photography</option></select></div>
                <div className="admin-input-group"><label>Level (0-100)</label><input type="number" className="admin-input" value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value) })} /></div>
                <div className="admin-input-group"><label>Icon URL</label><input className="admin-input" value={skillForm.icon || ""} onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })} /></div>
                <div className="admin-input-group"><label>Emoji Placeholder</label><input className="admin-input" value={skillForm.emoji || ""} onChange={(e) => setSkillForm({ ...skillForm, emoji: e.target.value })} /></div>
                <div className="admin-input-group"><label>Sort Order</label><input type="number" className="admin-input" value={skillForm.sortOrder} onChange={(e) => setSkillForm({ ...skillForm, sortOrder: parseInt(e.target.value) })} /></div>
                <div className="admin-form-actions admin-input-full">
                  <button type="submit" disabled={saving} className="admin-btn admin-btn--primary">{saving ? "Saving…" : editingId ? "Update Skill" : "Create Skill"}</button>
                  {editingId && <button type="button" onClick={cancelEdit} className="admin-btn admin-btn--ghost">Cancel</button>}
                </div>
              </form>
              <ItemList items={skills} renderItem={(s) => (
                <><div className="admin-item-content"><div className="admin-item-title">{s.name}</div><div className="admin-item-meta">{s.category} · {s.level}%</div></div>
                  <div className="admin-item-actions"><button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => startEdit(s, "skills")}>{Icons.edit} Edit</button><button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => handleDelete("skills", s.id)}>{Icons.trash} Delete</button></div></>
              )} />
            </CrudSection>
          )}
        </main>
      </div>
      {toast && <div className="admin-toast">{toast}</div>}
    </>
  );
}

/* ── sub-components ──────────────────────────────────── */
function FullScreen({ children }: { children: ReactNode }) { return <div className="admin-fullscreen">{children}</div>; }
function Spinner() { return <div className="admin-spinner" />; }
function StatCard({ label, count, color, icon }: { label: string; count: number; color: string; icon: ReactNode }) {
  return (<div className="admin-stat-card"><div className="admin-stat-icon" style={{ background: `${color}18`, color }}>{icon}</div><div><div className="admin-stat-num" style={{ color }}>{count}</div><div className="admin-stat-label">{label}</div></div></div>);
}
function CrudSection({ title, desc, icon, children }: { title: string; desc: string; icon: ReactNode; children: ReactNode }) {
  return (<div className="admin-section"><div className="admin-section-header"><div><h2>{icon}{title}</h2><p>{desc}</p></div></div>{children}</div>);
}
function ItemList<T extends { id: string }>({ items, renderItem }: { items: T[]; renderItem: (item: T) => ReactNode }) {
  if (items.length === 0) return <div className="admin-empty">No items found. Add one above!</div>;
  return (<div className="admin-items">{items.map((item) => <div key={item.id} className="admin-item">{renderItem(item)}</div>)}</div>);
}

/* ── styles ─────────────────────────────────────────── */
function AdminStyles() {
  return (<style jsx global>{`
    .admin-layout { display: flex; min-height: 100vh; background: #05071a; font-family: 'Inter', system-ui, sans-serif; color: #e2e8f0; }
    .admin-sidebar { width: 260px; background: rgba(255,255,255,0.03); border-right: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; padding: 24px 0; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; transition: transform 0.3s cubic-bezier(.4,0,.2,1); }
    .admin-sidebar-brand { padding: 0 24px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 8px; display: flex; align-items: center; gap: 12px; }
    .admin-sidebar-logo { width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #6c63ff, #3ecfcf); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(108,99,255,0.3); flex-shrink: 0; color: white; }
    .admin-sidebar-brand h2 { font-size: 1.05rem; font-weight: 700; }
    .admin-sidebar-brand span { font-size: 0.72rem; color: #4a5568; }
    .admin-nav { flex: 1; padding: 12px; display: flex; flex-direction: column; gap: 4px; }
    .admin-nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 10px; font-size: 0.88rem; font-weight: 500; color: #8892a4; cursor: pointer; border: none; background: none; text-align: left; width: 100%; transition: 0.2s; }
    .admin-nav-item:hover { color: #e2e8f0; background: rgba(255,255,255,0.05); }
    .admin-nav-item--active { color: #e2e8f0 !important; background: rgba(108,99,255,0.12) !important; }
    .admin-nav-item--active svg { color: #6c63ff; }
    .admin-sidebar-footer { padding: 16px 12px 0; border-top: 1px solid rgba(255,255,255,0.06); }
    .admin-user-info { padding: 8px 16px; margin-bottom: 8px; }
    .admin-user-email { font-size: 0.8rem; color: #8892a4; overflow: hidden; text-overflow: ellipsis; }
    .admin-user-badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; font-weight: 700; background: rgba(16,185,129,0.15); color: #34d399; margin-top: 4px; }
    .admin-main { flex: 1; margin-left: 260px; padding: 32px 48px; min-height: 100vh; }
    .admin-topbar { margin-bottom: 32px; }
    .admin-topbar h1 { font-size: 1.8rem; font-weight: 700; }
    .admin-topbar p { color: #4a5568; font-size: 0.9rem; }
    .admin-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; margin-bottom: 32px; }
    .admin-stat-card { padding: 24px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; display: flex; align-items: center; gap: 16px; transition: 0.3s; }
    .admin-stat-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.1); }
    .admin-stat-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .admin-stat-num { font-size: 1.8rem; font-weight: 800; }
    .admin-stat-label { font-size: 0.82rem; color: #8892a4; }
    .admin-section { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 24px; padding: 32px; margin-bottom: 24px; }
    .admin-section-header { margin-bottom: 24px; }
    .admin-section-header h2 { font-size: 1.25rem; font-weight: 700; display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
    .admin-form { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; padding-bottom: 32px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .admin-input-group { display: flex; flex-direction: column; gap: 6px; }
    .admin-input-group label { font-size: 0.75rem; font-weight: 600; color: #4a5568; text-transform: uppercase; letter-spacing: 0.5px; }
    .admin-input { width: 100%; padding: 12px 16px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: #e2e8f0; font-size: 0.9rem; outline: none; transition: 0.2s; }
    .admin-input:focus { border-color: #6c63ff; }
    .admin-textarea { min-height: 100px; resize: vertical; }
    .admin-input-full { grid-column: 1 / -1; }
    .admin-form-actions { display: flex; gap: 12px; }
    .admin-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px; border-radius: 10px; font-size: 0.9rem; font-weight: 600; cursor: pointer; border: none; transition: 0.2s; white-space: nowrap; }
    .admin-btn--primary { background: linear-gradient(135deg, #6c63ff, #5a52e0); color: white; }
    .admin-btn--primary:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(108,99,255,0.3); }
    .admin-btn--ghost { background: rgba(255,255,255,0.06); color: #e2e8f0; border: 1px solid rgba(255,255,255,0.1); }
    .admin-btn--danger { background: rgba(239,68,68,0.1); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
    .admin-btn--sm { padding: 8px 14px; font-size: 0.8rem; }
    .admin-items { display: flex; flex-direction: column; gap: 12px; }
    .admin-item { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); border-radius: 14px; }
    .admin-item-content { flex: 1; }
    .admin-item-category { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; background: rgba(108,99,255,0.15); color: #8b83ff; margin-bottom: 4px; }
    .admin-item-title { font-weight: 600; font-size: 1rem; }
    .admin-item-desc { font-size: 0.82rem; color: #8892a4; margin-top: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .admin-item-meta { font-size: 0.78rem; color: #4a5568; margin-top: 2px; }
    .admin-item-actions { display: flex; gap: 8px; }
    .admin-toast { position: fixed; bottom: 32px; right: 32px; padding: 14px 24px; background: #1a202c; border: 1px solid #6c63ff; color: #e2e8f0; border-radius: 12px; font-size: 0.9rem; z-index: 1000; box-shadow: 0 10px 40px rgba(0,0,0,0.5); animation: toastIn 0.3s ease; }
    @keyframes toastIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .admin-error { background: rgba(239,68,68,0.1); border: 1px solid #ef4444; color: #fca5a5; padding: 12px 20px; border-radius: 10px; margin-bottom: 24px; display: flex; align-items: center; }
    .admin-fullscreen { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #05071a; }
    .admin-guard-card { background: rgba(255,255,255,0.03); padding: 48px; border-radius: 24px; text-align: center; max-width: 400px; border: 1px solid rgba(255,255,255,0.06); }
    .admin-spinner { width: 32px; height: 32px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #6c63ff; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 900px) { .admin-sidebar { transform: translateX(-100%); } .admin-main { margin-left: 0; } .admin-hamburger { display: block; } .admin-form { grid-template-columns: 1fr; } }
  `}</style>);
}
