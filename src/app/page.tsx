"use client";

import { useState, useEffect, useRef, FormEvent } from "react";

// ── DATA ─────────────────────────────────────────────
const projectsData = [
  {
    id: 1, category: "design",
    title: "EcoBrand – Corporate Identity",
    desc: "Complete branding package including logo, business cards, and a 20-page professional brochure for a green energy startup.",
    tags: ["Photoshop", "Illustrator", "Branding"],
    emoji: "🎨",
    gradient: "linear-gradient(135deg, #6c63ff 0%, #3ecfcf 100%)",
    image: "/EcoBrand/Cover.png",
    gallery: [
      "/EcoBrand/Cover.png",
      "/EcoBrand/0000000.jpg",
      "/EcoBrand/01.png",
      "/EcoBrand/Book Font Cover 2.jpg",
      "/EcoBrand/1st Page.png",
      "/EcoBrand/Ajith Wellington 25th Bookmark.png"
    ],
    live: "#", code: "#"
  },
  {
    id: 2, category: "web",
    title: "TravelPulse – WordPress Site",
    desc: "A modern, responsive travel blog and booking site with custom theme elements and SEO optimization.",
    tags: ["WordPress", "SEO", "Elementor"],
    emoji: "🌐",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    live: "#", code: "#"
  },
  {
    id: 3, category: "photo",
    title: "Aerial Lanka – Drone Cinematography",
    desc: "A collection of 4K aerial shots and landscape photography from various locations across Sri Lanka.",
    tags: ["DJI Drone", "Lightroom", "Premiere Pro"],
    emoji: "🚁",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    gallery: [
      "/Drone Videos/ssstik.io_1771946919687.mp4",
      "/Drone Videos/ssstik.io_1771947096752.mp4",
      "/Drone Videos/ssstik.io_1771947261912.mp4",
      "/Drone Videos/ssstik.io_1771947314544.mp4"
    ],
    live: "#", code: "#"
  },
  {
    id: 4, category: "it",
    title: "School Network Infrastructure",
    desc: "Designed and implemented a secure, high-speed network for a campus of 500+ users with firewall and content filtering.",
    tags: ["Networking", "Security", "Server Admin"],
    emoji: "🖥️",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    live: "#", code: "#"
  },
  {
    id: 5, category: "design",
    title: "Event Magazine – Souvenir Book",
    desc: "Design and layout for a 120-page annual school magazine with custom graphics and photo editing.",
    tags: ["Adobe InDesign", "Photoshop", "Typography"],
    emoji: "📚",
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    image: "/EcoBrand/Book Front Cover 1 of 1.png",
    gallery: [
      "/EcoBrand/Book Front Cover 1 of 1.png",
      "/EcoBrand/Front Iner 1 of 1.png",
      "/EcoBrand/Book Font Cover 2.jpg"
    ],
    live: "#", code: "#"
  },
  {
    id: 6, category: "web",
    title: "SMM Campaign – Local Brands",
    desc: "Social media management and content creation for several local SMEs, increasing engagement by 150%.",
    tags: ["Social Media", "Canva", "Analytics"],
    emoji: "📱",
    gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    image: "/EcoBrand/Cashew  Poster.png",
    live: "/EcoBrand/Cashew  Poster.png", code: "#"
  },
  {
    id: 7, category: "photo",
    title: "Portrait Series – Professional",
    desc: "High-quality professional portraits and event photography with advanced retouching techniques.",
    tags: ["DSLR", "Studio Lighting", "Retouching"],
    emoji: "📸",
    gradient: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    image: "/EcoBrand/Invitation Silver Jubilee of Priestly Ordination.jpg",
    gallery: [
      "/EcoBrand/Invitation Silver Jubilee of Priestly Ordination.jpg",
      "/EcoBrand/Ajith Wellington 25th Bookmark.png",
      "/EcoBrand/Dr. Sri Rajan Prize Giving Chif Guest.jpg"
    ],
    live: "#", code: "#"
  },
  {
    id: 8, category: "it",
    title: "CCTV Surveillance Mesh",
    desc: "Installation of a 32-camera surveillance system with AI-powered motion alerts and remote cloud monitoring.",
    tags: ["CCTV", "Hikvision", "NVR Configuration"],
    emoji: "👁️",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    image: "/EcoBrand/IMOU Cruiser SC 5MP Smart WiFi Camera with Red & Blue Warning Lights.png",
    gallery: [
      "/EcoBrand/IMOU Cruiser SC 5MP Smart WiFi Camera with Red & Blue Warning Lights.png",
      "/EcoBrand/IMOU Dual Leans.png"
    ],
    live: "#", code: "#"
  },
  {
    id: 9, category: "design",
    title: "Aura Hair & Beauty – Identity",
    desc: "Complete visual identity design for a premium beauty studio, focusing on elegance and modern aesthetics.",
    tags: ["Logo Design", "Typography", "Color Theory"],
    emoji: "💄",
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
    image: "/EcoBrand/AURA HAIR BEAUTY STUDIO.png",
    gallery: [
      "/EcoBrand/AURA HAIR BEAUTY STUDIO.png",
      "/EcoBrand/Weeding Cake Add.png",
      "/EcoBrand/Independence Day  Post.png"
    ],
    live: "#", code: "#"
  }
];

