import prisma from './prisma';
import { Prisma } from '@prisma/client';

const defaultContent = {
  "meta": {
    "siteName": "Business Name",
    "siteDescription": "Your business description",
    "siteUrl": "https://example.com",
    "siteLang": "en",
    "faviconUrl": "https://i.imgur.com/udCYp7c.png",
    "ogImageUrl": "",
    "logoText": "LOGO",
    "logoImageUrl": "",
    "copyright": "© 2025 Business Name. All rights reserved.",
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
    "images": [] as string[]
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
  "legal": {
    "privacyPolicy": "Privacy Policy\n\nWe respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.",
    "termsOfService": "Terms of Service\n\nThese terms and conditions outline the rules and regulations for the use of our Website. By accessing this website we assume you accept these terms and conditions. Do not continue to use the website if you do not agree to take all of the terms and conditions stated on this page.",
    "cookiePolicy": "Cookie Policy\n\nWe use cookies to help improve your experience of our website. This cookie policy is part of our privacy policy, and covers the use of cookies between your device and our site. We also provide basic information on third-party services we may use, who may also use cookies as part of their service, though they are not covered by our policy."
  },
  "footer": {
    "text": "© 2025 Business Name. All rights reserved."
  }
};

export type SiteContentData = typeof defaultContent;

type JsonObject = Record<string, unknown>;

function isObject(item: unknown): item is JsonObject {
  return Boolean(item) && typeof item === 'object' && !Array.isArray(item);
}

function deepMerge(target: JsonObject, source: JsonObject): JsonObject {
  const output: JsonObject = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      const sourceValue = source[key];
      if (isObject(sourceValue)) {
        if (!(key in target))
          Object.assign(output, { [key]: sourceValue });
        else
          output[key] = deepMerge(target[key] as JsonObject, sourceValue);
      } else {
        if (sourceValue !== undefined && sourceValue !== null && sourceValue !== '') {
          Object.assign(output, { [key]: sourceValue });
        }
      }
    });
  }
  return output;
}

export async function getSiteContent() {
  const content = await prisma.siteContent.findUnique({
    where: { id: 1 },
  });

  if (!content) {
    const newContent = await prisma.siteContent.create({
      data: {
        id: 1,
        data: defaultContent,
      },
    });
    return newContent.data as unknown as SiteContentData;
  }

  let data = content.data as unknown as SiteContentData;

  // Merge with default content to ensure all fields exist
  data = deepMerge(defaultContent, data) as unknown as SiteContentData;

  // Ensure meta exists and merge fields from columns if available
  if (data.meta) {
    if (content.copyright) data.meta.copyright = content.copyright;
    if (content.siteName) data.meta.siteName = content.siteName;
    if (content.siteDescription) data.meta.siteDescription = content.siteDescription;
    if (content.siteUrl) data.meta.siteUrl = content.siteUrl;
    if (content.siteLang) data.meta.siteLang = content.siteLang;
    if (content.faviconUrl) data.meta.faviconUrl = content.faviconUrl;
    if (content.ogImageUrl) data.meta.ogImageUrl = content.ogImageUrl;
  }

  return data;
}

export async function updateSiteContent(section: string, data: JsonObject) {
  const currentContent = await getSiteContent();

  const updatedData = {
    ...currentContent,
    [section]: data,
  };

  const content = await prisma.siteContent.update({
    where: { id: 1 },
    data: {
      data: updatedData as unknown as Prisma.InputJsonValue,
      ...(section === 'meta' ? {
        copyright: (data.copyright as string) || '',
        siteName: (data.siteName as string) || '',
        siteDescription: (data.siteDescription as string) || '',
        siteUrl: (data.siteUrl as string) || '',
        siteLang: (data.siteLang as string) || '',
        faviconUrl: (data.faviconUrl as string) || '',
        ogImageUrl: (data.ogImageUrl as string) || ''
      } : {}),
    },
  });

  const resultData = content.data as unknown as SiteContentData;
  if (resultData.meta) {
    if (content.copyright) resultData.meta.copyright = content.copyright;
    if (content.siteName) resultData.meta.siteName = content.siteName;
    if (content.siteDescription) resultData.meta.siteDescription = content.siteDescription;
    if (content.siteUrl) resultData.meta.siteUrl = content.siteUrl;
    if (content.siteLang) resultData.meta.siteLang = content.siteLang;
    if (content.faviconUrl) resultData.meta.faviconUrl = content.faviconUrl;
    if (content.ogImageUrl) resultData.meta.ogImageUrl = content.ogImageUrl;
  }

  return resultData;
}
