'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Edit3, Check, X } from 'lucide-react'
import { CompanyProfile, Source } from '@/lib/types'

interface ProfileEditorProps {
  profile: CompanyProfile
  onProfileChange: (profile: CompanyProfile) => void
  confidenceScores: Record<string, number>
  onViewSources: (field: string) => void
  sources: Record<string, Source[]>
}

export function ProfileEditor({
  profile,
  onProfileChange,
  confidenceScores,
  onViewSources,
  sources
}: ProfileEditorProps) {
  const [editingField, setEditingField] = useState<string | null>(null)
  const [tempValue, setTempValue] = useState<string>('')

  const handleStartEdit = (field: string, currentValue: any) => {
    setEditingField(field)
    setTempValue(currentValue?.toString() || '')
  }

  const handleSaveEdit = (field: string) => {
    const newProfile = { ...profile }
    
    if (field.startsWith('socials.')) {
      const socialKey = field.split('.')[1]
      if (!newProfile.socials) newProfile.socials = {}
      ;(newProfile.socials as any)[socialKey] = tempValue || undefined
    } else if (field === 'main_keywords' || field === 'competitors') {
      // Handle array fields - split by comma and trim
      const arrayValue = tempValue.split(',').map(item => item.trim()).filter(item => item.length > 0)
      ;(newProfile as any)[field] = arrayValue.length > 0 ? arrayValue : undefined
    } else if (field === 'competitor_urls') {
      // Handle URL array - split by newline and trim
      const urlArray = tempValue.split('\n').map(url => url.trim()).filter(url => url.length > 0)
      ;(newProfile as any)[field] = urlArray.length > 0 ? urlArray : undefined
    } else {
      // Handle type conversion
      let value: any = tempValue
      if (field === 'year_founded' && tempValue) {
        value = parseInt(tempValue)
      }
      ;(newProfile as any)[field] = value || undefined
    }
    
    onProfileChange(newProfile)
    setEditingField(null)
    setTempValue('')
  }

  const handleCancelEdit = () => {
    setEditingField(null)
    setTempValue('')
  }

  const getFieldValue = (field: string): string => {
    if (field.startsWith('socials.')) {
      const socialKey = field.split('.')[1]
      return (profile.socials as any)?.[socialKey] || ''
    }
    return (profile as any)[field]?.toString() || ''
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800'
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const formatConfidence = (score: number) => {
    return `${Math.round(score * 100)}%`
  }

  const fields = [
    { key: 'website', label: 'Website', type: 'url' },
    { key: 'hq_address', label: 'Headquarters Address', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'tel' },
    { key: 'industry', label: 'Industry', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'year_founded', label: 'Year Founded', type: 'number' },
    { key: 'employee_count', label: 'Employee Count', type: 'text' },
    { key: 'logo_url', label: 'Logo URL', type: 'url' },
    { key: 'country', label: 'Country', type: 'text' },
    { key: 'city', label: 'City', type: 'text' },
  ]

  const marketFields = [
    { key: 'target_market', label: 'Target Market', type: 'textarea' },
    { key: 'niche', label: 'Niche & Specialization', type: 'textarea' },
    { key: 'services_offered', label: 'Services Offered', type: 'textarea' },
    { key: 'client_types', label: 'Client Types', type: 'textarea' },
  ]

  const missionFields = [
    { key: 'mission_statement', label: 'Mission Statement', type: 'textarea' },
    { key: 'why_started', label: 'Why Did You Start Your Business?', type: 'textarea' },
    { key: 'founding_story', label: 'Founding Story', type: 'textarea' },
    { key: 'company_values', label: 'Company Values', type: 'textarea' },
  ]

  const socialFields = [
    { key: 'socials.linkedin', label: 'LinkedIn', type: 'url' },
    { key: 'socials.twitter', label: 'Twitter', type: 'url' },
    { key: 'socials.facebook', label: 'Facebook', type: 'url' },
    { key: 'socials.instagram', label: 'Instagram', type: 'url' },
    { key: 'socials.youtube', label: 'YouTube', type: 'url' },
  ]

  return (
    <div className="space-y-6">
      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Company Name</Label>
              <Input value={profile.company_name} disabled />
            </div>
            <div>
              <Label>Official Email</Label>
              <Input value={profile.official_email} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Fields */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field) => {
            const value = getFieldValue(field.key)
            const confidence = confidenceScores[field.key]
            const isEditing = editingField === field.key
            const hasSources = sources[field.key] && sources[field.key].length > 0

            return (
              <div key={field.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{field.label}</Label>
                  <div className="flex items-center gap-2">
                    {confidence && (
                      <Badge className={getConfidenceColor(confidence)}>
                        {formatConfidence(confidence)}
                      </Badge>
                    )}
                    {hasSources && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewSources(field.key)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Sources
                      </Button>
                    )}
                    {!isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartEdit(field.key, value)}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    {field.type === 'textarea' ? (
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    ) : (
                      <Input
                        type={field.type}
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                    <Button
                      size="sm"
                      onClick={() => handleSaveEdit(field.key)}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="min-h-[40px] p-2 border rounded-md bg-indigo-1000 text-sm">
                    {value || <span className="text-gray-400">Not available</span>}
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Mission & Founding Story */}
      <Card>
        <CardHeader>
          <CardTitle>Mission & Founding Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {missionFields.map((field) => {
            const value = getFieldValue(field.key)
            const confidence = confidenceScores[field.key]
            const isEditing = editingField === field.key
            const hasSources = sources[field.key] && sources[field.key].length > 0

            return (
              <div key={field.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{field.label}</Label>
                  <div className="flex items-center gap-2">
                    {confidence && (
                      <Badge className={getConfidenceColor(confidence)}>
                        {formatConfidence(confidence)}
                      </Badge>
                    )}
                    {hasSources && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewSources(field.key)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Sources
                      </Button>
                    )}
                    {!isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartEdit(field.key, value)}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <textarea
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(field.key)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="min-h-[80px] p-3 border rounded-md bg-indigo-1000 text-sm">
                    {value ? (
                      <div className="whitespace-pre-wrap">{value}</div>
                    ) : (
                      <span className="text-gray-400">
                        {field.key === 'mission_statement' && 'Mission statement will be extracted from about page'}
                        {field.key === 'why_started' && 'Founding motivation will be identified from company story'}
                        {field.key === 'founding_story' && 'Company founding story will be extracted'}
                        {field.key === 'company_values' && 'Core values will be identified from website'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Target Market & Niche */}
      <Card>
        <CardHeader>
          <CardTitle>Target Market & Business Intelligence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {marketFields.map((field) => {
            const value = getFieldValue(field.key)
            const confidence = confidenceScores[field.key]
            const isEditing = editingField === field.key
            const hasSources = sources[field.key] && sources[field.key].length > 0

            return (
              <div key={field.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{field.label}</Label>
                  <div className="flex items-center gap-2">
                    {confidence && (
                      <Badge className={getConfidenceColor(confidence)}>
                        {formatConfidence(confidence)}
                      </Badge>
                    )}
                    {hasSources && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewSources(field.key)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Sources
                      </Button>
                    )}
                    {!isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartEdit(field.key, value)}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <textarea
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(field.key)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="min-h-[60px] p-3 border rounded-md bg-indigo-1000 text-sm">
                    {value ? (
                      <div className="whitespace-pre-wrap">{value}</div>
                    ) : (
                      <span className="text-gray-400">
                        {field.key === 'target_market' && 'Target market will be identified from website analysis'}
                        {field.key === 'niche' && 'Company niche and specialization will be determined'}
                        {field.key === 'services_offered' && 'Services will be extracted from website content'}
                        {field.key === 'client_types' && 'Client patterns will be analyzed from customer sections'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {socialFields.map((field) => {
            const value = getFieldValue(field.key)
            const confidence = confidenceScores[field.key]
            const isEditing = editingField === field.key
            const hasSources = sources[field.key] && sources[field.key].length > 0

            return (
              <div key={field.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{field.label}</Label>
                  <div className="flex items-center gap-2">
                    {confidence && (
                      <Badge className={getConfidenceColor(confidence)}>
                        {formatConfidence(confidence)}
                      </Badge>
                    )}
                    {hasSources && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewSources(field.key)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Sources
                      </Button>
                    )}
                    {!isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartEdit(field.key, value)}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type={field.type}
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      placeholder={`Enter ${field.label} URL`}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSaveEdit(field.key)}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="min-h-[40px] p-2 border rounded-md bg-indigo-1000 text-sm">
                    {value ? (
                      <a 
                        href={value} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-gray-400">Not available</span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Competitor Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🏆</span> Competitor Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Main Keywords</Label>
            {editingField === 'main_keywords' ? (
              <div className="flex items-center gap-2 mt-2">
                <Input
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  placeholder="Enter keywords separated by commas"
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => handleSaveEdit('main_keywords')}
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-wrap gap-2">
                    {profile.main_keywords?.map((keyword, index) => (
                      <Badge key={index} variant="secondary">
                        {keyword}
                      </Badge>
                    )) || <span className="text-gray-500">Keywords will be extracted from website analysis</span>}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStartEdit('main_keywords', profile.main_keywords?.join(', ') || '')}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div>
            <Label>Direct Competitors</Label>
            {editingField === 'competitors' ? (
              <div className="flex items-center gap-2 mt-2">
                <Input
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  placeholder="Enter competitor names separated by commas"
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => handleSaveEdit('competitors')}
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-wrap gap-2">
                    {profile.competitors?.map((competitor, index) => (
                      <Badge key={index} variant="outline">
                        {competitor}
                      </Badge>
                    )) || <span className="text-gray-500">Competitors will be identified through keyword analysis</span>}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStartEdit('competitors', profile.competitors?.join(', ') || '')}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div>
            <Label>Competitor URLs</Label>
            {editingField === 'competitor_urls' ? (
              <div className="space-y-2 mt-2">
                <textarea
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  placeholder="Enter competitor URLs, one per line"
                  rows={5}
                  className="w-full p-2 border rounded-md text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSaveEdit('competitor_urls')}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <div className="flex items-start justify-between mb-2">
                  <div className="space-y-1 flex-1">
                    {profile.competitor_urls?.slice(0, 5).map((url, index) => (
                      <div key={index} className="text-sm">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {url}
                        </a>
                      </div>
                    )) || <span className="text-gray-500">Competitor URLs will be found via Google search</span>}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStartEdit('competitor_urls', profile.competitor_urls?.join('\n') || '')}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Acquisition & Growth Strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📈</span> Customer Acquisition & Growth Strategy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>How do you currently turn strangers into customers?</Label>
            <div className="mt-2 p-3 border rounded-md bg-indigo-1000 text-sm">
              {profile.customer_acquisition_process || <span className="text-gray-500">Customer acquisition process will be analyzed from website content</span>}
            </div>
          </div>
          <div>
            <Label>What has worked best to grow your business so far?</Label>
            <div className="mt-2 p-3 border rounded-md bg-indigo-1000 text-sm">
              {profile.growth_strategies_that_work || <span className="text-gray-500">Successful growth strategies will be identified</span>}
            </div>
          </div>
          <div>
            <Label>What hasn&apos;t worked or felt like a waste of time?</Label>
            <div className="mt-2 p-3 border rounded-md bg-indigo-1000 text-sm">
              {profile.ineffective_strategies || <span className="text-gray-500">Ineffective strategies will be analyzed</span>}
            </div>
          </div>
          <div>
            <Label>How do you currently use Search Engine Optimization or Search Advertising, if at all?</Label>
            <div className="mt-2 p-3 border rounded-md bg-indigo-1000 text-sm">
              {profile.seo_and_advertising_approach || <span className="text-gray-500">SEO and advertising approach will be determined</span>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Future Goals & Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🎯</span> Future Goals & Challenges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>What are your main business goals for the next 12 months?</Label>
            <div className="mt-2 p-3 border rounded-md bg-indigo-1000 text-sm">
              {profile.main_business_goals_12_months || <span className="text-gray-500">12-month business goals will be analyzed from company content</span>}
            </div>
          </div>
          <div>
            <Label>What specific SEO, Ads, or visibility goals do you have?</Label>
            <div className="mt-2 p-3 border rounded-md bg-indigo-1000 text-sm">
              {profile.seo_ads_visibility_goals || <span className="text-gray-500">SEO and advertising goals will be identified</span>}
            </div>
          </div>
          <div>
            <Label>What do you believe is blocking you from reaching your goals right now?</Label>
            <div className="mt-2 p-3 border rounded-md bg-indigo-1000 text-sm">
              {profile.current_blocking_factors || <span className="text-gray-500">Current challenges and blocking factors will be analyzed</span>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service & Location Priorities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🎯</span> Service & Location Priorities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>What are your top 3 priority services to promote first?</Label>
            <div className="mt-2 p-3 border rounded-md bg-indigo-1000 text-sm">
              {profile.top_3_priority_services || <span className="text-gray-500">Top priority services will be identified from website content and offerings</span>}
            </div>
          </div>
          <div>
            <Label>What areas or regions do you serve? What are your top 3 priority locations?</Label>
            <div className="mt-2 p-3 border rounded-md bg-indigo-1000 text-sm">
              {profile.service_areas_and_regions || <span className="text-gray-500">Service areas and priority locations will be analyzed from company information</span>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topic Authority Map & Content Planning */}
      {profile.topic_authority_map && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📝</span> Topic Authority Map & Content Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Content Plan Summary */}
            <div>
              <Label className="text-lg font-semibold">Content Strategy Overview</Label>
              <div className="mt-2 p-4 border rounded-md bg-blue-50 text-sm">
                {profile.content_plan_summary || "Content strategy summary will be generated based on keyword research"}
              </div>
            </div>

            {/* Topic Authority Map Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-indigo-1000 rounded-md">
                <div className="text-2xl font-bold text-blue-600">{profile.topic_authority_map.total_keywords || 0}</div>
                <div className="text-sm text-gray-600">Total Keywords</div>
              </div>
              <div className="text-center p-3 bg-indigo-1000 rounded-md">
                <div className="text-2xl font-bold text-green-600">{profile.topic_authority_map.pillars?.length || 0}</div>
                <div className="text-sm text-gray-600">Topic Pillars</div>
              </div>
              <div className="text-center p-3 bg-indigo-1000 rounded-md">
                <div className="text-2xl font-bold text-purple-600">{profile.topic_authority_map.avg_search_volume || 0}</div>
                <div className="text-sm text-gray-600">Avg Search Volume</div>
              </div>
            </div>

            {/* Topic Pillars */}
            <div>
              <Label className="text-lg font-semibold">Content Pillars & Supporting Articles</Label>
              <div className="mt-3 space-y-4">
                {profile.topic_authority_map.pillars?.map((pillar, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg text-gray-900">{pillar.topic}</h4>
                      <div className="flex gap-2">
                        <Badge variant={pillar.intent === 'Local-Commercial' ? 'default' : 'secondary'}>
                          {pillar.intent}
                        </Badge>
                        <Badge variant="outline">
                          Score: {(pillar.cluster_score * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <Label className="text-sm font-medium text-gray-700">Pillar Page H1:</Label>
                      <p className="text-sm text-blue-600 font-medium">{pillar.pillar_page_h1}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Supporting Articles:</Label>
                      <div className="mt-2 space-y-2">
                        {pillar.supporting_articles?.map((article, articleIndex) => (
                          <div key={articleIndex} className="p-3 bg-indigo-1000 rounded-md">
                            <p className="font-medium text-sm">{article.title}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {article.keywords?.map((keyword, kwIndex) => (
                                <Badge key={kwIndex} variant="outline" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-1 mt-1">
                              {article.serp_features?.map((feature, featureIndex) => (
                                <Badge key={featureIndex} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )) || <p className="text-sm text-gray-500">Supporting articles will be generated</p>}
                      </div>
                    </div>
                  </div>
                )) || <p className="text-gray-500">Topic pillars will be created from keyword research</p>}
              </div>
            </div>

            {/* Action Items */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <Label className="text-lg font-semibold text-green-800">Next Steps for Content Creation</Label>
              <ul className="mt-2 text-sm text-green-700 space-y-1">
                <li>• Start with the highest-scoring topic pillar</li>
                <li>• Create pillar pages first, then supporting articles</li>
                <li>• Focus on Local-Commercial intent keywords for immediate impact</li>
                <li>• Optimize for featured snippets and local pack presence</li>
                <li>• Build internal linking between pillar pages and supporting content</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}



