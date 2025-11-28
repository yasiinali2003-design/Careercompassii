import Link from 'next/link';

export default function TeacherFooter() {
  return (
    <footer className="border-t border-gray-200 py-8 bg-neutral-900/20 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-sm">
            <p className="font-semibold mb-2 text-gray-900">Navigointi</p>
            <ul className="space-y-1">
              <li>
                <Link href="/" className="text-neutral-300 hover:text-gray-900 hover:underline transition-colors">
                  Etusivu
                </Link>
              </li>
              <li>
                <Link href="/teacher/classes" className="text-neutral-300 hover:text-gray-900 hover:underline transition-colors">
                  Omat luokat
                </Link>
              </li>
              <li>
                <Link href="/teacher/classes/new" className="text-neutral-300 hover:text-gray-900 hover:underline transition-colors">
                  Luo uusi luokka
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-sm">
            <p className="font-semibold mb-2 text-gray-900">Laki ja tietosuoja</p>
            <ul className="space-y-1">
              <li>
                <Link href="/legal/kayttoehdot" className="text-neutral-300 hover:text-gray-900 hover:underline transition-colors">
                  Käyttöehdot
                </Link>
              </li>
              <li>
                <Link href="/legal/tietosuojaseloste" className="text-neutral-300 hover:text-gray-900 hover:underline transition-colors">
                  Tietosuojaseloste
                </Link>
              </li>
              <li>
                <Link href="/legal/immateriaalioikeus-ja-kilpailijasuoja" className="text-neutral-300 hover:text-gray-900 hover:underline transition-colors">
                  Immateriaalioikeus- ja kilpailijansuoja
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-sm">
            <p className="font-semibold mb-2 text-gray-900">Tuki</p>
            <p>
              <a 
                href="mailto:support@urakompassi.com" 
                className="text-neutral-300 hover:text-gray-900 hover:underline transition-colors"
              >
                support@urakompassi.com
              </a>
            </p>
            <p className="text-neutral-400 mt-4">
              Tulevaisuus alkaa itsensä löytämisestä • © 2025 Urakompassi
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}




