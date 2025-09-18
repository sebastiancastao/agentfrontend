'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ExternalLink, CheckCircle, AlertTriangle, Mail, Key, Globe, Image, BarChart3 } from 'lucide-react'

export default function OnboardingPage() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [isComplete, setIsComplete] = useState(false)

  const handleCheckChange = (itemId: string, checked: boolean) => {
    const newCheckedItems = { ...checkedItems, [itemId]: checked }
    setCheckedItems(newCheckedItems)
    
    // Check if all required items are checked
    const requiredItems = [
      'website_access', 'domain_access', 'dedicated_email', 'brand_assets',
      'google_analytics', 'google_search_console', 'google_business_profile', 'google_tag_manager',
      'confirmation'
    ]
    const allChecked = requiredItems.every(item => newCheckedItems[item])
    setIsComplete(allChecked)
  }

  const handleGetStarted = () => {
    // Here you could integrate with your backend or redirect to next step
    alert("🎉 Thank you! We'll begin working on your project immediately. You'll hear from us within 24 hours!")
  }

  return (
    <div className="min-h-screen bg-indigo-1000 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚀 Ready to Get Started!
          </h1>
          <p className="text-lg text-gray-600">
            Your business analysis is complete. Now we need access to implement your growth strategy.
          </p>
        </div>

        <Alert className="mb-6 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>We know these take effort to gather, but they are imperative.</strong>
            <br />
            If you cannot do this right now, please email who can give access and CC{' '}
            <strong>mike@nextstepconnect.com</strong> and <strong>dave@nextstepconnect.com</strong>.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 mb-8">
          {/* Website & Technical Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Website & Technical Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="website_access"
                  checked={checkedItems.website_access || false}
                  onCheckedChange={(checked) => handleCheckChange('website_access', checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="website_access"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Please give us login access to your website
                  </label>
                  <p className="text-xs text-muted-foreground">
                    WordPress admin, hosting panel, or CMS access
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="domain_access"
                  checked={checkedItems.domain_access || false}
                  onCheckedChange={(checked) => handleCheckChange('domain_access', checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="domain_access"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Please find where your domain name is hosted and give us access
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Domain registrar access (GoDaddy, Namecheap, etc.)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="dedicated_email"
                  checked={checkedItems.dedicated_email || false}
                  onCheckedChange={(checked) => handleCheckChange('dedicated_email', checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="dedicated_email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    If you want, please create a dedicated email for us: <code className="bg-gray-100 px-1 rounded">nsc@yoursite.com</code>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Optional but recommended for project communication
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="brand_assets"
                  checked={checkedItems.brand_assets || false}
                  onCheckedChange={(checked) => handleCheckChange('brand_assets', checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="brand_assets"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Please create a Google Drive or Dropbox with your logo and brand images
                  </label>
                  <p className="text-xs text-muted-foreground">
                    High-resolution logos, brand colors, style guides, marketing materials
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Google Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Google Access Required
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Please add <strong>mike@nextstepconnect.com</strong> and <strong>dave@nextstepconnect.com</strong> as <strong>owners</strong> to all:
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="google_analytics"
                  checked={checkedItems.google_analytics || false}
                  onCheckedChange={(checked) => handleCheckChange('google_analytics', checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="google_analytics"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                  >
                    Google Analytics - Add users as owners
                    <a 
                      href="https://support.google.com/analytics/answer/9305788?hl=en#zippy=%2Cin-this-article" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Go to &quot;Add users to analytics&quot; section
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="google_search_console"
                  checked={checkedItems.google_search_console || false}
                  onCheckedChange={(checked) => handleCheckChange('google_search_console', checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="google_search_console"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                  >
                    Google Search Console - Add as owners
                    <a 
                      href="https://support.google.com/webmasters/answer/7687615?hl=en" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Essential for SEO monitoring and optimization
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="google_business_profile"
                  checked={checkedItems.google_business_profile || false}
                  onCheckedChange={(checked) => handleCheckChange('google_business_profile', checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="google_business_profile"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                  >
                    Google Business Profile - Add as owners
                    <a 
                      href="https://support.google.com/business/answer/3403100?hl=en" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Critical for local SEO and Google Maps presence
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="google_tag_manager"
                  checked={checkedItems.google_tag_manager || false}
                  onCheckedChange={(checked) => handleCheckChange('google_tag_manager', checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="google_tag_manager"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                  >
                    Google Tag Manager - Add as owners
                    <a 
                      href="https://support.google.com/tagmanager/answer/6107011?hl=en" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    For tracking and conversion optimization
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Final Confirmation */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                Final Confirmation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="confirmation"
                  checked={checkedItems.confirmation || false}
                  onCheckedChange={(checked) => handleCheckChange('confirmation', checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="confirmation"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-800"
                  >
                    Please confirm you have given us everything or you sent an email to who can give us access and CC&apos;ed{' '}
                    <strong>mike@nextstepconnect.com</strong> and <strong>dave@nextstepconnect.com</strong>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Button
            onClick={handleGetStarted}
            disabled={!isComplete}
            size="lg"
            className={`px-8 py-3 text-lg font-semibold ${
              isComplete 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isComplete ? (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                I&apos;m ready. LET&apos;S GO!!!!
              </>
            ) : (
              'Complete all requirements above'
            )}
          </Button>
          
          {isComplete && (
            <p className="mt-4 text-sm text-green-600 font-medium">
              🎉 All requirements completed! We&apos;ll start working immediately.
            </p>
          )}
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center border-t pt-8">
          <div className="flex justify-center items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>Questions? Contact us:</span>
            <a href="mailto:mike@nextstepconnect.com" className="text-blue-600 hover:underline">
              mike@nextstepconnect.com
            </a>
            <span>or</span>
            <a href="mailto:dave@nextstepconnect.com" className="text-blue-600 hover:underline">
              dave@nextstepconnect.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
