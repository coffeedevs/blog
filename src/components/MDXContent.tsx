import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import rehypePrism from 'rehype-prism-plus'
import Slideshare from './Slideshare'

interface MDXContentProps {
  source: string
}

// Custom components available to all MDX content
const components = {
  Slideshare,
}

export default async function MDXContent({ source }: MDXContentProps) {
  // Compile the MDX source to JavaScript with Prism syntax highlighting
  const compiled = await compile(source, {
    outputFormat: 'function-body',
    development: false,
    rehypePlugins: [[rehypePrism, { ignoreMissing: true }]],
  })

  // Run the compiled code to get the component with custom components
  const { default: MDXComponent } = await run(String(compiled), {
    ...runtime,
    ...components,
    baseUrl: import.meta.url,
  })

  return <MDXComponent components={components} />
}
