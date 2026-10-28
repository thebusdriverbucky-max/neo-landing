import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  CMS_SECTION_FIELDS,
  ContentValidationError,
  mergeContentDefaults,
  validateContentUpdate,
} from '../lib/content-contract';
import { defaultContent } from '../lib/default-content';
import { moduleLoader } from './helpers/load-module';

function source(relativePath: string): string {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), 'utf8');
}

test('Hero has a bundled neutral background without restoring a removed customer image', () => {
  assert.equal(defaultContent.hero.backgroundImage, '/images/hero-neutral.svg');
  assert.match(source('public/images/hero-neutral.svg'), /<svg/);
  assert.match(source('components/sections/Hero.tsx'), /url\(\/images\/hero-neutral\.svg\)/);
  assert.match(source('components/sections/Hero.tsx'), /content\.backgroundImage \?/);
  const cleared = mergeContentDefaults(defaultContent, { hero: { backgroundImage: '' } });
  assert.equal(cleared.hero.backgroundImage, '');
});

test('CMS contract contains only fields with an intended public consumer', () => {
  assert.deepEqual(
    Object.keys(defaultContent).sort(),
    Object.keys(CMS_SECTION_FIELDS).sort(),
  );
  for (const section of Object.keys(CMS_SECTION_FIELDS) as Array<keyof typeof CMS_SECTION_FIELDS>) {
    assert.deepEqual(
      Object.keys(defaultContent[section]).sort(),
      [...CMS_SECTION_FIELDS[section]].sort(),
      `default fields for ${section} must match the validated CMS contract`,
    );
  }
});

test('CMS updates preserve supported empty/false values and reject ignored fields', () => {
  for (const section of Object.keys(CMS_SECTION_FIELDS) as Array<keyof typeof CMS_SECTION_FIELDS>) {
    assert.doesNotThrow(() => validateContentUpdate(section, defaultContent[section]));
  }

  assert.doesNotThrow(() => validateContentUpdate('booking', { showDateField: false }));
  assert.doesNotThrow(() => validateContentUpdate('gallery', { images: [] }));
  assert.doesNotThrow(() => validateContentUpdate('contact', { facebook: '' }));
  assert.throws(
    () => validateContentUpdate('contact', { facebook: 'https://facebook.test', ignored: 'value' }),
    ContentValidationError,
  );
  assert.throws(
    () => validateContentUpdate('footer', { text: 'Legacy footer' }),
    ContentValidationError,
  );
  assert.throws(
    () => validateContentUpdate('navbar', { logo: 'Legacy logo' }),
    ContentValidationError,
  );
  assert.throws(
    () => validateContentUpdate('services', {
      items: [{ title: 'Service', description: 'Description', icon: '⭐', ignored: 'value' }],
    }),
    ContentValidationError,
  );
});

test('CMS default merging keeps explicit empty and false values', () => {
  const merged = mergeContentDefaults(defaultContent, {
    meta: { faviconUrl: '' },
    booking: { showDateField: false },
    gallery: { images: [] },
    contact: { email: '' },
  });

  assert.equal(merged.meta.faviconUrl, '');
  assert.equal(merged.booking.showDateField, false);
  assert.deepEqual(merged.gallery.images, []);
  assert.equal(merged.contact.email, '');
});

test('admin editors and public consumers cover the Landing CMS sections', () => {
  const adminPage = source('app/admin/page.tsx');
  const publicHome = source('app/page.tsx');
  const contactEditor = source('app/admin/_components/ContactEditor.tsx');
  const navbarEditor = source('app/admin/_components/NavbarEditor.tsx');
  const contact = source('components/sections/Contact.tsx');

  for (const editor of [
    'MetaEditor',
    'NavbarEditor',
    'HeroEditor',
    'AboutEditor',
    'ServicesEditor',
    'GalleryEditor',
    'BookingEditor',
    'ContactEditor',
    'LegalEditor',
  ]) {
    assert.match(adminPage, new RegExp(`<${editor} `));
  }

  for (const section of ['meta', 'navbar', 'hero', 'about', 'services', 'gallery', 'booking', 'contact']) {
    assert.match(publicHome, new RegExp(`content\\?\\.${section}`));
  }
  assert.match(contactEditor, /facebook/);
  assert.match(navbarEditor, /section: 'navbar'/);
  assert.match(contact, /content\.facebook/);

  assert.match(source('app/privacy-policy/page.tsx'), /privacyPolicy/);
  assert.match(source('app/terms-of-service/page.tsx'), /termsOfService/);
  assert.match(source('app/cookies/page.tsx'), /cookiePolicy/);
});

test('content update merges a partial section without dropping sibling fields', async () => {
  delete (globalThis as { prisma?: unknown }).prisma;
  const writes: Array<Record<string, unknown>> = [];
  const current = {
    id: 1,
    data: defaultContent,
    copyright: defaultContent.meta.copyright,
    siteName: defaultContent.meta.siteName,
    siteDescription: defaultContent.meta.siteDescription,
    siteUrl: defaultContent.meta.siteUrl,
    siteLang: defaultContent.meta.siteLang,
    faviconUrl: defaultContent.meta.faviconUrl,
    ogImageUrl: defaultContent.meta.ogImageUrl,
  };
  const siteContent = {
    findUnique: async () => current,
    update: async ({ data }: { data: Record<string, unknown> }) => {
      writes.push(data);
      return { ...current, ...data };
    },
  };
  const load = moduleLoader({
    '@prisma/client': {
      Prisma: {},
      PrismaClient: class {
        siteContent = siteContent;
      },
    },
  });
  const content = load('lib/content') as {
    updateSiteContent: (section: unknown, data: unknown) => Promise<unknown>;
  };

  await content.updateSiteContent('booking', { showDateField: false });

  const stored = writes[0].data as Record<string, unknown>;
  const booking = (stored.booking ?? {}) as Record<string, unknown>;
  assert.equal(booking.title, defaultContent.booking.title);
  assert.equal(booking.showDateField, false);
  assert.equal(booking.buttonText, defaultContent.booking.buttonText);
});

test('explicitly cleared meta columns remain cleared in the public content', async () => {
  delete (globalThis as { prisma?: unknown }).prisma;
  const load = moduleLoader({
    '@prisma/client': {
      Prisma: {},
      PrismaClient: class {
        siteContent = {
          findUnique: async () => ({
            id: 1,
            data: {
              ...defaultContent,
              meta: { ...defaultContent.meta, siteName: 'JSON value' },
            },
            copyright: '',
            siteName: '',
            siteDescription: null,
            siteUrl: null,
            siteLang: null,
            faviconUrl: null,
            ogImageUrl: null,
          }),
        };
      },
    },
  });
  const content = load('lib/content') as {
    getSiteContent: () => Promise<typeof defaultContent>;
  };

  const result = await content.getSiteContent();
  assert.equal(result.meta.siteName, '');
  assert.equal(result.meta.copyright, '');
});

test('public consumers do not reintroduce removed placeholder copy or image fallbacks', () => {
  for (const file of [
    'app/layout.tsx',
    'components/sections/Hero.tsx',
    'components/sections/About.tsx',
    'components/sections/Gallery.tsx',
    'components/sections/Contact.tsx',
    'components/sections/Footer.tsx',
  ]) {
    const content = source(file);
    assert.doesNotMatch(content, /images\.unsplash\.com/);
    assert.doesNotMatch(content, /Business Name|Neo Landing|Modern landing page template/);
  }
});
