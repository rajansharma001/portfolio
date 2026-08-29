import mongoose from 'mongoose';
import { ProjectModel } from '../models/Project';
import { PostModel } from '../models/Post';
import { SkillModel } from '../models/Skill';
import { ExperienceModel } from '../models/Experience';
import { SettingModel } from '../models/Setting';
import { AnalyticsModel } from '../models/Analytics';
import { AdminAuthModel } from '../models/AdminAuth';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://emailrajan001_db_user:9rZFc6cZXNf2CwAH@cluster0.wkzewhu.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0';

const projects = [
  {
    id: 'proj_1',
    slug: 'advanced-lms',
    title: 'Advanced LMS — Full-Stack Learning Management System',
    type: 'SaaS',
    tagline: 'Complete Learning Management System with RBAC, email verification, live scheduling, course/institution management, and Cloudinary media.',
    impact: 'Multi-role RBAC (Admin, Instructor, Student) with JWT auth, audit logging, and security middleware.',
    description: 'A production-ready, full-stack Learning Management System featuring complete Role-Based Access Control (RBAC), multi-role dashboards, automated email verification, password recovery, course & class scheduling, and Cloudinary media pipelines.',
    thumbnail: '/uploads/restroos.png',
    techStack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'TanStack Query', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'JWT', 'Zod', 'Cloudinary'],
    liveUrl: 'https://github.com/rajansharma001',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: 'https://github.com/rajansharma001',
    featured: true,
    published: true,
    order: 1,
  },
  {
    id: 'proj_2',
    slug: 'restroos-pos',
    title: 'RestroOS — Restaurant Management System & POS',
    type: 'SaaS',
    tagline: 'Comprehensive restaurant business management platform combining a customer-facing site with real-time POS, payroll, and inventory operations.',
    impact: 'Processed 50,000+ real operational orders with sub-50ms query latency and automated cost-price calculations.',
    description: 'An enterprise restaurant management and POS suite engineered with Next.js and Node.js. Integrates customer-facing reservations, digital menu ordering, table billing, inventory management, and staff payroll.',
    thumbnail: '/uploads/restroos.png',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'Prisma', 'PostgreSQL', 'JWT', 'Zod'],
    liveUrl: 'https://github.com/rajansharma001',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: 'https://github.com/rajansharma001',
    featured: true,
    published: true,
    order: 2,
  },
  {
    id: 'proj_3',
    slug: 'nexzen-tour',
    title: 'Nexzen Tour — Tourism & Geospatial Platform',
    type: 'SaaS',
    tagline: 'Comprehensive tourism & geospatial intelligence platform with dynamic route calculation and OpenStreetMap vector routing.',
    impact: 'Valhalla dynamic engine with OSRM fallback, custom POI clustering, and geo-polygon queries.',
    description: 'A large-scale map-based tourism and geospatial intelligence platform. Features OpenStreetMap integrations, interactive itinerary builders, Valhalla dynamic route calculations with OSRM fallbacks, and PostgreSQL spatial storage.',
    thumbnail: '/uploads/tripnest.png',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'Prisma', 'PostgreSQL', 'OpenStreetMap', 'Valhalla', 'OSRM'],
    liveUrl: 'https://github.com/rajansharma001',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: 'https://github.com/rajansharma001',
    featured: true,
    published: true,
    order: 3,
  },
  {
    id: 'proj_4',
    slug: 'osm-nepal-pipeline',
    title: 'OpenStreetMap Nepal Data Ingestion Pipeline',
    type: 'Client',
    tagline: 'High-throughput geospatial data ingestion engine processing OpenStreetMap datasets across all 77 districts of Nepal.',
    impact: 'Integrated Overpass API & Overpass Kumi with automated bounding-box batch queries, retry backoff, and PostgreSQL spatial indexing.',
    description: 'A standalone backend data engineering pipeline built to query, clean, normalize, and ingest geographic records across all 77 districts of Nepal. Includes automated rate-limit retry backoffs and Prisma ORM relational mapping.',
    thumbnail: '/uploads/tripnest.png',
    techStack: ['Node.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'OpenStreetMap', 'Overpass API', 'Data Engineering'],
    liveUrl: 'https://github.com/rajansharma001',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: 'https://github.com/rajansharma001',
    featured: true,
    published: true,
    order: 4,
  },
  {
    id: 'proj_5',
    slug: 'ambikeshori-travels',
    title: 'Ambikeshori Travels — Travel Management & Booking Portal',
    type: 'Client',
    tagline: 'Full-stack travel portal and custom CMS empowering clients to manage destinations, tour packages, and booking inquiries independently.',
    impact: 'Launched February 2026. Decreased client dependence on developers by 95% with centralized inquiry workflows.',
    description: 'A high-performance commercial tourism portal and CMS designed for Ambikeshori Travels. Features destination package builders, automated booking intake forms, image optimization, and centralized administrative lead management.',
    thumbnail: '/uploads/tripnest.png',
    techStack: ['Next.js', 'React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
    liveUrl: 'https://github.com/rajansharma001',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 5,
  },
  {
    id: 'proj_6',
    slug: 'bmw-tours',
    title: 'BMW Tours and Travels — Full-Stack Tourism Website',
    type: 'Client',
    tagline: 'Full-stack commercial tourism portal built on Next.js App Router and deployed to production on Node.js hosting.',
    impact: 'Custom itinerary management, automated lead intake, and server-side performance tuning.',
    description: 'A custom tourism website built with Next.js App Router, Express backend, and MongoDB. Deployed on cPanel Node.js hosting with server resource optimization and custom inquiry workflows.',
    thumbnail: '/uploads/tripnest.png',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'cPanel'],
    liveUrl: 'https://github.com/rajansharma001',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 6,
  },
  {
    id: 'proj_7',
    slug: 'landbdevs-portal',
    title: 'LandBDevs — Engineering Consultancy & Property Listing Portal',
    type: 'Client',
    tagline: 'Hybrid engineering consultancy portal and real-estate property discovery directory.',
    impact: 'Unified structural engineering service showcases with interactive property search, filtering, and lead capture.',
    description: 'A hybrid platform developed for an engineering and land development firm. Combines civil engineering consultancy service pages with a dynamic property listing directory featuring multi-attribute search and inquiry funnels.',
    thumbnail: '/uploads/restroos.png',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express.js'],
    liveUrl: 'https://github.com/rajansharma001',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 7,
  },
  {
    id: 'proj_8',
    slug: 'ai-job-hunter',
    title: 'AI Job Hunter — Automated Job Application Platform',
    type: 'Personal',
    tagline: 'Autonomous job discovery and application platform with multi-country crawler and AI-generated cover letters.',
    impact: 'Aggregated jobs from multiple global portals with salary normalization and Kanban pipeline tracking.',
    description: 'An intelligent automation system that crawls remote and international software job openings, normalizes compensation across currencies, generates targeted cover letters via LLM APIs, and tracks submissions on a Kanban board.',
    thumbnail: '/uploads/restroos.png',
    techStack: ['Next.js', 'TypeScript', 'Node.js', 'AI APIs', 'Tailwind CSS'],
    liveUrl: 'https://github.com/rajansharma001',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 8,
  },
  {
    id: 'proj_9',
    slug: 'japanese-learning-platform',
    title: 'Japanese Learning Platform — JFT-Basic & JLPT N5',
    type: 'Personal',
    tagline: 'Exam-focused Japanese language preparation platform with interactive quiz engine, Hiragana/Katakana drills, and Kanji flashcards.',
    impact: 'Timed test simulation with immediate feedback, weak-area detection, and client-side progress analytics.',
    description: 'A specialized web application built for students preparing for the JFT-Basic and JLPT N5 exams. Features interactive syllabary drills, spaced-repetition flashcards, timed practice tests, and visual accuracy analytics.',
    thumbnail: '/uploads/tripnest.png',
    techStack: ['React.js', 'TypeScript', 'Tailwind CSS', 'Custom Quiz Engine'],
    liveUrl: 'https://github.com/rajansharma001',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 9,
  },
  {
    id: 'proj_10',
    slug: 'nea-level5-quiz',
    title: 'NEA Level 5 Quiz App',
    type: 'Personal',
    tagline: 'Nepal Electricity Authority (NEA) Level 5 exam preparation platform with syllabus-based question banks.',
    impact: 'Subject categorization, timed exam modes, and real-time performance analytics.',
    description: 'An exam preparation portal designed specifically for NEA Level 5 candidates. Offers categorized question banks, timed mock exam simulations, instant answer breakdowns, and progress tracking.',
    thumbnail: '/uploads/restroos.png',
    techStack: ['React.js', 'TypeScript', 'Tailwind CSS', 'Web Storage'],
    liveUrl: 'https://github.com/rajansharma001',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 10,
  },
  {
    id: 'proj_11',
    slug: 'banau-clothing',
    title: 'Banau Clothing — E-Commerce & Custom Theme',
    type: 'WordPress',
    tagline: 'Custom WordPress e-commerce theme with multi-platform social media video parsing (Instagram, TikTok, YouTube).',
    impact: 'Engineered from scratch without pre-built themes, featuring automated social media embeds and DNS/SSL hardening.',
    description: 'A fully bespoke WordPress theme built from scratch for a clothing brand. Engineered with PHP, custom WooCommerce product flows, social video feeds (TikTok, Instagram, YouTube), and optimized DNS/SSL security.',
    thumbnail: '/uploads/restroos.png',
    techStack: ['WordPress', 'PHP', 'JavaScript', 'HTML/CSS', 'WooCommerce', 'Social APIs'],
    liveUrl: 'https://github.com/rajansharma001',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 11,
  },
  {
    id: 'proj_12',
    slug: 'custom-wp-news-portal',
    title: 'Custom WordPress News Portal',
    type: 'WordPress',
    tagline: 'Bespoke editorial news and media publication system with category architecture and breaking news tickers.',
    impact: 'Custom theme built for high-traffic editorial workflows across politics, sports, and tech categories.',
    description: 'An editorial news publication platform created with custom PHP templates and responsive frontend layouts. Organizes articles across Politics, Sports, and Tech with trending story carousels and fast page delivery.',
    thumbnail: '/uploads/tripnest.png',
    techStack: ['WordPress', 'PHP', 'JavaScript', 'HTML5/CSS3'],
    liveUrl: 'https://github.com/rajansharma001',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 12,
  },
  {
    id: 'proj_13',
    slug: 'dipshan-tours-demo',
    title: 'Dipshan Tours and Travels — Website Demo',
    type: 'Client',
    tagline: 'Client demonstration prototype for travel and tour agency booking workflows.',
    impact: 'Rapid interactive prototype showcasing booking inquiry funnels and mobile responsive layouts.',
    description: 'An interactive demonstration website engineered to showcase tour itinerary discovery, package pricing grids, and streamlined booking inquiry workflows for a travel agency client.',
    thumbnail: '/uploads/tripnest.png',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    liveUrl: 'https://github.com/rajansharma001',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 13,
  },
  {
    id: 'proj_14',
    slug: 'bheri-nepalgunj-tours-demo',
    title: 'Bheri Nepalgunj Tours — Website Demo',
    type: 'Client',
    tagline: 'Demonstration portal built for regional tourism operators in western Nepal.',
    impact: 'Destination showcase with itinerary preview cards and direct inquiry triggers.',
    description: 'A modern tourism demonstration platform designed for operators in Nepalgunj. Highlights western Nepal attractions, safari packages, and automated contact triggers.',
    thumbnail: '/uploads/tripnest.png',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    liveUrl: 'https://github.com/rajansharma001',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 14,
  },
  {
    id: 'proj_15',
    slug: 'academy-coffee-arts-demo',
    title: 'Academy of Coffee Arts — Website Demo',
    type: 'Client',
    tagline: 'Demonstration site for specialty barista training academy and course registrations.',
    impact: 'Course curriculum timeline, event schedules, and dynamic registration forms.',
    description: 'A barista academy demonstration website featuring modular course syllabus cards, masterclass schedules, hands-on workshop previews, and registration inquiry forms.',
    thumbnail: '/uploads/restroos.png',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    liveUrl: 'https://github.com/rajansharma001',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 15,
  },
  {
    id: 'proj_16',
    slug: 'om-kalika-hospital-demo',
    title: 'Om Kalika Hospital — Website Demo',
    type: 'Client',
    tagline: 'Healthcare facility demonstration portal with doctor schedules and department directories.',
    impact: 'Departmental navigation, emergency contact integration, and doctor appointment inquiry mockups.',
    description: 'A healthcare portal demonstration built for a regional hospital. Showcases medical departments, on-duty physician rosters, emergency service lines, and OPD appointment booking mockups.',
    thumbnail: '/uploads/restroos.png',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    liveUrl: 'https://github.com/rajansharma001',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 16,
  },
];

