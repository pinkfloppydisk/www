import React from 'react'
import Head from 'next/head'
import groupBy from 'just-group-by'
import { getPosts } from '../utils/post'
import { getDateComponents } from '../utils'
import Link from '../components/Link'
import Metadata from '../components/Metadata'

const DateLabel = ({ date }) => {
  const { month, day } = getDateComponents(date, { monthFormat: 'short' })

  return (
    <div
      className='bg-gray--100 px-12 py-4 flex flex-column align--center'
      style={{ borderRadius: '8px' }}
    >
      <span
        className='smaller uppercase color-caption'
        style={{ fontSize: '0.65em' }}
      >
        {month}
      </span>
      <span className='bold larger tighter'>{day}</span>
    </div>
  )
}

const Blog = ({ posts }) => {
  React.useEffect(() => {
    document.querySelector('body').dataset.section = 'blog'
  })

  const years = Object.keys(posts).reverse()

  return (
    <div className='flow'>
      <Head>
        <link rel='stylesheet' href='/styles/blog.css' />
      </Head>

      <Metadata
        title='Blog'
        description="What's on my mind, and links to some interesting stuff on the web."
      />

      <main className='flow' style={{ '--flow-spacing': '4em' }}>
        {years.map((year) => (
          <React.Fragment key={year}>
            <h2 className='marker'>
              <span>{year}</span>
            </h2>

            {posts[year].map((post, i) => (
              <div
                className='flow'
                style={{ '--flow-spacing': '1.5em' }}
                key={post.slug}
              >
                {/* {i !== 0 && <hr className='dashed' />} */}
                <Link href={post.slug} className='block unstyled no-hover'>
                  <article className='post-preview flex flex-column align--flex-start gap-16'>
                    <div className='flex align--flex-start gap-16'>
                      <DateLabel date={new Date(post.date)} />
                      <div>
                        <h2 className='tighter' style={{ fontSize: '1.4em' }}>
                          {post.title}
                        </h2>
                        <p className='color-caption mt-4'>{post.excerpt}</p>
                      </div>
                    </div>

                    {post.image && (
                      <img
                        src={`/img/${post.params.slug}/${post.image}`}
                        alt=''
                      />
                    )}
                  </article>
                </Link>
              </div>
            ))}
          </React.Fragment>
        ))}
      </main>
    </div>
  )
}

export const getStaticProps = async (context) => {
  const posts = await getPosts()
  const postsByYear = groupBy(posts, (item) => {
    const { year } = getDateComponents(new Date(item.date))
    return year
  })

  return {
    props: { posts: postsByYear },
  }
}

export default Blog
