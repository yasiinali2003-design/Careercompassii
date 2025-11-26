'use client'

import { Briefcase, GraduationCap, TrendingUp } from 'lucide-react'

interface StatCardProps {
  icon: React.ReactNode
  value: string
  label: string
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="relative bg-gradient-to-br from-[#1f2937] to-[#020617] rounded-2xl p-6 border border-[#242938] shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:border-[#2B5F75]/50">
      {/* Accent border on hover */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2B5F75] via-[#E8994A] to-[#4A7C59] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-[#2B5F75]/10 flex items-center justify-center text-[#2B5F75] group-hover:bg-[#2B5F75]/20 transition-colors border border-[#2B5F75]/20">
          {icon}
        </div>
        <div>
          <div className="text-3xl font-bold text-white">
            {value}
          </div>
          <div className="text-sm text-gray-400">{label}</div>
        </div>
      </div>
    </div>
  )
}

export default function StatsSection() {
  return (
    <section className="py-12 bg-gradient-to-b from-[#0f1419]/80 to-transparent">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon={<Briefcase className="h-6 w-6" />}
            value="760"
            label="Eri ammattia"
          />
          <StatCard
            icon={<GraduationCap className="h-6 w-6" />}
            value="8"
            label="Koulutustasoa"
          />
          <StatCard
            icon={<TrendingUp className="h-6 w-6" />}
            value="30"
            label="Kysymystä testissä"
          />
        </div>
      </div>
    </section>
  )
}
