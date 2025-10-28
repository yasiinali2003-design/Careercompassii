/**
 * Pricing Page for Schools
 * "Kouluille" = "For Schools"
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            CareerCompass Kouluille
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Moderni ja helppokäyttöinen työohjauksen työkalu oppilaitoksille
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Free - Public */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">JULKINEN (ILMAINEN)</CardTitle>
              <CardDescription>Kaikille ilmainen</CardDescription>
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
                  <span>175 eri ammattimahdollisuutta</span>
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

          {/* School Package */}
          <Card className="border-2 border-blue-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                SUOSITELTU KORKEAKOULUILLE
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">KORKEAKOULU PAKETTI</CardTitle>
              <CardDescription>Helppo koulun käyttöön</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">1 500€</span>
                <span className="text-gray-600">/vuosi</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="mr-2 text-blue-500" size={20} />
                  <span>Kaikki julkiset ominaisuudet</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 text-blue-500" size={20} />
                  <span>Opettajien hallintapaneeli</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 text-blue-500" size={20} />
                  <span>Lokituksen tulosten seuranta</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 text-blue-500" size={20} />
                  <span>CSV-vienti tuloksille</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 text-blue-500" size={20} />
                  <span>Analyyttiset työkalut</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 text-blue-500" size={20} />
                  <span>Tekninen tuki</span>
                </li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Ota yhteyttä
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              Mitä sisältyy korkeakoulu pakettiin?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Opettajien hallintapaneeli</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Luo tunteja ja generaattori PIN-koodit</li>
                  <li>✓ Seuraa tuloksia reaaliajassa</li>
                  <li>✓ Tulosten exportaminen CSV-muodossa</li>
                  <li>✓ Anonyymit tulokset (GDPR-turvalliset)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Analytiikka & raportointi</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Yleisimmät kiinnostusten kohteet</li>
                  <li>✓ Tulosten trendianalyysi</li>
                  <li>✓ Raportit ryhmille tai kaikille oppilaille</li>
                  <li>✓ Kustomoitavat raportit</li>
                </ul>
              </div>
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

