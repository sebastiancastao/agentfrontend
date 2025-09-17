'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, ExternalLink } from 'lucide-react'
import { Source } from '@/lib/types'

interface SourcesModalProps {
  isOpen: boolean
  onClose: () => void
  field: string
  sources: Record<string, Source[]>
}

export function SourcesModal({ isOpen, onClose, field, sources }: SourcesModalProps) {
  if (!isOpen) return null

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800'
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const formatScore = (score: number) => {
    return `${Math.round(score * 100)}%`
  }

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            Sources {field !== 'all' && `for ${field.replace('socials.', '').replace('_', ' ')}`}
          </h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {Object.keys(sources).length === 0 ? (
            <p className="text-center text-gray-500">No sources available</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(sources).map(([fieldName, fieldSources]) => (
                <div key={fieldName}>
                  {field === 'all' && (
                    <h3 className="text-lg font-medium mb-3 capitalize">
                      {fieldName.replace('socials.', '').replace('_', ' ')}
                    </h3>
                  )}
                  
                  {fieldSources.length === 0 ? (
                    <p className="text-gray-500 text-sm">No sources found for this field</p>
                  ) : (
                    <div className="space-y-3">
                      {fieldSources.map((source, index) => (
                        <Card key={index} className="border-l-4 border-l-blue-500">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline font-medium text-sm flex items-center gap-1"
                                >
                                  {new URL(source.url).hostname}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                              <Badge className={getScoreColor(source.score)}>
                                {formatScore(source.score)}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {truncateText(source.snippet)}
                            </p>
                            {source.snippet.length > 200 && (
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 h-auto text-xs mt-1"
                                onClick={() => window.open(source.url, '_blank')}
                              >
                                Read more at source
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="border-t p-4 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              Sources are ranked by confidence score and relevance
            </div>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  )
}



