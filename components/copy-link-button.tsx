"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"

interface CopyLinkButtonProps {
  url: string
  className?: string
}

export function CopyLinkButton({ url, className = "" }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={`h-9 border-white/20 text-white hover:bg-white/10 ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2 text-green-400" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-2" />
          Copy Link
        </>
      )}
    </Button>
  )
}
