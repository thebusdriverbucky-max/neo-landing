import { NextResponse } from 'next/server';
import { getSiteContent, updateSiteContent } from '@/lib/content';
import { isAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { ContentValidationError } from '@/lib/content-contract';

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const content = await getSiteContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error('Failed to fetch content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await request.json();
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return NextResponse.json({ error: 'Missing section or data' }, { status: 400 });
    }
    const { section, data } = payload as { section?: unknown; data?: unknown };
    if (!section || data === undefined) {
      return NextResponse.json({ error: 'Missing section or data' }, { status: 400 });
    }

    const updatedContent = await updateSiteContent(section, data);
    // Meta lives in the root layout and the sitemap, so refresh every page.
    revalidatePath('/', 'layout');
    revalidatePath('/sitemap.xml');
    return NextResponse.json(updatedContent);
  } catch (error) {
    if (error instanceof ContentValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
