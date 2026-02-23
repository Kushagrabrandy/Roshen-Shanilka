/* ═══════════════════════════════════════════════════
   script.js – Portfolio interactivity
   ═══════════════════════════════════════════════════ */

// ── PROJECTS DATA ────────────────────────────────────
const projects = [
  {
    id: 1, category: "design",
    title: "EcoBrand – Corporate Identity",
    desc: "Complete branding package including logo, business cards, and a 20-page professional brochure for a green energy startup.",
    tags: ["Photoshop", "Illustrator", "Branding"],
    emoji: "🎨",
    gradient: "linear-gradient(135deg, #6c63ff 0%, #3ecfcf 100%)",
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
    live: "#", code: "#"
  },
  {
    id: 6, category: "web",
    title: "SMM Campaign – Local Brands",
    desc: "Social media management and content creation for several local SMEs, increasing engagement by 150%.",
    tags: ["Social Media", "Canva", "Analytics"],
    emoji: "📱",
    gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    live: "#", code: "#"
  },
  {
    id: 7, category: "photo",
    title: "Portrait Series – Professional",
    desc: "High-quality professional portraits and event photography with advanced retouching techniques.",
    tags: ["DSLR", "Studio Lighting", "Retouching"],
    emoji: "📸",
    gradient: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    live: "#", code: "#"
  },
  {
    id: 8, category: "it",
    title: "CCTV Surveillance Mesh",
    desc: "Installation of a 32-camera surveillance system with AI-powered motion alerts and remote cloud monitoring.",
    tags: ["CCTV", "Hikvision", "NVR Configuration"],
    emoji: "👁️",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    live: "#", code: "#"
  }
];

// ── RENDER PROJECTS ────────────────────────────────────
function renderProjects(filter = "all") {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;
  grid.innerHTML = "";
  const filtered = filter === "all" ? projects : projects.filter(p => p.category === filter);
  filtered.forEach((p, i) => {
    const badgeClass = { web: "badge-web", design: "badge-mobile", it: "badge-cloud", photo: "badge-ai" }[p.category];
    const badgeLabel = { web: "Website", design: "Graphic Design", it: "IT Project", photo: "Photography" }[p.category];
    const card = document.createElement("div");
    card.className = "project-card reveal";
    card.style.transitionDelay = `${i * 0.07}s`;
    card.innerHTML = `
      <div class="project-thumb" style="background:${p.gradient}">
        <span style="font-size:4rem;">${p.emoji}</span>
        <div class="project-overlay">
          <a href="${p.live}" class="proj-link live" onclick="return false;">View Project</a>
          <a href="${p.code}" class="proj-link code" onclick="return false;">Details</a>
        </div>
      </div>
      <div class="project-body">
        <span class="proj-badge ${badgeClass}">${badgeLabel}</span>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.desc}</p>
        <div class="project-tags">${p.tags.map(t => `<span>${t}</span>`).join("")}</div>
      </div>`;
    grid.appendChild(card);
  });
  // Trigger reveal for newly added cards
  setTimeout(() => observeAll(), 50);
}

// ── FILTER BUTTONS ─────────────────────────────────────
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProjects(btn.dataset.filter);
  });
});

// ── SKILLS TABS ────────────────────────────────────────
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".skills-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    const panel = document.getElementById(`panel-${btn.dataset.tab}`);
    if (panel) panel.classList.add("active");
    animateSkillBars();
    setTimeout(() => observeAll(), 50);
  });
});

// ── SKILL BAR ANIMATION ────────────────────────────────
function animateSkillBars() {
  document.querySelectorAll(".skill-fill").forEach(bar => {
    const w = bar.dataset.width;
    bar.style.width = "0";
    setTimeout(() => { bar.style.width = w + "%"; }, 100);
  });
}

// ── INTERSECTION OBSERVER (REVEAL) ─────────────────────
let observer;
function observeAll() {
  const items = document.querySelectorAll(".reveal:not(.visible)");
  if (!observer) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Animate skill bars if visible
          const bars = entry.target.querySelectorAll(".skill-fill");
          bars.forEach(bar => {
            bar.style.transitionDelay = "0.2s";
            bar.style.width = bar.dataset.width + "%";
          });
        }
      });
    }, { threshold: 0.12 });
  }
  items.forEach(item => observer.observe(item));
}

