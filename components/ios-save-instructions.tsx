"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"

export function IOSSaveInstructions() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mt-3 bg-gray-800/50 rounded-xl border border-white/10">
      <Button
        variant="ghost"
        className="w-full flex justify-between items-center p-3 h-auto text-sm text-blue-300 hover:bg-white/5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <HelpCircle className="w-4 h-4 mr-2" />
          <span>How to save media on iOS</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>

      {isOpen && (
        <div className="p-3 pt-0 text-sm text-gray-300 space-y-3">
          <div className="space-y-1">
            <h4 className="font-medium text-white">For Videos:</h4>
            <ol className="list-decimal list-inside space-y-1 pl-1">
              <li>Tap the "View Video" button to open it in your browser</li>
              <li>Press and hold on the video</li>
              <li>Select "Download Video" or "Save to Files"</li>
              <li>Alternatively, copy the link and paste it in a downloader app</li>
            </ol>
          </div>

          <div className="space-y-1">
            <h4 className="font-medium text-white">For Images:</h4>
            <ol className="list-decimal list-inside space-y-1 pl-1">
              <li>Tap the "View Image" button</li>
              <li>Press and hold on the image</li>
              <li>Select "Add to Photos" or "Save to Files"</li>
            </ol>
          </div>

          <div className="space-y-1">
            <h4 className="font-medium text-white">For Audio:</h4>
            <ol className="list-decimal list-inside space-y-1 pl-1">
              <li>Tap the "Listen to Audio" button</li>
              <li>Use the "Copy Link" button</li>
              <li>Paste the link in a browser or downloader app that supports audio downloads</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
