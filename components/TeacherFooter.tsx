import Link from 'next/link';

export default function TeacherFooter() {
  return (
    <footer className="border-t border-gray-200 py-8 bg-gray-50 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-sm">
            <p className="font-semibold mb-2 text-gray-900">Navigointi</p>
            <ul className="space-y-1">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 hover:underline transition-colors">
                  Etusivu
                </Link>
              </li>
              <li>
                <Link href="/teacher/classes" className="text-gray-600 hover:text-gray-900 hover:underline transition-colors">
                  Omat luokat
                </Link>
              </li>
              <li>
                <Link href="/teacher/classes/new" className="text-gray-600 hover:text-gray-900 hover:underline transition-colors">
                  Luo uusi luokka
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-sm">
            <p className="font-semibold mb-2 text-gray-900">Laki ja tietosuoja</p>
            <ul className="space-y-1">
              <li>
                <Link href="/legal/kayttoehdot" className="text-gray-600 hover:text-gray-900 hover:underline transition-colors">
                  Käyttöehdot
                </Link>
              </li>
              <li>
                <Link href="/legal/tietosuojaseloste" className="text-gray-600 hover:text-gray-900 hover:underline transition-colors">
                  Tietosuojaseloste
                </Link>
              </li>
              <li>
                <Link href="/legal/immateriaalioikeus-ja-kilpailijasuoja" className="text-gray-600 hover:text-gray-900 hover:underline transition-colors">
                  Immateriaalioikeus- ja kilpailijansuoja
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-sm">
            <p className="font-semibold mb-2 text-gray-900">Tuki</p>
            <p>
              <a 
                href="mailto:support@careercompassi.com" 
                className="text-gray-600 hover:text-gray-900 hover:underline transition-colors"
              >
                support@careercompassi.com
              </a>
            </p>
            <p className="text-gray-500 mt-4">
              Tulevaisuus alkaa itsensä löytämisestä • © 2025 CareerCompassi
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

