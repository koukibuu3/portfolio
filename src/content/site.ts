export const site = {
  url: 'https://koukibuu3.dev',
  title: 'Kouki Akasaka | Software Engineer / Scrum Master',
  description:
    'Kouki Akasakaの制作物・技術記事・経歴。Webアプリケーションの設計・開発と、スクラムチームの支援。',
}

export function formatDate(value: string) {
  const date = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value))
  return date.replaceAll('-', '.')
}

export function jsonLd(value: object) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
