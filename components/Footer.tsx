import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Urakompassi • © 2025
          </p>
          <p className="text-sm text-gray-600">
            Tulevaisuus alkaa itsensä löytämisestä
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-gray-600 md:text-right" />
      </div>
    </footer>
  );
}

