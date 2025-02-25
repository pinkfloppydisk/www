import { bundleMDX } from 'mdx-bundler'
import { visit } from 'unist-util-visit'
import rehypeShiki from '@leafac/rehype-shiki'
import gfm from 'remark-gfm'
import remarkSlug from 'remark-slug'
import smartypants from 'remark-smartypants'
import { toc } from 'mdast-util-toc'
import { toHast } from 'mdast-util-to-hast'
import { toHtml } from 'hast-util-to-html'
import * as shiki from 'shiki'
import remarkEmbedder from '@remark-embedder/core'
import oembedTransformer from '@remark-embedder/transformer-oembed'
import nodePath from 'path'

const getOEmbedConfig = ({ provider }) => {
  if (provider.provider_name === 'Twitter') {
    return {
      params: {
        dnt: true,
        omit_script: true,
      },
    }
  }
  return null
}

async function compileMdx(path, slug) {
	path = nodePath.resolve(path)
  let tocData = null

  const imageTransformer = () => {
    return (tree) => {
      visit(tree, 'image', (node, index, parent) => {
        const filename = String(node.url)
        node.url = `/img/${slug}/${filename}`

        if (node.title) {
          // Make sure images that get transformed to figures aren't nested within paragraph tags (which is invalid HTML)
          parent.type = 'div'
        }
      })
    }
  }

  const getToC = () => {
    return (tree) => {
      const mdast = toc(tree)
      if (mdast.map) {
        tocData = toHtml(toHast(mdast.map))
      }
    }
  }

  const remarkPlugins = [
    gfm,
    smartypants,
    imageTransformer,
    getToC,
    remarkSlug,
    [remarkEmbedder, { transformers: [[oembedTransformer, getOEmbedConfig]] }],
  ]

  const rehypePlugins = [
    [
      rehypeShiki,
      {
        highlighter: await shiki.getHighlighter({ theme: 'github-light' }),
      },
    ],
  ]

  const { frontmatter, code } = await bundleMDX({
    file: path,
    cwd: nodePath.resolve(path, '..'),
    xdmOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        ...remarkPlugins,
      ]

      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        ...rehypePlugins,
      ]

      return options
    },
    esbuildOptions(options) {
      options.loader = {
        ...options.loader,
        '.js': 'jsx',
      }
      return options
    },
  })

  return {
    code,
    frontmatter,
    toc: tocData,
  }
}

export { compileMdx }
