import { PrismaClient } from '@prisma/client';
import { defaultContent } from '../lib/default-content';

const prisma = new PrismaClient();

async function main() {
  const content = await prisma.siteContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      data: defaultContent,
      copyright: defaultContent.meta.copyright,
      siteName: defaultContent.meta.siteName,
      siteDescription: defaultContent.meta.siteDescription,
      siteUrl: defaultContent.meta.siteUrl,
      siteLang: defaultContent.meta.siteLang,
      faviconUrl: defaultContent.meta.faviconUrl,
      ogImageUrl: defaultContent.meta.ogImageUrl,
    },
  });

  console.log(
    `Required landing content is ready (SiteContent ${content.id}). Existing owner content was not changed.`,
  );
}

main()
  .catch((error) => {
    console.error('Database bootstrap error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
