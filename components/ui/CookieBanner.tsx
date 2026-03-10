"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-neutral-800 bg-neutral-900/95 p-6 shadow-2xl backdrop-blur-md sm:flex sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0 sm:pr-8">
          <p className="text-sm text-neutral-300">
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{" "}
            <Link href="/cookies" className="text-white underline underline-offset-4 hover:text-neutral-300 transition-colors">
              Learn more
            </Link>
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-3">
          <button
            onClick={handleDecline}
            className="rounded-full border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
