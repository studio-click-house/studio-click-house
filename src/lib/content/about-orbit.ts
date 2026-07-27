export interface AboutOrbitCard {
  id: string;
  title: string;
  category: string;
  shape: "portrait" | "tall" | "compact";
  media: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export const aboutOrbitCards: AboutOrbitCard[] = [
  {
    id: "orbit-1",
    title: "Fashion Editorial Retouching",
    category: "Campaign",
    shape: "tall",
    media: {
      src: "https://images.pexels.com/photos/17173186/pexels-photo-17173186.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Editorial fashion portrait",
      width: 1200,
      height: 1600,
    },
  },
  {
    id: "orbit-2",
    title: "DaVinci Skin Tone Grading",
    category: "Video Suite",
    shape: "compact",
    media: {
      src: "https://images.pexels.com/photos/306088/pexels-photo-306088.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Video color grading panel",
      width: 1200,
      height: 800,
    },
  },
  {
    id: "orbit-3",
    title: "3D CGI Product Modeling",
    category: "3D Studio",
    shape: "portrait",
    media: {
      src: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "3D render interface",
      width: 1200,
      height: 800,
    },
  },
  {
    id: "orbit-4",
    title: "High-Key Luxury Perfume",
    category: "Still Life",
    shape: "tall",
    media: {
      src: "https://images.pexels.com/photos/18302102/pexels-photo-18302102.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Perfume still life shot",
      width: 1200,
      height: 1600,
    },
  },
  {
    id: "orbit-5",
    title: "Fine Jewelry Macro Retouch",
    category: "Luxury",
    shape: "portrait",
    media: {
      src: "https://images.pexels.com/photos/11006273/pexels-photo-11006273.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Pearl jewelry closeup",
      width: 1200,
      height: 1600,
    },
  },
  {
    id: "orbit-6",
    title: "Automotive & Industrial CGI",
    category: "CGI Studio",
    shape: "compact",
    media: {
      src: "https://images.pexels.com/photos/37848029/pexels-photo-37848029.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Editing workspace monitors",
      width: 1200,
      height: 800,
    },
  },
  {
    id: "orbit-7",
    title: "Studio Collective Collaboration",
    category: "Production",
    shape: "portrait",
    media: {
      src: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Creative team reviewing work",
      width: 1200,
      height: 800,
    },
  },
  {
    id: "orbit-8",
    title: "E-Commerce Apparel Retouch",
    category: "Retouching",
    shape: "tall",
    media: {
      src: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Sneaker product photo edit",
      width: 1200,
      height: 1600,
    },
  },
];
