'use client'

import { useState } from 'react'

export default function FedRAMPBuilder() {
  const [items, setItems] = useState<any[]>([])

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-semibold tracking-tighter mb-2">FedRAMP POA&M Builder</h1>
      <p className="text-slate-600 mb-8">Next.js version with Google Drive OAuth (in progress)</p>

      <div className="bg-white rounded-3xl border p-8">
        <p className="text-sm text-slate-500">Full interactive builder + Auth.js + Drive export coming in next iteration.</p>
        <p className="mt-4 text-xs">Current production tool: <a href="/" className="text-blue-600">Static version</a></p>
      </div>
    </div>
  )
}