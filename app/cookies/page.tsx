import { getSiteContent } from "@/lib/content";
import Link from "next/link";
import Footer from "@/components/sections/Footer";

export const dynamic = 'force-dynamic';

export default async function CookiesPage() {
  const content = await getSiteContent();
  const text = content.legal?.cookiePolicy || "Cookie Policy content is not available.";

  return (
    <main className="min-h-screen bg-primary text-white flex flex-col">
      <div className="flex-grow container-custom max-w-4xl py-20 md:py-32">
        <Link href="/" className="text-secondary hover:text-white transition-colors mb-8 inline-block text-sm uppercase tracking-widest">
          &larr; Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-12 tracking-tight">Cookie Policy</h1>
        <div className="prose prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-white/80 leading-relaxed font-sans">
            {text}
          </div>
        </div>
      </div>
      <Footer copyright={content?.meta?.copyright} />
    </main>
  );
}
