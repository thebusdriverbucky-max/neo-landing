import { NextResponse } from 'next/server';
import { getSiteContent, updateSiteContent } from '@/lib/content';
import { isAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

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
    const { section, data } = await request.json();
    if (!section || !data) {
      return NextResponse.json({ error: 'Missing section or data' }, { status: 400 });
    }

    const updatedContent = await updateSiteContent(section, data);
    revalidatePath('/');
    return NextResponse.json(updatedContent);
  } catch {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
