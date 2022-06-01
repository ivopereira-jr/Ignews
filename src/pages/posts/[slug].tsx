import { GetServerSideProps } from "next"
import { getSession } from "next-auth/client"
import Head from "next/head"
import { RichText } from "prismic-dom"
import { getPrismicClient } from "../../services/prismic"

import styles from './post.module.scss'

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
} // tiper somente as infos que vc for utilizar

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div 
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          >

          </div>
        </article>
      </main>
    </>
  )
}

// CUIDADO com o dangerouslySetInnerHTML pois se sua aplicação nao tiver uma tratativa no back-end para insersão de html no post invasores podem injetar scripts maliciosos e usar o dados dos users aki como esta sendo usado o prismic e o prismic tem essa tratativa e tbm como ess app tem foco no estudo e d boa  

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req })
  const { slug } = params

  if(!session?.activeSubscription) {
    return {
      redirect: {
        destination: `/posts/preview/${slug}`,
        permanent: false, // para quando o user nao tiver acesso ou for negado o acesso por outros motivos usar true em casos que a pagina nao exista mais ou ver mais sobre essa funçao dpois
      }
    }
  }
  
  const prismic = getPrismicClient(req)
  const response = await prismic.getByUID('post', String(slug), {})

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: {
      post,
    }
  }
}