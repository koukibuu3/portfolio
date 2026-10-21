export default function NotFound() {
  return (
    <main id="main" className="wrap error-page" tabIndex={-1}>
      <h1>404 Not Found</h1>
      <p>ページが見つかりませんでした。</p>
      <a className="textlink" href="/">
        ホームへ戻る
      </a>
    </main>
  )
}
