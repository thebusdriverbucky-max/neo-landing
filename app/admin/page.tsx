import { getSiteContent } from '@/lib/content';
import AdminNav from './_components/AdminNav';
import MetaEditor from './_components/MetaEditor';
import HeroEditor from './_components/HeroEditor';
import AboutEditor from './_components/AboutEditor';
import ServicesEditor from './_components/ServicesEditor';
import GalleryEditor from './_components/GalleryEditor';
import BookingEditor from './_components/BookingEditor';
import ContactEditor from './_components/ContactEditor';
import MessagesManager from './_components/MessagesManager';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret');
    await jwtVerify(token, secret);
  } catch (error) {
    redirect('/admin/login');
  }
}

export default async function AdminPage() {
  await checkAuth();
  const content = await getSiteContent();

  return (
    <div className="flex min-h-screen bg-neutral-950 overflow-x-hidden">
      <AdminNav />

      <main className="flex-1 w-full lg:ml-64 p-4 md:p-6 lg:p-10 pt-24 lg:pt-10 space-y-12 overflow-x-hidden">
        <div className="max-w-4xl mx-auto space-y-12 w-full">
          <div className="px-2 md:px-0">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Content Management</h1>
            <p className="text-neutral-400">Edit your landing page sections in real time.</p>
          </div>

          <MetaEditor initialData={content.meta} />
          <HeroEditor initialData={content.hero} />
          <AboutEditor initialData={content.about} />
          <ServicesEditor initialData={content.services} />
          <GalleryEditor initialData={content.gallery} />
          <BookingEditor initialData={content.booking} />
          <ContactEditor initialData={content.contact} />
          <MessagesManager />
        </div>
      </main>
    </div>
  );
}
