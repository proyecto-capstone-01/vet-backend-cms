import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'

import config from '@payload-config'
import './styles.css'
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
    <div className="home">
      <div className="content">
        <picture>
          <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg" />
          <Image
            alt="Payload Logo"
            height={65}
            src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
            width={65}
          />
        </picture>
        {!user && <h1>Welcome to your new project.</h1>}
        {user && <h1>Welcome back, {user.email}</h1>}
        <div className="links">
          <a className="admin" href={payloadConfig.routes.admin} rel="noopener noreferrer">
            Go to CMS panel
          </a>
          <a className="docs" href="/dashboard">
            Go to Dashboard
          </a>
        </div>
      </div>
      <div className="footer">
      </div>
    </div>
  )
}
