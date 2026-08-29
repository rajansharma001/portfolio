import { ProjectModel } from '@/models/Project';
import { SkillModel } from '@/models/Skill';
import { ExperienceModel } from '@/models/Experience';
import { PostModel } from '@/models/Post';
import { SettingModel } from '@/models/Setting';
import { AdminAuthModel } from '@/models/AdminAuth';
import { hashPassword } from '@/lib/auth';

const projects = [
  {
    id: 'proj_lms',
    slug: 'advanced-lms',
    title: 'Advanced LMS — Full-Stack Learning Management System',
    type: 'Full-Stack / SaaS',
    tagline: 'Multi-role LMS with JWT authentication, RBAC, live scheduling & Cloudinary media storage.',
    impact: 'Role-Based Access Control, Cloudinary media pipeline, and end-to-end audit logging.',
    description:
      'A production-grade Learning Management System with distinct Admin, Instructor, and Student portals. Features JWT auth with email verification, password recovery, live-class scheduling, enrollment workflows, and audit logging.',
    techStack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind CSS',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Mongoose',
      'JWT',
      'Cloudinary',
      'Zod',
    ],
    liveUrl: '',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: true,
    published: true,
    order: 1,
    details: {
      role: 'Lead Full-Stack Engineer',
      duration: '4 Months',
      overview:
        'A comprehensive Learning Management System built for institutions to manage students, instructors, and online curricula with enterprise-grade security.',
      problem:
        'Educational platforms often suffer from slow server-side response times, fragmented role access controls, and difficult asset management.',
      solution:
        'Engineered a scalable architecture using Next.js 16 with TanStack Query and Express/Mongoose. Implemented granular RBAC middleware and Cloudinary CDN storage.',
      features: [
        'JWT authentication, email verification & password recovery flows',
        'Role-Based Access Control (Admin, Instructor, Student)',
        'Class, course, and enrollment lifecycle management',
        'Live-class scheduling with interactive calendar',
        'Cloudinary cloud storage for course media and assignments',
        'Rate limiting, Helmet security headers, CORS & Zod validation',
      ],
      architecture:
        'Client-side state managed via TanStack Query on Next.js 16. Backend REST API on Node.js/Express with Mongoose schema models and JWT middleware.',
      takeaways:
        'Strengthened deep expertise in RBAC security, token life-cycle management, and clean RESTful API contracts.',
    },
  },
  {
    id: 'proj_restro_os',
    slug: 'restro-os',
    title: 'RestroOS — Restaurant Management System & POS',
    type: 'Full-Stack / SaaS',
    tagline: 'Comprehensive restaurant POS, inventory, payroll, and real-time ordering system.',
    impact: 'Consolidated table booking, POS billing, and staff payroll into a sub-second response engine.',
    description:
      'A full-featured restaurant operations platform featuring floor plan management, real-time kitchen order tickets (KOT), POS billing, stock inventory, and employee payroll.',
    techStack: [
      'Next.js',
      'React',
      'TypeScript',
      'Node.js',
      'Express.js',
      'Prisma',
      'PostgreSQL',
      'JWT',
      'Zod',
      'Tailwind CSS',
    ],
    liveUrl: '',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: true,
    published: true,
    order: 2,
    details: {
      role: 'Full-Stack Developer',
      duration: '3 Months',
      overview: 'End-to-end POS and restaurant management suite built for high concurrency table orders.',
      problem: 'Restaurant operations faced lag during peak ordering hours with manual order ticket errors.',
      solution: 'Created type-safe Prisma models on PostgreSQL with optimized query indexes.',
      features: [
        'Floor plan editor & real-time table occupancy tracking',
        'Kitchen Order Ticket (KOT) real-time display pipeline',
        'Split billing, tax calculations, and printable receipts',
        'Ingredient-level stock inventory decrementing',
        'Employee shift scheduling, attendance, and payroll',
      ],
      architecture: 'Next.js frontend communicating with Node/Express REST API backed by Prisma ORM and PostgreSQL.',
      takeaways: 'Mastered transactional relational database operations and low-latency POS interfaces.',
    },
  },
  {
    id: 'proj_nexzen_tour',
    slug: 'nexzen-tour',
    title: 'Nexzen Tour — Tourism & Geospatial Platform',
    type: 'Product / SaaS',
    tagline: 'Interactive map-based travel exploration with custom routing and itinerary generation.',
    impact: 'Integrated OpenStreetMap with Valhalla routing engine and OSRM fallback for zero downtime.',
    description:
      'A modern tourism discovery platform with map-based POI browsing, dynamic routing itineraries, custom package booking, and multi-currency pricing.',
    techStack: [
      'Next.js',
      'React',
      'TypeScript',
      'Node.js',
      'Express.js',
      'Prisma',
      'PostgreSQL',
      'OpenStreetMap',
      'Valhalla Routing',
      'OSRM',
      'Tailwind CSS',
    ],
    liveUrl: '',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: true,
    published: true,
    order: 3,
    details: {
      role: 'Full-Stack & Geospatial Engineer',
      duration: '3 Months',
      overview: 'Interactive tourism map with custom routing and dynamic destination packaging.',
      problem: 'Commercial map APIs were cost-prohibitive for high-volume tourism route queries.',
      solution: 'Deployed custom OpenStreetMap tiles with Valhalla routing and automated OSRM fallback.',
      features: [
        'Interactive OpenStreetMap geospatial layer',
        'Turn-by-turn route calculations with elevation profiles',
        'Dynamic multi-day travel itinerary builder',
        'Custom booking inquiries and lead management CMS',
      ],
      architecture: 'Next.js map components consuming Valhalla routing microservices and PostgreSQL geospatial coordinates.',
      takeaways: 'Acquired deep skills in OpenStreetMap data handling, geospatial coordinates, and routing engines.',
    },
  },
  {
    id: 'proj_osm_pipeline',
    slug: 'osm-nepal-pipeline',
    title: 'OpenStreetMap Nepal Data Ingestion Pipeline',
    type: 'Backend / Data Engineering',
    tagline: 'Automated geospatial data pipeline ingesting POIs across all 77 districts of Nepal.',
    impact: 'Automated ingestion of over 100,000 geospatial nodes with zero-downtime batching.',
    description:
      'A backend data ingestion pipeline using Overpass API and bounding-box queries to systematically extract, normalize, and load OpenStreetMap POI data into PostgreSQL.',
    techStack: [
      'Node.js',
      'TypeScript',
      'Prisma',
      'PostgreSQL',
      'Overpass API',
      'Overpass Kumi',
      'Cron / Worker',
    ],
    liveUrl: '',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: true,
    published: true,
    order: 4,
    details: {
      role: 'Backend Data Engineer',
      duration: '2 Months',
      overview: 'Automated Overpass API ingestion pipeline covering 77 administrative districts of Nepal.',
      problem: 'Manual geospatial data entry was impossible for nationwide points of interest.',
      solution: 'Built a resilient queue-based Overpass extractor with rate limiting and upsert logic.',
      features: [
        '77-district bounding box coordinate generator',
        'Rate-limited batch requests against Overpass Kumi servers',
        'GeoJSON schema normalization and deduplication',
        'High-throughput PostgreSQL upserts via Prisma',
      ],
      architecture: 'CLI and scheduled worker pipelines with robust retry policies and database indexing.',
      takeaways: 'Learned large-scale data ingestion, geospatial bounding calculations, and resilient ETL pipelines.',
    },
  },
  {
    id: 'proj_ambikeshori',
    slug: 'ambikeshori-travels',
    title: 'Ambikeshori Travels — Travel Management & Booking Portal',
    type: 'Client / Commercial',
    tagline: 'Full production travel portal with dynamic packages, inquiry engine, and custom CMS.',
    impact: 'Launched in February 2026, handling live client bookings with sub-100ms API response.',
    description:
      'A production tourism portal engineered for Ambikeshori Travels. Features destination showcases, travel packages, customer inquiries, and an admin CMS.',
    techStack: [
      'Next.js',
      'React',
      'TypeScript',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Mongoose',
      'Tailwind CSS',
    ],
    liveUrl: 'https://ambikeshoritravels.com',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 5,
    details: {
      role: 'Full-Stack Engineer',
      duration: '2 Months (Launched Feb 2026)',
      overview: 'Production commercial travel portal with dynamic packages, inquiry management, and CMS.',
      problem: 'Client needed a modern high-performance portal to replace legacy WordPress site.',
      solution: 'Built Next.js web application with Express/MongoDB backend and automated inquiries.',
      features: [
        'Dynamic destination packaging with seasonal pricing',
        'Interactive booking inquiry pipeline with email notifications',
        'Admin CMS for managing itineraries, galleries, and client reviews',
      ],
      architecture: 'Next.js App Router deployed with MongoDB Atlas backend.',
      takeaways: 'Successfully launched a live client system with strict deadline and real users.',
    },
  },
  {
    id: 'proj_bmw_tours',
    slug: 'bmw-tours',
    title: 'BMW Tours and Travels — Tourism Portal',
    type: 'Client / Commercial',
    tagline: 'Production tourism website with booking inquiries and cPanel server deployment.',
    impact: 'Production deployed with automated email routing and responsive layout.',
    description:
      'A travel website built for BMW Tours and Travels. Includes custom tour packaging, vehicle rental listings, customer booking requests, and cPanel deployment.',
    techStack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'cPanel'],
    liveUrl: '',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 6,
  },
  {
    id: 'proj_landbdevs',
    slug: 'landbdevs',
    title: 'LandBDevs — Engineering Consultancy & Property Listing Portal',
    type: 'Client / Commercial',
    tagline: 'Dual-purpose platform for civil engineering consultancy and real estate property discovery.',
    impact: 'Integrated engineering project portfolio with dynamic real-estate property listings.',
    description:
      'A web portal engineered for LandBDevs. Features property listings, filters, project blueprints showcase, and direct inquiry forms.',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express.js'],
    liveUrl: '',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 7,
  },
  {
    id: 'proj_ai_job_hunter',
    slug: 'ai-job-hunter',
    title: 'AI Job Hunter — Automated Job Application Platform',
    type: 'Personal / Automation',
    tagline: 'Multi-country job scraper with AI-tailored resume generation and Kanban pipeline.',
    impact: 'Automated job discovery across 4 countries with AI-powered resume and cover letter matching.',
    description:
      'An automated job hunting platform that aggregates job postings across Nepal, India, US, and remote boards, generates AI cover letters, and tracks application status.',
    techStack: ['Next.js', 'TypeScript', 'Node.js', 'AI APIs', 'Tailwind CSS', 'Cheerio'],
    liveUrl: '',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 8,
  },
  {
    id: 'proj_japanese_learning',
    slug: 'japanese-learning',
    title: 'Japanese Learning Platform — JFT-Basic & JLPT N5',
    type: 'Education / Personal',
    tagline: 'Interactive study platform for Hiragana, Katakana, Kanji, and timed exam simulators.',
    impact: 'Built timed quiz engine, flashcard decks, and progress tracking for language learners.',
    description:
      'An education application tailored for JFT-Basic and JLPT N5 exam preparation. Includes interactive flashcards, character stroke practice, and timed mock tests.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Local State', 'Audio API'],
    liveUrl: '',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 9,
  },
  {
    id: 'proj_nea_quiz',
    slug: 'nea-level-5-quiz',
    title: 'NEA Level 5 Quiz App',
    type: 'Education / Personal',
    tagline: 'Exam preparation platform for Nepal Electricity Authority Level 5 electrical engineering.',
    impact: 'Question bank engine with category breakdown, instant answer analysis, and score history.',
    description:
      'A quiz engine built specifically for NEA Level 5 exam preparation, offering topic-based quizzes, timed mock tests, and performance score breakdowns.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    liveUrl: '',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 10,
  },
  {
    id: 'proj_banau_clothing',
    slug: 'banau-clothing',
    title: 'Banau Clothing — E-Commerce & Custom Theme',
    type: 'WordPress / CMS',
    tagline: 'Custom e-commerce theme with social media video feed parsing and WooCommerce integration.',
    impact: 'Custom WordPress theme integrating social video feeds (TikTok/Reels) and WooCommerce checkout.',
    description:
      'A custom-built WordPress e-commerce theme for Banau Clothing brand. Features WooCommerce checkout, social media video embeds, and mobile-optimized catalog navigation.',
    techStack: ['WordPress', 'PHP', 'WooCommerce', 'JavaScript', 'CSS3'],
    liveUrl: '',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 11,
  },
  {
    id: 'proj_wp_news',
    slug: 'custom-wp-news-portal',
    title: 'Custom WordPress News Portal',
    type: 'WordPress / CMS',
    tagline: 'High-speed editorial theme with breaking news tickers, category feeds, and ad placements.',
    impact: 'Built responsive custom PHP templates with sub-second page loads for editorial publishers.',
    description:
      'A custom editorial news portal developed in PHP and WordPress. Includes breaking news tickers, category archive grids, and optimized asset delivery.',
    techStack: ['WordPress', 'PHP', 'JavaScript', 'CSS3', 'MySQL'],
    liveUrl: '',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 12,
  },
  {
    id: 'proj_demo_dipshan',
    slug: 'dipshan-tours-demo',
    title: 'Dipshan Tours and Travels — Website Demo',
    type: 'Client / Commercial',
    tagline: 'High-converting agency showcase with dynamic travel packages and quick booking engine.',
    impact: 'Full interactive demonstration platform built with Next.js and Tailwind CSS.',
    description: 'A client showcase demo for Dipshan Tours and Travels featuring package browsing and trip booking.',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    liveUrl: '',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 13,
  },
  {
    id: 'proj_demo_bheri',
    slug: 'bheri-nepalgunj-tours',
    title: 'Bheri Nepalgunj Tours — Website Demo',
    type: 'Client / Commercial',
    tagline: 'Regional tourism exploration platform featuring jungle safari and heritage packages.',
    impact: 'Interactive regional tourism portal designed for Western Nepal destinations.',
    description: 'A regional travel website demo for Bheri Nepalgunj Tours with safari itineraries and vehicle hire.',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    liveUrl: '',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 14,
  },
  {
    id: 'proj_demo_coffee',
    slug: 'academy-of-coffee-arts',
    title: 'Academy of Coffee Arts — Website Demo',
    type: 'Client / Commercial',
    tagline: 'Barista training academy and specialty coffee certification showcase.',
    impact: 'Course syllabus display, student enrollment inquiries, and workshop schedule calendar.',
    description: 'A website demo built for Academy of Coffee Arts showcasing barista courses and workshop schedules.',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    liveUrl: '',
    githubUrl: 'https://github.com/rajansharma001',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 15,
  },
  {
    id: 'proj_demo_hospital',
    slug: 'om-kalika-hospital',
    title: 'Om Kalika Hospital — Website Demo',
    type: 'Client / Commercial',
    tagline: 'Healthcare portal with doctor directory, department listings, and appointment scheduling.',
    impact: 'Doctor OPD schedule, department navigation, and responsive appointment request forms.',
    description: 'A clean healthcare website demo for Om Kalika Hospital featuring doctor schedules and service listings.',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    liveUrl: '',
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
    skills: [
      'Next.js 16 (App Router)',
      'React 19',
      'TypeScript',
      'Tailwind CSS',
      'TanStack Query',
      'HTML5 / SCSS',
      'Responsive UI/UX',
    ],
  },
  {
    category: 'Backend & Database Systems',
    skills: [
      'Node.js',
      'Express.js',
      'PostgreSQL (Prisma)',
      'MongoDB (Mongoose)',
      'RESTful API Architecture',
      'JWT Authentication & RBAC',
      'Zod Data Validation',
    ],
  },
  {
    category: 'Geospatial & Data Engineering',
    skills: [
      'OpenStreetMap Data Ingestion',
      'Overpass API & Overpass Kumi',
      'Valhalla Routing Engine',
      'OSRM Fallback Integration',
      'Bounding Box Spatial Queries',
      'ETL Data Pipelines',
    ],
  },
  {
    category: 'Security, Cloud & DevOps',
    skills: [
      'Cloudinary Media Management',
      'PBKDF2 Password Hashing',
      'HMAC Session Security',
      'Git & GitHub Workflows',
      'cPanel & Linux Node Hosting',
      'Rate Limiting & CORS Hardening',
    ],
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
  },
];

