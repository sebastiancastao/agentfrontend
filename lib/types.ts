export enum JobStatus {
  QUEUED = 'queued',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface CompanyProfile {
  company_name: string
  official_email: string
  website?: string
  hq_address?: string
  phone?: string
  industry?: string
  description?: string
  year_founded?: number
  employee_count?: string
  logo_url?: string
  country?: string
  city?: string
  target_market?: string
  niche?: string
  services_offered?: string
  client_types?: string
  mission_statement?: string
  founding_story?: string
  why_started?: string
  company_values?: string
  // Competitor analysis
  main_keywords?: string[]
  competitors?: string[]
  competitor_urls?: string[]
  // Customer acquisition and growth strategy
  customer_acquisition_process?: string
  growth_strategies_that_work?: string
  ineffective_strategies?: string
  seo_and_advertising_approach?: string
  // Future goals and challenges
  main_business_goals_12_months?: string
  seo_ads_visibility_goals?: string
  current_blocking_factors?: string
  // Service and location priorities
  top_3_priority_services?: string
  service_areas_and_regions?: string
  // Content planning and Topic Authority Map
  topic_authority_map?: TopicAuthorityMap
  content_plan_summary?: string
  socials?: {
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
    youtube?: string
  }
  confidence_per_field?: Record<string, number>
}

export interface JobRequest {
  company_name: string
  official_email: string
  domain?: string
  competitor_domains?: string[]
  main_locations?: string[]
}

export interface JobResponse {
  id: string
  status: JobStatus
  company_name: string
  official_email: string
  created_at: string
  updated_at: string
  error?: string
  profile?: CompanyProfile
}

export interface Candidate {
  value: string
  score: number
  rank: number
}

export interface Source {
  url: string
  snippet: string
  score: number
}

export interface JobDetailResponse extends JobResponse {
  candidates?: Record<string, Candidate[]>
  sources?: Record<string, Source[]>
}

export interface ExportResponse {
  profile: CompanyProfile
  sources: Record<string, Source[]>
  metadata: Record<string, string>
}

export interface SupportingArticle {
  title: string
  keywords: string[]
  serp_features: string[]
  intent: string
  priority_score: number
}

export interface TopicPillar {
  topic: string
  intent: string
  seasonality?: string
  cluster_score: number
  pillar_page_h1: string
  supporting_articles: SupportingArticle[]
  local_entities_sample: string[]
  top_competing_urls: string[]
}

export interface TopicAuthorityMap {
  niche: string
  location: string
  language: string
  country_code: string
  pillars: TopicPillar[]
  total_keywords: number
  avg_search_volume: number
  content_gap_opportunities: string[]
}



