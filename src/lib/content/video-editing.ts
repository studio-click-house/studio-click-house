import type { FaqItem, PreviewMedia } from "$lib/types/content";

export interface VideoHeroData {
  title: string;
  titleAccent: string;
  description: string;
  videoSrc: string;
  videoPoster: string;
}

export interface VideoServiceOverviewItem {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
  deliverables: string[];
  ctaLabel: string;
}

export interface VideoCommercialData {
  id: string;
  heading: string;
  leadParagraph: string;
  bodyParagraph: string;
  capabilities: {
    title: string;
    description: string;
  }[];
  sampleVideo: {
    src: string;
    poster: string;
    title: string;
    description: string;
  };
}

export interface VideoColorGradingData {
  id: string;
  heading: string;
  description: string;
  rawImage: {
    src: string;
    alt: string;
    label: string;
  };
  gradedImage: {
    src: string;
    alt: string;
    label: string;
  };
  highlights: {
    title: string;
    description: string;
  }[];
}

export interface VideoSocialCutdownsData {
  id: string;
  heading: string;
  description: string;
  widescreenMaster: {
    src: string;
    alt: string;
    label: string;
    aspectRatio: string;
  };
  verticalCutdown: {
    src: string;
    alt: string;
    label: string;
    aspectRatio: string;
  };
  principles: {
    title: string;
    description: string;
  }[];
}

export interface VideoAiGenerationData {
  id: string;
  heading: string;
  leadParagraph: string;
  bodyParagraph: string;
  videoSrc: string;
  videoPoster: string;
  features: {
    title: string;
    description: string;
  }[];
}

export interface VideoWorkflowStep {
  step: string;
  title: string;
  timeframe: string;
  description: string;
}

export interface VideoDeliveryStandard {
  category: string;
  headline: string;
  specs: {
    label: string;
    value: string;
  }[];
}

export interface VideoEditingPageData {
  seo: {
    title: string;
    description: string;
  };
  hero: VideoHeroData;
  servicesOverview: VideoServiceOverviewItem[];
  commercial: VideoCommercialData;
  grading: VideoColorGradingData;
  social: VideoSocialCutdownsData;
  aiGeneration: VideoAiGenerationData;
  workflow: VideoWorkflowStep[];
  standards: VideoDeliveryStandard[];
  faqs: FaqItem[];
  faqImages: PreviewMedia[];
}

