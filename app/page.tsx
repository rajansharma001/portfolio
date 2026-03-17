"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Code2Icon,
  FacebookIcon,
  GithubIcon,
  LinkedinIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";

// --- DYNAMIC DATA ---
const SERVICES = [
  {
    id: 1,
    title: "Frontend Development",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    description:
      "Crafting responsive, accessible, and highly dynamic user interfaces using Next.js, React, and Tailwind CSS.",
  },
  {
    id: 2,
    title: "Backend Architecture",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
        />
      </svg>
    ),
    description:
      "Building secure, scalable, and RESTful server-side applications and databases using Node.js, Express, and MongoDB.",
  },
  {
    id: 3,
    title: "AI & CMS Integration",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    description:
      "Enhancing applications with intelligent features like Google Gemini AI, and delivering custom WordPress solutions.",
  },
];

const TECH_STACK = [
  "Next.js",
  "React.js",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Tailwind CSS",
  "Zod",
  "Tanstack Query",
  "Redux Toolkit",
  "Google Gemini AI",
  "Git & GitHub",
  "REST APIs",
  "WordPress / Elementor",
];

const EXPERIENCE = [
  {
    id: 1,
    role: "Full-Stack Developer",
    company: "Freelance / Independent",
    location: "Nepal",
    type: "Work",
    description:
      "Architecting and deploying scalable MERN stack applications, including comprehensive learning management systems and AI-integrated travel platforms.",
  },
  {
    id: 2,
    role: "Assistant Manager & Computer Operator",
    company: "Business Operations",
    location: "Banke, Nepal",
    type: "Work",
    description:
      "Streamlined daily operational workflows, managed technical data entry systems, and handled client transactions efficiently.",
  },
  {
    id: 3,
    role: "Data Entry Operator",
    company: "Corporate Data Management",
    location: "Doha, Qatar",
    type: "Work",
    description:
      "Maintained large-scale enterprise databases with high accuracy and strictly adhered to international data compliance standards.",
  },
  {
    id: 4,
    role: "Diploma in Computer Engineering",
    company: "Technical Education",
    location: "Nepal",
    type: "Education",
    description:
      "Built a comprehensive 3-year foundation in software engineering, algorithms, networking, and modern programming principles.",
  },
];

const CATEGORIES = ["All", "MERN Stack", "WordPress", "Vibe Coded"];

