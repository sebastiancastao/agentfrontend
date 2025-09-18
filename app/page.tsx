'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Search, Sparkles, CheckCircle } from 'lucide-react'
import { createJob } from '@/lib/api'

export default function HomePage() {
  const [companyName, setCompanyName] = useState('')
  const [officialEmail, setOfficialEmail] = useState('')
  const [domain, setDomain] = useState('')
  const [competitorDomains, setCompetitorDomains] = useState('')
  const [mainLocations, setMainLocations] = useState('')
  const router = useRouter()

  const createJobMutation = useMutation({
    mutationFn: createJob,
    onSuccess: (data) => {
      router.push(`/jobs/${data.id}`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName.trim() || !officialEmail.trim()) return
    
    // Process competitor domains and locations
    const competitorDomainsArray = competitorDomains
      ? competitorDomains.split(',').map(d => d.trim()).filter(d => d.length > 0)
      : undefined
    
    const mainLocationsArray = mainLocations
      ? mainLocations.split(',').map(l => l.trim()).filter(l => l.length > 0)
      : undefined
    
    createJobMutation.mutate({
      company_name: companyName.trim(),
      official_email: officialEmail.trim(),
      domain: domain.trim() || undefined,
      competitor_domains: competitorDomainsArray,
      main_locations: mainLocationsArray,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
     

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Company Analysis Form */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Start Your AI Analysis</h2>
              <p className="text-slate-400">
                Let our AI agents analyze your business and discover proven growth opportunities
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-slate-200 font-medium">Company Name *</Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="e.g., Acme Corporation"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    disabled={createJobMutation.isPending}
                    className="bg-blue-900/30 border-blue-700/50 text-white placeholder:text-blue-300/70 focus:border-blue-400 focus:ring-blue-400 focus:bg-blue-800/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="officialEmail" className="text-slate-200 font-medium">Official Email *</Label>
                  <Input
                    id="officialEmail"
                    type="email"
                    placeholder="e.g., contact@acme.com"
                    value={officialEmail}
                    onChange={(e) => setOfficialEmail(e.target.value)}
                    required
                    disabled={createJobMutation.isPending}
                    className="bg-blue-900/30 border-blue-700/50 text-white placeholder:text-blue-300/70 focus:border-blue-400 focus:ring-blue-400 focus:bg-blue-800/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain" className="text-slate-200 font-medium">Company Domain</Label>
                <Input
                  id="domain"
                  type="text"
                  placeholder="e.g., acme.com (optional - we can detect from email)"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  disabled={createJobMutation.isPending}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="competitorDomains" className="text-slate-200 font-medium">3 Main Competitor Domains</Label>
                <Input
                  id="competitorDomains"
                  type="text"
                  placeholder="e.g., competitor1.com, competitor2.com, competitor3.com"
                  value={competitorDomains}
                  onChange={(e) => setCompetitorDomains(e.target.value)}
                  disabled={createJobMutation.isPending}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mainLocations" className="text-slate-200 font-medium">3 Main Locations/Regions</Label>
                <Input
                  id="mainLocations"
                  type="text"
                  placeholder="e.g., New York City, Los Angeles, Chicago"
                  value={mainLocations}
                  onChange={(e) => setMainLocations(e.target.value)}
                  disabled={createJobMutation.isPending}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {createJobMutation.isError && (
                <Alert variant="destructive" className="bg-red-900/50 border-red-700 text-red-200">
                  <AlertDescription>
                    {createJobMutation.error instanceof Error 
                      ? createJobMutation.error.message 
                      : 'Failed to create analysis job. Please try again.'}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                disabled={createJobMutation.isPending || !companyName.trim() || !officialEmail.trim()}
              >
                {createJobMutation.isPending ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Analyzing Your Business...
                  </>
                ) : (
                  <>
                    <Search className="mr-3 h-5 w-5" />
                    Start AI Analysis
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* What Our AI Agents Will Discover */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            What our AI agents will discover
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Complete business intelligence profile",
              "Target market and niche analysis", 
              "Mission statement and founding story",
              "Customer acquisition strategies",
              "Growth opportunities and challenges",
              "Service priorities and locations",
              "Competitor analysis and positioning",
              "SEO keyword opportunities",
              "Topic authority content strategy"
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}



