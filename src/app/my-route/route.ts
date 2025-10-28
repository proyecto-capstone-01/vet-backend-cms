import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const GET = async (request: Request) => {
  const payload = await getPayload({
    config: configPromise,
  })

  const pets = await payload.find({
    collection: 'pets',
    limit: 10,
  })



  console.log('---')

  console.log('Retrieved pets:', pets)


  return Response.json({
    message: 'This is an example of a custom route.',
  })
}
