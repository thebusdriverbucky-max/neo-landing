import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultContent = {
  "meta": {
    "siteName": "Business Name",
    "siteDescription": "Your business description",
    "favicon": ""
  },
  "navbar": {
    "logo": "LOGO",
    "links": ["About", "Services", "Gallery", "Contact"]
  },
  "hero": {
    "title": "Welcome to Our Business",
    "subtitle": "Professional service you can trust",
    "buttonText": "Book Now",
    "backgroundImage": ""
  },
  "about": {
    "title": "About Us",
    "text": "We are a professional team...",
    "image": "",
    "stats": [
      { "value": "10+", "label": "Years Experience" },
      { "value": "500+", "label": "Happy Clients" },
      { "value": "100%", "label": "Satisfaction" }
    ]
  },
  "services": {
    "title": "Our Services",
    "items": [
      { "title": "Service 1", "description": "Description", "icon": "⭐" },
      { "title": "Service 2", "description": "Description", "icon": "🔥" },
      { "title": "Service 3", "description": "Description", "icon": "💎" }
    ]
  },
  "gallery": {
    "title": "Our Work",
    "images": []
  },
  "booking": {
    "title": "Book Now",
    "subtitle": "Fill the form and we'll contact you",
    "showDateField": true,
    "buttonText": "Send Request"
  },
  "contact": {
    "title": "Contact Us",
    "phone": "+1 234 567 890",
    "email": "hello@business.com",
    "address": "123 Street, City",
    "workingHours": "Mon-Fri: 9:00 - 18:00",
    "googleMapsUrl": "",
    "whatsapp": "",
    "instagram": "",
    "facebook": ""
  },
  "footer": {
    "text": "© 2025 Business Name. All rights reserved."
  }
};

async function main() {
  const content = await prisma.siteContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      data: defaultContent,
    },
  });
  console.log('Seed completed: SiteContent created/updated', content.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
