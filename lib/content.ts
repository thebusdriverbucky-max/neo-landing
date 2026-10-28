import { cache } from 'react';
import prisma from './prisma';
import { Prisma } from '@prisma/client';
import { defaultContent, type SiteContentData } from './default-content';
import {
  mergeContentDefaults,
  validateContentUpdate,
  type JsonObject,
} from './content-contract';

export type { SiteContentData } from './default-content';

async function readSiteContent() {
  // Plain read on the hot path; the upsert only runs once, on an empty table.
  const content =
    (await prisma.siteContent.findUnique({ where: { id: 1 } })) ??
    (await prisma.siteContent.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        data: defaultContent,
      },
    }));

  let data = content.data as unknown as SiteContentData;

  // Merge with default content to ensure all fields exist
  data = mergeContentDefaults(defaultContent, data);

  // Ensure meta exists and merge fields from columns if available
  if (data.meta) {
    if (content.copyright !== null && content.copyright !== undefined) data.meta.copyright = content.copyright;
    if (content.siteName !== null && content.siteName !== undefined) data.meta.siteName = content.siteName;
    if (content.siteDescription !== null && content.siteDescription !== undefined) data.meta.siteDescription = content.siteDescription;
    if (content.siteUrl !== null && content.siteUrl !== undefined) data.meta.siteUrl = content.siteUrl;
    if (content.siteLang !== null && content.siteLang !== undefined) data.meta.siteLang = content.siteLang;
    if (content.faviconUrl !== null && content.faviconUrl !== undefined) data.meta.faviconUrl = content.faviconUrl;
    if (content.ogImageUrl !== null && content.ogImageUrl !== undefined) data.meta.ogImageUrl = content.ogImageUrl;
  }

  return data;
}

// One query per request: generateMetadata, the root layout and the page share it.
export const getSiteContent = cache(readSiteContent);

export async function updateSiteContent(section: unknown, data: unknown) {
  const validated = validateContentUpdate(section, data);
  const currentContent = await getSiteContent();
  const currentSection = currentContent[validated.section] as unknown as JsonObject;
  const updatedSection = {
    ...currentSection,
    ...validated.data,
  };

  const updatedData = {
    ...currentContent,
    [validated.section]: updatedSection,
  };

  const content = await prisma.siteContent.update({
    where: { id: 1 },
    data: {
      data: updatedData as unknown as Prisma.InputJsonValue,
      ...(validated.section === 'meta' ? {
        copyright: (updatedSection.copyright as string) || '',
        siteName: (updatedSection.siteName as string) || '',
        siteDescription: (updatedSection.siteDescription as string) || '',
        siteUrl: (updatedSection.siteUrl as string) || '',
        siteLang: (updatedSection.siteLang as string) || '',
        faviconUrl: (updatedSection.faviconUrl as string) || '',
        ogImageUrl: (updatedSection.ogImageUrl as string) || ''
      } : {}),
    },
  });

  const resultData = content.data as unknown as SiteContentData;
  if (resultData.meta) {
    if (content.copyright !== null && content.copyright !== undefined) resultData.meta.copyright = content.copyright;
    if (content.siteName !== null && content.siteName !== undefined) resultData.meta.siteName = content.siteName;
    if (content.siteDescription !== null && content.siteDescription !== undefined) resultData.meta.siteDescription = content.siteDescription;
    if (content.siteUrl !== null && content.siteUrl !== undefined) resultData.meta.siteUrl = content.siteUrl;
    if (content.siteLang !== null && content.siteLang !== undefined) resultData.meta.siteLang = content.siteLang;
    if (content.faviconUrl !== null && content.faviconUrl !== undefined) resultData.meta.faviconUrl = content.faviconUrl;
    if (content.ogImageUrl !== null && content.ogImageUrl !== undefined) resultData.meta.ogImageUrl = content.ogImageUrl;
  }

  return resultData;
}
