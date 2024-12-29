import { NextApiRequest, NextApiResponse } from 'next'

const preview = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query.slug) {
    return res.status(404).end()
  }
  const content = await fetch(
    `https://koukibuu3.microcms.io/api/v1/articles/${req.query.slug}?fields=id&draftKey=${req.query.draftKey}`,
    { headers: { 'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY || '' } },
  )
    .then((res) => res.json())
    .catch((error) => null)

  if (!content) {
    return res.status(401).json({ message: 'Invalid slug' })
  }

  res.setPreviewData({
    slug: content.id,
    draftKey: req.query.draftKey,
  })
  res.writeHead(307, { Location: `/articles/${content.id}` })
  res.end('Preview mode enabled')
}

export default preview
