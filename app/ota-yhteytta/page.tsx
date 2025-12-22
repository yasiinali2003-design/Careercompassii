"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";
import { Logo } from "@/components/Logo";

type OrganizationType = 'koulu' | 'oppilaitos' | 'yritys' | 'muu' | '';

export default function OtaYhteyttaPage() {
  const [scrolled, setScrolled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    organizationType: '' as OrganizationType,
    message: '',
    website: '', // Honeypot field
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
      } else {
        setError(data.error || 'Jokin meni pieleen. Yritä uudelleen.');
      }
    } catch {
      setError('Verkkovirhe. Tarkista yhteys ja yritä uudelleen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav
        className="sticky top-0 z-50 border-b transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(2, 6, 23, 0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderColor: scrolled ? "rgba(255, 255, 255, 0.08)" : "transparent",
        }}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
          <Button variant="outline" asChild className="border-slate-700 bg-transparent hover:bg-slate-800/50 hover:border-slate-600 text-slate-300">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Takaisin
            </Link>
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-sky-500/10 text-sky-400 text-sm font-medium tracking-wide mb-6">
              Yhteistyö
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              Ota yhteyttä
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Kiinnostaako Urakompassin tuominen oppilaitokseesi?
              Täytä lomake ja otamme sinuun yhteyttä.
            </p>
          </div>

          {isSubmitted ? (
            /* Success State */
            <div className="max-w-lg mx-auto">
              <div className="bg-gradient-to-b from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-10 text-center">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-3">
                  Kiitos yhteydenotostasi!
                </h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Olemme vastaanottaneet viestisi ja palaamme asiaan mahdollisimman pian.
                </p>
                <Button asChild className="bg-white text-slate-900 hover:bg-slate-100 font-medium px-8">
                  <Link href="/">Takaisin etusivulle</Link>
                </Button>
              </div>
            </div>
          ) : (
            /* Form Section */
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
              {/* Left: Info */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Miksi Urakompassi?
                  </h2>
                  <ul className="space-y-4 text-slate-400">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 flex-shrink-0"></span>
                      <span>Tutkimuspohjainen urasuunnittelutyökalu nuorille</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 flex-shrink-0"></span>
                      <span>Helppo integroida osaksi ohjauspalveluja</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 flex-shrink-0"></span>
                      <span>Opettajien hallintapaneeli tulosten seurantaan</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 flex-shrink-0"></span>
                      <span>GDPR-yhteensopiva ja turvallinen</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
                    Yhteystiedot
                  </h3>
                  <div className="space-y-3 text-slate-400">
                    <p>Urakompassi Oy</p>
                    <p>Helsinki, Finland</p>
                    <a
                      href="mailto:info@urakompassi.fi"
                      className="text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      info@urakompassi.fi
                    </a>
                  </div>
                </div>
              </div>

              {/* Right: Form */}
              <div className="lg:col-span-3">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 lg:p-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Honeypot - hidden from users */}
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    {/* Name & Email Row */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                          Nimi <span className="text-sky-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all"
                          placeholder="Etunimi Sukunimi"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                          Sähköposti <span className="text-sky-400">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all"
                          placeholder="nimi@esimerkki.fi"
                        />
                      </div>
                    </div>

                    {/* Organization & Type Row */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Organization */}
                      <div>
                        <label htmlFor="organization" className="block text-sm font-medium text-slate-300 mb-2">
                          Organisaatio
                        </label>
                        <input
                          type="text"
                          id="organization"
                          name="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all"
                          placeholder="Koulun nimi"
                        />
                      </div>

                      {/* Organization Type */}
                      <div>
                        <label htmlFor="organizationType" className="block text-sm font-medium text-slate-300 mb-2">
                          Tyyppi
                        </label>
                        <select
                          id="organizationType"
                          name="organizationType"
                          value={formData.organizationType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all appearance-none cursor-pointer"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 0.75rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.5em 1.5em',
                            paddingRight: '2.5rem'
                          }}
                        >
                          <option value="" className="bg-slate-800">Valitse...</option>
                          <option value="koulu" className="bg-slate-800">Peruskoulu</option>
                          <option value="oppilaitos" className="bg-slate-800">Lukio / Ammattikoulu</option>
                          <option value="yritys" className="bg-slate-800">Yritys</option>
                          <option value="muu" className="bg-slate-800">Muu</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                        Viesti <span className="text-sky-400">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all resize-none"
                        placeholder="Kerro, miten voimme auttaa..."
                      />
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
                        {error}
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-sky-500 hover:bg-sky-400 text-white py-3.5 text-base font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Lähetetään...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Send className="h-4 w-4" />
                          Lähetä viesti
                        </span>
                      )}
                    </Button>

                    {/* Privacy Note */}
                    <p className="text-xs text-slate-500 text-center pt-2">
                      Lähettämällä lomakkeen hyväksyt{' '}
                      <Link href="/legal/tietosuojaseloste" className="text-slate-400 hover:text-white underline underline-offset-2 transition-colors">
                        tietosuojaselosteen
                      </Link>
                      {' '}mukaiset käytännöt.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
