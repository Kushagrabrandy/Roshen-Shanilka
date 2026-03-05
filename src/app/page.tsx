"use client";

import { useState, useEffect, useRef, FormEvent } from "react";

// ── DATA Types ─────────────────────────────────────────
interface Project {
  id: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  emoji?: string | null;
  gradient?: string | null;
  image?: string | null;
  gallery?: string[] | null;
  liveUrl?: string | null;
  codeUrl?: string | null;
}

interface Endorsement {
  id: string;
  name: string;
  role: string;
  company: string;
  message: string;
  phone?: string | null;
}

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  icon?: string | null;
  emoji?: string | null;
}

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  dateRange: string;
  tasks: string[];
  tags: string[];
}

const phrases = [
  "Building Modern Websites",
  "Graphic Design & Branding",
  "Professional Video Editing",
  "IT & Network Solutions",
  "Social Media Management",
  "Photography & Drone Work"
];

// ── MAIN PORTFOLIO COMPONENT ───────────────────────────
export default function Portfolio() {
  const [activeTab, setActiveTab] = useState("design");
  const [projectFilter, setProjectFilter] = useState("all");
  const [typedText, setTypedText] = useState("");
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success">("idle");
  const [stats, setStats] = useState({ years: 0, clients: 0, designs: 0 });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Database States
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [endorsements, setEndorsements] = useState<Endorsement[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  // ── FETCH DATA ──────────────────────────────────────
  useEffect(() => {
    async function fetchAll() {
      try {
        const [projRes, skillRes, endRes, expRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/skills"),
          fetch("/api/endorsements"),
          fetch("/api/experience")
        ]);

        if (projRes.ok) setProjects(await projRes.json());
        if (skillRes.ok) setSkills(await skillRes.json());
        if (endRes.ok) setEndorsements(await endRes.json());
        if (expRes.ok) setExperience(await expRes.json());
      } catch (err) {
        console.error("Failed to fetch content", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAll();
  }, []);

  // ── TYPING EFFECT ───────────────────────────────────
  useEffect(() => {
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timeout: NodeJS.Timeout;

    const type = () => {
      const current = phrases[phraseIdx];
      setTypedText(isDeleting ? current.slice(0, charIdx--) : current.slice(0, charIdx++));

      let delay = isDeleting ? 40 : 80;
      if (!isDeleting && charIdx > current.length) {
        delay = 1800;
        isDeleting = true;
      } else if (isDeleting && charIdx < 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        charIdx = 0;
        delay = 300;
      }
      timeout = setTimeout(type, delay);
    };

    type();
    return () => clearTimeout(timeout);
  }, []);

  // ── SCROLL EFFECTS ──────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsNavScrolled(y > 50);
      setShowBackToTop(y > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── REVEAL ANIMATIONS ────────
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          if (entry.target.id === "hero-stats-box") {
            animateStats();
          }
        }
      });
    }, { threshold: 0.12 });

    const items = document.querySelectorAll(".reveal");
    items.forEach(item => observer.observe(item));

    const animateStats = () => {
      const targets = { years: 7, clients: 50, designs: 250 };
      let current = { years: 0, clients: 0, designs: 0 };
      const duration = 1500;
      const steps = 40;
      const interval = duration / steps;

      const timer = setInterval(() => {
        current.years = Math.min(current.years + targets.years / steps, targets.years);
        current.clients = Math.min(current.clients + targets.clients / steps, targets.clients);
        current.designs = Math.min(current.designs + targets.designs / steps, targets.designs);

        setStats({
          years: Math.floor(current.years),
          clients: Math.floor(current.clients),
          designs: Math.floor(current.designs)
        });

        if (current.designs >= targets.designs) clearInterval(timer);
      }, interval);
    };

    return () => observer.disconnect();
  }, [isLoading]);

  // REMOVED: CUSTOM CURSOR EFFECT


  // ── PARTICLES ───────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let W: number, H: number;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      x!: number; y!: number; r!: number; vx!: number; vy!: number; opacity!: number; color!: string;
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.5 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? "#6c63ff" : "#3ecfcf";
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx!.fillStyle = this.color;
        ctx!.globalAlpha = this.opacity;
        ctx!.fill();
        ctx!.globalAlpha = 1;
      }
    }

    particles = Array.from({ length: 120 }, () => new Particle());

    const anim = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = "#6c63ff";
            ctx.globalAlpha = (1 - dist / 100) * 0.15;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(anim);
    };
    const rAF = requestAnimationFrame(anim);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rAF);
    };
  }, []);

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    setTimeout(() => {
      setFormStatus("success");
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setFormStatus("idle"), 5000);
    }, 1500);
  };

  const filteredProjects = projectFilter === "all"
    ? projects
    : projects.filter(p => p.category === projectFilter);

  return (
    <>
      <canvas ref={canvasRef} id="bg-canvas" style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }} />


      <nav id="navbar" className={isNavScrolled ? "scrolled" : ""}>
        <div className="nav-inner">
          <a href="#home" className="nav-logo"><span className="accent">&lt;</span>RS<span className="accent">/&gt;</span></a>
          <ul className={`nav-links ${isNavOpen ? "open" : ""}`}>
            <li><a href="#home" className="nav-link" onClick={() => setIsNavOpen(false)}>Home</a></li>
            <li><a href="#about" className="nav-link" onClick={() => setIsNavOpen(false)}>About</a></li>
            <li><a href="#skills" className="nav-link" onClick={() => setIsNavOpen(false)}>Skills</a></li>
            <li><a href="#projects" className="nav-link" onClick={() => setIsNavOpen(false)}>Projects</a></li>
            <li><a href="#experience" className="nav-link" onClick={() => setIsNavOpen(false)}>Experience</a></li>
            <li><a href="#references" className="nav-link" onClick={() => setIsNavOpen(false)}>References</a></li>
            <li><a href="#contact" className="nav-link" onClick={() => setIsNavOpen(false)}>Contact</a></li>
          </ul>
          <a href="#contact" className="btn btn-sm hire-btn btn-primary">Hire Me</a>
          <button className={`hamburger ${isNavOpen ? "open" : ""}`} onClick={() => setIsNavOpen(!isNavOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      <section id="home" className="hero">
        <div className="hero-content">
          <div className="hero-badge"><span className="badge-dot"></span>Available for new projects</div>
          <h1 className="hero-title">Hi, I&apos;m <span className="gradient-text">Roshen Shanilka</span></h1>
          <div className="hero-subtitle-wrap">
            <span className="hero-subtitle">I am into </span>
            <span className="typed-text">{typedText}</span>
            <span className="cursor-blink">|</span>
          </div>
          <p className="hero-desc">IT Specialist & Creative Designer. I bridge the gap between technical infrastructure and visual excellence.</p>
          <div className="hero-cta">
            <a href="#projects" className="btn btn-primary">My Portfolio</a>
            <a href="#contact" className="btn btn-ghost">Let&apos;s Talk</a>
          </div>
          <div className="hero-stats reveal" id="hero-stats-box">
            <StatItem num={stats.years} label="Years IT Exp." />
            <div className="stat-divider" />
            <StatItem num={stats.clients} label="Clients" />
            <div className="stat-divider" />
            <StatItem num={stats.designs} label="Designs" />
          </div>
        </div>
        <div className="hero-visual">
          <div className="avatar-ring">
            <div className="avatar-container">
              <img src="/new-image-2.png" alt="Roshen Shanilka" className="avatar-img" onError={(e) => { (e.target as any).src = "https://via.placeholder.com/400x400?text=RS"; }} />
            </div>
          </div>
        </div>
        <a href="#about" className="scroll-indicator"><span>About Me</span><div className="scroll-arrow" /></a>
      </section>

      <section id="about" className="section about-section">
        <div className="section-inner">
          <div className="section-header reveal">
            <div id="about-me" className="section-tag" style={{ margin: "0 auto 16px" }}>About Me</div>
            <h2 className="section-title">Dedicated to <span className="gradient-text">Excellence</span></h2>
            <p className="section-subtitle">Blending technical IT expertise with creative design</p>
          </div>
          <div className="about-grid">
            <div className="about-card glass-card reveal">
              <div className="about-text">
                <p>
                  I&apos;m <strong>Roshen Shanilka</strong>, a passionate IT Specialist and Designer based in Kochchikade, Sri Lanka.
                  My journey in the tech world started with hardware and networking, but it quickly expanded into the creative realms of
                  graphic design, video editing, and social media management.
                </p>
                <p>
                  Currently, I serve as the IT Coordinator for St. Nicholas&apos; International College, where I maintain complex IT infrastructures.
                  Simultaneously, I channel my creativity into building websites, designing brochures, and managing social media for various brands.
                </p>
                <p>
                  My philosophy is simple: technology should be invisible and efficient, while design should be bold and impactful.
                  Whether I&apos;m troubleshooting a server or capturing the perfect drone shot, I aim for perfection.
                </p>

                <div className="about-details" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "40px" }}>
                  <div>
                    <span className="detail-label" style={{ display: "block", fontSize: "0.75rem", color: "var(--accent2)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Name:</span>
                    <span style={{ fontWeight: "600" }}>Roshen Shanilka</span>
                  </div>
                  <div>
                    <span className="detail-label" style={{ display: "block", fontSize: "0.75rem", color: "var(--accent2)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Location:</span>
                    <span style={{ fontWeight: "600" }}>Kochchikade, Sri Lanka</span>
                  </div>
                  <div>
                    <span className="detail-label" style={{ display: "block", fontSize: "0.75rem", color: "var(--accent2)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Email:</span>
                    <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>roshenshanilka123@gmail.com</span>
                  </div>
                  <div>
                    <span className="detail-label" style={{ display: "block", fontSize: "0.75rem", color: "var(--accent2)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Status:</span>
                    <span style={{ fontWeight: "600", color: "#4ade80" }}>Open for Freelance</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "40px", flexWrap: "wrap" }}>
                  <a href="/roshen-resume.pdf" download="Roshen_Shanilka_Resume.pdf" className="btn btn-primary">Download Resume</a>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <a href="https://wa.me/94770106368" className="social-btn" aria-label="WhatsApp">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.432h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    </a>
                    <a href="https://facebook.com/roshen.shanilka" className="social-btn" aria-label="Facebook">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                    </a>
                    <a href="https://instagram.com/roshen.shanilka" className="social-btn" aria-label="Instagram">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.019 1.575 20.35.935 19.56.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.584-.071 4.85c-.055 1.17-.249 1.805-.415 2.227-.217.562-.477.96-.896 1.382-.42.419-.819.679-1.381.896-.422.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07s-3.584-.015-4.85-.07c-1.17-.055-1.805-.249-2.227-.415-.562-.217-.96-.477-1.382-.896-.419-.42-.679-.819-.896-1.381-.164-.422-.36-1.057-.413-2.227-.057-1.266-.07-1.646-.07-4.85s.016-3.584.072-4.85c.055-1.17.249-1.805.415-2.227.217-.562.477-.96.896-1.382.42-.419.819-.679 1.381-.896.422-.164 1.057-.36 2.227-.413 1.265-.057 1.645-.07 4.85-.07zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-cards-col reveal" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <AboutMetaCard icon="🎓" title="Education" text={<>National Cert. in ICT<br />Don Bosco Technical - 2020</>} />
              <AboutMetaCard icon="🏆" title="Certifications" text={<>NVQ Level 3 & 4 (Dip)<br />Hardware & Networking<br />Creative Design</>} />
              <AboutMetaCard icon="🚁" title="Hobbies" text={<>Photography<br />Drone Cinematography<br />Tech Exploring</>} />
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="section skills-section">
        <div className="section-inner">
          <div className="section-header reveal">
            <span className="section-tag">Expertise</span>
            <h2 className="section-title">My Tech <span className="gradient-text">Stack</span></h2>
          </div>
          <div className="skills-tabs reveal">
            {["design", "it", "web", "photo"].map(id => (
              <button key={id} className={`tab-btn ${activeTab === id ? "active" : ""}`} onClick={() => setActiveTab(id)}>
                {id.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="skills-grid reveal">
            {skills.filter(s => s.category === activeTab).map(skill => (
              <SkillChip key={skill.id} {...skill} />
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="section projects-section">
        <div className="section-inner">
          <div className="section-header reveal">
            <span className="section-tag">Portfolio</span>
            <h2 className="section-title">Creative <span className="gradient-text">Showcase</span></h2>
          </div>
          <div className="projects-filter reveal">
            {["all", "design", "it", "photo", "web"].map(f => (
              <button key={f} className={`filter-btn ${projectFilter === f ? "active" : ""}`} onClick={() => setProjectFilter(f)}>
                {f === "all" ? "All" : f.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="projects-grid">
            {filteredProjects.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i}
                onViewGallery={() => { setSelectedProject(p); setGalleryIndex(0); }}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="section experience-section">
        <div className="section-inner">
          <div className="section-header reveal">
            <span className="section-tag">Experience</span>
            <h2 className="section-title">My Technical <span className="gradient-text">Path</span></h2>
          </div>
          <div className="timeline">
            {experience.map(item => (
              <TimelineItem key={item.id} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section id="references" className="section references-section">
        <div className="section-inner">
          <div className="section-header reveal">
            <span className="section-tag">References</span>
            <h2 className="section-title">Professional <span className="gradient-text">Endorsements</span></h2>
          </div>
          <div className="references-grid">
            {endorsements.map(en => (
              <div key={en.id} className="reference-card glass-card reveal">
                <div className="reference-quote">“</div>
                <div className="reference-body"><p>{en.message}</p></div>
                <div className="reference-footer">
                  <div className="ref-info">
                    <h3>{en.name}</h3><p>{en.role} · {en.company}</p>
                    {en.phone && <div className="ref-contact">📞 {en.phone}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="section-inner">
          <div className="section-header reveal">
            <span className="section-tag">Contact</span>
            <h2 className="section-title">Let&apos;s <span className="gradient-text">Work Together</span></h2>
          </div>
          <div className="contact-grid">
            <div className="contact-info reveal">
              <ContactCard icon="📧" title="Email" val="roshenshanilka123@gmail.com" />
              <ContactCard icon="📞" title="Phone" val="+94 77 010 63 68" />
              <ContactCard icon="📍" title="Location" val="Kochchikade, Sri Lanka" />
            </div>
            <form className="contact-form glass-card reveal" onSubmit={handleContactSubmit}>
              <h3>Send a Message</h3>
              <div className="form-row">
                <div className="form-group">
                  <input type="text" placeholder="Name" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Email" required />
                </div>
              </div>
              <div className="form-group">
                <textarea rows={6} placeholder="Your Message" required style={{ resize: "none" }} />
              </div>
              <button type="submit" className="btn btn-primary form-submit" disabled={formStatus === "sending"}>
                {formStatus === "sending" ? "Sending..." : "Send Message"}
              </button>
              {formStatus === "success" && (
                <div className="form-success show">
                  <span>✅</span> Message sent successfully! I&apos;ll get back to you soon.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <a href="#home" className="nav-logo"><span className="accent">&lt;</span>RS<span className="accent">/&gt;</span></a>
          <p>© 2026 Roshen Shanilka. Fully Database Driven.</p>
        </div>
      </footer>

      {selectedProject && (
        <div className="gallery-modal" onClick={() => setSelectedProject(null)}>
          <div className="gallery-content" onClick={e => e.stopPropagation()}>
            <button className="close-gallery" onClick={() => setSelectedProject(null)}>&times;</button>
            <div className="gallery-main">
              {((selectedProject.gallery ? selectedProject.gallery[galleryIndex] : selectedProject.image) || "").endsWith(".mp4") ? (
                <video src={selectedProject.gallery ? selectedProject.gallery[galleryIndex] : selectedProject.image || ""} controls autoPlay loop className="gallery-video" />
              ) : (
                <img src={selectedProject.gallery ? selectedProject.gallery[galleryIndex] : selectedProject.image || ""} alt={selectedProject.title} />
              )}
            </div>
            {selectedProject.gallery && selectedProject.gallery.length > 1 && (
              <div className="gallery-thumbs">
                {selectedProject.gallery.map((url, idx) => (
                  <div key={idx} className={`thumb ${idx === galleryIndex ? "active" : ""}`} onClick={() => setGalleryIndex(idx)}>
                    {url.endsWith(".mp4") ? "📹" : <img src={url} alt="thumb" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ── UTILS ───────────────────────────────────────────
function AboutMetaCard({ icon, title, text }: { icon: string, title: string, text: React.ReactNode }) {
  return (
    <div className="glass-card revelation" style={{ padding: "24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", border: "1px solid var(--border)" }}>
      <div style={{ fontSize: "2rem" }}>{icon}</div>
      <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>{title}</h3>
      <div style={{ fontSize: "0.85rem", color: "var(--text-dim)", lineHeight: "1.6" }}>{text}</div>
    </div>
  );
}

function StatItem({ num, label }: { num: number, label: string }) {
  return (<div className="stat"><div><span className="stat-num">{num}</span><span className="stat-plus">+</span></div><span className="stat-label">{label}</span></div>);
}
function DetailItem({ label, val }: { label: string, val: string }) {
  return (<div className="detail-item"><span className="detail-label">{label}:</span><span>{val}</span></div>);
}
function SkillChip({ name, icon, emoji, level }: Skill) {
  return (
    <div className="skill-chip reveal">
      {icon ? <img src={icon} alt={name} /> : <span style={{ fontSize: "2rem" }}>{emoji}</span>}
      <span>{name}</span>
      <div className="skill-bar"><div className="skill-fill" style={{ width: `${level}%` }}></div></div>
    </div>
  );
}
function ProjectCard({ project, index, onViewGallery }: { project: Project, index: number, onViewGallery: () => void }) {
  const badgeLabel: Record<string, string> = { web: "Website", design: "Graphic Design", it: "IT Project", photo: "Photography" };
  const currentBadgeLabel = badgeLabel[project.category] || "Project";
  return (
    <div className="project-card reveal" style={{ transitionDelay: `${index * 0.05}s` }}>
      <div className="project-thumb" style={{ background: project.image ? `url('${project.image}') center/cover no-repeat` : (project.gradient || "gray") }}>
        {!project.image && <span style={{ fontSize: "4.5rem", opacity: 0.8 }}>{project.emoji}</span>}
        <div className="project-overlay">
          <button className="proj-link live" onClick={onViewGallery}>{project.gallery?.length ? "View Gallery" : "View Details"}</button>
          {project.liveUrl && <a href={project.liveUrl} target="_blank" className="proj-link code">Live Site</a>}
        </div>
      </div>
      <div className="project-body">
        <span className="proj-badge">{currentBadgeLabel}</span>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.description}</p>
        <div className="project-tags">{project.tags.map(t => <span key={t}>{t}</span>)}</div>
      </div>
    </div>
  );
}
function TimelineItem({ title, company, dateRange, tasks, tags }: ExperienceItem) {
  return (
    <div className="timeline-item reveal">
      <div className="timeline-dot" />
      <div className="timeline-card glass-card">
        <div className="tl-header">
          <div><h3 className="tl-title">{title}</h3><p className="tl-company">{company}</p></div>
          <span className="tl-date">{dateRange}</span>
        </div>
        <ul className="tl-list">{tasks.map(t => <li key={t}>{t}</li>)}</ul>
        <div className="tl-tags">{tags.map(t => <span key={t}>{t}</span>)}</div>
      </div>
    </div>
  );
}
function ContactCard({ icon, title, val }: { icon: string, title: string, val: string }) {
  return (<div className="contact-card glass-card reveal">
    <div className="contact-icon" style={{ fontSize: "1.5rem" }}>{icon}</div>
    <h3>{title}</h3><p>{val}</p>
  </div>);
}
