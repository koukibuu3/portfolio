type Article = {
  id: string
  title: string
  body: string
  url: string
  type: 'qiita' | 'zenn'
  created_at: string
  updated_at?: string
}

export default Article
