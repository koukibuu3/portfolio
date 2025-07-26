import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, Paragraph, Text } from 'mdast'

interface ObsidianImageNode extends Text {
  type: 'text'
  value: string
}

export const remarkObsidianImage: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'paragraph', (node: Paragraph) => {
      const children = node.children
      const newChildren: typeof children = []

      for (let i = 0; i < children.length; i++) {
        const child = children[i]

        if (child.type === 'text') {
          const text = child.value
          const obsidianImageRegex = /!\[\[([^\]]+)\]\]/g
          let lastIndex = 0
          let match

          while ((match = obsidianImageRegex.exec(text)) !== null) {
            // マッチ前のテキストを追加
            if (match.index > lastIndex) {
              newChildren.push({
                type: 'text',
                value: text.slice(lastIndex, match.index),
              })
            }

            // 画像パスとalt textを解析
            const [imagePath, altText] = match[1].split('|')
            const cleanImagePath = imagePath.trim()
            const cleanAltText = altText?.trim() || cleanImagePath

            // 画像ノードを追加
            newChildren.push({
              type: 'image',
              url: `/notes/Article/Assets/${cleanImagePath}`,
              alt: cleanAltText,
              title: cleanAltText,
            })

            lastIndex = obsidianImageRegex.lastIndex
          }

          // 残りのテキストを追加
          if (lastIndex < text.length) {
            newChildren.push({
              type: 'text',
              value: text.slice(lastIndex),
            })
          }
        } else {
          newChildren.push(child)
        }
      }

      node.children = newChildren
    })
  }
}
