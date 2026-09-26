export const defaultContent = {
  meta: {
    siteName: "Business Name",
    siteDescription: "Your business description",
    siteUrl: "https://example.com",
    siteLang: "en",
    faviconUrl: "https://i.imgur.com/udCYp7c.png",
    ogImageUrl: "",
    logoText: "LOGO",
    logoImageUrl: "",
    copyright: "© 2025 Business Name. All rights reserved.",
  },
  navbar: {
    logo: "LOGO",
    links: ["About", "Services", "Gallery", "Contact"],
  },
  hero: {
    title: "Welcome to Our Business",
    subtitle: "Professional service you can trust",
    buttonText: "Book Now",
    backgroundImage: "",
  },
  about: {
    title: "About Us",
    text: "We are a professional team...",
    image: "",
    stats: [
      { value: "10+", label: "Years Experience" },
      { value: "500+", label: "Happy Clients" },
      { value: "100%", label: "Satisfaction" },
    ],
  },
  services: {
    title: "Our Services",
    items: [
      { title: "Service 1", description: "Description", icon: "⭐" },
      { title: "Service 2", description: "Description", icon: "🔥" },
      { title: "Service 3", description: "Description", icon: "💎" },
    ],
  },
  gallery: {
    title: "Our Work",
    images: [] as string[],
  },
  booking: {
    title: "Book Now",
    subtitle: "Fill the form and we'll contact you",
    showDateField: true,
    buttonText: "Send Request",
  },
  contact: {
    title: "Contact Us",
    phone: "+1 234 567 890",
    email: "hello@business.com",
    address: "123 Street, City",
    workingHours: "Mon-Fri: 9:00 - 18:00",
    googleMapsUrl: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
  },
  legal: {
    privacyPolicy:
      "Privacy Policy\n\nReplace this starter text with a privacy policy reviewed for the personal data, booking requests, analytics, and providers used by your business before launch.",
    termsOfService:
      "Terms of Service\n\nReplace this starter text with terms reviewed for your services, booking process, cancellations, payments, and jurisdiction before launch.",
    cookiePolicy:
      "Cookie Policy\n\nReplace this starter text with a cookie policy that reflects the analytics, embeds, authentication, and other services enabled on your deployment.",
  },
  footer: {
    text: "© 2025 Business Name. All rights reserved.",
  },
};

export type SiteContentData = typeof defaultContent;
