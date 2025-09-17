'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Search, Building2 } from 'lucide-react'
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
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Company Data Intelligence
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Enter a company name and email to automatically scrape and enrich their profile data using AI agents.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Start Company Analysis
          </CardTitle>
          <CardDescription>
            We'll discover the company's website, extract key information, and provide you with a comprehensive profile for review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="e.g., Acme Corporation"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                disabled={createJobMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="officialEmail">Official Email *</Label>
              <Input
                id="officialEmail"
                type="email"
                placeholder="e.g., contact@acme.com"
                value={officialEmail}
                onChange={(e) => setOfficialEmail(e.target.value)}
                required
                disabled={createJobMutation.isPending}
              />
              <p className="text-sm text-gray-500">
                This helps us verify the company domain and contact information.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">Company Domain</Label>
              <Input
                id="domain"
                type="text"
                placeholder="e.g., acme.com (optional - we can detect from email)"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                disabled={createJobMutation.isPending}
              />
              <p className="text-sm text-gray-500">
                Optional: Specify if different from email domain or for better accuracy.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="competitorDomains">3 Main Competitor Domains</Label>
              <Input
                id="competitorDomains"
                type="text"
                placeholder="e.g., competitor1.com, competitor2.com, competitor3.com"
                value={competitorDomains}
                onChange={(e) => setCompetitorDomains(e.target.value)}
                disabled={createJobMutation.isPending}
              />
              <p className="text-sm text-gray-500">
                Optional: Comma-separated list of your main competitors' domains for better analysis.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mainLocations">3 Main Locations/Regions</Label>
              <Input
                id="mainLocations"
                type="text"
                placeholder="e.g., New York City, Los Angeles, Chicago"
                value={mainLocations}
                onChange={(e) => setMainLocations(e.target.value)}
                disabled={createJobMutation.isPending}
              />
              <p className="text-sm text-gray-500">
                Optional: Your primary service areas or target locations for location-based analysis.
              </p>
            </div>

            {createJobMutation.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {createJobMutation.error instanceof Error 
                    ? createJobMutation.error.message 
                    : 'Failed to create scraping job. Please try again.'}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={createJobMutation.isPending || !companyName.trim() || !officialEmail.trim()}
            >
              {createJobMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Analysis Job...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Start Analysis
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">What we'll discover:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Official website and domain verification</li>
              <li>• Headquarters address and contact information</li>
              <li>• Industry classification and company description</li>
              <li>• Founding year and employee count estimates</li>
              <li>• Social media profiles and logo</li>
              <li>• AI-powered data reconciliation and confidence scoring</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



