# NEXUS Studio — Frontend Codebase

This document compiles the complete frontend source code for the **NEXUS Studio** website application.

## Table of Contents

- [package.json](#packagejson)
- [vite.config.js](#viteconfigjs)
- [tailwind.config.js](#tailwindconfigjs)
- [postcss.config.js](#postcssconfigjs)
- [index.html](#indexhtml)
- [src/main.jsx](#srcmainjsx)
- [src/App.jsx](#srcappjsx)
- [src/index.css](#srcindexcss)
- [src/App.css](#srcappcss)
- [src/data/content.js](#srcdatacontentjs)
- [src/utils/animations.js](#srcutilsanimationsjs)
- [src/hooks/useScrollProgress.js](#srchooksusescrollprogressjs)
- [src/hooks/useInView.js](#srchooksuseinviewjs)
- [src/hooks/useMousePosition.js](#srchooksusemousepositionjs)
- [src/components/layout/Navbar.jsx](#srccomponentslayoutnavbarjsx)
- [src/components/layout/Footer.jsx](#srccomponentslayoutfooterjsx)
- [src/components/ui/CustomCursor.jsx](#srccomponentsuicustomcursorjsx)
- [src/components/ui/MagneticButton.jsx](#srccomponentsuimagneticbuttonjsx)
- [src/components/ui/MarqueeText.jsx](#srccomponentsuimarqueetextjsx)
- [src/components/ui/AnimatedCounter.jsx](#srccomponentsuianimatedcounterjsx)
- [src/components/ui/ScrollProgressBar.jsx](#srccomponentsuiscrollprogressbarjsx)
- [src/components/ui/ScrollReveal.jsx](#srccomponentsuiscrollrevealjsx)
- [src/components/ui/ParallaxImage.jsx](#srccomponentsuiparallaximagejsx)
- [src/components/ui/NoiseBg.jsx](#srccomponentsuinoisebgjsx)
- [src/components/sections/Hero.jsx](#srccomponentssectionsherojsx)
- [src/components/sections/LogoCloud.jsx](#srccomponentssectionslogocloudjsx)
- [src/components/sections/StorySection.jsx](#srccomponentssectionsstorysectionjsx)
- [src/components/sections/ServicesGrid.jsx](#srccomponentssectionsservicesgridjsx)
- [src/components/sections/ProcessTimeline.jsx](#srccomponentssectionsprocesstimelinejsx)
- [src/components/sections/CaseStudies.jsx](#srccomponentssectionscasestudiesjsx)
- [src/components/sections/StatsSection.jsx](#srccomponentssectionsstatssectionjsx)
- [src/components/sections/TechStack.jsx](#srccomponentssectionstechstackjsx)
- [src/components/sections/PricingSection.jsx](#srccomponentssectionspricingsectionjsx)
- [src/components/sections/TestimonialsCarousel.jsx](#srccomponentssectionstestimonialscarouseljsx)
- [src/components/sections/TeamSection.jsx](#srccomponentssectionsteamsectionjsx)
- [src/components/sections/FAQSection.jsx](#srccomponentssectionsfaqsectionjsx)
- [src/components/sections/BlogPreview.jsx](#srccomponentssectionsblogpreviewjsx)
- [src/components/sections/CTASection.jsx](#srccomponentssectionsctasectionjsx)

---

## `package.json`
<a id="packagejson"></a>

```json
{
  "name": "nexus-studio",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-tooltip": "^1.2.8",
    "clsx": "^2.1.1",
    "framer-motion": "^12.38.0",
    "lucide-react": "^1.7.0",
    "react": "^19.2.4",
    "react-countup": "^6.5.3",
    "react-dom": "^19.2.4",
    "react-intersection-observer": "^10.0.3",
    "react-router-dom": "^7.13.2",
    "tailwind-merge": "^3.5.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.4",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.4.27",
    "eslint": "^9.39.4",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.4.0",
    "postcss": "^8.5.8",
    "puppeteer": "^24.40.0",
    "tailwindcss": "^3.4.19",
    "vite": "^8.0.1"
  }
}

```

## `vite.config.js`
<a id="viteconfigjs"></a>

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

```

## `tailwind.config.js`
<a id="tailwindconfigjs"></a>

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#04040a',
          900: '#080812',
          800: '#0d0d1f',
          700: '#12122e',
          600: '#1a1a3e',
        },
        signal: {
          DEFAULT: '#e8ff47',   // electric lime — primary accent
          dim: '#b8cc38',
        },
        ember: {
          DEFAULT: '#ff6b35',   // warm orange — secondary accent
          dim: '#cc5529',
        },
        mist: {
          900: '#9898b8',
          700: '#c4c4d8',
          500: '#dcdcec',
          100: '#f0f0f8',
        },
      },
      fontFamily: {
        display: ['"Clash Display"', 'sans-serif'],
        body: ['"Cabinet Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        '10xl': ['10rem', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        '9xl':  ['8rem',  { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        '8xl':  ['6rem',  { lineHeight: '0.92', letterSpacing: '-0.03em' }],
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee 25s linear infinite reverse',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
      },
    },
  },
}

```

## `postcss.config.js`
<a id="postcssconfigjs"></a>

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

```

## `index.html`
<a id="indexhtml"></a>

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NEXUS Studio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700,800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

## `src/main.jsx`
<a id="srcmainjsx"></a>

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

## `src/App.jsx`
<a id="srcappjsx"></a>

```jsx
import { MotionConfig } from 'framer-motion'

import CustomCursor from './components/ui/CustomCursor'
import ScrollProgressBar from './components/ui/ScrollProgressBar'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import LogoCloud from './components/sections/LogoCloud'
import StorySection from './components/sections/StorySection'
import ServicesGrid from './components/sections/ServicesGrid'
import ProcessTimeline from './components/sections/ProcessTimeline'
import CaseStudies from './components/sections/CaseStudies'
import StatsSection from './components/sections/StatsSection'
import TeamSection from './components/sections/TeamSection'
import TestimonialsCarousel from './components/sections/TestimonialsCarousel'
import TechStack from './components/sections/TechStack'
import PricingSection from './components/sections/PricingSection'
import FAQSection from './components/sections/FAQSection'
import BlogPreview from './components/sections/BlogPreview'
import CTASection from './components/sections/CTASection'

export default function App() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative bg-ink-950 font-body text-mist-100 overflow-x-hidden selection:bg-signal selection:text-ink-950">
        <CustomCursor />
        <ScrollProgressBar />
        <Navbar />
        
        <main>
          <Hero />
          <LogoCloud />
          <StorySection />
          <ServicesGrid />
          <ProcessTimeline />
          <CaseStudies />
          <StatsSection />
          <TeamSection />
          <TestimonialsCarousel />
          <TechStack />
          <PricingSection />
          <FAQSection />
          <BlogPreview />
          <CTASection />
        </main>
        
        <Footer />
      </div>
    </MotionConfig>
  )
}

```

## `src/index.css`
<a id="srcindexcss"></a>

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --cursor-x: 0px;
    --cursor-y: 0px;
  }

  * {
    cursor: none !important;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-ink-950 text-mist-100 font-body overflow-x-hidden;
    -webkit-font-smoothing: antialiased;
  }

  ::selection {
    @apply bg-signal text-ink-950;
  }
  
  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { @apply bg-ink-900; }
  ::-webkit-scrollbar-thumb { @apply bg-signal rounded-full; }
}

@layer utilities {
  .text-balance { text-wrap: balance; }
  
  .grain {
    position: relative;
  }
  .grain::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1;
  }

  .clip-diagonal {
    clip-path: polygon(0 0, 100% 0, 100% 92%, 0 100%);
  }

  .text-stroke {
    -webkit-text-stroke: 1px currentColor;
    color: transparent;
  }
}

```

## `src/App.css`
<a id="srcappcss"></a>

```css
.counter {
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
  color: var(--accent);
  background: var(--accent-bg);
  border: 2px solid transparent;
  transition: border-color 0.3s;
  margin-bottom: 24px;

  &:hover {
    border-color: var(--accent-border);
  }
  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}

.hero {
  position: relative;

  .base,
  .framework,
  .vite {
    inset-inline: 0;
    margin: 0 auto;
  }

  .base {
    width: 170px;
    position: relative;
    z-index: 0;
  }

  .framework,
  .vite {
    position: absolute;
  }

  .framework {
    z-index: 1;
    top: 34px;
    height: 28px;
    transform: perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg)
      scale(1.4);
  }

  .vite {
    z-index: 0;
    top: 107px;
    height: 26px;
    width: auto;
    transform: perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg)
      scale(0.8);
  }
}

#center {
  display: flex;
  flex-direction: column;
  gap: 25px;
  place-content: center;
  place-items: center;
  flex-grow: 1;

  @media (max-width: 1024px) {
    padding: 32px 20px 24px;
    gap: 18px;
  }
}

#next-steps {
  display: flex;
  border-top: 1px solid var(--border);
  text-align: left;

  & > div {
    flex: 1 1 0;
    padding: 32px;
    @media (max-width: 1024px) {
      padding: 24px 20px;
    }
  }

  .icon {
    margin-bottom: 16px;
    width: 22px;
    height: 22px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
}

#docs {
  border-right: 1px solid var(--border);

  @media (max-width: 1024px) {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}

#next-steps ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 8px;
  margin: 32px 0 0;

  .logo {
    height: 18px;
  }

  a {
    color: var(--text-h);
    font-size: 16px;
    border-radius: 6px;
    background: var(--social-bg);
    display: flex;
    padding: 6px 12px;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: var(--shadow);
    }
    .button-icon {
      height: 18px;
      width: 18px;
    }
  }

  @media (max-width: 1024px) {
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;

    li {
      flex: 1 1 calc(50% - 8px);
    }

    a {
      width: 100%;
      justify-content: center;
      box-sizing: border-box;
    }
  }
}

#spacer {
  height: 88px;
  border-top: 1px solid var(--border);
  @media (max-width: 1024px) {
    height: 48px;
  }
}

.ticks {
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -4.5px;
    border: 5px solid transparent;
  }

  &::before {
    left: 0;
    border-left-color: var(--border);
  }
  &::after {
    right: 0;
    border-right-color: var(--border);
  }
}

```

## `src/data/content.js`
<a id="srcdatacontentjs"></a>

```javascript
export const services = [
  { id: 1, number: '01', icon: 'Compass', title: 'Strategy & Consulting', desc: 'We map your business goals to digital outcomes with ruthless clarity.', tags: ['Research', 'Roadmap', 'OKRs'], span: 'col-span-2' },
  { id: 2, number: '02', icon: 'Paintbrush', title: 'UI/UX Design', desc: 'Interfaces that feel inevitable — like they were always meant to exist.', tags: ['Figma', 'Design Systems', 'Prototyping'], span: 'col-span-1' },
  { id: 3, number: '03', icon: 'Code2', title: 'Web Development', desc: 'We build fast, accessible, and scalable web applications.', tags: ['React', 'Next.js', 'Node.js'], span: 'col-span-1' },
  { id: 4, number: '04', icon: 'Smartphone', title: 'Mobile Apps', desc: 'Native and cross-platform apps your users will actually love using.', tags: ['React Native', 'iOS', 'Android'], span: 'col-span-2' },
  { id: 5, number: '05', icon: 'Layers', title: 'Brand Identity', desc: 'Your brand is a story. We make sure it is one worth telling.', tags: ['Logo', 'Guidelines', 'Assets'], span: 'col-span-1' },
  { id: 6, number: '06', icon: 'TrendingUp', title: 'SEO & Growth', desc: 'Organic strategies that compound over time like a good investment.', tags: ['SEO', 'Analytics', 'CRO'], span: 'col-span-1' },
  { id: 7, number: '07', icon: 'Cpu', title: 'AI Integration', desc: 'We embed intelligence into your product — not as a feature, but as a foundation.', tags: ['OpenAI', 'LangChain', 'Vector DBs', 'Fine-tuning'], span: 'col-span-3' },
  { id: 8, number: '08', icon: 'Shield', title: 'Maintenance & Support', desc: 'We do not ghost after launch. Your success is our reputation.', tags: ['SLA', 'Monitoring', 'Updates'], span: 'col-span-1' },
]

export const caseStudies = [
  { id: 1, company: 'Vanta Finance', industry: 'FinTech', result: '3.2× Conversion', desc: 'Redesigned their onboarding flow from 14 steps to 3. Conversion tripled in 6 weeks.', services: ['Strategy', 'Design', 'React'], accentColor: 'from-ember/20 to-transparent' },
  { id: 2, company: 'Bloom Health', industry: 'HealthTech', result: '$4M Series A', desc: 'Built the investor-facing brand and product demo that closed their seed round.', services: ['Branding', 'Web', 'Pitch Deck'], accentColor: 'from-green-900/40 to-transparent' },
  { id: 3, company: 'Orbit SaaS', industry: 'B2B SaaS', result: 'NPS 34 → 71', desc: 'Redesigned the core dashboard with AI-assisted insights. Users finally understood their data.', services: ['AI', 'Design', 'React'], accentColor: 'from-signal/10 to-transparent' },
  { id: 4, company: 'Crest Retail', industry: 'E-commerce', result: '₹2.4Cr / 90 days', desc: 'Shopify rebuild with conversion-first design. Revenue target hit in under 3 months.', services: ['Shopify', 'Growth', 'SEO'], accentColor: 'from-purple-900/40 to-transparent' },
]

export const team = [
  { name: 'Ritik Singh', role: 'Founder & Strategy', quote: 'Good strategy is just clear thinking made visible.', colors: ['#e8ff47', '#080812'] },
  { name: 'Deepak Kanojiya', role: 'Creative Director', quote: 'Design that doesn\'t solve a problem is just decoration.', colors: ['#ff6b35', '#080812'] },
  { name: 'Mayank Somvanshi', role: 'Lead Engineer', quote: 'Code is poetry. Ship it like it is.', colors: ['#a78bfa', '#080812'] },
  { name: 'Nand Kishore Soni', role: 'Growth & Marketing', quote: 'Growth is a system, not a hack.', colors: ['#34d399', '#080812'] },
]

export const faqs = [
  { q: 'How long does a typical project take?', a: 'Most projects take 3–8 weeks depending on scope. We\'ll give you a precise timeline in our discovery call. We don\'t pad timelines — we hit them.' },
  { q: 'Do you work with international clients?', a: 'Yes. About 30% of our clients are outside India. We work async-first with tools like Linear, Figma, and Loom — timezone is rarely a barrier.' },
  { q: 'What\'s your revision policy?', a: 'Unlimited revisions within scope. We\'ve never had a client feel they ran out of revisions, because we align on direction early.' },
  { q: 'Do you offer payment plans?', a: 'Yes. Typically 40% upfront, 30% at midpoint, 30% on delivery. For larger engagements we can structure monthly retainers.' },
  { q: 'Can I hire just for design, or development separately?', a: 'Absolutely. Many clients start with design-only, then bring us in for development later. Others need just a technical build from existing designs.' },
  { q: 'Do you sign NDAs?', a: 'Yes, always. We treat client information with the same care we give our own.' },
  { q: 'What happens after the project is delivered?', a: 'All projects include 30 days of post-launch support at no extra charge. After that, we offer monthly retainer plans starting at ₹25,000/month.' },
  { q: 'How do you handle urgent or rush projects?', a: 'We have a rush lane for time-sensitive projects (1.35× standard rate). Talk to us — we\'ve launched products in 7 days when the stakes demanded it.' },
]

```

## `src/utils/animations.js`
<a id="srcutilsanimationsjs"></a>

```javascript
export const fadeUpVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
}

export const scaleUpVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export const staggerContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

```

## `src/hooks/useScrollProgress.js`
<a id="srchooksusescrollprogressjs"></a>

```javascript

```

## `src/hooks/useInView.js`
<a id="srchooksuseinviewjs"></a>

```javascript

```

## `src/hooks/useMousePosition.js`
<a id="srchooksusemousepositionjs"></a>

```javascript

```

## `src/components/layout/Navbar.jsx`
<a id="srccomponentslayoutnavbarjsx"></a>

```jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import MagneticButton from '../ui/MagneticButton'
import { Menu, X, Camera as Instagram, Briefcase as Linkedin, MessageCircle as Twitter, Palette as Dribbble } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 80)
  })

  const navLinks = ['Work', 'Services', 'Process', 'Team', 'Blog', 'Contact']
  const socials = [<Linkedin key="ln"/>, <Twitter key="tw"/>, <Instagram key="ig"/>, <Dribbble key="dr"/>]

  return (
    <>
      <header 
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? 'backdrop-blur-xl bg-ink-950/80 border-b border-white/5 py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          
          <div className="flex items-center gap-2 cursor-pointer z-50">
            <span className="font-display text-2xl font-bold tracking-tight text-white">NEXUS</span>
            <div className="w-2 h-2 rounded-full bg-signal animate-pulse-slow"></div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link} 
                href={`#${link.toLowerCase()}`}
                className="font-body text-sm text-mist-900 hover:text-white transition-colors relative group"
                data-cursor="hover"
              >
                {link}
                <span className="absolute -bottom-1 left-0 h-[1px] bg-signal w-0 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <MagneticButton 
              className="px-6 py-2.5 rounded-full border border-ember text-ember text-sm hover:bg-ember hover:text-white transition-colors"
              data-cursor="hover"
            >
              Start a Project
            </MagneticButton>
          </div>

          <button 
            className="md:hidden z-50 text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink-900 z-40 flex flex-col justify-center px-6"
          >
            <nav className="flex flex-col gap-6 mt-20">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  initial={{ x: -60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.07, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="font-display text-6xl text-white hover:text-signal transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link}
                </motion.a>
              ))}
            </nav>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.5 }}
              className="absolute bottom-12 left-6 flex gap-6 text-mist-900"
            >
              {socials.map((icon, i) => (
                <a key={i} href="#" className="hover:text-white">{icon}</a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

```

## `src/components/layout/Footer.jsx`
<a id="srccomponentslayoutfooterjsx"></a>

```jsx
import { Briefcase as Linkedin, MessageCircle as Twitter, Camera as Instagram, Palette as Dribbble } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-ink-950 border-t border-white/5 pt-24 pb-8" id="contact">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-24">
          
          {/* Col 1 */}
          <div className="col-span-1 border-r-0 md:border-r md:border-white/5 pr-8">
            <div className="group inline-block mb-6 relative" data-cursor="hover">
              <span className="font-display text-3xl font-bold tracking-tight text-white group-hover:text-signal transition-colors duration-500">NEXUS</span>
              <div className="absolute top-1/2 left-full ml-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 text-mist-900 text-xs text-nowrap">
                Design & Engineering
              </div>
            </div>
            <p className="text-mist-900 text-sm mb-8 leading-relaxed max-w-xs">
              We don't build products.<br/>We build futures.
            </p>
            <div className="flex gap-4 text-mist-900">
              <a href="#" className="hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-white/5"><Linkedin size={20} /></a>
              <a href="#" className="hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"><Twitter size={20} /></a>
              <a href="#" className="hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"><Instagram size={20} /></a>
              <a href="#" className="hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"><Dribbble size={20} /></a>
            </div>
          </div>

          {/* Col 2 */}
          <div className="col-span-1">
            <h4 className="font-mono text-xs text-signal uppercase tracking-widest mb-6">Services</h4>
            <ul className="flex flex-col gap-4 text-sm text-mist-500">
              <li><a href="#" className="hover:text-white transition-colors" data-cursor="text">Strategy & Consulting</a></li>
              <li><a href="#" className="hover:text-white transition-colors" data-cursor="text">UI/UX Design</a></li>
              <li><a href="#" className="hover:text-white transition-colors" data-cursor="text">Web Development</a></li>
              <li><a href="#" className="hover:text-white transition-colors" data-cursor="text">Mobile Apps</a></li>
              <li><a href="#" className="hover:text-white transition-colors" data-cursor="text">AI Integration</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="col-span-1">
            <h4 className="font-mono text-xs text-signal uppercase tracking-widest mb-6">Company</h4>
            <ul className="flex flex-col gap-4 text-sm text-mist-500">
              <li><a href="#" className="hover:text-white transition-colors" data-cursor="text">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors" data-cursor="text">Our Process</a></li>
              <li><a href="#" className="hover:text-white transition-colors" data-cursor="text">The Team</a></li>
              <li><a href="#" className="hover:text-white transition-colors" data-cursor="text">Blog & Insights</a></li>
              <li><a href="#" className="hover:text-white transition-colors" data-cursor="text">Careers</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="col-span-1">
            <h4 className="font-mono text-xs text-signal uppercase tracking-widest mb-6">Contact</h4>
            <div className="flex flex-col gap-4 text-sm text-mist-500">
              <a href="mailto:hello@nexus.studio" className="hover:text-white transition-colors" data-cursor="hover">hello@nexus.studio</a>
              <a href="tel:+919876543210" className="hover:text-white transition-colors" data-cursor="hover">+91 98765 43210</a>
              <p className="mt-4 text-mist-700 leading-relaxed">
                100ft Road, Indiranagar<br/>
                Bangalore, India 560038
              </p>
              <a href="#" className="text-signal hover:underline mt-2 inline-block" data-cursor="hover">View on Map →</a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-mist-900">
          <p>© <span title="Our founding year — and still going strong." className="cursor-help hover:text-signal transition-colors">2025</span> NEXUS Studio. All rights reserved.</p>
          <p>Designed with <span className="text-ember">♥</span> in Bangalore</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-white">Terms</a>
            <span>·</span>
            <a href="#" className="hover:text-white">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

```

## `src/components/ui/CustomCursor.jsx`
<a id="srccomponentsuicustomcursorjsx"></a>

```jsx
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState('default') // 'default'|'hover'|'text'|'view'
  
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  
  // Outer trail
  const trailX = useSpring(mouseX, { stiffness: 150, damping: 25 })
  const trailY = useSpring(mouseY, { stiffness: 150, damping: 25 })
  
  // Inner dot
  const springX = useSpring(mouseX, { stiffness: 500, damping: 40 })
  const springY = useSpring(mouseY, { stiffness: 500, damping: 40 })

  useEffect(() => {
    const onMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [mouseX, mouseY])

  useEffect(() => {
    const handleMouseOver = (e) => {
      const el = e.target.closest('[data-cursor]')
      if (el) {
        setCursorState(el.getAttribute('data-cursor'))
      }
    }
    const handleMouseOut = (e) => {
      // Only reset if we are not moving into another data-cursor element
      if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-cursor]')) {
        return;
      }
      setCursorState('default')
    }
    
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    
    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

  // Variants for the inner tracker (usually text or specific shape)
  const variants = {
    default: {
      width: 12,
      height: 12,
      x: "-50%",
      y: "-50%",
      borderRadius: "50%",
      backgroundColor: "#ffffff",
      opacity: 1
    },
    hover: {
      width: 48,
      height: 48,
      x: "-50%",
      y: "-50%",
      borderRadius: "50%",
      backgroundColor: "#ffffff",
      opacity: 1
    },
    text: {
      width: 4,
      height: 24,
      x: "-2px",
      y: "-12px",
      borderRadius: "2px",
      backgroundColor: "#ffffff",
      opacity: 1
    },
    view: {
      width: 64,
      height: 64,
      x: "-50%",
      y: "-50%",
      borderRadius: "50%",
      backgroundColor: "transparent",
      border: "1px solid #ffffff",
      opacity: 1
    }
  }

  // Define trailing ring states
  const trailingVariants = {
    default: {
      width: 32,
      height: 32,
      opacity: 0.3,
      border: "1px solid #ffffff",
      backgroundColor: "transparent"
    },
    hover: { opacity: 0 },
    text: { opacity: 0 },
    view: { opacity: 0 }
  }

  // Using a portal or just fixed positioning
  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none flex justify-center items-center text-ink-950 font-mono text-[10px] tracking-widest font-bold overflow-hidden"
        style={{
          x: springX,
          y: springY,
          mixBlendMode: 'difference'
        }}
        variants={variants}
        animate={cursorState}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      >
        {cursorState === 'hover' && "CLICK"}
        {cursorState === 'view' && "VIEW"}
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full flex justify-center items-center"
        style={{
          x: trailX,
          y: trailY,
          xOffset: "-50%",
          yOffset: "-50%",
          transform: "translate(-50%, -50%)",
          mixBlendMode: 'difference'
        }}
        variants={trailingVariants}
        animate={cursorState}
        transition={{ duration: 0.2 }}
      />
    </>
  )
}

```

## `src/components/ui/MagneticButton.jsx`
<a id="srccomponentsuimagneticbuttonjsx"></a>

```jsx
import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function MagneticButton({ children, className, ...props }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springX = useSpring(x, { stiffness: 200, damping: 15 })
  const springY = useSpring(y, { stiffness: 200, damping: 15 })

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.35)
    y.set((e.clientY - centerY) * 0.35)
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  )
}

```

## `src/components/ui/MarqueeText.jsx`
<a id="srccomponentsuimarqueetextjsx"></a>

```jsx
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export default function MarqueeText({ items, speed = 'slow', direction = 'forward' }) {
  // We'll rely on the Tailwind config animations for marquee
  const animationClass = direction === 'reverse' ? 'animate-marquee-reverse' : 'animate-marquee'
  
  return (
    <div className="flex overflow-hidden relative w-full">
      <div className={twMerge("flex whitespace-nowrap", animationClass)}>
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className="mx-8">{item}</span>
            <span className="text-signal/30 text-sm">◆</span>
          </div>
        ))}
        {/* Duplicate items for seamless loop */}
        {items.map((item, index) => (
          <div key={`dup-${index}`} className="flex items-center">
            <span className="mx-8">{item}</span>
            <span className="text-signal/30 text-sm">◆</span>
          </div>
        ))}
      </div>
    </div>
  )
}

```

## `src/components/ui/AnimatedCounter.jsx`
<a id="srccomponentsuianimatedcounterjsx"></a>

```jsx
import React from 'react'
import CountUpRaw from 'react-countup'
import { useInView } from 'react-intersection-observer'

const CountUp = CountUpRaw.default || CountUpRaw

export default function AnimatedCounter({ end, prefix = '', suffix = '', decimals = 0 }) {
  const [ref, inView] = useInView({ triggerOnce: true })
  
  return (
    <span ref={ref}>
      {inView ? (
        <CountUp 
          start={0} 
          end={end} 
          duration={2.5} 
          prefix={prefix} 
          suffix={suffix} 
          decimals={decimals} 
        />
      ) : (
        <span>{prefix}0{suffix}</span>
      )}
    </span>
  )
}

```

## `src/components/ui/ScrollProgressBar.jsx`
<a id="srccomponentsuiscrollprogressbarjsx"></a>

```jsx
import { motion, useScroll } from 'framer-motion'

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-signal z-[100] origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  )
}

```

## `src/components/ui/ScrollReveal.jsx`
<a id="srccomponentsuiscrollrevealjsx"></a>

```jsx
import { motion } from 'framer-motion'

export default function ScrollReveal({ children, delay = 0, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

```

## `src/components/ui/ParallaxImage.jsx`
<a id="srccomponentsuiparallaximagejsx"></a>

```jsx

```

## `src/components/ui/NoiseBg.jsx`
<a id="srccomponentsuinoisebgjsx"></a>

```jsx

```

## `src/components/sections/Hero.jsx`
<a id="srccomponentssectionsherojsx"></a>

```jsx
import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import MagneticButton from '../ui/MagneticButton'
import AnimatedCounter from '../ui/AnimatedCounter'

export default function Hero() {
  const containerRef = useRef(null)
  const blobRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  const y = useTransform(scrollYProgress, [0, 1], [0, 150])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!blobRef.current) return
      const { clientX, clientY } = e
      blobRef.current.style.transform = `translate(${clientX - 400}px, ${clientY - 400}px)`
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const line1 = "We build".split(' ')
  const line2 = "digital futures".split(' ')
  const line3 = "that matter.".split(' ')
  
  let wordIndex = 0

  const renderWords = (words, stroke = false) => {
    return words.map((word, i) => {
      const currentDelay = (wordIndex++) * 0.08
      return (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 60, rotateX: -40 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: currentDelay, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`inline-block mr-[2vw] ${stroke ? 'text-stroke opacity-90' : 'text-white'}`}
          style={{ transformOrigin: "bottom center" }}
        >
          {word}
        </motion.span>
      )
    })
  }

  return (
    <section ref={containerRef} className="relative min-h-screen bg-ink-950 overflow-hidden flex flex-col justify-center pt-20 pb-20">
      
      {/* Dynamic Backgrounds */}
      <div 
        ref={blobRef} 
        className="absolute top-0 left-0 w-[800px] h-[800px] bg-signal/10 rounded-full blur-[120px] pointer-events-none transition-transform duration-1000 ease-out z-0"
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none z-0"></div>
      <div className="grain absolute inset-0 z-[1]"></div>

      <motion.div style={{ opacity, scale, y }} className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-start mt-4 sm:mt-10">
        
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-ink-800 border border-white/10 text-mist-900 font-mono text-xs px-4 py-2 rounded-full mb-12 flex items-center gap-2"
        >
          <div className="w-1.5 h-1.5 bg-signal rounded-full animate-pulse-slow"></div>
          Available for projects in 2025 &rarr;
        </motion.div>

        {/* Headlines */}
        <h1 className="font-display text-7xl sm:text-8xl md:text-[8rem] lg:text-[10rem] leading-[0.9] tracking-tight mb-8 w-full perspective-1000" data-cursor="hover">
          <div className="overflow-visible pb-1 sm:pb-2">{renderWords(line1)}</div>
          <div className="overflow-visible pb-1 sm:pb-2">{renderWords(line2, true)}</div>
          <div className="overflow-visible pb-1 sm:pb-2">{renderWords(line3)}</div>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="font-body text-mist-900 text-lg md:text-xl max-w-lg mb-12 leading-relaxed"
          data-cursor="text"
        >
          We are an award-winning studio pushing the boundaries of strategy, design, and engineering to build digital products people love.
        </motion.p>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="flex flex-wrap items-center gap-6"
        >
          <MagneticButton className="bg-signal text-ink-950 font-display font-medium px-8 py-4 rounded-full text-lg hover:shadow-[0_0_30px_rgba(232,255,71,0.3)] transition-all">
            See Our Work
          </MagneticButton>
          <button className="border border-white/20 text-mist-900 hover:text-white hover:border-white/40 hover:bg-white/5 font-display font-medium px-8 py-4 rounded-full text-lg transition-all" data-cursor="hover">
            How We Work
          </button>
        </motion.div>

      </motion.div>

      {/* Floating Elements & Decorations */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-32 right-12 md:right-32 w-32 h-32 hidden md:flex items-center justify-center opacity-60 z-10"
      >
        <svg viewBox="0 0 100 100" width="100" height="100">
          <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
          <text className="font-mono text-[9.5px] fill-white tracking-widest uppercase">
            <textPath href="#circlePath">Premium · Studio · 2025 · Premium · Studio · 2025 · </textPath>
          </text>
        </svg>
      </motion.div>

      <div className="absolute bottom-8 left-6 md:left-12 z-20 hidden sm:block">
        <div className="font-display flex flex-col gap-1 items-start text-white/80">
          <span className="text-3xl text-signal"><AnimatedCounter end={48} suffix="+" /></span>
          <span className="font-mono text-xs text-mist-900 tracking-wider">Projects Delivered</span>
        </div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 z-20"
      >
        <ChevronDown size={24} />
      </motion.div>

      {/* Abstract floating shapes behind content */}
      <div className="absolute top-1/2 right-1/4 z-0 opacity-20 pointer-events-none">
        <motion.div animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="w-64 h-64 border border-signal rounded-full" />
      </div>
      <div className="absolute bottom-1/4 right-[10%] z-0 text-white/5 pointer-events-none">
        <motion.div animate={{ y: [0, 40, 0], rotate: [0, -15, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
          <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor"><rect width="100" height="100" className="clip-diagonal"/></svg>
        </motion.div>
      </div>

    </section>
  )
}

```

## `src/components/sections/LogoCloud.jsx`
<a id="srccomponentssectionslogocloudjsx"></a>

```jsx
import MarqueeText from '../ui/MarqueeText'

export default function LogoCloud() {
  const companies1 = [
    'Vercel', 'Stripe', 'Linear', 'Notion', 'Figma', 
    'Shopify', 'Loom', 'Arc', 'Raycast', 'Pitch'
  ]
  const companies2 = [...companies1].reverse() // the reversed list

  const LogoText = ({ name }) => (
    <span className="font-display text-4xl md:text-5xl font-semibold text-white/20 hover:text-white/80 transition-colors duration-300" data-cursor="hover">
      {name}
    </span>
  )

  const mapped1 = companies1.map(c => <LogoText key={c} name={c} />)
  const mapped2 = companies2.map(c => <LogoText key={c} name={c} />)

  return (
    <section className="bg-ink-900 py-24 pb-32 border-b border-white/5 relative overflow-hidden group">
      <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10">
        <p className="text-center font-mono text-xs text-mist-900 uppercase tracking-widest">
          Trusted by forward-thinking companies
        </p>
      </div>
      
      {/* Optional: Add hover pause to the group */}
      <div className="flex flex-col gap-12 sm:group-hover:[&>div>div]:[animation-play-state:paused] transition-all">
        <MarqueeText items={mapped1} direction="forward" />
        <MarqueeText items={mapped2} direction="reverse" />
      </div>

      {/* Fade edges */}
      <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-ink-900 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-ink-900 to-transparent z-10 pointer-events-none"></div>
    </section>
  )
}

```

## `src/components/sections/StorySection.jsx`
<a id="srccomponentssectionsstorysectionjsx"></a>

```jsx
import { motion } from 'framer-motion'

export default function StorySection() {
  const chapters = [
    {
      num: '01',
      title: 'The world drowns in mediocre digital products.',
      p1: 'Look at the tools you use every day. Most are clunky, slow, or just plain boring. The baseline for digital experiences has settled somewhere between "barely functional" and "forgettable."',
      p2: 'Companies bleed revenue not because their idea is flawed, but because their execution lacks soul. In a sea of templates, average is the most dangerous place a brand can be.',
      align: 'left'
    },
    {
      num: '02',
      title: 'We believe every company deserves a world-class digital presence.',
      p1: 'Your product is your absolute best salesperson. It doesn\'t sleep, it doesn\'t take days off. It should feel intuitive, look striking, and function flawlessly.',
      p2: 'We reject the compromise between aesthetic beauty and technical performance. The best digital products do both beautifully.',
      align: 'right'
    },
    {
      num: '03',
      title: 'So we built a studio that does it differently.',
      p1: 'No fluff. No bloated agency retainers. Just a ruthless focus on building what matters with the best craft possible.',
      p2: 'From deep strategic foundations to pixel-perfect execution, our process is designed to push your brand from where it is to where it simply must be.',
      align: 'center'
    }
  ]

  const Art01 = () => (
    <div className="relative w-full aspect-square md:aspect-[4/3] flex items-center justify-center pointer-events-none">
      <div className="absolute w-64 h-64 bg-signal mix-blend-difference rounded-full blur-2xl opacity-40 animate-pulse-slow"></div>
      <div className="absolute w-40 h-40 bg-ember rounded-tr-full rounded-bl-full rotate-45 transform mix-blend-overlay"></div>
      <div className="absolute w-48 h-48 bg-ink-600 rounded-sm clip-diagonal"></div>
      <div className="absolute inset-0 border-[1px] border-white/10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
    </div>
  )

  const Art02 = () => (
    <div className="relative w-full aspect-square md:aspect-[4/3] flex items-center justify-center pointer-events-none group">
      <div className="w-1 h-3/4 bg-white/20 mx-4"></div>
      <div className="w-16 h-1/2 bg-signal/80 mx-4 transition-transform group-hover:scale-y-110"></div>
      <div className="w-1 h-2/3 bg-white/20 mx-4"></div>
      <div className="w-1 h-1/4 bg-white/10 mx-4"></div>
      <div className="w-8 h-8 bg-ember rounded-full mx-4 absolute right-1/4 top-1/4 animate-bounce"></div>
    </div>
  )

  return (
    <section className="bg-ink-950 py-32 md:py-48 relative overflow-hidden text-mist-100" id="about">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col pt-12">
        {chapters.map((chapter, i) => (
          <div key={i} className="mb-24 md:mb-48 relative last:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center ${chapter.align === 'right' ? 'md:flex-row-reverse' : ''} ${chapter.align === 'center' ? 'md:grid-cols-1 md:w-3/4 mx-auto text-center' : ''}`}
            >
              
              {/* Text Side */}
              <div className={`relative z-10 ${chapter.align === 'right' ? 'md:col-start-2 md:row-start-1' : ''}`}>
                <div className="absolute -top-16 md:-top-32 -left-8 md:-left-16 font-display text-[15rem] md:text-[20rem] text-white/[0.02] leading-none select-none pointer-events-none font-bold">
                  {chapter.num}
                </div>
                
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight mb-8">
                  {chapter.title}
                </h2>
                
                <div className={`flex flex-col gap-6 text-mist-900 text-lg leading-relaxed ${chapter.align === 'center' ? 'items-center' : ''}`}>
                  <p>{chapter.p1}</p>
                  <p>{chapter.p2}</p>
                </div>

                {chapter.align === 'center' && (
                  <div className="mt-12">
                    <a href="#team" className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-signal hover:text-white transition-colors" data-cursor="hover">
                      Meet the team →
                    </a>
                  </div>
                )}
              </div>

              {/* Visual Side */}
              {chapter.align !== 'center' && (
                <div className={`relative z-0 ${chapter.align === 'right' ? 'md:col-start-1 md:row-start-1' : ''}`}>
                  {i === 0 ? <Art01 /> : <Art02 />}
                </div>
              )}

            </motion.div>

            {/* Chapter dividers */}
            {i < chapters.length - 1 && (
              <div className="my-24 md:my-48 relative flex justify-center items-center">
                <hr className="w-full border-white/5 absolute" />
                <span className="bg-ink-950 px-4 font-mono text-xs text-white/20 relative">Chapter {chapters[i+1].num}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

```

## `src/components/sections/ServicesGrid.jsx`
<a id="srccomponentssectionsservicesgridjsx"></a>

```jsx
import { motion } from 'framer-motion'
import * as LucideIcons from 'lucide-react'
import { services } from '../../data/content'
import ScrollReveal from '../ui/ScrollReveal'

export default function ServicesGrid() {
  return (
    <section className="bg-ink-900 py-32 relative" id="services">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <ScrollReveal delay={0.1}>
          <p className="font-mono text-xs text-signal uppercase tracking-widest mb-4">Our Capabilities</p>
          <h2 className="font-display text-5xl md:text-7xl font-bold mb-16 tracking-tight">Everything you need.<br/>Nothing you don't.</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(280px,auto)]">
          {services.map((service, i) => {
            const IconComponent = LucideIcons[service.icon] || LucideIcons.Circle
            const isLarge = service.span === 'col-span-2' || service.span === 'col-span-3'
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className={`${service.span} bg-ink-800 border border-white/5 p-8 relative overflow-hidden group hover:border-signal/40 hover:scale-[1.01] transition-all duration-500 hover:bg-ink-800/80 flex flex-col justify-between`}
                data-cursor="hover"
              >
                {/* Background glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 mb-8">
                  <div className="flex justify-between items-start w-full mb-8">
                    <span className="font-mono text-xs text-mist-900">{service.number}</span>
                    <div className="text-white/60 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                      <IconComponent size={28} strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  <h3 className={`font-display font-medium ${isLarge ? 'text-3xl lg:text-4xl' : 'text-2xl mt-4'} mb-3`}>
                    {service.title}
                  </h3>
                  <p className="text-mist-900 text-sm leading-relaxed max-w-sm">
                    {service.desc}
                  </p>
                </div>

                <div className="relative z-10 flex flex-wrap gap-2 mt-auto">
                  {service.tags.map(tag => (
                    <span key={tag} className="font-mono text-[10px] md:text-xs text-mist-700 bg-ink-900 border border-white/10 px-3 py-1.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Hover arrow slide-in */}
                <div className="absolute right-8 bottom-8 flex items-center gap-2 text-signal font-mono text-sm translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="hidden sm:inline">Explore</span> &rarr;
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

```

## `src/components/sections/ProcessTimeline.jsx`
<a id="srccomponentssectionsprocesstimelinejsx"></a>

```jsx
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import ScrollReveal from '../ui/ScrollReveal'

export default function ProcessTimeline() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"]
  })

  // We draw the vertical line from top to bottom
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  const steps = [
    { title: "Discovery Call", tagline: "15 minutes that change everything", desc: "A brief alignment on your goals, timeline, constraints, and budget. No pressure, just clarity.", duration: "Day 0" },
    { title: "Deep Dive Workshop", tagline: "We become obsessed with your problem", desc: "We map user journeys, run competitive analysis, and unearth the technical constraints before writing a single line of code.", duration: "Week 1" },
    { title: "Strategy Blueprint", tagline: "Your roadmap to digital dominance", desc: "We deliver a comprehensive architecture, proposed design system foundations, and technical stack choices.", duration: "Week 2" },
    { title: "Design Sprints", tagline: "Pixels become possibilities", desc: "Weekly agile sprints. You get access to live Figma files and daily async updates. Feedback loops are tight and fast.", duration: "Weeks 3-5" },
    { title: "Build & Iterate", tagline: "We ship. You approve. We refine.", desc: "Engineering happens transparently. We push to staging environments continuously so you can test as we build.", duration: "Weeks 4-7" },
    { title: "Launch & Grow", tagline: "The beginning, not the end", desc: "Go-live is orchestrated meticulously. We set up analytics, monitor performance, and hand over the keys (or stay on for support).", duration: "Week 8+" }
  ]

  const StepItem = ({ step, index }) => {
    const { ref, inView } = useInView({ threshold: 0.5 })
    
    return (
      <div ref={ref} className="min-h-screen flex items-center relative py-32" id={`process-step-${index}`}>
        {/* Animated Dot indicator */}
        <div className="absolute left-0 w-8 h-8 -translate-x-1/2 flex items-center justify-center z-10 group cursor-pointer" onClick={() => window.scrollTo({top: document.getElementById(`process-step-${index}`).offsetTop, behavior: 'smooth'})}>
          <motion.div 
            className="w-4 h-4 rounded-full border-2 transition-colors duration-500"
            animate={{ 
              borderColor: inView ? '#e8ff47' : 'rgba(255,255,255,0.2)',
              backgroundColor: inView ? '#e8ff47' : '#080812'
            }}
          />
          <span className="absolute left-8 font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity text-mist-900">Scroll</span>
        </div>

        <motion.div
          initial={{ x: 60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ margin: '-20%' }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="pl-16 md:pl-24 relative w-full max-w-2xl"
        >
          {/* Faded Background Number */}
          <div className="absolute -top-12 md:-top-20 left-12 md:left-16 font-display text-[8rem] md:text-[12rem] text-white/5 font-bold leading-none select-none pointer-events-none">
            0{index + 1}
          </div>

          <div className="relative z-10">
            <span className="inline-block border border-white/10 text-mist-900 bg-ink-950 font-mono text-xs px-3 py-1 rounded-full mb-6">
              {step.duration}
            </span>
            <h3 className={`font-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 tracking-tight transition-colors duration-500 ${inView ? 'text-white' : 'text-mist-500'}`}>
              {step.title}
            </h3>
            <p className={`font-body text-xl md:text-2xl mb-6 transition-colors duration-500 ${inView ? 'text-signal' : 'text-mist-700'}`}>
              "{step.tagline}"
            </p>
            <p className="text-mist-900 text-base md:text-lg leading-relaxed max-w-lg">
              {step.desc}
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <section ref={containerRef} className="bg-ink-900 relative" id="process">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-16">
        <ScrollReveal>
          <p className="font-mono text-xs text-signal uppercase tracking-widest mb-4">Process</p>
          <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tight">How we get there.</h2>
        </ScrollReveal>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative w-full flex">
        
        {/* Vertical Timeline container - sticky */}
        <div className="w-px bg-white/5 absolute top-0 bottom-0 left-6 md:left-12 opacity-50"></div>
        
        {/* The active animated line */}
        <div className="sticky top-0 h-screen w-px left-6 md:left-12 flex-shrink-0 z-0">
          <motion.div 
            className="absolute top-0 w-[3px] -ml-[1px] bg-gradient-to-b from-signal/10 via-signal to-signal/10 origin-top shadow-[0_0_15px_rgba(232,255,71,0.5)]"
            style={{ scaleY, height: "100vh" }}
          />
        </div>

        {/* Steps contents */}
        <div className="flex-1 pb-32">
          {steps.map((step, index) => (
            <StepItem key={index} step={step} index={index} />
          ))}
        </div>

      </div>
    </section>
  )
}

```

## `src/components/sections/CaseStudies.jsx`
<a id="srccomponentssectionscasestudiesjsx"></a>

```jsx
import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { caseStudies } from '../../data/content'
import ScrollReveal from '../ui/ScrollReveal'

const CaseStudyCard = ({ data }) => {
  const cardRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"])

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div style={{ perspective: 1500 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative overflow-hidden bg-ink-800 border border-white/5 aspect-[4/3] group rounded-sm"
        data-cursor="view"
      >
        {/* Background gradient art */}
        <div className={`absolute inset-0 bg-gradient-to-br ${data.accentColor} opacity-40 transition-opacity duration-500 group-hover:opacity-80`} />
        <div 
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        ></div>

        {/* Normal State Front */}
        <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
          <div className="flex justify-between items-start">
            <span className="inline-block border border-white/20 text-white/60 bg-black/20 font-mono text-xs px-3 py-1 rounded-full backdrop-blur-md">
              {data.industry}
            </span>
          </div>
          <div>
            <h3 className="font-display font-medium text-4xl mb-2 tracking-tight" style={{ transform: "translateZ(30px)" }}>{data.company}</h3>
            <p className="font-mono text-xl text-signal" style={{ transform: "translateZ(20px)" }}>{data.result}</p>
          </div>
        </div>

        {/* Hover Overlay State */}
        <div className="absolute inset-0 bg-ink-950/95 p-8 flex flex-col justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
          <p className="text-mist-100 text-lg leading-relaxed mb-6 font-body">
            {data.desc}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {data.services.map(tag => (
              <span key={tag} className="font-mono text-[10px] text-white/50 bg-white/5 px-2 py-1 rounded-sm border border-white/10">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-center gap-2 text-signal font-mono text-sm group/btn cursor-pointer">
            <span className="group-hover/btn:underline hover:underline-offset-4">View Case Study</span> &rarr;
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function CaseStudies() {
  return (
    <section className="bg-ink-950 py-32" id="work">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <ScrollReveal className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="font-mono text-xs text-signal uppercase tracking-widest mb-4">Selected Work</p>
            <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tight">Proof in production.</h2>
          </div>
          <button className="text-mist-900 border border-white/10 hover:border-white/30 hover:text-white px-6 py-3 rounded-full text-sm transition-colors text-nowrap self-start md:self-auto" data-cursor="hover">
            View All Projects
          </button>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {caseStudies.map((cs, i) => (
            <ScrollReveal key={cs.id} delay={i * 0.1}>
              <CaseStudyCard data={cs} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

```

## `src/components/sections/StatsSection.jsx`
<a id="srccomponentssectionsstatssectionjsx"></a>

```jsx
import AnimatedCounter from '../ui/AnimatedCounter'
import ScrollReveal from '../ui/ScrollReveal'

export default function StatsSection() {
  const stats = [
    { num: 48, label: 'Projects Delivered', suffix: '+' },
    { num: 12, label: 'Revenue Generated', prefix: '$', suffix: 'M' },
    { num: 98, label: 'Satisfaction Rate', suffix: '%' },
    { num: 4.9, label: 'Avg Clutch Rating', suffix: '★', decimals: 1 },
    { num: 6, label: 'Years in Business' },
    { num: 3, label: 'Countries Served' }
  ]

  return (
    <section className="bg-signal py-24 md:py-32 w-full text-ink-950 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-y-20 whitespace-nowrap">
          {stats.map((stat, i) => (
            <ScrollReveal key={i} delay={i * 0.1} className="flex flex-col items-start xl:items-center">
              <div className="font-display text-6xl md:text-8xl font-bold tracking-tighter tabular-nums">
                <AnimatedCounter 
                  end={stat.num} 
                  prefix={stat.prefix} 
                  suffix={stat.suffix} 
                  decimals={stat.decimals} 
                />
              </div>
              <p className="font-mono text-xs md:text-sm uppercase tracking-widest mt-2 md:mt-4 opacity-80 font-semibold text-wrap">
                {stat.label}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

```

## `src/components/sections/TechStack.jsx`
<a id="srccomponentssectionstechstackjsx"></a>

```jsx
import { motion } from 'framer-motion'
import ScrollReveal from '../ui/ScrollReveal'

export default function TechStack() {
  const stack = [
    { cat: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Framer Motion', 'Three.js'] },
    { cat: 'Backend', items: ['Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'Redis'] },
    { cat: 'Cloud', items: ['AWS', 'Vercel', 'Docker', 'Kubernetes'] },
    { cat: 'Design', items: ['Figma', 'Adobe Suite', 'Spline', 'Rive'] },
    { cat: 'AI/ML', items: ['OpenAI', 'Langchain', 'Pinecone', 'HuggingFace'] }
  ]

  return (
    <section className="bg-ink-900 py-32 border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <ScrollReveal className="mb-20">
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Our Arsenal.</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8">
          {stack.map((category, i) => (
            <div key={category.cat} className="flex flex-col">
              <h3 className="font-mono text-xs text-signal uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
                {category.cat}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((tech) => (
                  <motion.div
                    key={tech}
                    whileHover={{ scale: 1.05, backgroundColor: '#e8ff47', color: '#04040a', borderColor: '#e8ff47' }}
                    className="font-mono text-xs md:text-sm px-4 py-2 rounded-full border border-white/10 text-mist-500 cursor-default transition-colors"
                  >
                    {tech}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

```

## `src/components/sections/PricingSection.jsx`
<a id="srccomponentssectionspricingsectionjsx"></a>

```jsx
import { Check } from 'lucide-react'
import MagneticButton from '../ui/MagneticButton'
import ScrollReveal from '../ui/ScrollReveal'

export default function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      price: '₹1.5L',
      desc: 'Perfect for: Startups & MVPs',
      features: ['Brand Identity', '5-page website', 'Responsive Design', 'Basic SEO Setup', '3 months support'],
      timeline: '3 weeks',
      btnText: 'Get Started',
      btnClass: 'bg-signal text-ink-950 hover:shadow-[0_0_20px_rgba(232,255,71,0.2)]',
      borderClass: 'border-white/10'
    },
    {
      name: 'Growth',
      price: '₹4L',
      desc: 'Perfect for: Scaling companies',
      features: ['Full design system', 'Custom Web App', 'Advanced Animations', 'Technical SEO', 'Analytics Integration', '6 months support'],
      timeline: '6 weeks',
      btnText: 'Get Started',
      btnClass: 'bg-signal text-ink-950 hover:shadow-[0_0_20px_rgba(232,255,71,0.2)]',
      borderClass: 'border-signal/50',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      desc: 'Perfect for: Series A+ companies',
      features: ['Everything in Growth', 'Dedicated Team', 'AI Features Integration', 'Custom Backend', 'Scalability Audits', 'Priority Support'],
      timeline: 'Custom',
      btnText: 'Talk to Us',
      btnClass: 'border border-ember text-ember hover:bg-ember hover:text-ink-950',
      borderClass: 'border-ember/30'
    }
  ]

  return (
    <section className="bg-ink-950 py-32" id="pricing">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <ScrollReveal className="text-center mb-20 md:mb-24">
          <p className="font-mono text-xs text-signal uppercase tracking-widest mb-4">Investment</p>
          <h2 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-6">Honest pricing.<br/>No surprises.</h2>
          <p className="text-mist-900 max-w-lg mx-auto">We don't believe in hidden fees or bloated retainers. Just clear deliverables and predictable timelines.</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.1}>
              <div 
                className={`relative bg-ink-900 border ${plan.borderClass} p-8 md:p-10 rounded-sm flex flex-col h-full group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${plan.popular ? 'scale-100 md:scale-105 z-10 shadow-2xl' : 'z-0'}`}
                data-cursor="hover"
              >
                {plan.popular && (
                  <div className="absolute top-0 right-8 -translate-y-1/2">
                    <span className="bg-signal/10 text-signal border border-signal/30 font-mono text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <h3 className="font-display text-2xl font-semibold mb-2">{plan.name}</h3>
                <div className="font-display text-5xl font-bold mb-4">{plan.price}</div>
                <p className="font-mono text-xs text-mist-700 mb-8 pb-8 border-b border-white/5">{plan.desc}</p>
                
                <ul className="flex flex-col gap-4 mb-10 flex-grow">
                  {plan.features.map(feat => (
                    <li key={feat} className="flex items-start gap-3">
                      <Check className="text-signal mt-1 shrink-0" size={16} strokeWidth={3} />
                      <span className="text-sm text-mist-500">{feat}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-3 mt-4 pt-4 border-t border-white/5 border-dashed">
                    <span className="text-signal mt-1 shrink-0 font-mono text-[10px]">&rarr;</span>
                    <span className="text-xs font-mono text-mist-700">Timeline: {plan.timeline}</span>
                  </li>
                </ul>

                <MagneticButton className={`w-full py-4 rounded-full font-display font-medium text-lg transition-all ${plan.btnClass}`}>
                  {plan.btnText}
                </MagneticButton>
                
                <p className="font-mono text-[10px] text-mist-900 text-center mt-6">
                  No hidden fees. Cancel anytime.
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

```

## `src/components/sections/TestimonialsCarousel.jsx`
<a id="srccomponentssectionstestimonialscarouseljsx"></a>

```jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import MagneticButton from '../ui/MagneticButton'

export default function TestimonialsCarousel() {
  const testimonials = [
    { quote: "NEXUS transformed our entire digital presence. We went from embarrassed to proud in 12 weeks.", author: "CEO", company: "Vanta Finance" },
    { quote: "The strategy session alone was worth the entire engagement cost.", author: "Founder", company: "Bloom Health" },
    { quote: "They think like founders, not vendors. Rare.", author: "CTO", company: "Orbit SaaS" },
    { quote: "Delivered 3 weeks early. Never happens with agencies.", author: "Product Lead", company: "Crest Retail" },
    { quote: "Our Clutch review says 5 stars. Honestly, we'd give 6.", author: "CMO", company: "Frameshift" }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section className="bg-ink-950 py-32 overflow-hidden relative">
      <div className="max-w-5xl mx-auto px-6 md:px-12 relative min-h-[400px] flex flex-col justify-center">
        
        {/* Giant decorative quote */}
        <div className="absolute top-0 left-4 font-display text-[15rem] md:text-[25rem] text-signal/5 leading-none pointer-events-none select-none -translate-y-12">
          "
        </div>

        <div className="relative z-10 w-full md:w-4/5 mx-auto text-center" data-cursor="text">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <h3 className="font-display text-3xl md:text-5xl lg:text-6xl leading-tight mb-12">
                {testimonials[currentIndex].quote}
              </h3>
              
              <div>
                <p className="font-mono text-signal uppercase tracking-widest text-sm mb-1">
                  {testimonials[currentIndex].author}
                </p>
                <p className="font-body text-mist-700">
                  {testimonials[currentIndex].company}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex gap-4">
            <MagneticButton onClick={prev} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/30 transition-colors">
              <ChevronLeft size={20} />
            </MagneticButton>
            <MagneticButton onClick={next} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/30 transition-colors">
              <ChevronRight size={20} />
            </MagneticButton>
          </div>
          
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-signal w-6' : 'bg-white/20 hover:bg-white/40'}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

```

## `src/components/sections/TeamSection.jsx`
<a id="srccomponentssectionsteamsectionjsx"></a>

```jsx
import { MessageCircle as Twitter, Briefcase as Linkedin } from 'lucide-react'
import { team } from '../../data/content'
import ScrollReveal from '../ui/ScrollReveal'

export default function TeamSection() {
  const PixelAvatar = ({ colors }) => {
    // 4x4 grid of pixels
    const pattern = [
      0,0,1,0,
      0,1,1,0,
      1,0,1,1,
      0,1,0,0
    ]
    
    return (
      <div className="w-full aspect-square grid grid-cols-4 grid-rows-4 gap-0 mb-6 rounded-sm overflow-hidden border border-white/5">
        {pattern.map((val, i) => (
          <div key={i} style={{ backgroundColor: val ? colors[0] : colors[1] }}></div>
        ))}
      </div>
    )
  }

  return (
    <section className="bg-ink-900 py-32" id="team">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <ScrollReveal className="mb-16 md:mb-24">
          <p className="font-mono text-xs text-signal uppercase tracking-widest mb-4">The Humans Behind The Pixels</p>
          <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tight">Our core team.</h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {team.map((member, i) => (
            <ScrollReveal key={member.name} delay={i * 0.1}>
              <div className="group h-[380px] w-full [perspective:1000px] cursor-pointer">
                <div className="relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  
                  {/* Front Face */}
                  <div className="absolute inset-0 bg-ink-800 border border-white/5 p-6 md:p-8 flex flex-col [backface-visibility:hidden]">
                    <PixelAvatar colors={member.colors} />
                    <h3 className="font-display text-2xl font-semibold">{member.name}</h3>
                    <p className="font-mono text-sm text-signal mt-1">{member.role}</p>
                  </div>

                  {/* Back Face */}
                  <div className="absolute inset-0 bg-signal border border-signal p-8 flex flex-col justify-center text-ink-950 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <p className="font-body text-xl lg:text-3xl italic leading-tight mb-8">
                      "{member.quote}"
                    </p>
                    <div className="flex gap-4 mt-auto">
                      <a href="#" className="p-2 bg-ink-950 text-mist-100 rounded-full hover:bg-black transition-colors">
                        <Linkedin size={20} />
                      </a>
                      <a href="#" className="p-2 bg-ink-950 text-mist-100 rounded-full hover:bg-black transition-colors">
                        <Twitter size={20} />
                      </a>
                    </div>
                  </div>
                  
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

```

## `src/components/sections/FAQSection.jsx`
<a id="srccomponentssectionsfaqsectionjsx"></a>

```jsx
import * as Accordion from '@radix-ui/react-accordion'
import { Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { faqs } from '../../data/content'
import ScrollReveal from '../ui/ScrollReveal'

export default function FAQSection() {
  const [value, setValue] = useState('')

  return (
    <section className="bg-ink-950 py-32 border-b border-white/5" id="faq">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          <ScrollReveal>
            <div className="sticky top-32">
              <h2 className="font-display text-[8rem] md:text-[10rem] text-white/5 leading-none font-bold select-none pointer-events-none mb-4 -ml-4 tracking-tighter">
                FAQ
              </h2>
              <div className="relative -mt-16 md:-mt-20 ml-2">
                <p className="font-mono text-xs text-signal uppercase tracking-widest mb-4">The details</p>
                <h3 className="font-display text-4xl md:text-5xl font-bold mb-6">Answers to your questions.</h3>
                <p className="text-mist-900 font-body text-lg leading-relaxed max-w-sm">
                  Everything you need to know about how we work, what we charge, and what happens when things go wrong.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2} className="relative z-10 w-full mt-10 lg:mt-32">
            <Accordion.Root 
              type="single" 
              collapsible 
              className="w-full flex flex-col"
              value={value}
              onValueChange={setValue}
            >
              {faqs.map((faq, index) => (
                <Accordion.Item 
                  key={index} 
                  value={`item-${index}`}
                  className="border-b border-white/5 overflow-hidden"
                >
                  <Accordion.Header className="flex">
                    <Accordion.Trigger 
                      className="group font-body text-lg md:text-xl py-6 md:py-8 flex justify-between items-center w-full text-left focus:outline-none transition-colors"
                      data-cursor="hover"
                    >
                      <span className={`tracking-tight pr-8 transition-colors duration-300 ${value === `item-${index}` ? 'text-signal' : 'text-mist-100 group-hover:text-white'}`}>
                        {faq.q}
                      </span>
                      <div className="shrink-0 text-mist-700 transition-transform duration-300 group-hover:text-white">
                        {value === `item-${index}` ? <Minus size={20} className="text-signal"/> : <Plus size={20} />}
                      </div>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content asChild forceMount>
                    <AnimatePresence initial={false}>
                      {value === `item-${index}` && (
                        <motion.div
                          initial="collapsed"
                          animate="open"
                          exit="collapsed"
                          variants={{
                            open: { opacity: 1, height: 'auto', marginBottom: 24, marginTop: -8 },
                            collapsed: { opacity: 0, height: 0, marginBottom: 0, marginTop: 0 }
                          }}
                          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="overflow-hidden"
                        >
                          <p className="text-mist-700 text-sm md:text-base leading-relaxed pr-8">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </ScrollReveal>

        </div>
      </div>
    </section>
  )
}

```

## `src/components/sections/BlogPreview.jsx`
<a id="srccomponentssectionsblogpreviewjsx"></a>

```jsx
import ScrollReveal from '../ui/ScrollReveal'

export default function BlogPreview() {
  const posts = [
    { title: 'Why 90% of SaaS products fail at onboarding (and how to fix it)', cat: 'UX Strategy', readTime: '7 min', date: 'Jan 2025' },
    { title: 'The Indian startup design deficit: a ₹500Cr opportunity', cat: 'Industry', readTime: '5 min', date: 'Feb 2025' },
    { title: 'AI won\'t replace designers. But it will replace bad designers.', cat: 'AI & Design', readTime: '9 min', date: 'Mar 2025' }
  ]

  return (
    <section className="bg-ink-900 py-32" id="blog">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <ScrollReveal className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div>
            <p className="font-mono text-xs text-signal uppercase tracking-widest mb-4">Insights</p>
            <h2 className="font-display text-5xl md:text-6xl font-bold tracking-tight">We share what we know.</h2>
          </div>
          <a href="#" className="font-mono text-sm text-mist-900 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1 group" data-cursor="hover">
            View All Articles <span className="text-signal inline-block group-hover:translate-x-1 transition-transform">&rarr;</span>
          </a>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <a href="#" className="block bg-ink-800 border border-white/5 p-8 h-full group transition-all duration-500 hover:border-signal/30 hover:-translate-y-2 hover:bg-ink-800/80 relative overflow-hidden" data-cursor="hover">
                <div className="absolute inset-0 bg-gradient-to-t from-signal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <span className="inline-block border border-signal/30 text-signal font-mono text-xs px-3 py-1 rounded-full self-start mb-6 -ml-1">
                    {post.cat}
                  </span>
                  
                  <h3 className="font-display text-2xl lg:text-3xl font-medium leading-[1.2] mb-6 tracking-tight group-hover:text-signal transition-colors duration-300">
                    {post.title}
                  </h3>
                  
                  <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between font-mono text-xs text-mist-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-mist-700"></div>
                      <span>{post.date}</span>
                      <span className="opacity-50">·</span>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-signal">
                      Read Article &rarr;
                    </span>
                  </div>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

```

## `src/components/sections/CTASection.jsx`
<a id="srccomponentssectionsctasectionjsx"></a>

```jsx
import { motion } from 'framer-motion'
import MagneticButton from '../ui/MagneticButton'

export default function CTASection() {
  return (
    <section className="relative min-h-screen bg-ink-950 flex flex-col justify-center items-center overflow-hidden py-32" id="cta">
      {/* Dramatic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink-700 via-ink-900 to-ink-950 opacity-50 z-0"></div>
      <div className="grain absolute inset-0 z-0 mix-blend-overlay opacity-30"></div>
      
      {/* Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(232,255,71,0.06),transparent)] z-0 rounded-full blur-[50px] pointer-events-none"></div>

      {/* Very large slow floating shapes */}
      <motion.div 
        animate={{ y: [0, -100, 0], x: [0, 50, 0] }} 
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} 
        className="absolute -top-20 left-[10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-signal rounded-full opacity-[0.02] blur-3xl z-0"
      />
      <motion.div 
        animate={{ y: [0, 100, 0], x: [0, -50, 0] }} 
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }} 
        className="absolute -bottom-40 right-[10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-ember rounded-full opacity-[0.02] blur-3xl z-0"
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-xs text-mist-900 uppercase tracking-widest mb-8"
        >
          Ready to build something great?
        </motion.p>

        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-7xl md:text-[8rem] lg:text-[10rem] tracking-tighter leading-[0.85] mb-12 flex flex-col"
          data-cursor="hover"
        >
          <span className="text-white">Let's make</span>
          <span className="text-stroke">it happen.</span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-mist-500 font-body text-xl md:text-2xl mb-16 max-w-xl"
        >
          We're now accepting a limited number of new projects for Q3. Book a discovery call to secure your spot.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col items-center gap-6 w-full"
        >
          <MagneticButton className="px-12 py-6 text-xl md:text-2xl font-display font-medium bg-signal text-ink-950 rounded-full hover:shadow-[0_0_40px_rgba(232,255,71,0.3)] transition-all group overflow-hidden relative">
            <span className="relative z-10 flex items-center gap-3">
              Book a Free Call
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>&rarr;</motion.span>
            </span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity z-0"></div>
          </MagneticButton>

          <a href="mailto:hello@nexus.studio" className="font-mono text-sm text-mist-700 hover:text-white transition-colors pb-1 border-b border-white/20 hover:border-white mt-4" data-cursor="text">
            Or email us at hello@nexus.studio
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-24 pt-8 border-t border-white/5 flex flex-col items-center gap-4 w-full md:w-auto px-12"
        >
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`w-10 h-10 rounded-full border-2 border-ink-950 bg-gradient-to-br ${i%2===0 ? 'from-ink-700 to-ink-900' : 'from-signal/20 to-ink-800'}`}></div>
            ))}
          </div>
          <p className="font-mono text-xs text-mist-900">Join 48+ companies who chose us.</p>
        </motion.div>

      </div>
    </section>
  )
}

```
