import { google } from "googleapis"
import { auth } from "@/lib/auth"
import { verifyLicense } from "@/lib/billing"
import { Readable } from "stream"

export async function POST(request: Request) {
  const license = request.headers.get("x-license")
  if (!license) {
    return Response.json({ error: "Pro license required", code: "license-missing" }, { status: 402 })
  }
  const verification = await verifyLicense(license)
  if (!verification.valid) {
    return Response.json(
      { error: "Pro license required", code: verification.reason || "license-invalid" },
      { status: 402 }
    )
  }

  const session = await auth()
  // @ts-ignore
  const accessToken = (session as any)?.accessToken

  if (!accessToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { fileName, base64Data } = await request.json()

  const oauth2Client = new google.auth.OAuth2()
  oauth2Client.setCredentials({ access_token: accessToken })

  const drive = google.drive({ version: "v3", auth: oauth2Client })

  const buffer = Buffer.from(base64Data, "base64")
  const stream = Readable.from(buffer)

  try {
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
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}