// ── TYPED TEXT ────────────────────────────────────────
const phrases = [
  "Building Modern Websites",
  "Graphic Design & Branding",
  "Professional Video Editing",
  "IT & Network Solutions",
  "Social Media Management",
  "Photography & Drone Work"
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;
function type() {
  const el = document.getElementById("typed");
  if (!el) return;
  const current = phrases[phraseIdx];
  el.textContent = isDeleting
    ? current.slice(0, charIdx--)
    : current.slice(0, charIdx++);
  let delay = isDeleting ? 40 : 80;
  if (!isDeleting && charIdx > current.length) {
    delay = 1800; isDeleting = true;
  } else if (isDeleting && charIdx < 0) {
    isDeleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; charIdx = 0; delay = 300;
  }
  setTimeout(type, delay);
}

// ── COUNTER ANIMATION ─────────────────────────────────
function animateCounters() {
  document.querySelectorAll(".stat-num").forEach(el => {
    const target = +el.dataset.target;
    let current = 0;
    const step = target / 40;
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(interval);
    }, 30);
  });
}

let countersAnimated = false;
const heroObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersAnimated) {
    countersAnimated = true; animateCounters();
  }
}, { threshold: 0.4 });
const heroEl = document.querySelector("#home .hero-stats");
if (heroEl) heroObserver.observe(heroEl);

// ── NAVBAR SCROLL ───────────────────────────────────────
const navbar = document.getElementById("navbar");
const backToTop = document.getElementById("back-to-top");
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  if (navbar) navbar.classList.toggle("scrolled", y > 50);
  if (backToTop) backToTop.classList.toggle("show", y > 400);
  // Active nav link
  sections.forEach(sec => {
    const offset = sec.offsetTop - 120;
    const bottom = offset + sec.offsetHeight;
    if (y >= offset && y < bottom) {
      document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
      const active = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (active) active.classList.add("active");
    }
  });
}, { passive: true });

// ── BACK TO TOP ─────────────────────────────────────────
if (backToTop) backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ── HAMBURGER MENU ──────────────────────────────────────
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
  navLinks.querySelectorAll(".nav-link").forEach(l => {
    l.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });
}

// ── CUSTOM CURSOR ───────────────────────────────────────
const cursor = document.getElementById("cursor");
const cursorFollower = document.getElementById("cursor-follower");
if (cursor && cursorFollower) {
  let mx = 0, my = 0, fx = 0, fy = 0;
  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + "px"; cursor.style.top = my + "px";
  });
  function animCursor() {
    fx += (mx - fx) * 0.12; fy += (my - fy) * 0.12;
    cursorFollower.style.left = fx + "px"; cursorFollower.style.top = fy + "px";
    requestAnimationFrame(animCursor);
  }
  animCursor();
  document.querySelectorAll("a, button, .project-card, .skill-chip").forEach(el => {
    el.addEventListener("mouseenter", () => { cursor.style.transform = "translate(-50%,-50%) scale(1.8)"; cursorFollower.style.transform = "translate(-50%,-50%) scale(1.4)"; });
    el.addEventListener("mouseleave", () => { cursor.style.transform = "translate(-50%,-50%) scale(1)"; cursorFollower.style.transform = "translate(-50%,-50%) scale(1)"; });
  });
}

// ── PARTICLES ──────────────────────────────────────────
const canvas = document.getElementById("particles-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  class Particle {
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
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function initParticles(count = 120) {
    particles = Array.from({ length: count }, () => new Particle());
  }
  initParticles();

  function drawConnections() {
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
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function animParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animParticles);
  }
  animParticles();
}

// ── CONTACT FORM ─────────────────────────────────────
const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    const btn = document.getElementById("form-submit-btn");
    btn.disabled = true;
    btn.querySelector("span").textContent = "Sending…";
    setTimeout(() => {
      btn.disabled = false;
      btn.querySelector("span").textContent = "Send Message";
      form.reset();
      const success = document.getElementById("form-success");
      if (success) {
        success.classList.add("show");
        setTimeout(() => success.classList.remove("show"), 5000);
      }
    }, 1400);
  });
}

// ── INIT ──────────────────────────────────────────────
renderProjects("all");
type();
observeAll();
animateSkillBars();
