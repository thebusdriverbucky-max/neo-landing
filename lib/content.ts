import prisma from './prisma';
import { Prisma } from '@prisma/client';
import { defaultContent, type SiteContentData } from './default-content';

export type { SiteContentData } from './default-content';

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
  const content = await prisma.siteContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      data: defaultContent,
    },
  });

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
