import React from 'react';

export default function LicenseRequiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-red-500">
            License Inactive
          </h1>
          <p className="text-neutral-400 text-lg">
            To continue using this website, you must activate your license key.
          </p>
        </div>
        
        <div className="p-6 bg-neutral-900 rounded-2xl border border-neutral-800">
          <p className="text-sm text-neutral-500 mb-4">
            If you are the owner of this site, please check your LICENSE_KEY settings in the .env file or contact support.
          </p>
          <a 
            href="mailto:support@example.com"
            className="inline-block w-full py-3 px-4 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors"
          >
            Contact Support
          </a>
        </div>
        
        <p className="text-xs text-neutral-600">
          Neo Landing Protection System
        </p>
      </div>
    </div>
  );
}
