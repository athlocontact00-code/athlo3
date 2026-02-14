"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface KeyboardShortcutsOptions {
  onCommandPalette?: () => void
  onNewWorkout?: () => void
}

export function useKeyboardShortcuts(options: KeyboardShortcutsOptions = {}) {
  const router = useRouter()
  const [sequenceKeys, setSequenceKeys] = useState<string[]>([])
  const [sequenceTimeout, setSequenceTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInputField = target.tagName === "INPUT" || 
                          target.tagName === "TEXTAREA" || 
                          target.isContentEditable

      // Clear sequence timeout
      if (sequenceTimeout) {
        clearTimeout(sequenceTimeout)
      }

      // Single key shortcuts (when not in input)
      if (!isInputField && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        // Handle sequence shortcuts (G + letter)
        if (e.key.toLowerCase() === "g") {
          e.preventDefault()
          setSequenceKeys(["g"])
          
          // Set timeout to clear sequence
          const timeout = setTimeout(() => {
            setSequenceKeys([])
          }, 1500)
          setSequenceTimeout(timeout)
          return
        }

        // Handle G sequence completions
        if (sequenceKeys.includes("g")) {
          e.preventDefault()
          setSequenceKeys([])
          
          switch (e.key.toLowerCase()) {
            case "d":
              router.push("/dashboard")
              break
            case "t":
              router.push("/today")
              break
            case "c":
              router.push("/calendar")
              break
            case "p":
              router.push("/plan")
              break
            case "m":
              router.push("/messages")
              break
          }
          return
        }

        // Single key shortcuts
        switch (e.key.toLowerCase()) {
          case "n":
            e.preventDefault()
            options.onNewWorkout?.()
            break
        }
      }

      // Meta/Ctrl key shortcuts
      const isMetaOrCtrl = e.metaKey || e.ctrlKey

      if (isMetaOrCtrl) {
        switch (e.key.toLowerCase()) {
          case "k":
            if (!e.shiftKey && !e.altKey) {
              e.preventDefault()
              options.onCommandPalette?.()
            }
            break
          case "/":
            if (!isInputField) {
              e.preventDefault()
              // Toggle sidebar - this would need to be handled by the layout component
              const sidebarToggle = document.querySelector('[data-sidebar-toggle]') as HTMLButtonElement
              sidebarToggle?.click()
            }
            break
        }
      }

      // Set new timeout for sequence
      if (sequenceKeys.length > 0) {
        const timeout = setTimeout(() => {
          setSequenceKeys([])
        }, 1500)
        setSequenceTimeout(timeout)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      if (sequenceTimeout) {
        clearTimeout(sequenceTimeout)
      }
    }
  }, [router, sequenceKeys, sequenceTimeout, options])

  return {
    sequenceKeys,
    clearSequence: () => {
      setSequenceKeys([])
      if (sequenceTimeout) {
        clearTimeout(sequenceTimeout)
      }
    }
  }
}