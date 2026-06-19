# Next.js Google Drive OAuth Integration Guide

This document describes how to add secure, server-side Google Drive export to the FedRAMP POA&M Toolkit using Next.js + Auth.js.

## 1. Google Cloud Console Setup

1. Go to https://console.cloud.google.com/
2. Create/select a project
3. Enable **Google Drive API**
4. Go to **APIs & Services > Credentials**
5. Create **OAuth 2.0 Client ID** (Web application)
6. Add Authorized Redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-app.vercel.app/api/auth/callback/google`
7. Copy `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

**Recommended Scope** (least privilege):
```
https://www.googleapis.com/auth/drive.file
```

## 2. Environment Variables

```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000          # or production URL
```

## 3. Install Dependencies

```bash
npm install next-auth@beta googleapis
# or for v4:
# npm install next-auth googleapis
```

## 4. Auth.js Configuration (App Router)

### app/api/auth/[...nextauth]/route.ts

```ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "https://www.googleapis.com/auth/drive.file email profile",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      return token
    },
    async session({ session, token }) {
      // @ts-ignore
      session.accessToken = token.accessToken
      return session
    },
  },
})

export const { GET, POST } = handlers
```

## 5. Drive Export API Route

### app/api/drive/export/route.ts

```ts
import { google } from "googleapis"
import { auth } from "@/app/api/auth/[...nextauth]/route"

import { Readable } from "stream"

export async function POST(request: Request) {
  const session = await auth()
  // @ts-ignore
  const accessToken = session?.accessToken

  if (!accessToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { fileName, base64Data } = await request.json()

  const drive = google.drive({ version: "v3", auth: accessToken })

  const buffer = Buffer.from(base64Data, "base64")
  const stream = Readable.from(buffer)

  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    media: {
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      body: stream,
    },
    fields: "id, webViewLink",
  })

  return Response.json({
    success: true,
    fileId: response.data.id,
    webViewLink: response.data.webViewLink,
  })
}
```

## 6. Frontend Button Example

```tsx
'use client'

import { signIn, signOut, useSession } from "next-auth/react"

export default function ExportButton() {
  const { data: session } = useSession()

  const handleExport = async () => {
    // Generate xlsx as base64 using SheetJS or call your generator
    const base64Data = "..." // your generated file

    const res = await fetch("/api/drive/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: "FedRAMP-POA-M.xlsx",
        base64Data,
      }),
    })

    const data = await res.json()
    if (data.webViewLink) {
      window.open(data.webViewLink, "_blank")
    }
  }

  if (!session) {
    return <button onClick={() => signIn("google")}>Connect Google Drive</button>
  }

  return (
    <div>
      <button onClick={handleExport}>Export to Google Drive</button>
      <button onClick={() => signOut()}>Disconnect</button>
    </div>
  )
}
```

## 7. Production Notes

- Store refresh tokens securely (Vercel KV, database, or encrypted cookies)
- Rotate `NEXTAUTH_SECRET` regularly
- For public toolkit: Consider "Bring Your Own Credentials" model or hosted version with user accounts
- Rate limiting and audit logging recommended for production use

## 8. Next Steps for This Repo

- [ ] Scaffold full Next.js app in `/web` directory
- [ ] Migrate current HTML builder to React components
- [ ] Add loading states, error handling, and file preview
- [ ] Support folder selection in Drive

---

**Status**: Ready to implement. The static `index.html` remains the instant public tool while we build the full OAuth-capable version.