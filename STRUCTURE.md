# Studio Click House — Pro File Structure
## Stack: Next.js 14 (App Router) + Framer Motion + Lenis + Tailwind + shadcn

```
studio-click-house/
│
├── app/                                # Next.js App Router
│   ├── layout.tsx                      # Root layout (Lenis provider, fonts, metadata)
│   ├── page.tsx                        # Home page
│   │
│   ├── about/
│   │   └── page.tsx
│   │
│   ├── services/
│   │   ├── page.tsx                    # All services listing
│   │   └── [slug]/
│   │       └── page.tsx                # Dynamic: clipping-path, ghost-mannequin, etc.
│   │
│   ├── portfolio/
│   │   └── page.tsx
│   │
│   ├── pricing/
│   │   └── page.tsx
│   │
│   ├── blog/
│   │   ├── page.tsx                    # Blog listing
│   │   └── [slug]/
│   │       └── page.tsx                # Single blog post
│   │
│   ├── contact/
│   │   └── page.tsx
│   │
│   ├── privacy/
│   │   └── page.tsx
│   │
│   └── terms/
│       └── page.tsx
│
│
├── components/
│   │
│   ├── layout/                         # Used on EVERY page
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── SmoothScrollProvider.tsx    # Lenis setup wrapper
│   │
│   ├── ui/                             # shadcn + custom base UI
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   └── (other shadcn components)
│   │
│   ├── animations/                     # Reusable Framer Motion wrappers
│   │   ├── FadeUp.tsx                  # Fade up on scroll (most used)
│   │   ├── FadeIn.tsx                  # Simple fade in
│   │   ├── StaggerContainer.tsx        # Parent for stagger children
│   │   ├── TextReveal.tsx              # Word/line reveal animation
│   │   ├── ParallaxImage.tsx           # Parallax scroll image
│   │   └── MarqueeScroll.tsx           # Infinite scroll ticker
│   │
│   ├── sections/                       # Page sections (reused across pages)
│   │   ├── HeroSection.tsx
│   │   ├── ServicesGrid.tsx            # Used on home + services page
│   │   ├── PortfolioSlider.tsx         # Before/after slider
│   │   ├── StatsRow.tsx                # 50K+ images, 99%, 24h etc
│   │   ├── ProcessSteps.tsx            # 4-step workflow
│   │   ├── WhyUsGrid.tsx               # 6 feature cards
│   │   ├── TestimonialsSection.tsx
│   │   ├── FaqAccordion.tsx
│   │   ├── CtaBanner.tsx               # "Get 5 free images" CTA
│   │   ├── PricingTable.tsx
│   │   └── BlogGrid.tsx
│   │
│   └── common/                         # Small reusable pieces
│       ├── SectionHeading.tsx          # Consistent heading style
│       ├── ServiceCard.tsx             # Single service card
│       ├── BlogCard.tsx                # Single blog card
│       ├── BeforeAfterSlider.tsx       # Drag slider component
│       └── TrustBadges.tsx             # Client logos marquee
│
│
├── lib/                                # Utilities & config
│   ├── animations.ts                   # Shared Framer Motion variants
│   ├── lenis.ts                        # Lenis init config
│   ├── utils.ts                        # cn() and helpers
│   └── seo.ts                          # generateMetadata helpers
│
│
├── hooks/                              # Custom React hooks
│   ├── useScrollProgress.ts            # Page scroll % for progress bar
│   └── useInView.ts                    # Wrapper for Framer motion inView
│
│
├── content/                            # Static data (no CMS needed)
│   ├── services.ts                     # All 6 services data array
│   ├── faqs.ts                         # FAQ list
│   ├── pricing.ts                      # Pricing plans data
│   ├── testimonials.ts                 # Client reviews
│   └── blog-posts.ts                   # Blog data (or use MDX)
│
│
├── types/                              # TypeScript types
│   └── index.ts                        # Service, Blog, Pricing types
│
│
├── public/
│   ├── images/
│   │   ├── portfolio/                  # Before/after images
│   │   ├── team/
│   │   └── og-image.jpg
│   └── fonts/                          # Self-hosted fonts
│
│
├── styles/
│   └── globals.css                     # Tailwind base + CSS variables
│
├── tailwind.config.ts                  # Colors, fonts, animations
├── next.config.ts
└── tsconfig.json
```

---

## Key Design Decisions

### Why `components/animations/` folder?
Instead of writing Framer Motion code in every section, you wrap once:
```tsx
// components/animations/FadeUp.tsx
export function FadeUp({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  )
}

// Then use ANYWHERE like this:
<FadeUp delay={0.2}>
  <h2>Your heading</h2>
</FadeUp>
```

### Why `content/` folder?
Your services, FAQs, pricing are the same data used on multiple pages.
Keep it in one place, import everywhere:
```ts
// content/services.ts
export const services = [
  { slug: "clipping-path", title: "Clipping Path", ... },
  { slug: "ghost-mannequin", title: "Ghost Mannequin", ... },
  // ...
]
// Used in: Navbar dropdown, ServicesGrid, services/[slug] page
```

### Why `lib/animations.ts`?
Shared variants so all animations feel consistent:
```ts
// lib/animations.ts
export const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
}
export const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}
```

### Lenis Setup (layout.tsx)
```tsx
// components/layout/SmoothScrollProvider.tsx
"use client"
import Lenis from "lenis"
import { useEffect } from "react"

export function SmoothScrollProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true })
    return () => lenis.destroy()
  }, [])
  return <>{children}</>
}
```

---

## Pages → Sections Mapping

| Page | Sections Used |
|------|--------------|
| `/` (Home) | Hero, StatsRow, ServicesGrid, PortfolioSlider, WhyUsGrid, ProcessSteps, CtaBanner, FaqAccordion |
| `/about` | HeroSection, StatsRow, WhyUsGrid, TeamSection, CtaBanner |
| `/services` | HeroSection, ServicesGrid |
| `/services/[slug]` | ServiceHero, ServiceDetails, PortfolioSlider, CtaBanner |
| `/portfolio` | HeroSection, PortfolioSlider (full), CtaBanner |
| `/pricing` | HeroSection, PricingTable, FaqAccordion, CtaBanner |
| `/blog` | HeroSection, BlogGrid |
| `/blog/[slug]` | BlogPost, BlogGrid (related) |
| `/contact` | HeroSection, ContactForm, StatsRow |
