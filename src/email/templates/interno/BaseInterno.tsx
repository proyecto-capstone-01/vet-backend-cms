import * as React from 'react'
import { Html } from '@react-email/components'

interface BaseInternoProps {
  children: React.ReactNode
}

export const BaseInterno: React.FC<BaseInternoProps> = ({ children }) => {
  const brand = process.env.BRANDING || 'Acme Inc'
  const year = new Date().getFullYear()
  const hqAddress = process.env.HQ_ADDRESS || 'CL'
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL || '#'

  return (
    <Html>
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f9f9f9' }}>
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <header style={{ marginBottom: '20px', textAlign: 'center' }}>
            <h1 style={{ color: '#333333', margin: 0 }}>
              <span style={{ verticalAlign: 'middle' }}>{brand}</span>
            </h1>
          </header>
          <main>{children}</main>
          <footer
            style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#777777' }}
          >
            <p>
              © {year} {brand}. Todos los derechos reservados.
            </p>
            <p>{hqAddress}</p>
          </footer>
        </div>
      </div>
    </Html>
  )
}
