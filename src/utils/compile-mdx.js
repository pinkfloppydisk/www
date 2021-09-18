import { bundleMDX } from 'mdx-bundler'
import visit from 'unist-util-visit'

async function compileMdx(slug, githubFiles) {
  const indexRegex = new RegExp(`${slug}\\/index.mdx?$`)
  const indexFile = githubFiles.find(({ path }) => indexRegex.test(path))
  if (!indexFile) {
    throw new Error(`${slug} has no index.mdx file.`)
  }

  const rootDir = indexFile.path.replace(/index.mdx?$/, '')

  const relativeFiles = githubFiles.map(({ path, content }) => ({
    path: path.replace(rootDir, './'),
    content,
  }))

  const files = arrayToObject(relativeFiles, {
    keyName: 'path',
    valueName: 'content',
  })

  const imageTransformer = (tree) => {
		// ❗ Commenting out the next 3 lines fixes the issue
    visit(tree, 'image', (node, index, parent) => {
      console.log('This breaks?')
    })

    return tree
  }

  const remarkPlugins = [() => imageTransformer]

  const { frontmatter, code } = await bundleMDX(indexFile.content, {
    files,
    xdmOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        ...remarkPlugins,
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
  }
}

function arrayToObject(array, { keyName, valueName }) {
  const object = {}
  for (const item of array) {
    const key = item[keyName]
    if (typeof key !== 'string') {
      throw new TypeError(`${keyName} of item must be a string`)
    }

    const value = item[valueName]
    object[key] = value
  }

  return object
}

export { compileMdx }
