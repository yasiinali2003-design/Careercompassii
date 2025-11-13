/**
 * Pricing Page for Schools - 3-Tier Setup
 * Free / Yläaste (€1,200) / Premium (€2,000)
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Takaisin etusivulle
          </Link>
        </div>
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            CareerCompassi Kouluille
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Moderni ja helppokäyttöinen uraohjaustyökalu oppilaitoksille
          </p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            361 uramahdollisuutta koko Suomesta • 75 modernia tulevaisuuden ammattia • Edistyneet analytiikkatyökalut
          </p>
        </div>

        {/* 3-Tier Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Tier 1: Free */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">ILMAINEN</CardTitle>
              <CardDescription>Yksityiskäyttäjille</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">0€</span>
                <span className="text-gray-600">/vuosi</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="mr-2 text-green-500" size={20} />
                  <span>Perus-urapolku-testi</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 text-green-500" size={20} />
                  <span>Henkilökohtaiset tulokset</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 text-green-500" size={20} />
                  <span>361 eri ammattimahdollisuutta (sis. 75 modernia uraa)</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 text-green-500" size={20} />
                  <span>GDPR-yhteensopiva</span>
                </li>
              </ul>
              <Link href="/test">
                <Button className="w-full" variant="outline">
                  Kokeile ilmaiseksi
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Tier 2: Yläaste */}
          <Card className="border-2 border-green-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                PERUSKOULUILLE
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">YLÄASTE</CardTitle>
              <CardDescription>7.-9. luokat</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">1 200€</span>
                <span className="text-gray-600">/vuosi</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="mr-2 text-green-500" size={20} />
                  <span>Kaikki ilmaiset ominaisuudet</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 text-green-500" size={20} />
                  <span>Opettajien hallintapaneeli</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 text-green-500" size={20} />
                  <span>PIN-koodien generointi</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 text-green-500" size={20} />
                  <span>Yksityiskohtaiset CSV-vienti</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 text-green-500" size={20} />
                  <span>Edistyneet analytiikkatyökalut</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 text-green-500" size={20} />
                  <span>Ulottuvuuksien yksityiskohtainen erittely</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 text-green-500" size={20} />
                  <span>Koulutuspolkujen visualisointi</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 text-green-500" size={20} />
                  <span>Koko Suomen kattava urakartta</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 text-green-500" size={20} />
                  <span>Sähköpostituki</span>
                </li>
              </ul>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Ota yhteyttä
              </Button>
            </CardContent>
          </Card>

          {/* Tier 3: Premium */}
          <Card className="border-2 border-blue-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                SUOSITELTU
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">PREMIUM</CardTitle>
              <CardDescription>Lukio & Ammattikoulu</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">2 000€</span>
                <span className="text-gray-600">/vuosi</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="mr-2 text-blue-500" size={20} />
                  <span>Kaikki Yläaste-ominaisuudet</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 text-blue-500" size={20} />
                  <span>PDF-raporttien generointi (oppilas & luokka)</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 text-blue-500" size={20} />
                  <span>Trendianalyysit ja vertailut ajanjaksolta</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 text-blue-500" size={20} />
                  <span>Luokkien väliset vertailuanalyysit</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 text-blue-500" size={20} />
                  <span>5 vuoden historiadata ja kehitysraportit</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 text-blue-500" size={20} />
                  <span>Nopea tuki ja henkilökohtainen käyttöohjeistus</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 text-blue-500" size={20} />
                  <span>API-integraatiot koulujen järjestelmiin</span>
                </li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Ota yhteyttä
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feature Comparison Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              Vertailutaulukko
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-3 text-left">Ominaisuus</th>
                    <th className="border p-3 text-center">Ilmainen</th>
                    <th className="border p-3 text-center">Yläaste</th>
                    <th className="border p-3 text-center">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-3">Urapolku-testi</td>
                    <td className="border p-3 text-center">✓</td>
                    <td className="border p-3 text-center">✓</td>
                    <td className="border p-3 text-center">✓</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-3">Opettajien hallintapaneeli</td>
                    <td className="border p-3 text-center">—</td>
                    <td className="border p-3 text-center">✓</td>
                    <td className="border p-3 text-center">✓</td>
                  </tr>
                  <tr>
                    <td className="border p-3">CSV-vienti</td>
                    <td className="border p-3 text-center">—</td>
                    <td className="border p-3 text-center">✓</td>
                    <td className="border p-3 text-center">✓</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-3">Analyyttiset työkalut</td>
                    <td className="border p-3 text-center">—</td>
                    <td className="border p-3 text-center">Edistyneet</td>
                    <td className="border p-3 text-center">Edistyneet + trendivertailut</td>
                  </tr>
                  <tr>
                    <td className="border p-3">PDF-raportit</td>
                    <td className="border p-3 text-center">—</td>
                    <td className="border p-3 text-center">—</td>
                    <td className="border p-3 text-center">✓</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-3">Tietojen säilytys</td>
                    <td className="border p-3 text-center">—</td>
                    <td className="border p-3 text-center">1 vuosi</td>
                    <td className="border p-3 text-center">5 vuotta</td>
                  </tr>
                  <tr>
                    <td className="border p-3">Tuki</td>
                    <td className="border p-3 text-center">—</td>
                    <td className="border p-3 text-center">Sähköposti</td>
                    <td className="border p-3 text-center">Nopea tuki ja käyttöohjeistus</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-3">API-pääsy</td>
                    <td className="border p-3 text-center">—</td>
                    <td className="border p-3 text-center">—</td>
                    <td className="border p-3 text-center">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Valmis aloittamaan?
          </h2>
          <p className="text-gray-600 mb-8">
            Ota yhteyttä niin järjestämme keskustelun ja demo-session
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/test">
              <Button size="lg" variant="outline">
                Kokeile ilmaiseksi
              </Button>
            </Link>
            <Button size="lg" className="bg-blue-600">
              Ota yhteyttä
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
