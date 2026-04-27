require('dotenv').config();
const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'agency.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT    UNIQUE NOT NULL,
    password   TEXT    NOT NULL,
    name       TEXT    NOT NULL DEFAULT 'Admin',
    created_at TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS services (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    icon        TEXT DEFAULT '⚡',
    price       TEXT DEFAULT 'Custom',
    features    TEXT DEFAULT '[]',
    is_active   INTEGER DEFAULT 1,
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS portfolio (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    category    TEXT NOT NULL,
    image_url   TEXT DEFAULT '',
    client_name TEXT DEFAULT '',
    project_url TEXT DEFAULT '',
    tags        TEXT DEFAULT '[]',
    is_featured INTEGER DEFAULT 0,
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT NOT NULL,
    slug         TEXT UNIQUE NOT NULL,
    excerpt      TEXT NOT NULL,
    content      TEXT NOT NULL,
    author       TEXT DEFAULT 'Admin',
    category     TEXT DEFAULT 'General',
    tags         TEXT DEFAULT '[]',
    cover_image  TEXT DEFAULT '',
    is_published INTEGER DEFAULT 0,
    views        INTEGER DEFAULT 0,
    created_at   TEXT DEFAULT (datetime('now')),
    updated_at   TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    phone      TEXT DEFAULT '',
    company    TEXT DEFAULT '',
    service    TEXT DEFAULT '',
    budget     TEXT DEFAULT '',
    message    TEXT NOT NULL,
    status     TEXT DEFAULT 'new',
    notes      TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT NOT NULL,
    email        TEXT NOT NULL,
    phone        TEXT DEFAULT '',
    service      TEXT NOT NULL,
    date         TEXT NOT NULL,
    time         TEXT NOT NULL,
    message      TEXT DEFAULT '',
    status       TEXT DEFAULT 'pending',
    meeting_link TEXT DEFAULT '',
    notes        TEXT DEFAULT '',
    created_at   TEXT DEFAULT (datetime('now'))
  );
`);

// ─── SEED ADMIN ───────────────────────────────────────────────────────────────

const seedAdmin = () => {
  const adminEmail    = process.env.ADMIN_EMAIL    || 'admin@agency.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

  console.log('🔐 Admin Email from env:', adminEmail);
  console.log('🔐 Admin Password from env:', adminPassword);

  const existing = db.prepare('SELECT id FROM admins WHERE email = ?').get(adminEmail);

  if (!existing) {
    const hash = bcrypt.hashSync(adminPassword, 12);
    db.prepare('INSERT INTO admins (email, password, name) VALUES (?, ?, ?)').run(
      adminEmail,
      hash,
      'Agency Admin'
    );
    console.log(`✅ Admin user created: ${adminEmail}`);
  } else {
    // Always re-sync password from .env on every server restart
    const hash = bcrypt.hashSync(adminPassword, 12);
    db.prepare('UPDATE admins SET password = ? WHERE email = ?').run(hash, adminEmail);
    console.log(`✅ Admin password synced from .env: ${adminEmail}`);
  }
};

// ─── SEED SAMPLE DATA ────────────────────────────────────────────────────────

const seedSampleData = () => {
  const serviceCount = db.prepare('SELECT COUNT(*) as count FROM services').get();
  if (serviceCount.count === 0) {
    const services = [
      {
        title: 'Web Development',
        description: 'Custom websites and web applications built with modern technologies. Responsive, fast, and scalable solutions tailored to your business needs.',
        icon: '🌐',
        price: '$2,000+',
        features: JSON.stringify(['React / Next.js', 'Node.js Backend', 'Database Design', 'API Integration', 'Performance Optimization']),
      },
      {
        title: 'UI/UX Design',
        description: 'Beautiful, intuitive interfaces that convert visitors into customers. We craft experiences that users love and businesses rely on.',
        icon: '🎨',
        price: '$1,500+',
        features: JSON.stringify(['User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability Testing']),
      },
      {
        title: 'Digital Marketing',
        description: 'Data-driven strategies to grow your online presence, generate leads, and maximize ROI across all digital channels.',
        icon: '📈',
        price: '$800/mo',
        features: JSON.stringify(['SEO Optimization', 'Content Strategy', 'Social Media', 'PPC Campaigns', 'Analytics & Reporting']),
      },
      {
        title: 'Mobile Development',
        description: 'Native and cross-platform mobile applications for iOS and Android. From concept to app store deployment.',
        icon: '📱',
        price: '$3,000+',
        features: JSON.stringify(['React Native', 'iOS & Android', 'App Store Deploy', 'Push Notifications', 'Offline Support']),
      },
      {
        title: 'Brand Identity',
        description: 'Complete brand identity systems that tell your story, build trust, and make lasting impressions on your audience.',
        icon: '✨',
        price: '$1,200+',
        features: JSON.stringify(['Logo Design', 'Color System', 'Typography', 'Brand Guidelines', 'Marketing Materials']),
      },
      {
        title: 'Cloud & DevOps',
        description: 'Scalable infrastructure, CI/CD pipelines, and cloud architecture to keep your applications running smoothly 24/7.',
        icon: '☁️',
        price: '$1,500+',
        features: JSON.stringify(['AWS / GCP / Azure', 'Docker & Kubernetes', 'CI/CD Pipelines', 'Monitoring', 'Security Audits']),
      },
    ];
    const stmt = db.prepare(
      'INSERT INTO services (title, description, icon, price, features) VALUES (?, ?, ?, ?, ?)'
    );
    services.forEach(s => stmt.run(s.title, s.description, s.icon, s.price, s.features));
    console.log('✅ Sample services seeded');
  }

  const portfolioCount = db.prepare('SELECT COUNT(*) as count FROM portfolio').get();
  if (portfolioCount.count === 0) {
    const projects = [
      {
        title: 'FinTech Dashboard',
        description: 'A comprehensive financial analytics dashboard with real-time data visualization and reporting.',
        category: 'Web Development',
        client_name: 'CapitalFlow Inc.',
        tags: JSON.stringify(['React', 'Node.js', 'D3.js']),
        is_featured: 1,
      },
      {
        title: 'Luxe E-Commerce',
        description: 'Premium fashion e-commerce platform with advanced filtering, wishlist, and AR try-on features.',
        category: 'Web Development',
        client_name: 'Luxe Threads',
        tags: JSON.stringify(['Next.js', 'Stripe', 'Prisma']),
        is_featured: 1,
      },
      {
        title: 'HealthTrack App',
        description: 'Cross-platform mobile app for health monitoring, appointment booking, and medical records.',
        category: 'Mobile Development',
        client_name: 'MedCore Health',
        tags: JSON.stringify(['React Native', 'Firebase', 'HL7']),
        is_featured: 1,
      },
      {
        title: 'RealEstate Pro',
        description: 'Property listing and management platform with virtual tours, mortgage calculator, and agent portal.',
        category: 'Web Development',
        client_name: 'Prestige Realty',
        tags: JSON.stringify(['Vue.js', 'Laravel', 'MapBox']),
        is_featured: 0,
      },
      {
        title: 'Brand Refresh — Nova',
        description: 'Complete brand identity overhaul for a SaaS startup, including logo, design system, and marketing assets.',
        category: 'Brand Identity',
        client_name: 'Nova SaaS',
        tags: JSON.stringify(['Figma', 'Illustrator', 'Branding']),
        is_featured: 0,
      },
      {
        title: 'GrowthOps Marketing',
        description: '360° digital marketing campaign that grew organic traffic by 340% in 6 months.',
        category: 'Digital Marketing',
        client_name: 'GrowthOps Ltd.',
        tags: JSON.stringify(['SEO', 'Content', 'Analytics']),
        is_featured: 0,
      },
    ];
    const stmt = db.prepare(
      'INSERT INTO portfolio (title, description, category, client_name, tags, is_featured) VALUES (?, ?, ?, ?, ?, ?)'
    );
    projects.forEach(p =>
      stmt.run(p.title, p.description, p.category, p.client_name, p.tags, p.is_featured)
    );
    console.log('✅ Sample portfolio seeded');
  }

  const blogCount = db.prepare('SELECT COUNT(*) as count FROM blog_posts').get();
  if (blogCount.count === 0) {
    const posts = [
      {
        title: 'The Future of Web Development in 2025',
        slug: 'future-web-development-2025',
        excerpt: 'Explore the emerging trends shaping the web development landscape — from AI-assisted coding to edge computing.',
        content:
          'Web development is evolving at a rapid pace. In 2025, we are seeing a convergence of artificial intelligence, edge computing, and new frontend frameworks that are fundamentally changing how we build for the web.\n\nAI-assisted development tools like GitHub Copilot and similar solutions are now standard in professional workflows. Developers report up to 40% productivity gains when leveraging these tools effectively.\n\nEdge computing is moving computation closer to users, dramatically reducing latency. Platforms like Cloudflare Workers and Vercel Edge Functions allow developers to run server-side logic at the network edge.\n\nThe rise of meta-frameworks like Next.js, Remix, and Astro continues, with a focus on performance-first architecture and improved developer experience.',
        category: 'Technology',
        tags: JSON.stringify(['Web Dev', 'AI', 'Trends']),
        is_published: 1,
      },
      {
        title: 'How to Build a Scalable Design System',
        slug: 'build-scalable-design-system',
        excerpt: 'A practical guide to creating design systems that scale across products and teams without becoming a bottleneck.',
        content:
          'A well-crafted design system is the backbone of consistent, scalable product development. Without one, teams spend enormous energy rebuilding components and resolving inconsistencies.\n\nStart with a solid foundation: define your design tokens first. Colors, typography, spacing, shadows — these primitive values underpin every component in your system.\n\nComponent architecture matters deeply. Separate your primitive components (Button, Input, Icon) from composite components (Modal, Form, Card). This separation makes maintenance far easier.\n\nDocumentation is not optional. A design system without documentation is just a component library. Teams need to understand not just how to use components, but when and why.',
        category: 'Design',
        tags: JSON.stringify(['Design Systems', 'UI/UX', 'Figma']),
        is_published: 1,
      },
      {
        title: 'SEO Strategies That Actually Work in 2025',
        slug: 'seo-strategies-that-work-2025',
        excerpt: 'Cut through the noise with SEO strategies backed by data, not outdated advice.',
        content:
          "Search engine optimization has fundamentally changed. The strategies that worked in 2020 are table stakes today — and some are actively harmful.\n\nCore Web Vitals are now critical ranking factors. Google is increasingly sophisticated at measuring real user experience, not just technical metrics. Focus on Largest Contentful Paint (LCP), First Input Delay (FID), and Cumulative Layout Shift (CLS).\n\nContent quality over quantity. Google's Helpful Content updates have penalized sites that prioritize search engines over users. Write for humans. Answer questions completely. Add genuine expertise and unique insight.\n\nE-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) is more important than ever, especially in YMYL (Your Money, Your Life) niches.",
        category: 'Marketing',
        tags: JSON.stringify(['SEO', 'Marketing', 'Growth']),
        is_published: 1,
      },
    ];
    const stmt = db.prepare(
      'INSERT INTO blog_posts (title, slug, excerpt, content, category, tags, is_published) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    posts.forEach(p =>
      stmt.run(p.title, p.slug, p.excerpt, p.content, p.category, p.tags, p.is_published)
    );
    console.log('✅ Sample blog posts seeded');
  }
};

seedAdmin();
seedSampleData();

module.exports = db;