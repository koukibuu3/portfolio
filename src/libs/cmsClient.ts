import { createClient } from 'microcms-js-sdk'

const cmsClient = createClient({
  serviceDomain: process.env.CMS_API_ID ?? '',
  apiKey: process.env.CMS_API_KEY ?? '',
})

export default cmsClient