const PROJECTS = [
  // --- MERN STACK ---
  {
    id: 1,
    title: "Ambikeshori Travels",
    description:
      "High-performance business website and client booking portal tailored specifically for a travel agency client. Features include dynamic tour listings, real-time availability, secure booking management, and optimized user experience.",
    image: `/uploads/amb.png`,
    tech: [
      "Next.js",
      "Tailwind CSS",
      "TypeScript",
      "Express.js",
      "Node.js",
      "MongoDB",
    ],
    category: "MERN Stack",
    githubFrontend: "",
    githubBackend: "",
    live: "https://ambikeshoritravels.com/",
  },
  {
    id: 2,
    title: "BMW Tours & Travels",
    description:
      "Modern, responsive corporate website serving as a digital storefront and booking gateway for a touring company. Includes interactive tour packages, customer testimonials, secure login systems, and highly optimized navigation.",
    image: "/uploads/bmw1.png",
    tech: [
      "Next.js",
      "Tailwind CSS",
      "TypeScript",
      "Express.js",
      "Node.js",
      "MongoDB",
    ],
    category: "MERN Stack",
    githubFrontend: "",
    githubBackend: "",
    live: "https://bmwtoursandtravels.com/",
  },
  {
    id: 3,
    title: "L&B Devs",
    description:
      "Professional digital agency website representing development and custom business solutions. Features include an expansive portfolio showcase, client testimonials, and interactive contact forms integrated with lead management.",
    image: "/uploads/landb1.png",
    tech: [
      "Next.js",
      "Tailwind CSS",
      "TypeScript",
      "Express.js",
      "Node.js",
      "MongoDB",
    ],
    category: "MERN Stack",
    githubFrontend: "",
    githubBackend: "",
    live: "http://landbdevs.com.np/",
  },
  {
    id: 4,
    title: "Advanced LMS",
    description:
      "Enterprise-grade learning management system engineered with role-based access control and detailed analytics. Designed to support educational institutions with dynamic course management, progress tracking, and secure authentication.",
    image:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop",
    tech: [
      "Next.js",
      "Tailwind CSS",
      "TypeScript",
      "Express.js",
      "Node.js",
      "MongoDB",
    ],
    category: "MERN Stack",
    githubFrontend: "https://github.com/rajansharma001/advanced_lms_frontend",
    githubBackend: "https://github.com/rajansharma001/advanced_lms_backend",
    live: "",
  },
  {
    id: 5,
    title: "TripNest",
    description:
      "A travel management CMS featuring intelligent itinerary generation integrated directly with Google Gemini AI. Designed to provide highly personalized travel recommendations, automated planning, and seamless booking management.",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop",
    tech: [
      "Next.js",
      "Tailwind CSS",
      "TypeScript",
      "Express.js",
      "Node.js",
      "MongoDB",
      "Gemini AI",
    ],
    category: "MERN Stack",
    githubFrontend: "https://github.com/rajansharma001/tripnest_frontend",
    githubBackend: "https://github.com/rajansharma001/tripnest_backend",
    live: "",
  },
  {
    id: 6,
    title: "Rydzen",
    description:
      "A comprehensive ride-sharing application featuring real-time location tracking and dynamic booking functionality. Built to provide a seamless, highly responsive user experience for both drivers and passengers across all devices.",
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800&auto=format&fit=crop",
    tech: [
      "Next.js",
      "Tailwind CSS",
      "TypeScript",
      "Express.js",
      "Node.js",
      "MongoDB",
    ],
    category: "MERN Stack",
    githubFrontend: "https://github.com/rajansharma001/rydzen-frontend",
    githubBackend: "https://github.com/rajansharma001/rydzen-backend",
    live: "",
  },

  // --- Vibe Coded ---
  {
    id: 7,
    title: "Japanese Learning Platform",
    description:
      "A dedicated language learning application designed specifically to assist students preparing for the JFT-Basic and JLPT N5 exams. Features include interactive quizzes, detailed flashcards, and progress tracking for rapid retention.",
    image: "/uploads/japanese.png",
    tech: ["React.js", "Tailwind CSS", "TypeScript", "Quiz Engine"],
    category: "Vibe Coded",
    githubFrontend: "",
    githubBackend: "",
    live: "https://jlptn5.lovable.app/",
  },
  {
    id: 8,
    title: "NEA Level 5 Quiz App",
    description:
      "An interactive quiz application tailored for Loksewa candidates preparing for the Nepal Electricity Authority Level 5 exams. Features a comprehensive question bank, timed quizzes, and performance analytics for effective preparation.",
    image: "/uploads/nea.png",
    tech: ["React.js", "Tailwind CSS", "TypeScript", "Quiz Engine"],
    category: "Vibe Coded",
    githubFrontend: "",
    githubBackend: "",
    live: "https://level5.lovable.app/quiz",
  },

  // --- WORDPRESS ---
  {
    id: 9,
    title: "MyJawaaf",
    description:
      "A comprehensive, scalable online e-learning platform complete with dynamic functionality. Supports a large user base with real-time course updates, interactive content delivery, and secure authentication using advanced LMS plugins.",
    image: "/uploads/myjawaaf.png",
    tech: ["WordPress", "Elementor", "LMS", "PHP"],
    category: "WordPress",
    githubFrontend: "",
    githubBackend: "",
    live: "https://myjawaaf.com/",
  },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Added mobile menu state

  // Filter projects based on selected category
  const filteredProjects = PROJECTS.filter((project) =>
    activeCategory === "All" ? true : project.category === activeCategory,
  );

  // Intersection Observer for smooth scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-12");
          }
        });
      },
      { threshold: 0.1 },
    );

    const elements = document.querySelectorAll(".reveal-target");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0f14] text-gray-200 font-sans selection:bg-blue-500/30 scroll-smooth overflow-x-hidden">
      {/* STICKY NAVBAR */}
      <nav className="fixed w-full top-0 z-50 backdrop-blur-lg bg-[#0d0f14]/80 border-b border-gray-800/50 transition-all">
        <div className="flex items-center justify-between px-6 md:px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 text-xl font-bold group cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-linear-to-br from-blue-500 to-emerald-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              <Link
                href="/"
                className="w-full bg-white h-full rounded-[10px] flex items-center justify-center"
              >
                <Image
                  src="/uploads/logo.png"
                  alt="RS Logo"
                  width={50}
                  height={50}
                  className="inline-block ml-1"
                />
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <XIcon size={28} /> : <MenuIcon size={28} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {["Home", "Services", "Projects", "Experience", "Contact"].map(
              (item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-400 hover:text-white transition-colors relative group cursor-pointer"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ),
            )}
            <a
              href="/uploads/resume.pdf"
              target="_blank"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
            >
              Resume
            </a>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0d0f14] border-t border-gray-800/50 px-6 py-4 flex flex-col gap-4 shadow-xl">
            {["Home", "Services", "Projects", "Experience", "Contact"].map(
              (item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors block py-2 text-lg font-medium"
                >
                  {item}
                </Link>
              ),
            )}
            <a
              href="/uploads/resume.pdf"
              target="_blank"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 text-center px-5 py-3 rounded-lg transition-all duration-300 font-medium mt-2"
            >
              View Resume
            </a>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section
        id="home"
        className="pt-32 pb-20 max-w-7xl mx-auto px-6 md:px-8 lg:pb-32 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center reveal-target opacity-0 translate-y-12 transition-all duration-1000 ease-out"
      >
        {/* Content Side */}
        <div className="order-2 lg:order-1  space-y-8 relative z-10">
          <div className="flex flex-col justify-center  lg:items-start lg:text-left gap-2 items-center text-center">
            <div className="  items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold tracking-wide backdrop-blur-sm cursor-default shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              Available for new opportunities
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.15] tracking-tight text-white">
              {`Hi, I'm`} <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-cyan-400 to-emerald-400 animate-linear-x cursor-default drop-shadow-sm">
                Rajan Sharma.
              </span>
            </h1>
          </div>

          <p className="text-gray-400 text-base md:text-lg lg:text-xl max-w-xl text-left leading-relaxed cursor-default">
            {`I'm a Full-Stack Developer engineering secure, high-performance web applications. I specialize in the MERN stack, Next.js, TypeScript, and integrating modern AI solutions.`}
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4">
            <a
              href="#projects"
              className="group bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              View My Work
              {/* Arrow Icon */}
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
            <a
              href="#contact"
              className="group bg-[#11141c] hover:bg-[#1a1d27] border border-gray-700 hover:border-gray-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              Contact Me
              {/* Mail Icon */}
              <svg
                className="w-5 h-5 group-hover:rotate-12 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Image / Graphic Side - Hidden on Mobile (md and below) */}
        <div className="order-1 lg:order-2 hidden md:flex justify-center lg:justify-end relative">
          {/* Animated Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-linear-to-tr from-blue-500/20 to-emerald-500/20 blur-3xl rounded-full opacity-70 animate-pulse pointer-events-none"></div>

          {/* Main Image Container */}
          <div className="relative w-75 h-75 md:w-100 md:h-100 rounded-4xl overflow-hidden border border-gray-700/50 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 group">
            <Image
              src="/uploads/hero.jpg"
              alt="Rajan Sharma Workspace"
              fill
              sizes="(max-w-768px) 300px, 400px"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
              priority
            />
            {/* Dark linear overlay at the bottom of the image for blending */}
            <div className="absolute inset-0 bg-linear-to-t from-[#0d0f14] via-transparent to-transparent opacity-60"></div>
          </div>

          {/* Floating 'MERN Stack' Badge */}
          <div className="absolute -bottom-6 -left-2 md:bottom-8 md:-left-8 bg-[#11141c]/90 backdrop-blur-md border border-gray-800 p-4 rounded-2xl shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300 cursor-default z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Code2Icon size={25} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">MERN Stack</p>
                <p className="text-gray-400 text-xs">Specialist</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECH STACK SECTION (INFINITE MARQUEE) */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 pb-24 relative z-10 reveal-target opacity-0 translate-y-12 transition-all duration-1000 delay-200 ease-out">
        <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase text-center mb-10 cursor-default">
          Core Technologies
        </p>

        {/* Injecting CSS keyframes for the marquee animation */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scroll-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-scroll-left {
            animation: scroll-left 40s linear infinite;
          }
          .animate-scroll-right {
            animation: scroll-right 40s linear infinite;
          }
          .animate-scroll-left:hover, .animate-scroll-right:hover {
            animation-play-state: paused;
          }
        `,
          }}
        />

        {/* Marquee Container with linear Mask for faded edges */}
        <div className="relative max-w-5xl mx-auto overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          {/* First Row (Scrolls Left) */}
          <div className="flex w-max gap-4 animate-scroll-left py-2">
            {/* Duplicating the array creates the seamless infinite loop */}
            {[...TECH_STACK, ...TECH_STACK].map((tech, index) => (
              <div
                key={`row1-${index}`}
                className="px-6 py-3 bg-[#11141c] border border-gray-800 rounded-full text-gray-300 text-sm md:text-base font-medium hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-300 cursor-default shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] whitespace-nowrap"
              >
                {tech}
              </div>
            ))}
          </div>

          {/* Second Row (Scrolls Right) */}
          <div className="flex w-max gap-4 animate-scroll-right py-2 mt-2">
            {/* Reversing a copy of the array for visual variety */}
            {[...TECH_STACK]
              .reverse()
              .concat([...TECH_STACK].reverse())
              .map((tech, index) => (
                <div
                  key={`row2-${index}`}
                  className="px-6 py-3 bg-[#0d0f14] border border-gray-800 rounded-full text-gray-300 text-sm md:text-base font-medium hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300 cursor-default shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] whitespace-nowrap"
                >
                  {tech}
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* WHAT I DO (SERVICES) SECTION */}
      <section
        id="services"
        className="bg-[#11141c] border-t border-gray-800/50 py-24 scroll-mt-20 cursor-default"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 reveal-target opacity-0 translate-y-12 transition-all duration-1000 ease-out">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What I Do
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
              Delivering end-to-end web solutions from intuitive interfaces to
              robust database architectures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.map((service) => (
              <div
                key={service.id}
                className="bg-[#0d0f14] p-8 rounded-2xl border border-gray-800 hover:border-emerald-500/30 transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(16,185,129,0.05)]"
              >
                <div className="w-14 h-14 rounded-xl bg-gray-800/50 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm text-justify">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION WITH CATEGORIES */}
      <section id="projects" className="bg-[#11141c] py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8 reveal-target opacity-0 translate-y-12 transition-all duration-1000 ease-out">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 cursor-default">
              Featured Projects
            </h2>
            <p className="text-gray-400 max-w-2xl text-base md:text-lg cursor-default">
              A selection of my recent builds categorized by technology stack.
            </p>
          </div>

          {/* Category Filter Menu */}
          <div className="flex flex-wrap gap-3 mb-12">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                  activeCategory === category
                    ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    : "bg-[#0d0f14] border border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-[#0d0f14] rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(59,130,246,0.1)] overflow-hidden flex flex-col"
              >
                <div className="aspect-video w-full relative overflow-hidden bg-gray-900 cursor-default">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={400}
                    height={300}
                    className="object-cover w-full h-60 group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-80 group-hover:opacity-100"
                  />
                  {/* Category Badge on Image */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-blue-800 backdrop-blur-md border border-white/10 rounded-full text-xs font-semibold text-white">
                    {project.category}
                  </div>
                </div>

                <div className="p-6 flex flex-col grow cursor-default">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 grow leading-relaxed text-justify">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tech.map((item, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-800/50 border border-gray-700 rounded-full text-xs font-medium text-emerald-400"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Dynamic Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-auto">
                    {project.githubFrontend && (
                      <a
                        href={project.githubFrontend}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-gray-700 text-white py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 text-center cursor-pointer"
                      >
                        <GithubIcon size={18} />
                        Frontend
                      </a>
                    )}
                    {project.githubBackend && (
                      <a
                        href={project.githubBackend}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-gray-700 text-white py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 text-center cursor-pointer"
                      >
                        <GithubIcon size={18} />
                        Backend
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 text-center cursor-pointer flex items-center justify-center"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE & EDUCATION SECTION */}
      <section
        id="experience"
        className="border-y border-gray-800/50 py-24 scroll-mt-20 cursor-default"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 reveal-target opacity-0 translate-y-12 transition-all duration-1000 ease-out">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Experience & Background
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
              My professional journey across software development, technical
              operations, and engineering education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {EXPERIENCE.map((item) => (
              <div
                key={item.id}
                className="bg-[#11141c] p-6 md:p-8 rounded-2xl border border-gray-800 hover:border-blue-500/30 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span
                      className={`text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-3 inline-block ${item.type === "Work" ? "bg-blue-500/10 text-blue-400" : "bg-emerald-500/10 text-emerald-400"}`}
                    >
                      {item.type}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {item.role}
                    </h3>
                  </div>
                </div>
                <div className="text-gray-400 text-sm font-medium mb-4 flex flex-wrap items-center gap-2">
                  <span>{item.company}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-700 hidden sm:inline-block"></span>
                  <span className="w-full sm:w-auto mt-1 sm:mt-0">
                    {item.location}
                  </span>
                </div>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT DETAILS SECTION */}
      <section
        id="contact"
        className="border-t border-gray-800/50 py-24 scroll-mt-20 relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 md:px-8 relative z-10 reveal-target opacity-0 translate-y-12 transition-all duration-1000 ease-out">
          <div className="text-center mb-16 cursor-default">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {`Let's Work Together`}
            </h2>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
              {`I'm currently available for freelance work and full-time
              opportunities. Feel free to reach out through any of the channels
              below.`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Email Card */}
            <a
              href="mailto:email.rajan001@gmail.com"
              className="bg-[#11141c] p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300 group flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(59,130,246,0.1)] cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-bold mb-1">Email Me</h3>
              <p className="text-gray-400 text-sm break-all">
                email.rajan001@gmail.com
              </p>
            </a>

            {/* Phone Card (Call / WhatsApp) */}
            <a
              href="tel:+9779849809355"
              className="bg-[#11141c] p-8 rounded-2xl border border-gray-800 hover:border-emerald-500/50 transition-all duration-300 group flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-bold mb-1">Call / WhatsApp</h3>
              <p className="text-gray-400 text-sm">
                9849809355
                <br />
                9822552570
              </p>
            </a>

            {/* Location Card */}
            <div className="bg-[#11141c] p-8 rounded-2xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 group flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(168,85,247,0.1)] cursor-default">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-bold mb-1">Location</h3>
              <p className="text-gray-400 text-sm">Kathmandu, Nepal</p>
            </div>

            {/* Networks Card */}
            <div className="bg-[#11141c] p-8 rounded-2xl border border-gray-800 hover:border-cyan-500/50 transition-all duration-300 group flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)] cursor-default">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <h3 className="text-white font-bold mb-2">Networks</h3>
              <div className="flex gap-4 mt-1">
                <a
                  href="https://github.com/rajansharma001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <GithubIcon size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/rajan-sharma001/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <LinkedinIcon size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/rajan-sharma001/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <FacebookIcon size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0a0c10] border-t border-gray-800/50 pt-16 pb-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 pt-8 border-t border-gray-800/80 cursor-default relative z-10 text-center md:text-left">
          <p>© {new Date().getFullYear()} Rajan Sharma. All rights reserved.</p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-4 md:mt-0">
            <p>Built with Next.js & Tailwind</p>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-gray-700"></span>
            <Link
              href="#home"
              className="hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer mt-2 sm:mt-0"
            >
              Back to top
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
