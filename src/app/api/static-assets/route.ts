import fs from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

const NOTES_DIR = path.join(process.cwd(), 'notes')

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filePath = searchParams.get('path')

  if (!filePath) {
    return new NextResponse('Path parameter is required', { status: 400 })
  }

  // セキュリティ: パストラバーサル攻撃を防ぐ
  const normalizedPath = path.normalize(filePath)
  if (normalizedPath.includes('..') || path.isAbsolute(normalizedPath)) {
    return new NextResponse('Invalid path', { status: 400 })
  }

  const fullPath = path.join(NOTES_DIR, normalizedPath)

  try {
    // ファイルがnotes配下にあることを確認
    const relativePath = path.relative(NOTES_DIR, fullPath)
    if (relativePath.startsWith('..')) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const fileBuffer = await fs.readFile(fullPath)
    const ext = path.extname(fullPath).toLowerCase()

    // MIMEタイプを設定
    let contentType = 'application/octet-stream'
    switch (ext) {
      case '.png':
        contentType = 'image/png'
        break
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg'
        break
      case '.gif':
        contentType = 'image/gif'
        break
      case '.svg':
        contentType = 'image/svg+xml'
        break
      case '.webp':
        contentType = 'image/webp'
        break
      case '.md':
        contentType = 'text/markdown'
        break
      case '.txt':
        contentType = 'text/plain'
        break
    }

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving static asset:', error)
    return new NextResponse('File not found', { status: 404 })
  }
}