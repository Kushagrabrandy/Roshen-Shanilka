import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed process...");

  // 1. ADMIN USER
  const adminEmail = "admin@example.com";
  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existing) {
    const hashedPassword = await bcrypt.hash("Admin@123", 12);
    await prisma.user.create({
      data: {
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });
    console.log("Admin user created.");
  } else {
    console.log("Admin user already exists.");
  }

  // 2. CLEAR ALL PREVIOUS SITE CONTENT (Avoid duplicates during redo)
  await prisma.siteProject.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.professionalEndorsement.deleteMany({});

  // 3. PROJECTS (from hardcoded projectsData in page.tsx)
  const projectsData = [
    {
      category: "design",
      title: "Sacred Ceremonies – Print Identity",
      description: "Professional design for ecclesiastical events, including souvenir books, invitations, and bookmarks for silver jubilee celebrations.",
      tags: ["Photoshop", "Print Media", "Branding"],
      emoji: "⛪",
      gradient: "linear-gradient(135deg, #6c63ff 0%, #3ecfcf 100%)",
      image: "/EcoBrand/invitation-silver-jubilee-of-priestly-ordination.jpg",
      gallery: [
        "/EcoBrand/invitation-silver-jubilee-of-priestly-ordination.jpg",
        "/EcoBrand/ajith-wellington-25th-bookmark.png",
        "/EcoBrand/screenshot-2026-02-24-204214.png"
      ],
      sortOrder: 1
    },
    {
      category: "design",
      title: "Annual Drama Festival Branding",
      description: "Complete visual package for a major theatrical event, featuring posters, souvenir programs, and digital promotional materials.",
      tags: ["Photoshop", "Illustrator", "Event Graphics"],
      emoji: "🎭",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      image: "/EcoBrand/nicholite-s-drama-rs.2000.jpg",
      gallery: [
        "/EcoBrand/nicholite-s-drama-rs.2000.jpg",
        "/EcoBrand/book-front-cover-1-of-1.png",
        "/EcoBrand/font-cover.png",
        "/EcoBrand/screenshot-2026-02-24-204338.png"
      ],
      sortOrder: 2
    },
    {
      category: "design",
      title: "SNIC Sportswear Branding",
      description: "Custom jersey designs and tournament promotional graphics for international school basketball and volleyball teams.",
      tags: ["Apparel Design", "Sports Branding", "Illustrator"],
      emoji: "🏀",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      image: "/EcoBrand/snic-basketball-jersey-1-of-1-2-.png",
      gallery: [
        "/EcoBrand/snic-basketball-jersey-1-of-1-2-.png",
        "/EcoBrand/maris-volley-02.png",
        "/EcoBrand/annual-inter-house-karate-meet-2025.png"
      ],
      sortOrder: 3
    },
    {
      category: "it",
      title: "School Network Infrastructure",
      description: "Designed and implemented a secure, high-speed network for a campus of 500+ users with firewall and content filtering.",
      tags: ["Networking", "Security", "Server Admin"],
      emoji: "🖥️",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      sortOrder: 4
    },
    {
      category: "design",
      title: "Local Brand Marketing",
      description: "Creative social media management and high-impact poster designs for local businesses, from food vendors to beauty studios.",
      tags: ["Social Media", "Poster Design", "Canva"],
      emoji: "📱",
      gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      image: "/EcoBrand/cashew-poster.png",
      gallery: [
        "/EcoBrand/cashew-poster.png",
        "/EcoBrand/aura-hair-beauty-studio.png",
        "/EcoBrand/weeding-cake-add.png",
        "/EcoBrand/independence-day-post.png"
      ],
      sortOrder: 5
    },
    {
      category: "it",
      title: "CCTV Surveillance Mesh",
      description: "Installation of a 32-camera surveillance system with AI-powered motion alerts and remote cloud monitoring.",
      tags: ["CCTV", "Hikvision", "NVR Configuration"],
      emoji: "👁️",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      image: "/EcoBrand/imou-cruiser-sc-5mp-smart-wifi-camera-with-red-blue-warning-lights.png",
      gallery: [
        "/EcoBrand/imou-cruiser-sc-5mp-smart-wifi-camera-with-red-blue-warning-lights.png",
        "/EcoBrand/imou-dual-leans.png"
      ],
      sortOrder: 6
    },
    {
      category: "photo",
      title: "Aerial Lanka – Drone Cinematography",
      description: "A collection of 4K aerial shots and landscape photography from various locations across Sri Lanka.",
      tags: ["DJI Drone", "Lightroom", "Premiere Pro"],
      emoji: "🚁",
      gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
      gallery: [
        "/drone-videos/ssstik.io-1771946919687.mp4",
        "/drone-videos/ssstik.io-1771947096752.mp4",
        "/drone-videos/ssstik.io-1771947261912.mp4",
        "/drone-videos/ssstik.io-1771947314544.mp4"
      ],
      sortOrder: 7
    },
    {
      category: "design",
      title: "School Prize Giving – Souvenir",
      description: "Elegant souvenir book design for an annual prize giving ceremony, celebrating academic excellence and distinguished guests.",
      tags: ["Layout Design", "Typography", "Print Media"],
      emoji: "📜",
      gradient: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
      image: "/EcoBrand/dr.-sri-rajan-prize-giving-chif-guest.jpg",
      gallery: [
        "/EcoBrand/dr.-sri-rajan-prize-giving-chif-guest.jpg"
      ],
      sortOrder: 8
    },
    {
      category: "photo",
      title: "The Portrait Series – Professional Studio",
      description: "A collection of high-end professional portraits and candid captures, showcasing advanced lighting and post-processing techniques.",
      tags: ["Portraiture", "Studio Lighting", "Retouching"],
      emoji: "📸",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      image: "/portraits/whatsapp-image-2026-02-24-at-19.19.30.jpeg",
      gallery: [
        "/portraits/whatsapp-image-2026-02-24-at-19.19.30.jpeg",
        "/portraits/whatsapp-image-2026-02-24-at-19.19.50.jpeg",
        "/portraits/whatsapp-image-2026-02-24-at-19.20.18.jpeg",
        "/portraits/whatsapp-image-2026-02-24-at-19.20.39.jpeg",
        "/portraits/whatsapp-image-2026-02-24-at-19.21.58.jpeg",
        "/portraits/whatsapp-image-2026-02-24-at-19.22.22.jpeg",
        "/portraits/whatsapp-image-2026-02-24-at-19.23.01.jpeg",
        "/portraits/whatsapp-image-2026-02-24-at-19.23.26.jpeg",
        "/portraits/whatsapp-image-2026-02-24-at-19.23.52.jpeg",
        "/portraits/whatsapp-image-2026-02-24-at-19.26.20.jpeg",
        "/portraits/whatsapp-image-2026-02-24-at-19.26.43.jpeg",
        "/portraits/whatsapp-image-2026-02-24-at-19.26.49.jpeg",
        "/portraits/whatsapp-image-2026-02-24-at-19.27.11.jpeg",
        "/portraits/whatsapp-image-2026-02-24-at-19.27.23.jpeg"
      ],
      sortOrder: 9
    }
  ];

  for (const proj of projectsData) {
    await prisma.siteProject.create({ data: proj });
  }
  console.log("Projects seeded.");

  // 4. EXPERIENCE
  const experienceData = [
    {
      title: "IT Coordinator",
      company: "St. Nicholas’ International College · Negombo",
      dateRange: "Oct 2024 – Present",
      tasks: [
        "Manage and maintain complete school IT infrastructure, servers, and smart classrooms",
        "Oversee data security, backups, and CCTV systems with 99% uptime",
        "Provide high-level technical support for 50+ staff and 500+ students"
      ],
      tags: ["Infrastructure", "Networking", "EdTech", "Security"],
      sortOrder: 1
    },
    {
      title: "Senior Graphic Designer",
      company: "Souvenir Books & Advertisements · Freelance",
      dateRange: "Oct 2024 – Present",
      tasks: [
        "Design professional souvenir books, event magazines, and high-impact brochures",
        "Create complete branding identities for local businesses and social media campaigns",
        "Handle photo editing and print-ready file preparation for offset printing"
      ],
      tags: ["Photoshop", "Illustrator", "Branding", "Print Media"],
      sortOrder: 2
    },
    {
      title: "Hardware & CCTV Technician",
      company: "Nawaloka Hospital · Sri Lanka",
      dateRange: "2021 – 2023",
      tasks: [
        "Maintained hospital-wide computer networks and hardware systems",
        "Installed and configured high-end CCTV surveillance systems with remote monitoring",
        "Troubleshot complex hardware failures and performed component-level repairs"
      ],
      tags: ["Hardware", "CCTV", "MicroTech", "Repair"],
      sortOrder: 3
    },
    {
      title: "Computer/Laptop Technician",
      company: "MicroTech Computers · Sri Lanka",
      dateRange: "2019 – 2021",
      tasks: [
        "Diagnosed and replicated complex laptop motherboard issues",
        "Performed precision soldering and component replacement using microscope equipment",
        "Managed repair and maintenance for hundreds of consumer laptops"
      ],
      tags: ["Soldering", "Diagnostics", "Motherboards", "Laptop Repair"],
      sortOrder: 4
    }
  ];

  for (const exp of experienceData) {
    await prisma.experience.create({ data: exp });
  }
  console.log("Experience seeded.");

  // 5. SKILLS
  const skillsData = [
    // Design
    { name: "Photoshop", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg", level: 95, category: "design", sortOrder: 1 },
    { name: "Illustrator", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg", level: 90, category: "design", sortOrder: 2 },
    { name: "Premiere Pro", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/premierepro/premierepro-plain.svg", level: 85, category: "design", sortOrder: 3 },
    { name: "After Effects", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-plain.svg", level: 80, category: "design", sortOrder: 4 },
    { name: "Canva Expert", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg", level: 90, category: "design", sortOrder: 5 },
    { name: "UI/UX Design", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", level: 88, category: "design", sortOrder: 6 },
    // IT
    { name: "OS Management", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg", level: 92, category: "it", sortOrder: 7 },
    { name: "Hardware Troubleshooting", emoji: "⚙️", level: 90, category: "it", sortOrder: 8 },
    { name: "Cisco Networking", emoji: "🌐", level: 88, category: "it", sortOrder: 9 },
    { name: "CCTV & Surveillance", emoji: "🎥", level: 85, category: "it", sortOrder: 10 },
    { name: "Cloud Services", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg", level: 84, category: "it", sortOrder: 11 },
    { name: "Office Peripherals", emoji: "🖨️", level: 80, category: "it", sortOrder: 12 },
    // Web
    { name: "WordPress", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg", level: 85, category: "web", sortOrder: 13 },
    { name: "Web Building", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", level: 82, category: "web", sortOrder: 14 },
    { name: "Social Media Management", emoji: "📱", level: 90, category: "web", sortOrder: 15 },
    { name: "Digital Marketing", emoji: "📈", level: 88, category: "web", sortOrder: 16 },
    // Photo
    { name: "DSLR Photography", emoji: "📷", level: 92, category: "photo", sortOrder: 17 },
    { name: "Drone Piloting", emoji: "🎮", level: 88, category: "photo", sortOrder: 18 },
    { name: "Lighting & Composition", emoji: "🕯️", level: 90, category: "photo", sortOrder: 19 },
    { name: "Video Production", emoji: "✂️", level: 85, category: "photo", sortOrder: 20 }
  ];

  for (const skill of skillsData) {
    await prisma.skill.create({ data: skill });
  }
  console.log("Skills seeded.");

  // 6. ENDORSEMENTS
  const endorsementsData = [
    {
      name: "Rev. Fr. Anthony Lakshman",
      role: "Rector/Principal",
      company: "St. Nicholas' International College",
      message: "Roshen has consistently demonstrated high levels of technical proficiency and dedication in his role as IT Coordinator at St. Nicholas' International College.",
      phone: "+94 71 354 75 23"
    },
    {
      name: "R. A. Wasantha",
      role: "Network Administrator",
      company: "Nawaloka Hospital l Sri Lanka",
      message: "A reliable and skilled technician who maintained our hospital systems with great care and professional integrity.",
      phone: "+94 71 718 64 05"
    }
  ];

  for (const end of endorsementsData) {
    await prisma.professionalEndorsement.create({ data: end });
  }
  console.log("Endorsements seeded.");
  console.log("Seeds completed successfully!");
}

main()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
