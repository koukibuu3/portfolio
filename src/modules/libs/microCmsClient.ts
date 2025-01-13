import { createClient } from 'microcms-js-sdk'

const microCmsClient = createClient({
  serviceDomain: process.env.MICROCMS_API_ID ?? '',
  apiKey: process.env.MICROCMS_API_KEY ?? '',
})

export default microCmsClient