export const videoEditingPageData: VideoEditingPageData = {
  seo: {
    title: "Video Editing, Color Grading & AI Video Generation | Studio Click House",
    description:
      "Full-service video post-production by Studio Click House. Commercial editing, DaVinci Resolve color grading, 9:16 social cutdowns, and generative AI video motion for global brands.",
  },

  hero: {
    title: "Commercial video editing",
    titleAccent: "& AI motion.",
    description:
      "Full-service post-production for brands and creative agencies—commercial storytelling, DaVinci Resolve color grading, 9:16 social cutdowns, and generative AI motion.",
    videoSrc: "/videos/ai section video.mp4",
    videoPoster: "/images/about/orbit/ai-video-editing.jpg",
  },

  servicesOverview: [
    {
      id: "commercial-editing",
      number: "01",
      title: "Commercial Video Editing",
      description:
        "Offline narrative assembly, pacing, music synchronization, and sound design for brand commercials, product spots, and campaign films.",
      image: "/images/work-fields/studio-production-poster.jpg",
      deliverables: [
        "First rough cut in 24–48 hours",
        "Full music & sound design sync",
        "Frame.io timecode review links",
      ],
      ctaLabel: "View Commercial Editing Sample",
    },
    {
      id: "color-grading",
      number: "02",
      title: "Color Grading & Finishing",
      description:
        "DaVinci Resolve color science for camera RAW and Log files. Accurate skin tone calibration, multi-camera balance, and custom film looks.",
      image: "/images/services/model-beauty/beauty-editorial-glam-makeup-retouch-0969-after.webp",
      deliverables: [
        "Camera Log to Rec.709 conversion",
        "Natural skin tone preservation",
        "Multi-camera sensor matching",
      ],
      ctaLabel: "View Color Grading Before/After",
    },
    {
      id: "social-cutdowns",
      number: "03",
      title: "Social Media Cutdowns",
      description:
        "Reformatting horizontal 16:9 master videos into high-engagement 9:16 vertical reels for TikTok, Instagram Reels, and YouTube Shorts.",
      image: "/images/services/model-beauty/model-soleil-blue-resortwear-editorial-1308.webp",
      deliverables: [
        "Dynamic keyframed focal centering",
        "Safe zone margin protection",
        "6s, 15s, and 30s cut variations",
      ],
      ctaLabel: "View Social Cutdown Comparison",
    },
    {
      id: "ai-video-generation",
      number: "04",
      title: "AI Video Generation",
      description:
        "Transforming static product photography, fashion lookbooks, and campaign stills into fluid, photorealistic 4K motion sequences.",
      image: "/images/services/model-beauty/model-cue-designer-fashion-editorial-0137.webp",
      deliverables: [
        "Still-to-video motion synthesis",
        "Temporal stabilization & de-flicker",
        "Color-matched to live rushes",
      ],
      ctaLabel: "View AI Video Generation Sample",
    },
  ],

  commercial: {
    id: "commercial-editing",
    heading: "Commercial video editing.",
    leadParagraph:
      "We assemble raw footage into tight brand films with natural storytelling, musical pacing, and custom sound design.",
    bodyParagraph:
      "Whether you need high-energy fashion lookbooks, product showcases, or brand documentaries, our editors work in Premiere Pro and DaVinci Resolve with initial cuts delivered in 24 to 48 hours.",
    capabilities: [
      {
        title: "Fast Pacing",
        description:
          "Editing structured to hook viewers in the first 3 seconds and keep visual beats locked to your music.",
      },
      {
        title: "Clean Sound & Music",
        description:
          "Balancing licensed music tracks with clean dialogue, sound effects, and Foley for maximum audio punch.",
      },
      {
        title: "Easy Video Reviews",
        description:
          "Private review links so your team can click and leave exact timestamped comments on any frame.",
      },
    ],
    sampleVideo: {
      src: "/videos/editing-video-720p.webm",
      poster: "/images/work-fields/studio-production-poster.jpg",
      title: "Commercial Sequence Sample",
      description: "Sample commercial cut demonstrating match-cuts, audio rhythm, and pacing.",
    },
  },

  grading: {
    id: "color-grading",
    heading: "Professional color grading.",
    description:
      "We balance skin tones, match footage from different cameras, and create consistent cinematic color on color-calibrated monitors.",
    rawImage: {
      src: "/images/about/video-pipeline/stage-1-raw-synthesis.webp",
      alt: "Flat Log camera capture before color balance",
      label: "Flat Camera Log (Un-graded)",
    },
    gradedImage: {
      src: "/images/about/video-pipeline/stage-3-master-grade.webp",
      alt: "Final master color graded commercial image",
      label: "Finished Color Grade (Rec.709)",
    },
    highlights: [
      {
        title: "Natural Skin Tones",
        description:
          "Keeping actor and model skin tones healthy and true to life across all lighting conditions.",
      },
      {
        title: "Balanced Contrast",
        description:
          "Protecting highlights from blowing out while keeping clean contrast in shadows.",
      },
      {
        title: "Matching Cameras",
        description:
          "Unifying footage shot on different camera brands, drones, and phone setups into one cohesive film look.",
      },
    ],
  },

  social: {
    id: "social-cutdowns",
    heading: "Turn horizontal videos into vertical reels.",
    description:
      "We reframe your widescreen footage into vertical 9:16 cuts made specifically for TikTok, Instagram Reels, and YouTube Shorts. We manually track the main action so subjects never get cut off.",
    widescreenMaster: {
      src: "/videos/stage-3-master-grade.mp4",
      alt: "16:9 widescreen master video",
      label: "16:9 Master Video",
      aspectRatio: "16:9 Landscape",
    },
    verticalCutdown: {
      src: "/videos/stage-3-master-grade.mp4",
      alt: "9:16 vertical cutdown video",
      label: "9:16 Vertical Reel",
      aspectRatio: "9:16 Vertical",
    },
    principles: [
      {
        title: "Action Centered",
        description:
          "Keeping models and products in the center of the frame throughout each shot.",
      },
      {
        title: "Safe Margins",
        description:
          "Keeping titles, logos, and captions clear of app buttons, usernames, and icons.",
      },
      {
        title: "Quick Cuts",
        description:
          "Fast, punchy 6-second, 15-second, and 30-second cuts ready to post.",
      },
    ],
  },

  aiGeneration: {
    id: "ai-video-generation",
    heading: "Turn still photos into moving video.",
    leadParagraph:
      "When you have great product or fashion photography, we turn those still shots into smooth, realistic video motion.",
    bodyParagraph:
      "We combine modern motion synthesis with professional post-production finishing to remove flickering and ensure realistic motion that matches your brand style.",
    videoSrc: "/videos/ai section video.mp4",
    videoPoster: "/images/about/video-pipeline/stage-1-raw-synthesis.webp",
    features: [
      {
        title: "Photos to Video",
        description:
          "Creating natural movement like flowing fabric, moving water, or smooth camera pans from still photos.",
      },
      {
        title: "Smooth, Stable Motion",
        description:
          "Removing frame jitter and flickering so the video looks real and professional.",
      },
      {
        title: "Matching Colors",
        description:
          "Color-balancing generated video clips in DaVinci Resolve so they blend seamlessly with real live-action footage.",
      },
    ],
  },

  workflow: [
    {
      step: "01",
      title: "Send your footage",
      timeframe: "Day 1",
      description:
        "Upload your raw clips, audio stems, and creative briefs through fast, secure file transfer.",
    },
    {
      step: "02",
      title: "First cut review",
      timeframe: "24 to 48 Hours",
      description:
        "Receive the first cut on Frame.io. Your team can click and leave exact timestamped comments on any frame.",
    },
    {
      step: "03",
      title: "Color & sound finishing",
      timeframe: "1 to 2 Days",
      description:
        "We balance colors, clean dialogue, add sound effects, and sync licensed music tracks.",
    },
    {
      step: "04",
      title: "Final video delivery",
      timeframe: "Hand-off",
      description:
        "Download your master delivery package: high-quality archives, web MP4s, and vertical cuts ready to post.",
    },
  ],

  standards: [
    {
      category: "Aspect Ratios & Sizes",
      headline: "Any aspect ratio or size",
      specs: [
        { label: "16:9 Landscape", value: "Formatted for YouTube, website heroes, TV, and monitors." },
        { label: "9:16 Vertical", value: "Optimized for Instagram Reels, TikTok, and YouTube Shorts." },
        { label: "1:1 & 4:5 Social", value: "Clean square and portrait cuts for feed posts and sponsored ads." },
        { label: "Custom Resolutions", value: "Any custom dimensions you need for digital billboards or events." },
      ],
    },
    {
      category: "File Formats",
      headline: "Ready-to-post & master files",
      specs: [
        { label: "Web MP4 Files", value: "Compressed for fast web and social upload with crisp quality." },
        { label: "ProRes Masters", value: "Uncompressed high-resolution master archives for future editing." },
        { label: "Subtitles & Captions", value: "Burned-in stylized captions or clean separate .SRT subtitle files." },
        { label: "Split Audio Stems", value: "Separate audio files for dialogue, background music, and effects." },
      ],
    },
    {
      category: "Turnaround & Support",
      headline: "Fast delivery & smooth reviews",
      specs: [
        { label: "24–48 Hour First Cut", value: "Quick assembly so you can see and review your story early." },
        { label: "Frame-by-Frame Notes", value: "Private review links to click and leave timestamped comments." },
        { label: "12–24 Hour Revisions", value: "Quick turnaround on feedback rounds to meet tight deadlines." },
        { label: "Secure Cloud Storage", value: "Private high-speed download links that remain safely backed up." },
      ],
    },
  ],

  faqs: [
    {
      question: "How do we send our raw footage to you?",
      answer:
        "You can upload your files through MASV, Aspera, Google Drive, or any cloud platform you prefer. For very large projects, you can also ship encrypted drives directly to our studio.",
    },
    {
      question: "Can you match color across different cameras?",
      answer:
        "Yes. We balance and match footage shot on different cameras, drones, and phones so your entire film has one consistent, cinematic look.",
    },
    {
      question: "How do you turn photos into video?",
      answer:
        "We take your high-resolution product or model photos, create natural motion (like fabric moving or smooth camera pans), and color-grade the video to match your brand style.",
    },
    {
      question: "How fast do you deliver revisions?",
      answer:
        "We deliver your first rough cut in 24 to 48 hours. When you leave notes on Frame.io, we typically turn around revision rounds in 12 to 24 hours.",
    },
    {
      question: "Do you provide licensed music and sound design?",
      answer:
        "Yes. We can work with your provided tracks or source and license commercial music, sound effects, and clean up dialogue for broadcast and web.",
    },
    {
      question: "What video formats and sizes will we receive?",
      answer:
        "Whatever sizes you need: 16:9 for YouTube and web, 9:16 for Reels and TikTok, 1:1 and 4:5 for social feeds, plus high-res ProRes masters and compressed web MP4s.",
    },
  ],

  faqImages: [
    {
      src: "/images/services/model-beauty/beauty-editorial-glam-makeup-retouch-0969-after.webp",
      alt: "Commercial beauty and editorial fashion color grading",
      width: 1200,
      height: 1500,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/model-beauty/model-cue-designer-fashion-editorial-0137.webp",
      alt: "Designer fashion commercial campaign",
      width: 1200,
      height: 1500,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/model-beauty/beauty-portrait-close-up-skincare-retouch-0500-after.webp",
      alt: "Close-up skincare and calibrated skin tones",
      width: 1200,
      height: 1500,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/jewelry/jewelry-editorial-seashell-gold-necklace-model-2061-after.webp",
      alt: "Commercial fine jewelry campaign film still",
      width: 1200,
      height: 1500,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/model-beauty/model-rachel-gilbert-designer-gown-0094.webp",
      alt: "Designer eveningwear and campaign film",
      width: 1200,
      height: 1500,
      credit: "Studio Click House",
    },
    {
      src: "/images/work-fields/studio-production-poster.jpg",
      alt: "Studio camera lighting and production set",
      width: 1280,
      height: 720,
      credit: "Studio Click House",
    },
  ],
};
