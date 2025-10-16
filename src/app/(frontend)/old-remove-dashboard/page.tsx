import { isDashboardUser } from '@/access/isDashboardUser'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers.js'
import config from '@/payload.config'

export default async function Home(){
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <div>
      <div>
        Dashboard homepage
      </div>
      {user &&
        <span>Hello {user?.name}</span>
      }
    </div>
  )
}
