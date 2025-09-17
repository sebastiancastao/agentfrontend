import { JobRequest, JobResponse, JobDetailResponse, ExportResponse } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = `HTTP ${response.status}`
    
    try {
      const errorData = JSON.parse(errorText)
      errorMessage = errorData.detail || errorData.message || errorMessage
    } catch {
      errorMessage = errorText || errorMessage
    }
    
    throw new ApiError(errorMessage, response.status)
  }

  return response.json()
}

export async function createJob(request: JobRequest): Promise<JobResponse> {
  return fetchApi<JobResponse>('/jobs', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export async function getJob(jobId: string): Promise<JobDetailResponse> {
  return fetchApi<JobDetailResponse>(`/jobs/${jobId}`)
}

export async function finalizeJob(jobId: string, overrides: any): Promise<JobResponse> {
  return fetchApi<JobResponse>(`/jobs/${jobId}/finalise`, {
    method: 'POST',
    body: JSON.stringify(overrides),
  })
}

export async function exportJob(jobId: string): Promise<ExportResponse> {
  return fetchApi<ExportResponse>(`/jobs/${jobId}/export.json`)
}

export async function healthCheck(): Promise<{ status: string }> {
  return fetchApi<{ status: string }>('/health')
}



