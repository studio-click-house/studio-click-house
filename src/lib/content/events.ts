import type { CompanyEvent, EventActivity } from "$lib/types/events";

export const upcomingEvent: CompanyEvent = {
  id: "team-football-evening",
  title: "Team football evening",
  summary:
    "A relaxed team match that gives everyone time to move, reset, and enjoy the energy of working together.",
  date: "August 24, 2026",
  location: "Studio grounds",
  status: "upcoming",
  format: "Team activity",
  image:
    "https://images.pexels.com/photos/5235776/pexels-photo-5235776.jpeg?auto=compress&dpr=1&w=1440",
  imageAlt: "Employees playing football together outdoors",
  focus: ["Team time", "Friendly match", "Fresh air"],
};

export const pastEvents: CompanyEvent[] = [
  {
    id: "nepal-team-tour",
    title: "Nepal team tour",
    summary:
      "A shared mountain trip built around new surroundings, unhurried conversations, and time together away from the studio.",
    date: "June 15, 2026",
    location: "London · Online",
    status: "past",
    format: "Team tour",
    image:
      "https://images.pexels.com/photos/7263397/pexels-photo-7263397.jpeg?auto=compress&dpr=1&w=1440",
    imageAlt: "A team enjoying a mountain tour together",
    focus: ["Quality systems", "Production workflow", "Image consistency"],
  },
  {
    id: "coxs-bazar-team-trip",
    title: "Cox's Bazar team trip",
    summary:
      "A coastal break for the team to recharge, connect, and enjoy time together away from the studio.",
    date: "March 18, 2026",
    location: "Dhaka studio",
    status: "past",
    format: "Team trip",
    image:
      "https://images.pexels.com/photos/7148443/pexels-photo-7148443.jpeg?auto=compress&dpr=1&w=1440",
    imageAlt: "A team walking together along the beach",
    focus: ["Complex edges", "Alpha control", "Production detail"],
  },
  {
    id: "company-football-match",
    title: "Company football match",
    summary:
      "A friendly game that brings different teams together through movement, laughter, and a little competition.",
    date: "November 20, 2025",
    location: "Studio Click House",
    status: "past",
    format: "Sports activity",
    image:
      "https://images.pexels.com/photos/12169308/pexels-photo-12169308.jpeg?auto=compress&dpr=1&w=1440",
    imageAlt: "Employees playing a friendly football match",
    focus: ["Brushed metal", "Reflection control", "Micro detail"],
  },
  {
    id: "mountain-team-day",
    title: "Mountain team day",
    summary:
      "A day outside the usual routine, making room for perspective, conversation, and shared memories.",
    date: "September 15, 2025",
    location: "Studio Click House · Online",
    status: "past",
    format: "Company outing",
    image:
      "https://images.pexels.com/photos/7348656/pexels-photo-7348656.jpeg?auto=compress&dpr=1&w=1440",
    imageAlt: "A team exploring a mountain landscape together",
    focus: ["Capture planning", "Lighting", "Post-production"],
  },
];

export const eventActivities: EventActivity[] = [
  {
    id: "employee-football",
    title: "Employee football",
    description:
      "Friendly matches give the team space to move, compete, and spend time together beyond production work.",
    image: "/images/events/employee-football.png",
    imageAlt: "A group of friends playing football together outdoors",
  },
  {
    id: "nepal-team-tour",
    title: "Nepal team tour",
    description:
      "A shared mountain tour built around new surroundings, unhurried conversations, and time together as a team.",
    image: "/images/events/nepal-team-tour.png",
    imageAlt: "A group of friends resting together during a mountain hike",
  },
  {
    id: "coxs-bazar-team-trip",
    title: "Cox's Bazar team trip",
    description:
      "A coastal break for the team to recharge, connect, and enjoy time together away from the studio.",
    image: "/images/events/coxs-bazar-team-trip.png",
    imageAlt: "A group of friends walking together along a beach at sunset",
  },
];
