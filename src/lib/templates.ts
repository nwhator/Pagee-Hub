import type { BusinessFormValues } from "@/components/dashboard/business-form";

export type PageTemplate = {
  id: string;
  name: string;
  category: string;
  description: string;
  previewTag: string;
  defaultValues: BusinessFormValues;
};

export const pageTemplates: PageTemplate[] = [
  {
    id: "template_modern_solopreneur",
    name: "Modern Solopreneur",
    category: "Personal Brand",
    description: "Clean, confident one-page profile for consultants and solo founders.",
    previewTag: "Bold + Professional",
    defaultValues: {
      subdomain: "solopreneur-studio",
      name: "Nova Consulting Studio",
      tagline: "Build smarter systems, faster",
      whatsapp: "",
      phone: "",
      instagram: "@novaconsulting",
      about: "I help small businesses simplify operations, automate repetitive work, and scale with confidence.",
      services: [
        { name: "Strategy Session", price: "$120" },
        { name: "Automation Setup", price: "$350" }
      ],
      brand_color: "#0EA5A4",
      custom_domain: "",
      show_branding: true
    }
  },
  {
    id: "template_the_artisan_loft",
    name: "The Artisan Loft",
    category: "Craft + Lifestyle",
    description: "Warm, handcrafted visual style perfect for local makers and boutique stores.",
    previewTag: "Warm + Handcrafted",
    defaultValues: {
      subdomain: "artisan-loft",
      name: "The Artisan Loft",
      tagline: "Handcrafted with soul",
      whatsapp: "",
      phone: "",
      instagram: "@artisanloft",
      about: "Small-batch handmade pieces, thoughtfully crafted to add character and warmth to your everyday life.",
      services: [
        { name: "Custom Handmade Set", price: "$90" },
        { name: "Gift Packaging", price: "$15" }
      ],
      brand_color: "#B45309",
      custom_domain: "",
      show_branding: true
    }
  },
  {
    id: "template_vibrant_creative",
    name: "Vibrant Creative",
    category: "Creator",
    description: "High-energy profile template for creators, stylists, and media brands.",
    previewTag: "Colorful + Energetic",
    defaultValues: {
      subdomain: "vibrant-creative",
      name: "Vibrant Creative Co.",
      tagline: "Design stories people remember",
      whatsapp: "",
      phone: "",
      instagram: "@vibrantcreative",
      about: "We craft visual identity systems, social-first content, and campaign design for modern brands.",
      services: [
        { name: "Brand Refresh", price: "$450" },
        { name: "Social Design Kit", price: "$180" }
      ],
      brand_color: "#E11D48",
      custom_domain: "",
      show_branding: true
    }
  },
  {
    id: "template_tech_pulse",
    name: "Tech Pulse",
    category: "Tech",
    description: "Sleek template for agencies and startups with a modern digital tone.",
    previewTag: "Sleek + Tech",
    defaultValues: {
      subdomain: "tech-pulse",
      name: "Tech Pulse Labs",
      tagline: "Ship digital products with momentum",
      whatsapp: "",
      phone: "",
      instagram: "@techpulse",
      about: "We design, build, and launch digital products from MVP to scalable production.",
      services: [
        { name: "MVP Sprint", price: "$1200" },
        { name: "Product Design", price: "$600" }
      ],
      brand_color: "#1D4ED8",
      custom_domain: "",
      show_branding: true
    }
  }
];

export function getTemplateById(id: string) {
  return pageTemplates.find((template) => template.id === id) ?? null;
}
