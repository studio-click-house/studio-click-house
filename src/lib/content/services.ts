import type { FaqItem, PreviewMedia } from "$lib/types/content";
import { previewMedia } from "$lib/content/media";

export interface ServicesHeroData {
  eyebrow: string;
  title: string;
  description: string;
  media: PreviewMedia;
}

export const servicesHero: ServicesHeroData = {
  eyebrow: "Our Capabilities",
  title: "Precision finishing for brand assets.",
  description:
    "We provide pixel-perfect image retouching, commercial video editing, and photorealistic 3D CGI rendering. Built for high-volume catalogs, campaign creative, and global studio standards.",
  media: previewMedia.editingWorkspace,
};

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
      "All editing suites run hardware-calibrated EIZO monitors calibrated to D50/D65 standards. We manage conversions between sRGB, Adobe RGB, Display P3, and CMYK color spaces to ensure assets look flawless across print and screens.",
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
