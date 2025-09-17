'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Download, Save, Eye, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react'
import { getJob, finalizeJob, exportJob } from '@/lib/api'
import { JobStatus } from '@/lib/types'
import { ProfileEditor } from '@/components/profile-editor'
import { SourcesModal } from '@/components/sources-modal'
import { useToast } from '@/components/ui/use-toast'

export default function JobPage() {
  const params = useParams()
  const jobId = params.id as string
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [editedProfile, setEditedProfile] = useState<any>(null)

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => getJob(jobId),
    refetchInterval: (query) => {
      // Poll every 3 seconds while job is running
      const data = query.state.data
      if (!data) return false
      return data.status === JobStatus.QUEUED || data.status === JobStatus.RUNNING ? 3000 : false
    },
  })

  const finalizeMutation = useMutation({
    mutationFn: (overrides: any) => finalizeJob(jobId, overrides),
    onSuccess: () => {
      toast({
        title: 'Profile saved',
        description: 'Your changes have been saved successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['job', jobId] })
      setEditedProfile(null)
    },
    onError: (error) => {
      toast({
        title: 'Save failed',
        description: error instanceof Error ? error.message : 'Failed to save changes',
        variant: 'destructive',
      })
    },
  })

  const exportMutation = useMutation({
    mutationFn: () => exportJob(jobId),
    onSuccess: (data) => {
      // Download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${job?.company_name || 'company'}-profile.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: 'Export successful',
        description: 'Company profile downloaded as JSON.',
      })
    },
  })

  // Initialize edited profile when job data loads
  useEffect(() => {
    if (job?.profile && !editedProfile) {
      setEditedProfile({ ...job.profile })
    }
  }, [job?.profile, editedProfile])

  const handleSave = () => {
    if (!editedProfile || !job?.profile) return

    // Calculate overrides
    const overrides: any = {}
    Object.keys(editedProfile).forEach(key => {
      if (key !== 'company_name' && key !== 'official_email' && key !== 'confidence_per_field') {
        if (JSON.stringify(editedProfile[key]) !== JSON.stringify((job.profile as any)?.[key])) {
          overrides[key] = editedProfile[key]
        }
      }
    })

    if (Object.keys(overrides).length > 0) {
      finalizeMutation.mutate(overrides)
    } else {
      toast({
        title: 'No changes detected',
        description: 'No changes were made to save.',
      })
    }
  }

  const getStatusIcon = (status: JobStatus) => {
    switch (status) {
      case JobStatus.QUEUED:
        return <Clock className="h-4 w-4" />
      case JobStatus.RUNNING:
        return <RefreshCw className="h-4 w-4 animate-spin" />
      case JobStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4" />
      case JobStatus.FAILED:
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.QUEUED:
        return 'bg-yellow-100 text-yellow-800'
      case JobStatus.RUNNING:
        return 'bg-blue-100 text-blue-800'
      case JobStatus.COMPLETED:
        return 'bg-green-100 text-green-800'
      case JobStatus.FAILED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error instanceof Error ? error.message : 'Failed to load job details'}
        </AlertDescription>
      </Alert>
    )
  }

  if (!job) {
    return (
      <Alert>
        <AlertDescription>Job not found</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Job Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{job.company_name}</CardTitle>
              <CardDescription>{job.official_email}</CardDescription>
            </div>
            <Badge className={getStatusColor(job.status)}>
              <div className="flex items-center gap-1">
                {getStatusIcon(job.status)}
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </div>
            </Badge>
          </div>
        </CardHeader>
        {(job.status === JobStatus.QUEUED || job.status === JobStatus.RUNNING) && (
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <RefreshCw className="h-4 w-4 animate-spin" />
              {job.status === JobStatus.QUEUED 
                ? 'Job is queued for processing...' 
                : 'Scraping and analyzing company data...'}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Error Display */}
      {job.status === JobStatus.FAILED && job.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{job.error}</AlertDescription>
        </Alert>
      )}

      {/* Profile Editor */}
      {job.profile && editedProfile && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Company Profile</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedField('all')}
                disabled={!job.sources || Object.keys(job.sources).length === 0}
              >
                <Eye className="mr-2 h-4 w-4" />
                View All Sources
              </Button>
              <Button
                onClick={handleSave}
                disabled={finalizeMutation.isPending}
              >
                {finalizeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => exportMutation.mutate()}
                disabled={exportMutation.isPending}
              >
                {exportMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export JSON
                  </>
                )}
              </Button>
              
              {job.status === 'completed' && (
                <Button
                  onClick={() => window.location.href = '/onboarding'}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  🚀 Ready to Get Started? Click Here!
                </Button>
              )}
            </div>
          </div>

          <ProfileEditor
            profile={editedProfile}
            onProfileChange={setEditedProfile}
            confidenceScores={job.profile.confidence_per_field || {}}
            onViewSources={(field) => setSelectedField(field)}
            sources={job.sources || {}}
          />
        </>
      )}

      {/* Sources Modal */}
      {selectedField && job.sources && (
        <SourcesModal
          isOpen={!!selectedField}
          onClose={() => setSelectedField(null)}
          field={selectedField}
          sources={selectedField === 'all' ? job.sources : { [selectedField]: job.sources[selectedField] || [] }}
        />
      )}
    </div>
  )
}



