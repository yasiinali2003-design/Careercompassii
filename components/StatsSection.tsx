'use client'

import { Target, Compass, Rocket } from 'lucide-react'

interface BenefitCardProps {
  icon: React.ReactNode
  title: string
  description: string
  iconBg: string
  iconColor: string
}

function BenefitCard({ icon, title, description, iconBg, iconColor }: BenefitCardProps) {
  return (
    <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
      <div className={`w-16 h-16 mx-auto mb-4 ${iconBg} rounded-full flex items-center justify-center ${iconColor}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-neutral-300 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}

export default function StatsSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-3">
          Miten Urakompassi auttaa
        </h2>
        <p className="text-center text-neutral-300 mb-12 max-w-2xl mx-auto">
          Löydä sinulle sopiva urapolku kolmessa vaiheessa
        </p>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <BenefitCard
            icon={<Target className="w-8 h-8" />}
            iconBg="bg-[#2B5F75]/10"
            iconColor="text-[#2B5F75]"
            title="Löydä vahvuutesi"
            description="30 kysymystä paljastavat kiinnostuksesi, taitosi ja työskentelytyyppisi"
          />

          <BenefitCard
            icon={<Compass className="w-8 h-8" />}
            iconBg="bg-[#E8994A]/10"
            iconColor="text-[#E8994A]"
            title="Vertaile yli 600 uraa"
            description="Tarkastele palkkoja, työnäkymiä ja koulutuspolkuja eri ammattivaihtoehdoissa"
          />

          <BenefitCard
            icon={<Rocket className="w-8 h-8" />}
            iconBg="bg-[#4A7C59]/10"
            iconColor="text-[#4A7C59]"
            title="Aloita haku"
            description="Saat suorat linkit koulutusohjelmiin, pisterajoihin ja hakuohjeisiin"
          />
        </div>
      </div>
    </section>
  )
}
