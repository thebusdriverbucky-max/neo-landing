import { getSiteContent } from "@/lib/content";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Gallery from "@/components/sections/Gallery";
import BookingForm from "@/components/sections/BookingForm";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

// Static page, regenerated when the admin saves content (see
// app/api/admin/content). The hourly window only picks up edits made directly
// in the database. If the database is down during regeneration, the last good
// page keeps being served.
export const revalidate = 3600;

export default async function Home() {
  const content = await getSiteContent();

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar content={{
        ...(content?.navbar || {}),
        logoText: content?.meta?.logoText,
        logoImageUrl: content?.meta?.logoImageUrl
      }} />
      <Hero content={content?.hero} />
      <About content={content?.about} />
      <Services content={content?.services} />
      <Gallery content={content?.gallery} />
      <BookingForm content={content?.booking} />
      <Contact content={content?.contact} />
      <Footer copyright={content?.meta?.copyright} />
    </main>
  );
}