const skillsData = [
  {
    category: 'Frontend & Client Architecture',
    skills: ['Next.js 16 (App Router)', 'React 19', 'TypeScript', 'Tailwind CSS', 'TanStack Query', 'HTML5 / CSS3 / SCSS', 'Responsive UI/UX'],
  },
  {
    category: 'Backend & Database Systems',
    skills: ['Node.js', 'Express.js', 'PostgreSQL (Prisma)', 'MongoDB (Mongoose)', 'RESTful API Architecture', 'JWT Authentication & RBAC', 'Zod Data Validation'],
  },
  {
    category: 'Geospatial & Data Engineering',
    skills: ['OpenStreetMap Data Ingestion', 'Overpass API & Overpass Kumi', 'Valhalla Routing Engine', 'OSRM Fallback Integration', 'Bounding Box Spatial Queries', 'ETL Data Pipelines'],
  },
  {
    category: 'Security, Cloud & DevOps',
    skills: ['Cloudinary Media Management', 'PBKDF2 Password Hashing', 'HMAC Session Security', 'Git & GitHub Workflows', 'cPanel & Linux Node Hosting', 'Rate Limiting & CORS Hardening'],
  },
];

const experiences = [
  {
    id: 'exp_1',
    role: 'Full-Stack Software Engineer',
    company: 'Independent Engineering & Client Delivery',
    period: '2024 — Present',
    location: 'Kathmandu, Nepal',
    description: 'Architecting and deploying full-stack web applications, custom CMS solutions, and data pipelines.',
    highlights: [
      'Built Advanced LMS with multi-role RBAC, email verification, Cloudinary storage, and audit logs.',
      'Developed RestroOS restaurant management platform and high-performance POS system.',
      'Engineered OpenStreetMap Nepal data ingestion pipeline covering all 77 districts with Prisma and PostgreSQL.',
      'Launched production tourism portals (Ambikeshori Travels, BMW Tours) reducing client operational overhead.',
    ],
    order: 1,
  },
  {
    id: 'exp_2',
    role: 'Data Entry Operator',
    company: 'Souq Al Baladi',
    period: 'Nov 2022 — Dec 2024',
    location: 'Qatar',
    description: 'Managed enterprise retail inventory datasets, catalog updates, and operational record accuracy.',
    highlights: [
      'Processed and maintained high-volume SKU databases with high precision and zero discrepancies.',
      'Assisted in data hygiene, inventory reconciliation, and reporting workflows.',
    ],
    order: 2,
  },
  {
    id: 'exp_3',
    role: 'Diploma in Electrical Engineering',
    company: 'Council for Technical Education and Vocational Training (CTEVT)',
    period: '2016 — 2019',
    location: 'Nepal',
    description: 'Completed foundational engineering coursework in circuit design, logic systems, and technical mathematics.',
    highlights: [
      'Built strong analytical problem-solving foundation applied to software architecture and backend algorithms.',
    ],
    order: 3,
  },
];

