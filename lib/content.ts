import prisma from './prisma';

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

function deepMerge(target: any, source: any) {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = deepMerge(target[key], source[key]);
      } else {
        if (source[key] !== undefined && source[key] !== null && source[key] !== '') {
          Object.assign(output, { [key]: source[key] });
        }
      }
    });
  }
  return output;
}

function isObject(item: any) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export async function getSiteContent() {
  const content = await prisma.siteContent.findUnique({
    where: { id: 1 },
  }) as any;

  if (!content) {
    const newContent = await prisma.siteContent.create({
      data: {
        id: 1,
        data: defaultContent,
      },
    }) as any;
    return newContent.data;
  }

  let data = content.data as any;

  // Merge with default content to ensure all fields exist
  data = deepMerge(defaultContent, data);

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

export async function updateSiteContent(section: string, data: any) {
  const currentContent = await getSiteContent();

  const updatedData = {
    ...currentContent,
    [section]: data,
  };

  const content = await prisma.siteContent.update({
    where: { id: 1 },
    data: {
      data: updatedData,
      ...(section === 'meta' ? {
        copyright: data.copyright || '',
        siteName: data.siteName || '',
        siteDescription: data.siteDescription || '',
        siteUrl: data.siteUrl || '',
        siteLang: data.siteLang || '',
        faviconUrl: data.faviconUrl || '',
        ogImageUrl: data.ogImageUrl || ''
      } : {}),
    },
  }) as any;

  const resultData = content.data as any;
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
