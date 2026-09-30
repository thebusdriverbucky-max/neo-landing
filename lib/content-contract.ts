export type JsonObject = Record<string, unknown>;

export const CMS_SECTION_FIELDS = {
  meta: [
    'siteName',
    'siteDescription',
    'siteUrl',
    'siteLang',
    'faviconUrl',
    'ogImageUrl',
    'logoText',
    'logoImageUrl',
    'copyright',
  ],
  navbar: ['links'],
  hero: ['title', 'subtitle', 'buttonText', 'backgroundImage'],
  about: ['title', 'text', 'image', 'stats'],
  services: ['title', 'items'],
  gallery: ['title', 'images'],
  booking: ['title', 'subtitle', 'showDateField', 'buttonText'],
  contact: [
    'title',
    'phone',
    'email',
    'address',
    'workingHours',
    'googleMapsUrl',
    'whatsapp',
    'instagram',
    'facebook',
  ],
  legal: ['privacyPolicy', 'termsOfService', 'cookiePolicy'],
} as const;

export type CmsSection = keyof typeof CMS_SECTION_FIELDS;

export class ContentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContentValidationError';
  }
}

function isPlainObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function mergeContentDefaults<T extends JsonObject>(
  defaults: T,
  source: unknown,
): T {
  const merge = (target: JsonObject, value: JsonObject): JsonObject => {
    const output: JsonObject = { ...target };
    for (const [key, sourceValue] of Object.entries(value)) {
      if (isPlainObject(sourceValue)) {
        const targetValue = isPlainObject(target[key]) ? target[key] : {};
        output[key] = merge(targetValue, sourceValue);
      } else if (sourceValue !== undefined && sourceValue !== null) {
        // Empty strings and false are intentional CMS values, not missing data.
        output[key] = sourceValue;
      }
    }
    return output;
  };

  return (isPlainObject(source) ? merge(defaults, source) : defaults) as T;
}

function isObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isStats(value: unknown): boolean {
  return Array.isArray(value) && value.every((item) => (
    isObject(item)
    && Object.keys(item).every((key) => key === 'value' || key === 'label')
    && isString(item.value)
    && isString(item.label)
  ));
}

function isServices(value: unknown): boolean {
  return Array.isArray(value) && value.every((item) => (
    isObject(item)
    && Object.keys(item).every((key) => key === 'title' || key === 'description' || key === 'icon')
    && isString(item.title)
    && isString(item.description)
    && isString(item.icon)
  ));
}

const sectionValidators: Record<CmsSection, Record<string, (value: unknown) => boolean>> = {
  meta: {
    siteName: isString,
    siteDescription: isString,
    siteUrl: isString,
    siteLang: isString,
    faviconUrl: isString,
    ogImageUrl: isString,
    logoText: isString,
    logoImageUrl: isString,
    copyright: isString,
  },
  navbar: {
    links: isStringArray,
  },
  hero: {
    title: isString,
    subtitle: isString,
    buttonText: isString,
    backgroundImage: isString,
  },
  about: {
    title: isString,
    text: isString,
    image: isString,
    stats: isStats,
  },
  services: {
    title: isString,
    items: isServices,
  },
  gallery: {
    title: isString,
    images: isStringArray,
  },
  booking: {
    title: isString,
    subtitle: isString,
    showDateField: (value) => typeof value === 'boolean',
    buttonText: isString,
  },
  contact: {
    title: isString,
    phone: isString,
    email: isString,
    address: isString,
    workingHours: isString,
    googleMapsUrl: isString,
    whatsapp: isString,
    instagram: isString,
    facebook: isString,
  },
  legal: {
    privacyPolicy: isString,
    termsOfService: isString,
    cookiePolicy: isString,
  },
};

function isCmsSection(value: unknown): value is CmsSection {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(sectionValidators, value);
}

export function validateContentUpdate(
  section: unknown,
  data: unknown,
): { section: CmsSection; data: JsonObject } {
  if (!isCmsSection(section)) {
    throw new ContentValidationError('Unsupported content section');
  }
  if (!isObject(data)) {
    throw new ContentValidationError('Content data must be an object');
  }

  const validators = sectionValidators[section];
  for (const [field, value] of Object.entries(data)) {
    const validator = validators[field];
    if (!validator) {
      throw new ContentValidationError(`Unsupported field "${field}" in ${section}`);
    }
    if (!validator(value)) {
      throw new ContentValidationError(`Invalid field "${field}" in ${section}`);
    }
  }

  return { section, data };
}
