"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Keyboard } from "lucide-react"

interface Shortcut {
  keys: string[]
  description: string
}

interface ShortcutGroup {
  title: string
  shortcuts: Shortcut[]
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: "Navigation",
    shortcuts: [
      { keys: ["⌘", "K"], description: "Command palette" },
      { keys: ["G", "D"], description: "Go to Dashboard" },
      { keys: ["G", "T"], description: "Go to Today" },
      { keys: ["G", "C"], description: "Go to Calendar" },
      { keys: ["G", "P"], description: "Go to Plan" },
      { keys: ["G", "M"], description: "Go to Messages" },
    ]
  },
  {
    title: "Actions",
    shortcuts: [
      { keys: ["N"], description: "New workout" },
      { keys: ["⌘", "S"], description: "Save changes" },
      { keys: ["⌘", "Enter"], description: "Submit form" },
    ]
  },
  {
    title: "Views",
    shortcuts: [
      { keys: ["?"], description: "Show shortcuts" },
      { keys: ["Escape"], description: "Close modal/sheet" },
      { keys: ["⌘", "/"], description: "Toggle sidebar" },
    ]
  }
]

interface ShortcutsGuideProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShortcutsGuide({ open, onOpenChange }: ShortcutsGuideProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shortcutGroups.map((group, groupIndex) => (
            <div key={group.title}>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                {group.title}
              </h3>
              <div className="space-y-3">
                {group.shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <div key={keyIndex} className="flex items-center">
                          <Badge
                            variant="outline"
                            className="px-2 py-1 text-xs font-mono bg-muted"
                          >
                            {key}
                          </Badge>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="mx-1 text-xs text-muted-foreground">+</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {groupIndex < shortcutGroups.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t text-center">
          <p className="text-sm text-muted-foreground">
            Press <Badge variant="outline" className="mx-1 px-1 py-0.5 text-xs">?</Badge> to toggle this guide
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hook for using shortcuts guide
export function useShortcutsGuide() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        // Check if we're not in an input field
        const target = e.target as HTMLElement
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA" && !target.isContentEditable) {
          e.preventDefault()
          setOpen(prev => !prev)
        }
      }
      
      if (e.key === "Escape" && open) {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open])

  return { open, setOpen }
}