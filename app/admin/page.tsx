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

export default async function AdminPage() {
  const content = await getSiteContent();

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AdminNav />

      <main className="flex-1 ml-64 p-10 space-y-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Content Management</h1>
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
