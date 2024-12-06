type Knowledge = {
  id: string
  title: string
  description: string
  body: string
  url: string
  type: 'qiita' | 'zenn'
  created_at: string
  updated_at?: string
}

export default Knowledge
