import React from 'react'
import './styles.css'
import { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers'
import config from '@payload-config'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  description: 'app',
  title: 'app',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  if (!user) return redirect('/admin/login?redirect=%2F')



  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
