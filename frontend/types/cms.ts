// ==============================================================================
// IGENCO AI — Headless CMS TypeScript Interfaces (Matching Strapi Content Types)
// ==============================================================================

export interface BilingualText {
  th: string
  en: string
}

export interface HeroContent {
  badge: BilingualText
  title: BilingualText
  subtitle: BilingualText
  primaryCtaText: BilingualText
  secondaryCtaText: BilingualText
  hintText: BilingualText
}

export interface CapabilityItem {
  id: string
  tag: string
  pillBadge: string
  subBadge?: string
  title: BilingualText
  description: BilingualText
  gridSpan: 'large' | 'medium' // 7 cols vs 5 cols
  theme: 'light' | 'dark'
  interactiveType: 'flow' | 'chart' | 'shield' | 'vision'
}

export interface IndustryBlueprint {
  key: string
  name: BilingualText
  tag: string
  title: BilingualText
  summary: BilingualText
  pipeline: string[]
  metric1: {
    value: string
    label: BilingualText
  }
  metric2: {
    value: string
    label: BilingualText
  }
}

export interface DeploymentModel {
  id: string
  code: string
  title: BilingualText
  description: BilingualText
  badge?: string
  features: BilingualText[]
  theme: 'light' | 'highlight' | 'dark'
}

export interface PartnerBrand {
  id: string
  name: string
  tagline?: string
}

export interface DemoLeadForm {
  fullName: string
  workEmail: string
  companyName: string
  industry?: string
  notes?: string
}
