import type { AboutPageData } from "$lib/types/about";

export const aboutPageData: AboutPageData = {
  hero: {
    eyebrow: "About Studio Click House",
    headingLine1: "We Are",
    headingLine2: "Studio Click House",
    positioning:
      "A specialized post-production studio delivering high-end photo retouching, video color grading, and 3D CGI editing for global fashion labels, commercial e-commerce, and creative agencies.",
    stats: [
      {
        value: 150,
        suffix: "+",
        label: "Digital Artists",
        sublabel: "Retouchers, colorists & 3D artists",
      },
      {
        value: 10,
        suffix: "+",
        label: "Years of Excellence",
        sublabel: "Building global post-production pipelines",
      },
      {
        value: 5,
        suffix: "M+",
        label: "Assets Delivered",
        sublabel: "With zero compromise on SLA precision",
      },
    ],
    bannerMedia: {
      src: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=2200",
      alt: "Studio Click House creative team reviewing digital post-production proofs on high-gamut calibrated displays",
      width: 2200,
      height: 1467,
      credit: "Studio workspace overview",
    },
  },
  people: {
    eyebrow: "Our People",
    heading: "The Team Behind Every Frame",
    subheading:
      "We are a collective of pixel-obsessed retouchers, colorists, 3D generalists, and workflow architects operating seamlessly from our main studio in Dhaka.",
    heroCollectiveMedia: {
      src: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=2200",
      alt: "Full Studio Click House post-production collective gathered in the main production hall",
      width: 2200,
      height: 1237,
      credit: "Studio Click House team collective",
    },
    moments: [
      {
        id: "color-grading",
        title: "Precision Color Grading",
        category: "Video Suite",
        media: {
          src: "https://images.pexels.com/photos/306088/pexels-photo-306088.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Senior colorist calibrating skin tones on a DaVinci Resolve suite",
          width: 1200,
          height: 800,
          credit: "Color Suite Studio",
        },
      },
      {
        id: "collaborative-review",
        title: "Quality Control & Proofing",
        category: "Retouching Desk",
        media: {
          src: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Lead retouchers reviewing multi-exposure campaign assets",
          width: 1200,
          height: 800,
          credit: "Collaborative desk review",
        },
      },
      {
        id: "3d-cgi-workshop",
        title: "3D & CGI Rendering",
        category: "3D Department",
        media: {
          src: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "3D artist modeling luxury product lighting in Blender and Maya",
          width: 1200,
          height: 800,
          credit: "CGI rendering bay",
        },
      },
      {
        id: "studio-culture",
        title: "Workshop & Skill Sharing",
        category: "Studio Culture",
        media: {
          src: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Team members attending an internal masterclass on advanced retouching workflows",
          width: 1200,
          height: 800,
          credit: "Internal studio masterclass",
        },
      },
    ],
  },
  values: {
    eyebrow: "What Drives Us",
    heading: "Core Values",
    subheading:
      "These six foundational principles guide every project, file transfer, and client partnership we touch.",
    items: [
      {
        number: "01",
        title: "Uncompromising Craftsmanship",
        tagline: "Fine-art precision across every single pixel",
        description:
          "Whether processing 10,000 e-commerce lookbooks or a single hero billboard, we apply uncompromising attention to texture, lighting, and realistic skin tone fidelity.",
      },
      {
        number: "02",
        title: "Speed with Scale",
        tagline: "Overnight turnaround with guaranteed SLAs",
        description:
          "Our 24/7 dual-shift post-production model enables high-capacity throughput, offering global brands overnight turnarounds without sacrificing artistic control.",
      },
      {
        number: "03",
        title: "Transparent Partnership",
        tagline: "Direct line to your dedicated retouch team",
        description:
          "We act as an integrated extension of your creative team. Dedicated project managers and clear Slack/Teams lines ensure effortless communication.",
      },
      {
        number: "04",
        title: "Technological Innovation",
        tagline: "Blending human art direction with smart tooling",
        description:
          "We pioneer custom color management scripts, automated QC validation tools, and CGI hybrid pipelines to streamline turnaround and lower operational friction.",
      },
      {
        number: "05",
        title: "Data Security & Trust",
        tagline: "Enterprise-grade NDA & asset privacy",
        description:
          "Unreleased campaign media is protected by strict NDA protocols, encrypted R2 storage, watermarked internal proofs, and restricted air-gapped workstations.",
      },
      {
        number: "06",
        title: "Continuous Mastery",
        tagline: "Elevating craft through weekly masterclasses",
        description:
          "Post-production technology evolves constantly. We invest continuously in our artists' education across Unreal Engine 5, advanced compositing, and generative retouching.",
      },
    ],
  },
  journey: {
    eyebrow: "Our Journey",
    heading: "Our Story So Far",
    subheading:
      "From a modest 4-person photo editing cell in Dhaka to a 150+ specialist post-production force trusted by international fashion houses.",
    milestones: [
      {
        year: "2015",
        title: "The Studio Is Founded",
        subtitle: "Dhaka, Bangladesh",
        description:
          "Studio Click House started in a small workspace with just four passionate photo retouchers focused on high-end fashion catalog editing.",
        statsHighlight: "4 Retouchers · 10 Clients",
        media: {
          src: "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=1000",
          alt: "Early photo editing desktop setup in 2015",
          width: 1000,
          height: 667,
          credit: "Studio founding days",
        },
      },
      {
        year: "2017",
        title: "Commercial E-Commerce Expansion",
        subtitle: "High-Volume Scaling",
        description:
          "Expanded our production floor to accommodate overnight bulk retouching for major European and North American fashion retailers.",
        statsHighlight: "35 Artists · 100k+ Images/Year",
        media: {
          src: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1000",
          alt: "Expanded retouching floor with dual monitors",
          width: 1000,
          height: 667,
          credit: "Commercial expansion",
        },
      },
      {
        year: "2019",
        title: "Video Editing & Motion Department",
        subtitle: "Multi-Media Production",
        description:
          "Launched our dedicated video post-production suite, offering broadcast color grading, video retouching, and commercial reel editing.",
        statsHighlight: "Video Suite · 10-Bit Color Workstations",
        media: {
          src: "https://images.pexels.com/photos/11156896/pexels-photo-11156896.jpeg?auto=compress&cs=tinysrgb&w=1000",
          alt: "Color grading panel setup in video editing suite",
          width: 1000,
          height: 667,
          credit: "Video suite launch",
        },
      },
      {
        year: "2021",
        title: "3D & CGI Rendering Suite",
        subtitle: "Product Visualization",
        description:
          "Introduced 3D product modeling and CGI scene composition to serve jewelry, cosmetics, and footwear brands seeking virtual studio shoots.",
        statsHighlight: "3D Dept · Maya & Blender Pipeline",
        media: {
          src: "https://images.pexels.com/photos/6976094/pexels-photo-6976094.jpeg?auto=compress&cs=tinysrgb&w=1000",
          alt: "3D mesh product rendering on screen",
          width: 1000,
          height: 667,
          credit: "3D CGI launch",
        },
      },
      {
        year: "2023",
        title: "Global Delivery Hub & Enterprise Infrastructure",
        subtitle: "Cloud Infrastructure",
        description:
          "Deployed high-speed private cloud pipeline with Cloudflare R2 storage, guaranteeing sub-hour delivery windows for time-critical press campaigns.",
        statsHighlight: "100+ Team Members · Cloudflare R2",
        media: {
          src: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1000",
          alt: "High-capacity network server infrastructure",
          width: 1000,
          height: 667,
          credit: "Enterprise cloud pipeline",
        },
      },
      {
        year: "2025",
        title: "Next-Gen AI-Assisted Post Studio",
        subtitle: "Present & Beyond",
        description:
          "Pioneered proprietary workflow tooling integrating AI background synthesis with human master retouchers, doubling production velocity.",
        statsHighlight: "150+ Specialists · 5M+ Total Assets Delivered",
        media: {
          src: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1000",
          alt: "Modern Studio Click House main production floor",
          width: 1000,
          height: 667,
          credit: "Current production hub",
        },
      },
    ],
  },
  careers: {
    eyebrow: "Join Our Team",
    heading: "Your Next Chapter Starts Here",
    description:
      "We are always searching for passionate retouchers, video editors, 3D artists, and project leads who share our dedication to visual excellence.",
    ctaLabel: "View Open Positions",
    ctaHref: "/careers",
    bgMedia: {
      src: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=2000",
      alt: "Creative discussion at Studio Click House headquarters",
      width: 2000,
      height: 1333,
      credit: "Studio culture photo",
    },
  },
  leadership: {
    eyebrow: "Leadership Team",
    heading: "Meet the Minds Guiding SCH",
    subheading:
      "Our leadership combines deep technical post-production craft with international agency operational experience.",
    members: [
      {
        id: "leader-1",
        name: "Tanvir Rahman",
        role: "Founder & Creative Director",
        bio: "Over 14 years of editorial photo retouching and creative direction experience leading campaign post for international luxury brands.",
        linkedinUrl: "https://linkedin.com",
        media: {
          src: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800",
          alt: "Tanvir Rahman - Founder & Creative Director",
          width: 800,
          height: 1000,
          credit: "Studio portrait",
        },
      },
      {
        id: "leader-2",
        name: "Nusrat Jahan",
        role: "Head of Post-Production & Operations",
        bio: "Spearheads daily 24/7 production scheduling, client SLA compliance, and quality control pipelines for our 150+ artist team.",
        linkedinUrl: "https://linkedin.com",
        media: {
          src: "https://images.pexels.com/photos/3735747/pexels-photo-3735747.jpeg?auto=compress&cs=tinysrgb&w=800",
          alt: "Nusrat Jahan - Head of Operations",
          width: 800,
          height: 1000,
          credit: "Studio portrait",
        },
      },
      {
        id: "leader-3",
        name: "Mahmud Hasan",
        role: "Lead Colorist & Video Director",
        bio: "Master colorist specializing in DaVinci Resolve workflows, broadcast commercial color, and high-dynamic-range fashion films.",
        linkedinUrl: "https://linkedin.com",
        media: {
          src: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=800",
          alt: "Mahmud Hasan - Lead Colorist",
          width: 800,
          height: 1000,
          credit: "Studio portrait",
        },
      },
      {
        id: "leader-4",
        name: "Farhana Yasmin",
        role: "Head of 3D & CGI Pipelines",
        bio: "Supervises 3D product visualization, lighting architecture, and photorealistic CGI compositing for global e-commerce clients.",
        linkedinUrl: "https://linkedin.com",
        media: {
          src: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800",
          alt: "Farhana Yasmin - Head of 3D",
          width: 800,
          height: 1000,
          credit: "Studio portrait",
        },
      },
    ],
  },
  closingCta: {
    heading: "Need a post-production partner who can stay close to the work?",
    description:
      "Send us a test image or video clip. Experience our overnight turnaround, pixel precision, and dedicated project management firsthand.",
    primaryCtaLabel: "Start a Project",
    primaryCtaHref: "/contact",
    secondaryCtaLabel: "Explore Our Portfolio",
    secondaryCtaHref: "/portfolio",
  },
};