const posts = [
  {
    id: 'post_1',
    slug: 'scalable-full-stack-nextjs-nodejs-architecture',
    title: 'Architecting Scalable Full-Stack Systems: From Schema to Production',
    excerpt: 'A deep dive into modular REST architecture, database connection pooling, type-safe API boundaries, and SSR caching strategies with Next.js and Node.js.',
    content: `Building web applications that effortlessly scale beyond thousands of concurrent users requires disciplined architectural decisions right from day one.\n\n### 1. Separation of Concerns & Modular Layers\nIn production systems, avoid coupling business logic directly inside route handlers. A layered service pattern (Controller → Service → Repository) ensures testability, database portability, and clean boundaries.\n\n\`\`\`typescript\n// Example: Repository Pattern with Type Safety\nexport async function getOrderWithItems(orderId: string): Promise<Order | null> {\n  return await db.query.orders.findFirst({\n    where: eq(orders.id, orderId),\n    with: { items: true, customer: true }\n  });\n}\n\`\`\`\n\n### 2. Database Connection Pooling & Latency Optimization\nNode.js single-threaded event loop can easily bottleneck if database connections are exhausted during traffic spikes. Implement connection pooling (such as PgBouncer for PostgreSQL) and index hot query columns to maintain sub-50ms latency under high load.\n\n### 3. Edge Middleware & Intelligent Caching\nLeverage Next.js Incremental Static Regeneration (ISR) and Edge Caching for read-heavy public pages, while isolating mutation requests to secure, authenticated server-side handlers.\n\n### Key Takeaway\nA resilient full-stack architecture is not about overengineering—it's about predictability, clean data validation, and fail-safe security standards.`,
    category: 'Architecture',
    tags: ['Next.js', 'Node.js', 'PostgreSQL', 'Scalability', 'System Design'],
    coverImage: '/uploads/restroos.png',
    published: true,
    publishedAt: '2026-08-28T10:00:00.000Z',
    readTimeMinutes: 5,
    views: 42,
  },
  {
    id: 'post_2',
    slug: 'production-security-nextjs-api-hardening',
    title: 'Hardening Next.js & Node.js Applications for Production: A Security-First Guide',
    excerpt: 'Essential security practices: cryptographic session cookies, brute-force mitigation, CSP headers, path traversal guards, and constant-time password verification.',
    content: `Security cannot be an afterthought in modern web applications. Every endpoint exposed to the internet will inevitably be scanned for vulnerabilities.\n\n### 1. Cryptographic HMAC Session Tokens\nAvoid storing sensitive user IDs or roles in client-accessible localStorage. Instead, use cryptographically signed HMAC tokens stored in \`HttpOnly\`, \`SameSite=Lax\`, and \`Secure\` cookies.\n\n### 2. Constant-Time Password Verification\nTiming attacks allow adversaries to guess valid hashes by measuring slight differences in comparison execution times. Always verify credentials with \`crypto.timingSafeEqual\`.\n\n\`\`\`typescript\nimport crypto from 'crypto';\n\nexport function verifyHash(provided: string, expected: string): boolean {\n  const a = Buffer.from(provided, 'hex');\n  const b = Buffer.from(expected, 'hex');\n  if (a.length !== b.length) return false;\n  return crypto.timingSafeEqual(a, b);\n}\n\`\`\`\n\n### 3. File Upload Guards & Path Traversal Prevention\nNever trust user-supplied filenames. Always generate unpredictable server-side UUID filenames and enforce MIME type checks alongside magic byte validation.`,
    category: 'Security',
    tags: ['Security', 'Authentication', 'TypeScript', 'Node.js', 'DevOps'],
    coverImage: '/uploads/tripnest.png',
    published: true,
    publishedAt: '2026-08-25T14:30:00.000Z',
    readTimeMinutes: 6,
    views: 38,
  },
];

