import { ImageResponse } from 'next/og'
export const alt = 'Kouki Akasaka — Software Engineer / Scrum Master'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const dynamic = 'force-static'
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 100,
          background: '#edf2ed',
          color: '#202a27',
        }}
      >
        <div style={{ fontSize: 26, marginBottom: 36, color: '#226057' }}>
          koukibuu3.dev
        </div>
        <div style={{ fontSize: 76, fontWeight: 600, letterSpacing: '-3px' }}>
          Kouki Akasaka
        </div>
        <div style={{ fontSize: 30, marginTop: 32 }}>
          Software Engineer / Scrum Master
        </div>
      </div>
    ),
    size,
  )
}
