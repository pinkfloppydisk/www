import React from 'react';
import Head from 'next/head'
import {getMDXComponent} from 'mdx-bundler/client';
import {getPosts, getPost} from '../../../utils/post';
import mdxComponents from '../../../utils/mdx-components';
import { formatDate } from '../../../utils';

const BlogPost = ({ code, title, excerpt, date}) => {
	const Component = React.useMemo(() => getMDXComponent(code), [code]);
	const formattedDate = formatDate(new Date(date))

	return (
		<article>
			<Head>
        <link rel="stylesheet" href="/styles/blog.css" />
      </Head>

			<header>
				<div className='badge mb-16'>Blog post</div>
				<h1 className='serif tighter' style={{fontSize: '1.8em'}}>{title}</h1>
				<p className='lead mt-4 color-caption'>{excerpt}</p>
				<p className='smaller mt-12 color-caption bold'>{formattedDate}</p>
				<hr className='dashed my-16' />
			</header>

			<div className="prose blog-content">
				<Component components={mdxComponents} />
			</div>
		</article>
	);
};

export const getStaticProps = async ({ params }) => {
	const post = await getPost(params.slug)
	
  return {
    props: {...post}
  }
}

export const getStaticPaths = async () => {
	const posts = await getPosts()

	return {
		paths: posts.map(post => ({
			params: {...post.params}
		})),
		fallback: false
	}
}

export default BlogPost;
