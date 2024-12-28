import type { NextApiRequest, NextApiResponse } from 'next'

import { microCmsClient } from '~/libs'
import { ArticleRepository } from '~/modules/repositories/ArticleRepository'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const { page, perPage } = req.query
    const articles = await new ArticleRepository(microCmsClient).get(
      Number(page),
      Number(perPage),
    )
    res.status(200).json(articles)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