export async function ensureDatabaseSeeded() {
  try {
    const projectCount = await ProjectModel.countDocuments();
    if (projectCount === 0) {
      console.log('Database empty: Auto-seeding 16 projects...');
      await ProjectModel.insertMany(projects);
    }

    const skillCount = await SkillModel.countDocuments();
    if (skillCount === 0) {
      await SkillModel.insertMany(skillsData);
    }

    const expCount = await ExperienceModel.countDocuments();
    if (expCount === 0) {
      await ExperienceModel.insertMany(experiences);
    }

    const settingCount = await SettingModel.countDocuments();
    if (settingCount === 0) {
      await SettingModel.create({
        key: 'global_settings',
        name: 'Rajan Sharma',
        role: 'Full-Stack Software Engineer',
        headline: 'Building production-grade web systems, REST APIs & scalable backends.',
        location: 'Kathmandu, Bagmati Prov, Nepal (UTC +5:45)',
        email: 'email.rajan001@gmail.com',
        phone: '+977 9800000000',
        isAvailableForHire: true,
        availabilityBadgeText: 'Available for Roles',
        resumeUrl: '/uploads/resume.pdf',
        bio: 'Full-Stack Software Engineer specializing in Next.js, TypeScript, Node.js, Express, PostgreSQL, and MongoDB architectures.',
        codeSnippet: '',
        sectionVisibility: {
          showHero: true,
          showAvailabilityBadge: true,
          showMarquee: false,
          showProjects: true,
          showSkills: true,
          showExperience: true,
          showProcess: true,
          showContact: true,
          showBlog: true,
          showScrollProgress: true,
          showFooter: true,
          showResumeButton: true,
          showClockWidget: true,
          showThemeToggle: true,
        },
      });
    }

    const authCount = await AdminAuthModel.countDocuments();
    if (authCount === 0) {
      const creds = hashPassword(process.env.ADMIN_PASSWORD || 'admin');
      await AdminAuthModel.create({
        key: 'admin_credentials',
        email: 'email.rajan001@gmail.com',
        passwordHash: creds.hash,
        salt: creds.salt,
        lastUpdated: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error('Auto-seed check error:', err);
  }
}
