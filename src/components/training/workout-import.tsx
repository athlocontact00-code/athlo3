"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Upload, Download, FileText, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImportSource {
  id: string
  name: string
  description: string
  icon: string
  connected: boolean
  lastSync?: string
}

const importSources: ImportSource[] = [
  {
    id: "strava",
    name: "Strava",
    description: "Import activities from Strava",
    icon: "🏃",
    connected: true,
    lastSync: "2 hours ago"
  },
  {
    id: "garmin",
    name: "Garmin Connect",
    description: "Import from Garmin devices",
    icon: "⌚",
    connected: false
  },
  {
    id: "apple",
    name: "Apple Health",
    description: "Import workouts from Apple Health",
    icon: "🍎",
    connected: true,
    lastSync: "1 day ago"
  },
  {
    id: "google",
    name: "Google Fit",
    description: "Import activities from Google Fit",
    icon: "📊",
    connected: false
  }
]

const fileTypes = [
  { type: ".fit", description: "Garmin FIT files", color: "bg-blue-500" },
  { type: ".gpx", description: "GPS Exchange format", color: "bg-green-500" },
  { type: ".tcx", description: "Training Center XML", color: "bg-orange-500" }
]

export function WorkoutImport() {
  const [open, setOpen] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importingFrom, setImportingFrom] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleImport = async (sourceId: string) => {
    setImporting(true)
    setImportingFrom(sourceId)
    // Simulate import
    await new Promise(resolve => setTimeout(resolve, 2000))
    setImporting(false)
    setImportingFrom(null)
    // Show success toast here
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      // Handle file upload
      console.log("Files dropped:", files)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Import from...
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Workouts</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Connected Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {importSources.map((source) => (
              <Card key={source.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{source.icon}</span>
                      <div>
                        <CardTitle className="text-sm">{source.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {source.description}
                        </CardDescription>
                      </div>
                    </div>
                    {source.connected ? (
                      <Badge variant="secondary" className="gap-1 text-green-600 bg-green-500/10">
                        <Check className="h-3 w-3" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not connected</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {source.connected ? (
                    <div className="space-y-2">
                      {source.lastSync && (
                        <p className="text-xs text-muted-foreground">
                          Last sync: {source.lastSync}
                        </p>
                      )}
                      <Button 
                        size="sm" 
                        className="w-full"
                        disabled={importing}
                        onClick={() => handleImport(source.id)}
                      >
                        {importingFrom === source.id ? (
                          <>
                            <div className="h-3 w-3 mr-2 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                            Importing...
                          </>
                        ) : (
                          <>
                            <Download className="h-3 w-3 mr-2" />
                            Import latest
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full">
                      Connect
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Manual Upload */}
          <div>
            <h3 className="font-semibold mb-3">Manual Upload</h3>
            <Card
              className={cn(
                "border-dashed border-2 transition-colors",
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Drop files here or click to browse</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Supports .fit, .gpx, and .tcx files
                    </p>
                  </div>
                  <Button variant="outline" className="mt-2">
                    <FileText className="h-4 w-4 mr-2" />
                    Choose files
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* File Types Info */}
            <div className="flex flex-wrap gap-2 mt-3">
              {fileTypes.map((fileType) => (
                <Badge key={fileType.type} variant="outline" className="text-xs">
                  <div className={cn("w-2 h-2 rounded-full mr-1", fileType.color)} />
                  {fileType.type} - {fileType.description}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}