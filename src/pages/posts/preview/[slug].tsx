import { GetStaticProps } from "next"
import { useSession } from "next-auth/client"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { RichText } from "prismic-dom"
import { useEffect } from "react"
import { getPrismicClient } from "../../../services/prismic"

import styles from '../post.module.scss'

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
} // tiper somente as infos que vc for utilizar

export default function PostPreview({ post }: PostPreviewProps) {
  const [session] = useSession()
  const router = useRouter()

  useEffect(() => {
    if(session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session])

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
            className={`${styles.postContent} ${styles.previewContent}`} // para usar duas classes
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>            
          </div>
        </article>
      </main>
    </>
  )
}

// CUIDADO com o dangerouslySetInnerHTML pois se sua aplicação nao tiver uma tratativa no back-end para insersão de html no post invasores podem injetar scripts maliciosos e usar o dados dos users aki como esta sendo usado o prismic e o prismic tem essa tratativa e tbm como ess app tem foco no estudo e d boa  

export const getStaticPaths = () => {
  return {
    paths: [], // akie da para setar o vc quer que seja gerado de forma statica durante a build
    fallback: 'blocking' // serve para caso o conteudo nao tenha sido gerado ainda tem 3 opçoes o true false blocking o true e pouco utilizado e problematico false se o conteudo nao foi gerado ele retorna um 404 e nao vai fazer requisiçoes ou tentar buscar o conteudo o blocking caso o conteudo nao esteja pronto ou nao tenha conteudo ele nao buscar e carregar o conteudo na camada do next pelo serversiderender ai quando todo o conteudo estiver pronto ele exibe
  }
} // essa função so da para ser usada em arquivos que tem parametros como essa que recebe o params no nome ex. [slug].tsx os parametros sao passados por esse [slug]

export const getStaticProps: GetStaticProps = async ({ params }) => { // quando a pagina e publica pod ser o getstaticprops
  const { slug } = params

  const prismic = getPrismicClient()
  const response = await prismic.getByUID('post', String(slug), {})

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)), // o splice e para limitar o tanto de conteudo que vai ser retornado ou exibido
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: {
      post,
    },
    redirect: 60 * 30, // 30 minutos
  }
} // quando tiver utilizando o getstaticprops e legal colocar o redirect que serve para difinir o tempo que o conteudo vai ser atualizado