async function seed() {
  console.log('Connecting to MongoDB Atlas at', MONGODB_URI.split('@')[1] || 'Cluster');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB Atlas!');

  // 1. Seed Projects
  console.log('Seeding 16 Projects...');
  await ProjectModel.deleteMany({});
  await ProjectModel.insertMany(projects);
  console.log('✓ 16 Projects successfully saved to MongoDB!');

  // 2. Seed Skills
  console.log('Seeding Technical Capabilities...');
  await SkillModel.deleteMany({});
  await SkillModel.insertMany(skillsData);
  console.log('✓ Skills saved to MongoDB!');

  // 3. Seed Experiences
  console.log('Seeding Experience Milestones...');
  await ExperienceModel.deleteMany({});
  await ExperienceModel.insertMany(experiences);
  console.log('✓ Experiences saved to MongoDB!');

  // 4. Seed Blog Posts
  console.log('Seeding Blog Posts...');
  await PostModel.deleteMany({});
  await PostModel.insertMany(posts);
  console.log('✓ Blog Posts saved to MongoDB!');

  // 5. Seed Settings
  console.log('Seeding Settings...');
  await SettingModel.deleteMany({});
  await SettingModel.create({
    key: 'global_settings',
    name: 'Rajan Sharma',
    role: 'Full-Stack Software Engineer',
    headline: 'Building production-grade web systems, REST APIs & scalable backends.',
    location: 'Kathmandu, Bagmati Prov, Nepal',
    email: 'email.rajan001@gmail.com',
    phone: '+977 9800000000',
    isAvailableForHire: true,
    availabilityBadgeText: 'Available for Roles',
    resumeUrl: '/uploads/resume.pdf',
    bio: 'Full-Stack Software Engineer with proven experience delivering complex web platforms, Learning Management Systems, POS architectures, and OpenStreetMap data ingestion pipelines using Next.js, TypeScript, Node.js, Express, PostgreSQL, and MongoDB.',
    codeSnippet: `// rajan.config.ts\nexport const engineer = {\n  name: "Rajan Sharma",\n  role: "Full-Stack Software Engineer",\n  location: "Kathmandu, Nepal",\n  stack: ["Next.js", "TypeScript", "Node.js", "Express", "PostgreSQL", "MongoDB"],\n  projects: 16,\n  status: "Available for Engineering Roles"\n};`,
  });
  console.log('✓ Settings saved to MongoDB!');

  // 6. Seed Analytics
  const existingAnalytics = await AnalyticsModel.findOne({ key: 'global_analytics' });
  if (!existingAnalytics) {
    await AnalyticsModel.create({
      key: 'global_analytics',
      totalViews: 128,
      uniqueVisitors: 45,
      visits: [
        {
          ip: '103.1.200.15',
          country: 'Nepal',
          city: 'Kathmandu',
          flag: '🇳🇵',
          path: '/',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          timestamp: new Date().toISOString(),
        },
        {
          ip: '74.125.200.100',
          country: 'United States',
          city: 'Mountain View',
          flag: '🇺🇸',
          path: '/blog',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
      ],
    });
    console.log('✓ Analytics initialized in MongoDB!');
  }

  // 7. Seed Admin Auth
  const existingAuth = await AdminAuthModel.findOne({ key: 'admin_credentials' });
  if (!existingAuth) {
    await AdminAuthModel.create({
      key: 'admin_credentials',
      passwordHash: '343e8bbdbdfbc1cf822cb612e44ea090cfbda6414777d130a08e53a2ae3c3826019315d183818e69d749e7bdf51a7bebf7611abef9d0c5a27fe86c2e3df29c29',
      salt: 'c1d957d1bcbbdb0a597a78e88e285f5e',
      lastUpdated: new Date().toISOString(),
    });
    console.log('✓ Admin Credentials saved to MongoDB!');
  }

  console.log('\n=========================================');
  console.log('🚀 ALL DATA SUCCESSFULLY SEEDED TO MONGODB ATLAS!');
  console.log('=========================================\n');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error seeding MongoDB:', err);
  process.exit(1);
});
