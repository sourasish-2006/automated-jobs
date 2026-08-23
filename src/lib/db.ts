// Multi-tenant Store & Database Access Layer with Auto-seeding
import { CandidateProfileData, NormalizedJobPosting, MatchAnalysisResult, TailoredResumeContent, ApplicationFormField, ApplicationStatus } from '@/types';

export interface StoredTenant {
  id: string;
  name: string;
  slug: string;
  plan: string;
}

export interface StoredUser {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface StoredJobPosting extends NormalizedJobPosting {
  id: string;
  tenantId: string;
  fingerprint: string;
  lastSyncedAt: string;
}

export interface StoredJobMatch {
  id: string;
  userId: string;
  jobPostingId: string;
  matchResult: MatchAnalysisResult;
  isStarred: boolean;
  isDismissed: boolean;
  createdAt: string;
}

export interface StoredTailoredResume {
  id: string;
  userId: string;
  jobPostingId?: string;
  content: TailoredResumeContent;
  createdAt: string;
}

export interface StoredApplication {
  id: string;
  userId: string;
  jobPostingId: string;
  tailoredResumeId?: string;
  status: ApplicationStatus;
  automationEngine: 'PLAYWRIGHT' | 'API' | 'MANUAL';
  formUrl?: string;
  fields: ApplicationFormField[];
  hasSensitiveQuestions: boolean;
  requiresHumanInput: boolean;
  humanReviewNotes?: string;
  approvedAt?: string;
  submittedAt?: string;
  screenshotSnapshot?: string;
  stage: 'SUBMITTED' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'REJECTED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredNotification {
  id: string;
  userId: string;
  type: 'JOB_DISCOVERED' | 'RESUME_READY' | 'APPROVAL_REQUIRED' | 'APPLICATION_SUBMITTED' | 'SYSTEM';
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface StoredAuditLog {
  id: string;
  tenantId: string;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

// Global In-Memory and persistent store state
class StoreService {
  private static instance: StoreService;

  public tenants: StoredTenant[] = [];
  public users: StoredUser[] = [];
  public profiles: Map<string, CandidateProfileData> = new Map(); // userId -> CandidateProfileData
  public jobPostings: StoredJobPosting[] = [];
  public matches: StoredJobMatch[] = [];
  public resumes: StoredTailoredResume[] = [];
  public applications: StoredApplication[] = [];
  public notifications: StoredNotification[] = [];
  public auditLogs: StoredAuditLog[] = [];

  private constructor() {
    this.seedDefaultData();
  }

  public static getInstance(): StoreService {
    if (!(globalThis as any).__storeServiceInstance) {
      (globalThis as any).__storeServiceInstance = new StoreService();
    }
    return (globalThis as any).__storeServiceInstance;
  }

  public seedDefaultData() {
    const tenantId = 'tenant_prod_enterprise_1';
    const userId = 'user_alex_chen';

    this.tenants = [
      {
        id: tenantId,
        name: 'HyperScale AI Labs',
        slug: 'hyperscale-ai',
        plan: 'enterprise'
      }
    ];

    this.users = [
      {
        id: userId,
        tenantId,
        email: 'raihanmolla9903@gmail.com',
        name: 'Raihan Molla',
        role: 'CANDIDATE',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      }
    ];

    // Seed Candidate Master Profile
    const profile: CandidateProfileData = {
      id: 'prof_alex_chen',
      userId,
      fullName: 'Raihan Molla',
      email: 'raihanmolla9903@gmail.com',
      phone: '8585844758',
      location: 'Kolkata, West Bengal, India',
      headline: 'Raihan Molla — Senior Software Engineer | Distributed Systems & Full Stack',
      summary: 'Raihan Molla — Full-Stack & Systems Software Engineer with proven experience building scalable backend microservices, real-time React web applications, and high-performance cloud architectures.',
      website: 'https://myportfolio.vercel.app',
      linkedinUrl: 'https://linkedin.com/in/raihan-molla',
      githubUrl: 'https://github.com/raihan-codes',
      portfolioUrl: 'https://myportfolio.vercel.app',
      desiredTitles: [
        'Full Stack Engineer',
        'Senior Software Engineer',
        'Backend Engineer',
        'Frontend Engineer',
        'Distributed Systems Engineer'
      ],
      preferredLocations: ['Kolkata, India', 'Bengaluru, India', 'Hyderabad, India', 'Remote (India)', 'San Francisco, CA'],
      remotePreference: 'REMOTE_OR_HYBRID',
      minSalary: 2400000,
      expectedSalaryLPA: 24,
      noticePeriod: '60_DAYS',
      requiresVisa: false,
      workAuthorization: 'Indian Citizen (No Sponsorship Required)',
      yearsOfExperience: 1,
      skills: [
        { name: 'TypeScript', category: 'TECHNICAL', years: 4, level: 'EXPERT' },
        { name: 'React', category: 'FRAMEWORK', years: 4, level: 'EXPERT' },
        { name: 'Node.js', category: 'TECHNICAL', years: 4, level: 'EXPERT' },
        { name: 'Next.js', category: 'FRAMEWORK', years: 3, level: 'ADVANCED' },
        { name: 'PostgreSQL', category: 'TECHNICAL', years: 4, level: 'ADVANCED' },
        { name: 'Go (Golang)', category: 'TECHNICAL', years: 2.5, level: 'INTERMEDIATE' },
        { name: 'Redis', category: 'TOOL', years: 3.5, level: 'ADVANCED' },
        { name: 'Docker', category: 'TOOL', years: 4, level: 'ADVANCED' },
        { name: 'Kubernetes', category: 'TOOL', years: 2, level: 'INTERMEDIATE' },
        { name: 'AWS (ECS, S3, RDS)', category: 'TOOL', years: 3.5, level: 'ADVANCED' },
        { name: 'Tailwind CSS', category: 'FRAMEWORK', years: 3, level: 'EXPERT' },
        { name: 'GraphQL', category: 'TECHNICAL', years: 2.5, level: 'ADVANCED' },
        { name: 'Kafka', category: 'TOOL', years: 2, level: 'INTERMEDIATE' },
        { name: 'CI/CD & GitHub Actions', category: 'TOOL', years: 3, level: 'ADVANCED' }
      ],
      experiences: [
        {
          id: 'exp_1',
          company: 'Veloce Data Systems',
          role: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          startDate: '2023-01',
          endDate: null,
          isCurrent: true,
          description: 'Leading the ingestion pipeline and front-end observability portal.',
          bullets: [
            'Architected real-time event streaming pipeline processing 15M+ events/day using Node.js, Redis Streams, and PostgreSQL, reducing query latency by 42%.',
            'Engineered Next.js 14 telemetry dashboard with server-side streaming and WebSockets for 40,000+ active enterprise users.',
            'Spearheaded migration from legacy monolithic REST endpoints to structured GraphQL and gRPC microservices, cutting cloud egress costs by $18k/month.'
          ],
          technologies: ['TypeScript', 'Next.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS']
        },
        {
          id: 'exp_2',
          company: 'Aether Cloud Software',
          role: 'Software Engineer II',
          location: 'San Francisco, CA',
          startDate: '2021-06',
          endDate: '2022-12',
          isCurrent: false,
          description: 'Full stack development on multi-tenant SaaS collaboration platform.',
          bullets: [
            'Built real-time collaborative editor with operational transformation and CRDTs using React, TypeScript, and Node.js.',
            'Optimized relational database queries and indices in PostgreSQL, eliminating slow-query bottlenecks during peak loads.',
            'Created automated CI/CD deployment pipelines using GitHub Actions and AWS ECS with zero-downtime blue/green rollouts.'
          ],
          technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GitHub Actions', 'AWS']
        }
      ],
      educations: [
        {
          id: 'edu_1',
          institution: 'University of California, Berkeley',
          degree: 'B.S. in Computer Science',
          fieldOfStudy: 'Computer Science & Distributed Systems',
          startDate: '2017',
          endDate: '2021',
          gradeGpa: '3.82 / 4.0',
          highlights: ['Dean\'s Honors List', 'Teaching Assistant for CS 162 (Operating Systems)']
        }
      ],
      projects: [
        {
          id: 'proj_1',
          title: 'Distributed Vector Search Cache',
          description: 'High-performance distributed in-memory cache for high-dimensional vector embeddings with approximate nearest neighbors (HNSW).',
          role: 'Creator & Maintainer',
          link: 'https://github.com/alexchen-dev/vector-cache',
          technologies: ['Go', 'TypeScript', 'Redis', 'Docker'],
          bullets: [
            'Implemented sub-5ms cosine similarity and L2 distance lookups over 2M embedding vectors.',
            'Packaged as a lightweight container with Prometheus metrics and Grafana dashboards.'
          ]
        },
        {
          id: 'proj_2',
          title: 'Nexus Realtime Form Automation Engine',
          description: 'Headless automation SDK that generates deterministic, accessible form filling sequences across modern SPA web applications.',
          role: 'Creator',
          link: 'https://github.com/alexchen-dev/nexus-automator',
          technologies: ['TypeScript', 'Playwright', 'Node.js'],
          bullets: [
            'Achieved 98.4% fill accuracy on complex multi-step ATS workflows (Greenhouse, Lever, Workday).',
            'Implemented automated safety gates for sensitive data detection and user-confirmation checkpoints.'
          ]
        }
      ],
      achievements: [
        {
          id: 'ach_1',
          title: '1st Place Winner - CalHacks AI Innovation Track',
          issuer: 'CalHacks',
          date: '2021',
          description: 'Built a real-time speech translation and accessibility assistant.'
        }
      ],
      certifications: [
        {
          id: 'cert_1',
          name: 'AWS Certified Solutions Architect – Associate',
          issuer: 'Amazon Web Services',
          issueDate: '2023-04',
          credentialUrl: 'https://aws.amazon.com/verification'
        }
      ]
    };
    this.profiles.set(userId, profile);

    // Seed Real ATS & Aggregated Jobs from 10 Global Connectors
    this.jobPostings = [
      {
        id: 'job_razorpay_1',
        tenantId,
        sourcePlatform: 'GREENHOUSE',
        sourceJobId: 'rzp_88410',
        sourceUrl: 'https://boards.greenhouse.io/razorpay/jobs/88410',
        canonicalUrl: 'https://boards.greenhouse.io/razorpay/jobs/88410',
        applicationUrl: 'https://boards.greenhouse.io/razorpay/jobs/88410',
        applicationMethod: 'AUTOMATED_ATS',
        foundOnSources: ['GREENHOUSE', 'LINKEDIN', 'INDEED', 'CAREER_PAGES'],
        fingerprint: 'fp_razorpay_sde2_fullstack_88410',
        company: 'Razorpay',
        companyLogo: 'https://cdn.worldvectorlogo.com/logos/razorpay.svg',
        title: 'Software Development Engineer II (SDE-2) - Payments Core',
        department: 'Core Payments Engineering',
        location: 'Bengaluru, Karnataka (Hybrid / Remote India)',
        country: 'India',
        isRemote: true,
        remoteType: 'REMOTE',
        employmentType: 'FULL_TIME',
        salaryMin: 2800000,
        salaryMax: 4200000,
        salaryCurrency: 'INR',
        descriptionRaw: `Razorpay is India's leading full-stack financial solutions company. We power payments for over 10M+ businesses across India.
We are looking for an SDE-2 to build our next-generation high-throughput payment routing and checkout systems.

What You'll Do:
- Architect highly available payment processing microservices using Go, Node.js, and TypeScript.
- Build reliable Kafka event streams and PostgreSQL/Redis datastores processing 5,000+ transactions per second.
- Collaborate with product and design teams in Bengaluru to deliver developer-first APIs and payment gateways.

Requirements:
- 2+ years of software development experience in product engineering.
- Proficiency with Go, TypeScript, Node.js, and PostgreSQL.
- Strong grounding in distributed systems, concurrency, and caching.`,
        postedAt: new Date(Date.now() - 3600 * 1000 * 2),
        updatedAt: new Date(Date.now() - 3600 * 1000 * 2),
        lastSyncedAt: new Date().toISOString(),
        extractedSkills: ['TypeScript', 'Node.js', 'Go', 'PostgreSQL', 'Redis', 'Kafka', 'System Design'],
        experienceLevel: 'MID',
        visaAllowed: true
      },
      {
        id: 'job_zepto_intern',
        tenantId,
        sourcePlatform: 'ASHBY',
        sourceJobId: 'zpt_int_2026',
        sourceUrl: 'https://jobs.ashbyhq.com/zepto/zpt_int_2026',
        canonicalUrl: 'https://jobs.ashbyhq.com/zepto/zpt_int_2026',
        applicationUrl: 'https://jobs.ashbyhq.com/zepto/zpt_int_2026',
        applicationMethod: 'AUTOMATED_ATS',
        foundOnSources: ['ASHBY', 'INTERNSHALA', 'HANDSHAKE'],
        fingerprint: 'fp_zepto_sde_intern_2026',
        company: 'Zepto',
        companyLogo: 'https://cdn.worldvectorlogo.com/logos/zepto.svg',
        title: 'Software Development Engineer Intern (Summer 2026)',
        department: 'Supply Chain & Consumer Tech',
        location: 'Bengaluru / Kolkata / Remote, India',
        country: 'India',
        isRemote: true,
        remoteType: 'HYBRID',
        employmentType: 'INTERNSHIP',
        salaryMin: 960000,
        salaryMax: 1800000,
        salaryCurrency: 'INR',
        descriptionRaw: `Zepto is India's fastest growing instant grocery delivery platform.
We are hiring passionate SDE Interns for Summer 2026 to work on high-impact consumer apps, order dispatch systems, and warehouse automation.

You Will:
- Build high-performance React Native, Next.js, and Node.js applications.
- Design backend APIs and optimize PostgreSQL/Redis queries.
- Participate in code reviews, design sprints, and real-time delivery routing.`,
        postedAt: new Date(Date.now() - 3600 * 1000 * 6),
        updatedAt: new Date(Date.now() - 3600 * 1000 * 6),
        lastSyncedAt: new Date().toISOString(),
        extractedSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Data Structures & Algorithms'],
        experienceLevel: 'INTERN',
        visaAllowed: true
      },
      {
        id: 'job_wellfound_startup_1',
        tenantId,
        sourcePlatform: 'WELLFOUND',
        sourceJobId: 'wf_vercel_ecosystem_1',
        sourceUrl: 'https://wellfound.com/company/hypergrowth-ai/jobs/full-stack-engineer',
        canonicalUrl: 'https://wellfound.com/company/hypergrowth-ai/jobs/full-stack-engineer',
        applicationUrl: 'https://wellfound.com/company/hypergrowth-ai/jobs/full-stack-engineer',
        applicationMethod: 'AUTOMATED_ATS',
        foundOnSources: ['WELLFOUND', 'LINKEDIN', 'CAREER_PAGES'],
        fingerprint: 'fp_wf_hypergrowth_fullstack',
        company: 'HyperGrowth AI',
        companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        title: 'Full Stack Engineer (Founding Engineering Team)',
        department: 'Engineering',
        location: 'Remote (Global / India)',
        country: 'Global / Remote',
        isRemote: true,
        remoteType: 'REMOTE',
        employmentType: 'FULL_TIME',
        salaryMin: 3000000,
        salaryMax: 4500000,
        salaryCurrency: 'INR',
        descriptionRaw: `HyperGrowth AI is building next-generation developer tooling and agent orchestration infrastructure.
We are looking for a high-velocity Full Stack Engineer to lead full-stack feature delivery.
Stack: TypeScript, Next.js 14, Node.js, PostgreSQL, Redis, and LLM APIs.`,
        postedAt: new Date(Date.now() - 3600 * 1000 * 12),
        updatedAt: new Date(Date.now() - 3600 * 1000 * 12),
        lastSyncedAt: new Date().toISOString(),
        extractedSkills: ['TypeScript', 'Next.js', 'React', 'Node.js', 'PostgreSQL', 'Redis'],
        experienceLevel: 'MID',
        visaAllowed: true
      },
      {
        id: 'job_internshala_fullstack_1',
        tenantId,
        sourcePlatform: 'INTERNSHALA',
        sourceJobId: 'int_fullstack_kolkata_2026',
        sourceUrl: 'https://internshala.com/internship/detail/fullstack-engineer-internship',
        canonicalUrl: 'https://internshala.com/internship/detail/fullstack-engineer-internship',
        applicationUrl: 'https://internshala.com/internship/detail/fullstack-engineer-internship',
        applicationMethod: 'AUTOMATED_ATS',
        foundOnSources: ['INTERNSHALA', 'CAREER_PAGES'],
        fingerprint: 'fp_int_fullstack_internship_kolkata',
        company: 'DevScale India',
        companyLogo: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=100&auto=format&fit=crop&q=80',
        title: 'Full Stack Web Engineering Intern',
        department: 'Product Development',
        location: 'Kolkata, West Bengal, India (Hybrid / Remote Option)',
        country: 'India',
        isRemote: true,
        remoteType: 'HYBRID',
        employmentType: 'INTERNSHIP',
        salaryMin: 480000,
        salaryMax: 720000,
        salaryCurrency: 'INR',
        descriptionRaw: `DevScale is hiring Full Stack Engineering Interns in Kolkata/Remote.
Responsibilities:
- Build React and Next.js interfaces with modern Tailwind CSS.
- Write robust Node.js and PostgreSQL backend microservices.
- Opportunity for full-time PPO conversion based on performance.`,
        postedAt: new Date(Date.now() - 3600 * 1000 * 15),
        updatedAt: new Date(Date.now() - 3600 * 1000 * 15),
        lastSyncedAt: new Date().toISOString(),
        extractedSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Next.js'],
        experienceLevel: 'INTERN',
        visaAllowed: true
      },
      {
        id: 'job_figma_1',
        tenantId,
        sourcePlatform: 'GREENHOUSE',
        sourceJobId: '5489201',
        sourceUrl: 'https://boards.greenhouse.io/figma/jobs/5489201',
        canonicalUrl: 'https://boards.greenhouse.io/figma/jobs/5489201',
        applicationUrl: 'https://boards.greenhouse.io/figma/jobs/5489201',
        applicationMethod: 'AUTOMATED_ATS',
        foundOnSources: ['GREENHOUSE', 'LINKEDIN', 'INDEED', 'CAREER_PAGES'],
        fingerprint: 'fp_figma_swe_fullstack_5489201',
        company: 'Figma',
        companyLogo: 'https://cdn.worldvectorlogo.com/logos/figma-5.svg',
        title: 'Full Stack Software Engineer - Collaboration Tools',
        department: 'Core Product Engineering',
        location: 'San Francisco, CA (Hybrid / Remote Option)',
        country: 'United States',
        isRemote: true,
        remoteType: 'REMOTE',
        employmentType: 'FULL_TIME',
        salaryMin: 3500000,
        salaryMax: 5500000,
        salaryCurrency: 'INR',
        descriptionRaw: `At Figma, we are building browser-first design and collaboration tools used by millions of teams globally.
We are looking for a Full Stack Software Engineer to join our Collaboration Experience team.

What You'll Do:
- Build resilient, performant real-time collaborative interfaces using TypeScript, React, and WebSockets.
- Architect backend distributed services and event streaming systems in Node.js / Go and PostgreSQL.
- Optimize canvas rendering and multi-user synchronization with low latency.`,
        postedAt: new Date(Date.now() - 3600 * 1000 * 4),
        updatedAt: new Date(Date.now() - 3600 * 1000 * 4),
        lastSyncedAt: new Date().toISOString(),
        extractedSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'WebSockets', 'Go'],
        experienceLevel: 'MID',
        visaAllowed: true
      },
      {
        id: 'job_linkedin_msft_1',
        tenantId,
        sourcePlatform: 'LINKEDIN',
        sourceJobId: 'li_msft_swe_kolkata',
        sourceUrl: 'https://www.linkedin.com/jobs/view/microsoft-swe-kolkata',
        canonicalUrl: 'https://www.linkedin.com/jobs/view/microsoft-swe-kolkata',
        applicationUrl: 'https://www.linkedin.com/jobs/view/microsoft-swe-kolkata',
        applicationMethod: 'EXTERNAL_PORTAL_LINK',
        foundOnSources: ['LINKEDIN', 'INDEED', 'CAREER_PAGES'],
        fingerprint: 'fp_msft_swe_cloud_kolkata',
        company: 'Microsoft',
        companyLogo: 'https://cdn.worldvectorlogo.com/logos/microsoft-5.svg',
        title: 'Software Engineer - Azure Cloud Core',
        department: 'Cloud & AI',
        location: 'Bengaluru / Kolkata / Hyderabad, India',
        country: 'India',
        isRemote: true,
        remoteType: 'HYBRID',
        employmentType: 'FULL_TIME',
        salaryMin: 3200000,
        salaryMax: 4800000,
        salaryCurrency: 'INR',
        descriptionRaw: `Microsoft Azure engineering is expanding. We are seeking talented Software Engineers with strong problem solving, distributed backend systems, and modern cloud technologies.`,
        postedAt: new Date(Date.now() - 3600 * 1000 * 10),
        updatedAt: new Date(Date.now() - 3600 * 1000 * 10),
        lastSyncedAt: new Date().toISOString(),
        extractedSkills: ['Go', 'TypeScript', 'Distributed Systems', 'Kubernetes', 'PostgreSQL'],
        experienceLevel: 'MID',
        visaAllowed: true
      },
      {
        id: 'job_direct_tech_1',
        tenantId,
        sourcePlatform: 'CAREER_PAGES',
        sourceJobId: 'dir_swiggy_lead',
        sourceUrl: 'https://careers.swiggy.com/jobs/lead-engineer-dispatch',
        canonicalUrl: 'https://careers.swiggy.com/jobs/lead-engineer-dispatch',
        applicationUrl: 'https://careers.swiggy.com/jobs/lead-engineer-dispatch',
        applicationMethod: 'DIRECT_CAREER_PAGE',
        foundOnSources: ['CAREER_PAGES', 'LEVER', 'LINKEDIN', 'INDEED'],
        fingerprint: 'fp_swiggy_lead_dispatch',
        company: 'Swiggy',
        companyLogo: 'https://cdn.worldvectorlogo.com/logos/swiggy-1.svg',
        title: 'Senior / Lead Engineer - Real-time Delivery Logistics',
        department: 'Logistics Intelligence',
        location: 'Bengaluru, India (Remote Option)',
        country: 'India',
        isRemote: true,
        remoteType: 'REMOTE',
        employmentType: 'FULL_TIME',
        salaryMin: 3600000,
        salaryMax: 5200000,
        salaryCurrency: 'INR',
        descriptionRaw: `Swiggy is India's pioneer on-demand convenience platform.
Join our Logistics team to build allocation algorithms and real-time dispatch systems handling millions of orders daily.
Stack: Go, TypeScript, Node.js, Redis, Kafka, PostgreSQL.`,
        postedAt: new Date(Date.now() - 3600 * 1000 * 8),
        updatedAt: new Date(Date.now() - 3600 * 1000 * 8),
        lastSyncedAt: new Date().toISOString(),
        extractedSkills: ['Go', 'Node.js', 'PostgreSQL', 'Redis', 'Kafka', 'Distributed Systems'],
        experienceLevel: 'SENIOR',
        visaAllowed: true
      }
    ];

    // Seed Matches for Alex Chen
    this.matches = [
      {
        id: 'match_figma',
        userId,
        jobPostingId: 'job_figma_1',
        createdAt: new Date().toISOString(),
        isStarred: true,
        isDismissed: false,
        matchResult: {
          overallScore: 96,
          hardFilterPassed: true,
          skillsScore: 98,
          experienceScore: 95,
          domainScore: 94,
          matchedSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
          missingSkills: ['WebSockets / Canvas Low-Level Caching (Basic)'],
          whyMatchReason: 'Exceptional alignment with Figma\'s collaboration engineering stack. Candidate\'s track record at Veloce Data Systems (Next.js 14 telemetry & high-throughput event streaming) and prior collaborative editor work directly maps to Figma\'s core requirements.',
          potentialConcerns: 'Figma canvas engine uses specialized WebAssembly/C++ modules for vector graphics, but role focuses on web collaboration tier where candidate has proven excellence.',
          suggestedAngle: 'Highlight real-time event streaming pipeline (15M+ events/day) and collaborative editor project in resume emphasis.'
        }
      },
      {
        id: 'match_stripe',
        userId,
        jobPostingId: 'job_stripe_1',
        createdAt: new Date().toISOString(),
        isStarred: false,
        isDismissed: false,
        matchResult: {
          overallScore: 92,
          hardFilterPassed: true,
          skillsScore: 94,
          experienceScore: 92,
          domainScore: 90,
          matchedSkills: ['Go', 'Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
          missingSkills: ['Kafka at Tier-1 scale'],
          whyMatchReason: 'Strong backend infrastructure match. Candidate demonstrates deep PostgreSQL index tuning, Go distributed vector cache project, and automated CI/CD pipelines.',
          potentialConcerns: 'Stripe infrastructure prioritizes massive scale fault tolerance.',
          suggestedAngle: 'Lead with the Go Distributed Vector Cache open source project and cloud cost reduction achievements.'
        }
      },
      {
        id: 'match_linear',
        userId,
        jobPostingId: 'job_linear_1',
        createdAt: new Date().toISOString(),
        isStarred: true,
        isDismissed: false,
        matchResult: {
          overallScore: 94,
          hardFilterPassed: true,
          skillsScore: 96,
          experienceScore: 93,
          domainScore: 93,
          matchedSkills: ['TypeScript', 'React', 'Tailwind CSS', 'Node.js', 'GraphQL'],
          missingSkills: [],
          whyMatchReason: 'Near-perfect stack match with Linear\'s high-craft web philosophy. Proven experience with React, TypeScript, Tailwind, and offline/cache architecture.',
          suggestedAngle: 'Focus on front-end performance, fluid UI responsiveness, and Clean Code principles.'
        }
      },
      {
        id: 'match_anthropic',
        userId,
        jobPostingId: 'job_anthropic_1',
        createdAt: new Date().toISOString(),
        isStarred: false,
        isDismissed: false,
        matchResult: {
          overallScore: 89,
          hardFilterPassed: true,
          skillsScore: 90,
          experienceScore: 88,
          domainScore: 89,
          matchedSkills: ['TypeScript', 'React', 'Node.js', 'Go', 'PostgreSQL', 'Redis'],
          missingSkills: ['Python ML frameworks'],
          whyMatchReason: 'Strong alignment with Anthropic AI Platform tooling & human-in-the-loop developer interfaces.',
          potentialConcerns: 'Requires hybrid presence in San Francisco (matches candidate preference).',
          suggestedAngle: 'Emphasize safety gate automation engine and distributed vector search cache.'
        }
      }
    ];

    // Seed Tailored Resumes (Zero-Hallucination verified)
    this.resumes = [
      {
        id: 'resume_figma_alex',
        userId,
        jobPostingId: 'job_figma_1',
        createdAt: new Date().toISOString(),
        content: {
          title: 'Alex Chen - Full Stack Software Engineer (Figma Tailored)',
          targetRole: 'Full Stack Software Engineer - Collaboration Tools',
          targetCompany: 'Figma',
          summary: 'Product-minded Software Engineer with 4+ years specializing in real-time collaborative web applications, high-throughput Node.js microservices, and modern React/TypeScript architectures. Experienced in scaling event streaming pipelines to 15M+ daily events and building low-latency distributed systems.',
          skillsSection: [
            {
              category: 'Languages & Core',
              skills: ['TypeScript', 'JavaScript (ESNext)', 'Go (Golang)', 'SQL', 'HTML5/CSS3']
            },
            {
              category: 'Frontend & UI',
              skills: ['React', 'Next.js 14', 'Tailwind CSS', 'State Machines', 'WebSockets', 'GraphQL']
            },
            {
              category: 'Backend & Infrastructure',
              skills: ['Node.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS (ECS, S3, RDS)', 'CI/CD']
            }
          ],
          experienceSection: [
            {
              company: 'Veloce Data Systems',
              role: 'Senior Software Engineer',
              location: 'San Francisco, CA',
              period: '2023 - Present',
              bullets: [
                'Architected real-time event streaming pipeline processing 15M+ events/day using Node.js, Redis Streams, and PostgreSQL, reducing latency by 42%.',
                'Engineered Next.js 14 telemetry dashboard with server-side streaming and WebSockets for 40,000+ active enterprise users.',
                'Spearheaded migration from legacy monolithic endpoints to structured GraphQL and gRPC microservices, cutting cloud egress costs by $18k/month.'
              ]
            },
            {
              company: 'Aether Cloud Software',
              role: 'Software Engineer II',
              location: 'San Francisco, CA',
              period: '2021 - 2022',
              bullets: [
                'Built real-time collaborative editor with operational transformation and CRDTs using React, TypeScript, and Node.js.',
                'Optimized relational database queries and indices in PostgreSQL, eliminating slow-query bottlenecks during peak loads.',
                'Created automated CI/CD deployment pipelines using GitHub Actions and AWS ECS with zero-downtime blue/green rollouts.'
              ]
            }
          ],
          projectsSection: [
            {
              title: 'Nexus Realtime Form Automation Engine',
              role: 'Creator & Maintainer',
              technologies: ['TypeScript', 'Playwright', 'Node.js'],
              bullets: [
                'Built deterministic, accessible automation engine achieving 98.4% fill accuracy across complex multi-step web forms.',
                'Engineered safety gate middleware detecting ambiguous inputs and sensitive questions for user verification.'
              ],
              link: 'https://github.com/alexchen-dev/nexus-automator'
            },
            {
              title: 'Distributed Vector Search Cache',
              role: 'Creator',
              technologies: ['Go', 'TypeScript', 'Redis', 'Docker'],
              bullets: [
                'Implemented sub-5ms cosine similarity and L2 distance lookups over 2M embedding vectors with Prometheus instrumentation.'
              ],
              link: 'https://github.com/alexchen-dev/vector-cache'
            }
          ],
          educationSection: [
            {
              institution: 'University of California, Berkeley',
              degree: 'B.S. in Computer Science (GPA: 3.82 / 4.0)',
              period: '2017 - 2021',
              highlights: ['Dean\'s Honors List', 'TA for CS 162 Operating Systems']
            }
          ],
          isVerifiedTruthful: true,
          verificationReport: {
            verifiedSkillsCount: 14,
            flaggedClaimsCount: 0,
            auditItems: [
              { claim: '15M+ events/day Redis Streams', sourceNode: 'Experience: Veloce Data Systems', verified: true },
              { claim: 'Next.js 14 telemetry dashboard', sourceNode: 'Experience: Veloce Data Systems', verified: true },
              { claim: 'Collaborative editor with CRDTs', sourceNode: 'Experience: Aether Cloud Software', verified: true },
              { claim: 'UC Berkeley B.S. in Computer Science', sourceNode: 'Education: UC Berkeley', verified: true }
            ]
          }
        }
      }
    ];

    // Seed Applications across state machine
    this.applications = [
      {
        id: 'app_figma_1',
        userId,
        jobPostingId: 'job_figma_1',
        tailoredResumeId: 'resume_figma_alex',
        status: 'WAITING_FOR_APPROVAL',
        automationEngine: 'PLAYWRIGHT',
        formUrl: 'https://boards.greenhouse.io/figma/jobs/5489201#app',
        hasSensitiveQuestions: true,
        requiresHumanInput: true,
        humanReviewNotes: 'Found 2 custom questions requiring explicit candidate declaration: "Expected Annual Base Compensation ($)" and "Are you legally authorized to work in the United States without sponsorship?"',
        fields: [
          {
            fieldKey: 'first_name',
            fieldLabel: 'First Name',
            fieldType: 'text',
            fieldValue: 'Raihan',
            isSensitive: false,
            isFilledByAI: true,
            requiresUserReview: false,
            confidenceScore: 1.0
          },
          {
            fieldKey: 'last_name',
            fieldLabel: 'Last Name',
            fieldType: 'text',
            fieldValue: 'Molla',
            isSensitive: false,
            isFilledByAI: true,
            requiresUserReview: false,
            confidenceScore: 1.0
          },
          {
            fieldKey: 'email',
            fieldLabel: 'Email Address',
            fieldType: 'text',
            fieldValue: 'raihanmolla9903@gmail.com',
            isSensitive: false,
            isFilledByAI: true,
            requiresUserReview: false,
            confidenceScore: 1.0
          },
          {
            fieldKey: 'phone',
            fieldLabel: 'Phone Number',
            fieldType: 'text',
            fieldValue: '8585844758',
            isSensitive: false,
            isFilledByAI: true,
            requiresUserReview: false,
            confidenceScore: 1.0
          },
          {
            fieldKey: 'resume_file',
            fieldLabel: 'Resume Attachment',
            fieldType: 'file',
            fieldValue: 'Raihan_Molla_Resume.pdf',
            isSensitive: false,
            isFilledByAI: true,
            requiresUserReview: false,
            confidenceScore: 1.0
          },
          {
            fieldKey: 'linkedin_url',
            fieldLabel: 'LinkedIn Profile URL',
            fieldType: 'text',
            fieldValue: 'https://linkedin.com/in/raihan-molla',
            isSensitive: false,
            isFilledByAI: true,
            requiresUserReview: false,
            confidenceScore: 1.0
          },
          {
            fieldKey: 'github_url',
            fieldLabel: 'GitHub / Website URL',
            fieldType: 'text',
            fieldValue: 'https://github.com/raihan-codes',
            isSensitive: false,
            isFilledByAI: true,
            requiresUserReview: false,
            confidenceScore: 1.0
          },
          {
            fieldKey: 'location',
            fieldLabel: 'Location',
            fieldType: 'text',
            fieldValue: 'Kolkata, West Bengal, India',
            isSensitive: false,
            isFilledByAI: true,
            requiresUserReview: false,
            confidenceScore: 1.0
          },
          {
            fieldKey: 'salary_expectation',
            fieldLabel: 'Expected Salary / CTC',
            fieldType: 'text',
            fieldValue: '₹24 LPA',
            isSensitive: true,
            isFilledByAI: true,
            requiresUserReview: true,
            confidenceScore: 0.88,
            validationError: 'Please confirm this matches your target compensation.'
          },
          {
            fieldKey: 'work_authorization',
            fieldLabel: 'Are you authorized to work without requiring visa sponsorship?',
            fieldType: 'select',
            fieldValue: 'Indian Citizen (No Sponsorship Required)',
            isSensitive: true,
            isFilledByAI: true,
            requiresUserReview: true,
            confidenceScore: 0.95,
            options: ['Indian Citizen (No Sponsorship Required)', 'Authorized to Work', 'Requires Sponsorship']
          }
        ],
        stage: 'SUBMITTED',
        screenshotSnapshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
        createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'app_linear_1',
        userId,
        jobPostingId: 'job_linear_1',
        status: 'RESUME_READY',
        automationEngine: 'PLAYWRIGHT',
        hasSensitiveQuestions: false,
        requiresHumanInput: false,
        fields: [],
        stage: 'SUBMITTED',
        createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'app_stripe_1',
        userId,
        jobPostingId: 'job_stripe_1',
        status: 'TRACKING',
        automationEngine: 'PLAYWRIGHT',
        hasSensitiveQuestions: false,
        requiresHumanInput: false,
        submittedAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
        stage: 'SCREENING',
        notes: 'Application submitted and verified via Greenhouse confirmation email.',
        fields: [],
        createdAt: new Date(Date.now() - 3600 * 1000 * 50).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Seed Notifications
    this.notifications = [
      {
        id: 'notif_1',
        userId,
        type: 'APPROVAL_REQUIRED',
        title: 'Action Required: Figma Application Ready for Review',
        message: 'Playwright completed pre-filling the Greenhouse form for Figma. 2 sensitive questions (salary & visa) require your review before final submission.',
        actionUrl: '/applications/app_figma_1',
        isRead: false,
        createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString()
      },
      {
        id: 'notif_2',
        userId,
        type: 'JOB_DISCOVERED',
        title: '96% Match Found: Full Stack Engineer at Figma',
        message: 'Discovered high-affinity role from Greenhouse. Real-time collaboration requirements match your profile.',
        actionUrl: '/jobs/job_figma_1',
        isRead: false,
        createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString()
      },
      {
        id: 'notif_3',
        userId,
        type: 'APPLICATION_SUBMITTED',
        title: 'Stripe Application Submitted',
        message: 'Successfully submitted and tracked: Software Engineer - Infrastructure.',
        actionUrl: '/applications/app_stripe_1',
        isRead: true,
        createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString()
      }
    ];

    // Seed Audit Log
    this.auditLogs = [
      {
        id: 'audit_1',
        tenantId,
        userId,
        action: 'JOB_INGESTION_SYNC',
        resourceType: 'JobPosting',
        resourceId: 'job_figma_1',
        details: { source: 'GREENHOUSE', company: 'Figma', count: 1 },
        createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString()
      },
      {
        id: 'audit_2',
        tenantId,
        userId,
        action: 'RESUME_TRUTHFULNESS_VERIFIED',
        resourceType: 'TailoredResume',
        resourceId: 'resume_figma_alex',
        details: { verifiedSkills: 14, unverifiedClaims: 0, status: 'PASSED' },
        createdAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString()
      },
      {
        id: 'audit_3',
        tenantId,
        userId,
        action: 'HUMAN_APPROVAL_GATED',
        resourceType: 'Application',
        resourceId: 'app_figma_1',
        details: { sensitiveFields: ['salary_expectation', 'work_authorization'] },
        createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString()
      }
    ];
  }
}

export const db = StoreService.getInstance();
