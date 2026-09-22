import type { FaqItem, PreviewMedia } from "$lib/types/content";

export interface ServicesHeroData {
  eyebrow: string;
  title: string;
  description: string;
  media: PreviewMedia;
}

export const servicesHero: ServicesHeroData = {
  eyebrow: "Our Capabilities",
  title: "Image editing and post-production for brand assets",
  description:
    "We provide pixel-perfect image retouching, commercial video editing, and photorealistic 3D CGI rendering. Built for high-volume catalogs, campaign creative, and global studio standards.",
  media: {
    src: "/images/services/product-services/interior-luxury-bedroom-upholstered-bed-photography-after.webp",
    alt: "Finished luxury bedroom interior photograph prepared for a commercial campaign",
    width: 2000,
    height: 1500,
    credit: "Studio Click House",
  },
};

export const servicesFaqImages: PreviewMedia[] = [
  {
    src: "/images/services/product-services/product-industrial-machinery-rack-server-cutout-before.webp",
    alt: "Industrial server rack photographed in its workshop setting",
    width: 1500,
    height: 2000,
    credit: "Studio Click House",
  },
  {
    src: "/images/services/ghost-mannequin-apparel/apparel-ada-tactical-body-armour-vest-0059-after.webp",
    alt: "Completed ghost mannequin apparel image of a tactical vest",
    width: 1500,
    height: 2000,
    credit: "Studio Click House",
  },
  {
    src: "/images/services/model-beauty/model-soleil-blue-summer-fashion-1862.webp",
    alt: "Model wearing a blue summer outfit for a fashion campaign",
    width: 1500,
    height: 2000,
    credit: "Studio Click House",
  },
  {
    src: "/images/services/product-services/product-furniture-scandinavian-oak-chair-hero.png",
    alt: "Scandinavian oak chair shown in a finished catalog product image",
    width: 1122,
    height: 1402,
    credit: "Studio Click House",
  },
  {
    src: "/images/services/product-services/product-gem-whole-body-cream-deodorant-yellow-cream-after.webp",
    alt: "Finished cosmetic product image with consistent color and clean edges",
    width: 1500,
    height: 2000,
    credit: "Studio Click House",
  },
  {
    src: "/images/services/model-beauty/model-michael-lo-sordo-ivory-couture-0388.webp",
    alt: "Model wearing an ivory couture gown in a studio portrait",
    width: 1500,
    height: 2000,
    credit: "Studio Click House",
  },
];

export const servicesFaqs: FaqItem[] = [
  {
    question: "What file formats do you accept and deliver?",
    answer:
      "We accept all major raw camera formats (CR3, NEF, ARW, DNG) as well as PSD, PSB, TIFF, and high-resolution JPEG. Deliverables are customized to your pipeline requirements, including layered PSD/TIFF files, transparent PNGs, or optimized web assets.",
  },
  {
    question: "What is your typical turnaround time?",
    answer:
      "Standard turnaround for bulk image editing is 24 to 48 hours. Express 12-hour delivery is available for urgent campaigns. High-end video editing and complex 3D CGI rendering timelines are estimated per project scope.",
  },
  {
    question: "Do you offer test edits or trials?",
    answer:
      "Yes. We offer a free trial edit for up to 3 images so you can evaluate our quality, attention to detail, and retouching speed before committing to a larger order or contract.",
  },
  {
    question: "How do you guarantee color profile consistency?",
    answer:
      "Our editing suites use calibrated EIZO monitors and manage sRGB, Adobe RGB, Display P3, and CMYK conversions for consistent print and screen output.",
  },
  {
    question: "How is client media secured and transferred?",
    answer:
      "We use encrypted high-speed file transfer protocols (SFTP, MASV, Aspera, or cloud shares). Raw media and finished files are kept on secure, firewalled server setups and archived for 30 days post-delivery.",
  },
  {
    question: "Can you scale for high-volume catalog seasons?",
    answer:
      "Yes. With a production force of over 150+ trained digital artists operating 24/7, we regularly handle high-volume spikes of 2,000+ complex edits per day while maintaining rigid quality controls.",
  },
];

export interface ServiceStandardItem {
  icon: string;
  title: string;
  description: string;
}

export const serviceStandards: ServiceStandardItem[] = [
  {
    icon: "Sliders",
    title: "EIZO Color Calibrated",
    description: "Consistent color profiles across all displays, matching international print and screen requirements.",
  },
  {
    icon: "ShieldCheck",
    title: "Secure Infrastructure",
    description: "Encrypted server storage and NDA compliance safeguarding all intellectual property and client files.",
  },
  {
    icon: "Zap",
    title: "High-Volume Capacity",
    description: "Over 150+ trained artists working in daily shifts to comfortably scale for tight campaign windows.",
  },
  {
    icon: "CheckCircle",
    title: "Two-Tier QC Verification",
    description: "Every file passes through an artist review and a senior director inspection before export.",
  },
];