const phrases = [
  "Building Modern Websites",
  "Graphic Design & Branding",
  "Professional Video Editing",
  "IT & Network Solutions",
  "Social Media Management",
  "Photography & Drone Work"
];

// ── COMPONENT ────────────────────────────────────────
export default function Portfolio() {
  const [activeTab, setActiveTab] = useState("design");
  const [projectFilter, setProjectFilter] = useState("all");
  const [typedText, setTypedText] = useState("");
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success">("idle");
  const [stats, setStats] = useState({ years: 0, clients: 0, designs: 0 });
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

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
  }, []);

  // ── CUSTOM CURSOR ───────────────────────────────────
  useEffect(() => {
    let mx = 0, my = 0, fx = 0, fy = 0;
    const moveCursor = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = mx + "px";
        cursorRef.current.style.top = my + "px";
      }
    };

    const animCursor = () => {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      if (followerRef.current) {
        followerRef.current.style.left = fx + "px";
        followerRef.current.style.top = fy + "px";
      }
      requestAnimationFrame(animCursor);
    };

    window.addEventListener("mousemove", moveCursor);
    const rAF = requestAnimationFrame(animCursor);

    const interactiveEls = document.querySelectorAll("a, button, .project-card, .skill-chip");
    interactiveEls.forEach(el => {
      el.addEventListener("mouseenter", () => {
        if (cursorRef.current && followerRef.current) {
          cursorRef.current.style.transform = "translate(-50%,-50%) scale(1.8)";
          followerRef.current.style.transform = "translate(-50%,-50%) scale(1.4)";
        }
      });
      el.addEventListener("mouseleave", () => {
        if (cursorRef.current && followerRef.current) {
          cursorRef.current.style.transform = "translate(-50%,-50%) scale(1)";
          followerRef.current.style.transform = "translate(-50%,-50%) scale(1)";
        }
      });
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      cancelAnimationFrame(rAF);
    };
  }, []);

  // ── PARTICLES ───────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: any[] = [];
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
      // Connections
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
    ? projectsData
    : projectsData.filter(p => p.category === projectFilter);

  return (
    <>
      <nav id="navbar" className={isNavScrolled ? "scrolled" : ""}>
        <div className="nav-inner">
          <a href="#home" className="nav-logo"><span className="accent">&lt;</span>RS<span className="accent">/&gt;</span></a>
          <ul className={`nav-links ${isNavOpen ? "open" : ""}`} id="nav-links">
            <li><a href="#home" className="nav-link" onClick={() => setIsNavOpen(false)}>Home</a></li>
            <li><a href="#about" className="nav-link" onClick={() => setIsNavOpen(false)}>About</a></li>
            <li><a href="#skills" className="nav-link" onClick={() => setIsNavOpen(false)}>Skills</a></li>
            <li><a href="#projects" className="nav-link" onClick={() => setIsNavOpen(false)}>Projects</a></li>
            <li><a href="#experience" className="nav-link" onClick={() => setIsNavOpen(false)}>Experience</a></li>
            <li><a href="#contact" className="nav-link" onClick={() => setIsNavOpen(false)}>Contact</a></li>
          </ul>
          <a href="#contact" className="btn btn-sm hire-btn btn-primary">Hire Me</a>
          <button id="hamburger" className={`hamburger ${isNavOpen ? "open" : ""}`} onClick={() => setIsNavOpen(!isNavOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="home" className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Available for new projects
          </div>
          <h1 className="hero-title">
            Hi, I&apos;m <span className="gradient-text">Roshen Shanilka</span>
          </h1>
          <div className="hero-subtitle-wrap">
            <span className="hero-subtitle">I am into </span>
            <span className="typed-text">{typedText}</span>
            <span className="cursor-blink">|</span>
          </div>
          <p className="hero-desc">
            IT Specialist & Creative Designer. I bridge the gap between technical infrastructure
            and visual excellence. From managing school networks to crafting social media identities.
          </p>
          <div className="hero-cta">
            <a href="#projects" className="btn btn-primary">My Portfolio</a>
            <a href="#contact" className="btn btn-ghost">Let&apos;s Talk</a>
          </div>
          <div className="hero-stats reveal" id="hero-stats-box">
            <div className="stat">
              <div>
                <span className="stat-num">{stats.years}</span>
                <span className="stat-plus">+</span>
              </div>
              <span className="stat-label">Years IT Exp.</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <div>
                <span className="stat-num">{stats.clients}</span>
                <span className="stat-plus">+</span>
              </div>
              <span className="stat-label">Clients</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <div>
                <span className="stat-num">{stats.designs}</span>
                <span className="stat-plus">+</span>
              </div>
              <span className="stat-label">Designs</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="avatar-ring">
            <div className="avatar-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/new image (2).png"
                alt="Roshen Shanilka"
                className="avatar-img"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.avatar-placeholder')) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'avatar-placeholder';
                    placeholder.innerHTML = 'RS';
                    parent.appendChild(placeholder);
                  }
                }}
              />
            </div>
          </div>
        </div>
        <a href="#about" className="scroll-indicator">
          <span>About Me</span>
          <div className="scroll-arrow"></div>
        </a>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="section about-section">
        <div className="section-inner">
          <div className="section-header reveal">
            <span className="section-tag">About Me</span>
            <h2 className="section-title">Dedicated to <span className="gradient-text">Excellence</span></h2>
            <p className="section-subtitle">Blending technical IT expertise with creative design</p>
          </div>
          <div className="about-grid">
            <div className="about-card glass-card reveal">
              <div className="about-text">
                <p>
                  I&apos;m <strong>Roshen Shanilka</strong>, a passionate IT Specialist and Designer based in Kochchikade, Sri Lanka.
                  My journey in the tech world started with hardware and networking, but it quickly expanded into the creative realms
                  of graphic design, video editing, and social media management.
                </p>
                <p>
                  Currently, I serve as the IT Coordinator for St. Nicholas&apos; International College, where I maintain complex IT infrastructures.
                  Simultaneously, I channel my creativity into building websites, designing brochures, and managing social media for various brands.
                </p>
                <p>
                  My philosophy is simple: technology should be invisible and efficient, while design should be bold and impactful.
                  Whether I&apos;m troubleshooting a server or capturing the perfect drone shot, I aim for perfection.
                </p>
                <div className="about-details">
                  <div className="detail-item"><span className="detail-label">Name:</span><span>Roshen Shanilka</span></div>
                  <div className="detail-item"><span className="detail-label">Location:</span><span>Kochchikade, Sri Lanka</span></div>
                  <div className="detail-item"><span className="detail-label">Email:</span><span>roshenshanilka123@gmail.com</span></div>
                  <div className="detail-item"><span className="detail-label">Status:</span><span className="status-open">Open for Freelance</span></div>
                </div>
                <div className="about-actions">
                  <a href="/Y. B. Roshen Shanilka Resume .pdf" target="_blank" className="btn btn-primary">Download Resume</a>
                  <div className="social-links">
                    <a href="https://wa.me/94770106368" target="_blank" className="social-btn" aria-label="WhatsApp">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    </a>
                    <a href="https://www.facebook.com/roshen.shanilka.2025" target="_blank" className="social-btn" aria-label="Facebook">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                    </a>
                    <a href="https://www.instagram.com/__mr.roshe__?igsh=Y3lnNTk4MzMwNndr" target="_blank" className="social-btn" aria-label="Instagram">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.558.217.957.477 1.377.896.42.42.68.819.896 1.377.163.422.358 1.057.412 2.227.059 1.266.071 1.646.071 4.85s-.012 3.584-.071 4.85c-.054 1.17-.249 1.805-.412 2.227-.217.558-.477.957-.896 1.377-.42.42-.819.68-1.377.896-.422.163-1.057.358-2.227.412-1.266.059-1.646.071-4.85.071s-3.584-.012-4.85-.071c-1.17-.054-1.805-.249-2.227-.412-.558-.217-.957-.477-1.377-.896-.42-.42-.68-.819-.896-1.377-.163-.422-.358-1.057-.412-2.227-.059-1.266-.071-1.646-.071-4.85s.012-3.584.071-4.85c.054-1.17.249-1.805.412-2.227.217-.558.477-.957.896-1.377.42-.42.819-.68 1.377-.896.422-.163 1.057-.358 2.227-.412 1.266-.059 1.646-.071 4.85-.071M12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913a5.921 5.921 0 001.384 2.126A5.921 5.921 0 004.14 23.37c.766.296 1.637.499 2.913.558 1.28.058 1.689.072 4.947.072s3.667-.014 4.947-.072c1.277-.06 2.148-.261 2.913-.558a5.921 5.921 0 002.126-1.384 5.921 5.921 0 001.384-2.126c.296-.765.499-1.636.558-2.913.058-1.28.072-1.689.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.261-2.148-.558-2.913a5.921 5.921 0 00-1.384-2.126A5.921 5.921 0 0019.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.014 15.259 0 12 0m0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324M12 16a4 4 0 110-8 4 4 0 010 8m6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0" /></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="about-cards-col">
              <div className="mini-card glass-card reveal">
                <div className="mini-card-icon">🎓</div>
                <h3>Education</h3>
                <p>National Cert. in ICT<br /><span>Don Bosco Technical – 2020</span></p>
              </div>
              <div className="mini-card glass-card reveal">
                <div className="mini-card-icon">🏆</div>
                <h3>Certifications</h3>
                <p>NVQ Level 3 & 4 (Dip)<br />Hardware & Networking<br />Creative Design</p>
              </div>
              <div className="mini-card glass-card reveal">
                <div className="mini-card-icon">🚁</div>
                <h3>Hobbies</h3>
                <p>Photography<br />Drone Cinematography<br />Tech Exploring</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="section skills-section">
        <div className="section-inner">
          <div className="section-header reveal">
            <span className="section-tag">Expertise</span>
            <h2 className="section-title">My Tech <span className="gradient-text">Stack</span></h2>
            <p className="section-subtitle">Professional tools and technical proficiency</p>
          </div>

          <div className="skills-tabs reveal">
            {[{ id: "design", label: "Design & Creative" }, { id: "it", label: "IT & Networking" }, { id: "web", label: "Web & Social" }, { id: "photo", label: "Photography" }].map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="skills-panels reveal">
            <div className="skills-panel active">
              <div className="skills-grid">
                {activeTab === "design" && (
                  <>
                    <SkillChip name="Photoshop" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg" level={95} />
                    <SkillChip name="Illustrator" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg" level={90} />
                    <SkillChip name="Premiere Pro" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/premierepro/premierepro-plain.svg" level={85} />
                    <SkillChip name="After Effects" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-plain.svg" level={80} />
                    <SkillChip name="Canva Expert" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg" level={90} />
                    <SkillChip name="UI/UX Design" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" level={88} />
                  </>
                )}
                {activeTab === "it" && (
                  <>
                    <SkillChip name="OS Management" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg" level={92} />
                    <SkillChip name="Hardware Troubleshooting" emoji="⚙️" level={90} />
                    <SkillChip name="Cisco Networking" emoji="🌐" level={88} />
                    <SkillChip name="CCTV & Surveillance" emoji="🎥" level={85} />
                    <SkillChip name="Cloud Services" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" level={84} />
                    <SkillChip name="Office Peripherals" emoji="🖨️" level={80} />
                  </>
                )}
                {activeTab === "web" && (
                  <>
                    <SkillChip name="WordPress" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg" level={85} />
                    <SkillChip name="Web Building" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" level={82} />
                    <SkillChip name="Social Media Management" emoji="📱" level={90} />
                    <SkillChip name="Digital Marketing" emoji="📈" level={88} />
                  </>
                )}
                {activeTab === "photo" && (
                  <>
                    <SkillChip name="DSLR Photography" emoji="📷" level={92} />
                    <SkillChip name="Drone Piloting" emoji="🎮" level={88} />
                    <SkillChip name="Lighting & Composition" emoji="🕯️" level={90} />
                    <SkillChip name="Video Production" emoji="✂️" level={85} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="section projects-section">
        <div className="section-inner">
          <div className="section-header reveal">
            <span className="section-tag">Portfolio</span>
            <h2 className="section-title">Creative <span className="gradient-text">Showcase</span></h2>
            <p className="section-subtitle">A collection of my recent works across different fields</p>
          </div>
          <div className="projects-filter reveal">
            {[{ id: "all", label: "All" }, { id: "web", label: "Websites" }, { id: "design", label: "Design" }, { id: "it", label: "IT Projects" }, { id: "photo", label: "Photography" }].map(f => (
              <button
                key={f.id}
                className={`filter-btn ${projectFilter === f.id ? "active" : ""}`}
                onClick={() => setProjectFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="projects-grid">
            {filteredProjects.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i}
                onViewGallery={() => {
                  setSelectedProject(p);
                  setGalleryIndex(0);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="section experience-section">
        <div className="section-inner">
          <div className="section-header reveal">
            <span className="section-tag">Experience</span>
            <h2 className="section-title">My Technical <span className="gradient-text">Path</span></h2>
            <p className="section-subtitle">Professional history from hardware to coordination</p>
          </div>
          <div className="timeline">
            <TimelineItem
              title="IT Coordinator"
              company="St. Nicholas’ International College · Negombo"
              date="Oct 2024 – Present"
              tasks={["Manage and maintain complete school IT infrastructure, servers, and smart classrooms", "Oversee data security, backups, and CCTV systems with 99% uptime", "Provide high-level technical support for 50+ staff and 500+ students"]}
              tags={["Infrastructure", "Networking", "EdTech", "Security"]}
            />
            <TimelineItem
              title="Senior Graphic Designer"
              company="Souvenir Books & Advertisements · Freelance"
              date="Oct 2024 – Present"
              tasks={["Design professional souvenir books, event magazines, and high-impact brochures", "Create complete branding identities for local businesses and social media campaigns", "Handle photo editing and print-ready file preparation for offset printing"]}
              tags={["Photoshop", "Illustrator", "Branding", "Print Media"]}
            />
            <TimelineItem
              title="Hardware & CCTV Technician"
              company="Nawaloka Hospital · Sri Lanka"
              date="2021 – 2023"
              tasks={["Maintained hospital-wide computer networks and hardware systems", "Installed and configured high-end CCTV surveillance systems with remote monitoring", "Troubleshot complex hardware failures and performed component-level repairs"]}
              tags={["Hardware", "CCTV", "MicroTech", "Repair"]}
            />
            <TimelineItem
              title="Computer/Laptop Technician"
              company="MicroTech Computers · Sri Lanka"
              date="2019 – 2021"
              tasks={["Diagnosed and replicated complex laptop motherboard issues", "Performed precision soldering and component replacement using microscope equipment", "Managed repair and maintenance for hundreds of consumer laptops"]}
              tags={["Soldering", "Diagnostics", "Motherboards", "Laptop Repair"]}
            />
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="section contact-section">
        <div className="section-inner">
          <div className="section-header reveal">
            <span className="section-tag">Contact</span>
            <h2 className="section-title">Let&apos;s <span className="gradient-text">Work Together</span></h2>
            <p className="section-subtitle">Ready to bring your IT vision or design project to life.</p>
          </div>
          <div className="contact-grid">
            <div className="contact-info reveal">
              <div className="contact-card glass-card">
                <div className="contact-icon">📧</div>
                <h3>Email</h3>
                <p>roshenshanilka123@gmail.com</p>
              </div>
              <div className="contact-card glass-card">
                <div className="contact-icon">📞</div>
                <h3>Phone</h3>
                <p>+94 77 010 63 68</p>
              </div>
              <div className="contact-card glass-card">
                <div className="contact-icon">📍</div>
                <h3>Location</h3>
                <p>Kochchikade, Sri Lanka</p>
              </div>
            </div>
            <form className="contact-form glass-card reveal" onSubmit={handleContactSubmit}>
              <h3>Send a Message</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name</label>
                  <input type="text" placeholder="Name" required />
                </div>
                <div className="form-group">
                  <label>Your Email</label>
                  <input type="email" placeholder="Email" required />
                </div>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input type="text" placeholder="What is this about?" required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea rows={5} placeholder="Your requirements..." required></textarea>
              </div>
              <button type="submit" className="btn btn-primary form-submit" disabled={formStatus === "sending"}>
                <span>{formStatus === "sending" ? "Sending..." : "Send Message"}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px", height: "18px", marginLeft: "8px" }}>
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
              {formStatus === "success" && <div className="form-success show">✅ Message sent! I&apos;ll get back to you shortly.</div>}
            </form>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <a href="#home" className="nav-logo"><span className="accent">&lt;</span>RS<span className="accent">/&gt;</span></a>
          <p className="footer-copy">© 2026 Roshen Shanilka. Professional Portfolio.</p>
          <div className="footer-links">
            <a href="#about">About</a><a href="#projects">Work</a><a href="#contact">Contact</a>
          </div>
        </div>
      </footer>

      <button className={`back-to-top ${showBackToTop ? "show" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>

      {/* ── GALLERY MODAL ── */}
      {selectedProject && (
        <div className="gallery-modal" onClick={() => setSelectedProject(null)}>
          <div className="gallery-content" onClick={e => e.stopPropagation()}>
            <button className="close-gallery" onClick={() => setSelectedProject(null)}>&times;</button>
            <div className="gallery-main">
              {(selectedProject.gallery ? selectedProject.gallery[galleryIndex] : selectedProject.image).endsWith('.mp4') ? (
                <video
                  key={selectedProject.gallery ? selectedProject.gallery[galleryIndex] : selectedProject.image}
                  src={selectedProject.gallery ? selectedProject.gallery[galleryIndex] : selectedProject.image}
                  controls
                  autoPlay
                  loop
                  className="gallery-video"
                />
              ) : (
                <img src={selectedProject.gallery ? selectedProject.gallery[galleryIndex] : selectedProject.image} alt={selectedProject.title} />
              )}
              {selectedProject.gallery && selectedProject.gallery.length > 1 && (
                <>
                  <button className="gallery-nav prev" onClick={() => setGalleryIndex((galleryIndex - 1 + selectedProject.gallery.length) % selectedProject.gallery.length)}>&#10094;</button>
                  <button className="gallery-nav next" onClick={() => setGalleryIndex((galleryIndex + 1) % selectedProject.gallery.length)}>&#10095;</button>
                </>
              )}
            </div>
            {selectedProject.gallery && (
              <div className="gallery-thumbs">
                {selectedProject.gallery.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className={`thumb ${idx === galleryIndex ? "active" : ""}`}
                    onClick={() => setGalleryIndex(idx)}
                  >
                    {img.endsWith('.mp4') ? (
                      <div className="video-thumb-placeholder">📹</div>
                    ) : (
                      <img src={img} alt="thumb" />
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="gallery-info">
              <h3>{selectedProject.title}</h3>
              <p>{selectedProject.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Image Mask Definition */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="blob-mask" clipPathUnits="objectBoundingBox">
            <path d="M0.2,0.1 C0.5,-0.1 0.9,0.1 0.95,0.4 C1,0.7 0.8,0.95 0.5,1 C0.2,1.05 0,0.85 0,0.5 C0,0.2 0.1,0.15 0.2,0.1" />
          </clipPath>
        </defs>
      </svg>
    </>
  );
}

// ── SUB-COMPONENTS ───────────────────────────────────

function SkillChip({ name, icon, emoji, level }: { name: string, icon?: string, emoji?: string, level: number }) {
  return (
    <div className="skill-chip reveal">
      {icon ? <img src={icon} alt={name} /> : <span style={{ fontSize: "2rem" }}>{emoji}</span>}
      <span>{name}</span>
      <div className="skill-bar"><div className="skill-fill" style={{ width: `${level}%` }}></div></div>
    </div>
  );
}

function ProjectCard({ project, index, onViewGallery }: { project: any, index: number, onViewGallery?: () => void }) {
  const badgeClass = { web: "badge-web", design: "badge-mobile", it: "badge-cloud", photo: "badge-ai" }[project.category as string] || "badge-web";
  const badgeLabel = { web: "Website", design: "Graphic Design", it: "IT Project", photo: "Photography" }[project.category as string] || "Project";
  return (
    <div className="project-card reveal" style={{ transitionDelay: `${index * 0.07}s` }}>
      <div className="project-thumb" style={{
        background: project.image ? `url('${project.image}') center/cover no-repeat` : project.gradient
      }}>
        {!project.image && <span style={{ fontSize: "4rem" }}>{project.emoji}</span>}
        <div className="project-overlay">
          {project.gallery ? (
            <button className="proj-link live" onClick={onViewGallery}>View Works</button>
          ) : project.image ? (
            <a href={project.live} target="_blank" className="proj-link live">View Work</a>
          ) : (
            <a href="#" className="proj-link live">View Project</a>
          )}
          <a href="#" className="proj-link code">Details</a>
        </div>
      </div>
      <div className="project-body">
        <span className={`proj-badge ${badgeClass}`}>{badgeLabel}</span>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.desc}</p>
        <div className="project-tags">
          {project.tags.map((t: string) => <span key={t}>{t}</span>)}
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ title, company, date, tasks, tags }: any) {
  return (
    <div className="timeline-item reveal">
      <div className="timeline-dot"></div>
      <div className="timeline-card glass-card">
        <div className="tl-header">
          <div><h3 className="tl-title">{title}</h3><p className="tl-company">{company}</p></div>
          <span className="tl-date">{date}</span>
        </div>
        <ul className="tl-list">{tasks.map((t: string) => <li key={t}>{t}</li>)}</ul>
        <div className="tl-tags">{tags.map((t: string) => <span key={t}>{t}</span>)}</div>
      </div>
    </div>
  );
}
