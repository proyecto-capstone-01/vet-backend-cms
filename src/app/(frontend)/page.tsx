import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@payload-config'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  if (!user) return

  user.roles.forEach(role => {
    switch (role) {
      case 'admin':
        return redirect('/dashboard')
      case 'blogger':
        return redirect('/admin')
      case 'editor':
        return redirect('/admin')
      case 'webEditor':
        return redirect('/admin')
      case 'dashboard':
        return redirect('/dashboard')
      default:
        return redirect('/admin/login')
    }
  })

  return (
    <div className="home"></div>
  )
}
