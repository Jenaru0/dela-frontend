// web/src/app/nosotros/page.tsx
'use client'
import React from 'react'
import Layout from '@/components/layout/Layout'
import NuestraHistoriaSection from '@/components/sections/NuestraHistoriaSection'
import StatsCardsSection      from '@/components/sections/StatsCardsSection'
import BenefitsSection         from '@/components/sections/BenefitsSection'
import TimelineSection        from '@/components/sections/TimelineSection'

export default function NosotrosPage() {
  return (
    <Layout>
      <NuestraHistoriaSection />
      <StatsCardsSection />
      <TimelineSection />   
      <BenefitsSection />
    </Layout>
  )
}
