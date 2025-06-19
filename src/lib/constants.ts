export const CONTACT_DETAILS = {
  address: "200 W Green Rd, London N15 5AG",
  website: "website.com",
  email: "test@test.com",
  phone: "0208 800 7373",
  mapEmbedUrl: "https://maps.google.com/maps?q=200%20W%20Green%20Rd%2C%20London%20N15%205AG&t=&z=15&ie=UTF8&iwloc=&output=embed",
};

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  dataAiHint: string;
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "1",
    title: "Cosmetic Dentistry",
    description: "Enhance your smile with our range of cosmetic treatments including teeth whitening, veneers, and smile makeovers.",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "dentist patient",
  },
  {
    id: "2",
    title: "Orthodontics",
    description: "Straighten your teeth and improve your bite with modern orthodontic solutions like braces and clear aligners.",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "dental braces",
  },
  {
    id: "3",
    title: "Dental Implants",
    description: "Restore missing teeth with durable and natural-looking dental implants.",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "dental implant",
  },
  {
    id: "4",
    title: "General Check-ups",
    description: "Maintain optimal oral health with regular check-ups, cleanings, and preventative care.",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "dental checkup",
  },
  {
    id: "5",
    title: "Root Canal Therapy",
    description: "Save infected teeth and relieve pain with our expert root canal treatments.",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "dental surgery",
  },
  {
    id: "6",
    title: "Children's Dentistry",
    description: "Gentle and friendly dental care for your little ones to ensure a lifetime of healthy smiles.",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "child dentist",
  },
];
