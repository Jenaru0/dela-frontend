'use client'
import React from 'react'
import Layout from '@/components/layout/Layout'
import ContactoHeroSection from '@/components/sections/ContactoHeroSection'
import ContactoFormSection from '@/components/sections/ContactoFormSection'
import ContactoInfoSection from '@/components/sections/ContactoInfoSection'

export default function ContactoPage() {
  return (
    <Layout>
      <ContactoHeroSection />
      <ContactoInfoSection />
      <ContactoFormSection />
    </Layout>
  )
}
