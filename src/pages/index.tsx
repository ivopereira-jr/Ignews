import { GetStaticProps } from 'next'
import Head from 'next/head'

import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stripe'

import styles from './home.module.scss'

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head> 
        <title>Home | ig.news</title>
      </Head>
      
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>news about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br/>
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton />
        </section>
    
        <img src="/images/avatar.svg" alt="Girl coding" />   
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1IaSQ1KPxA7abVsy0Ftwjpdx')
  
  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };


  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24 // 24horas para recostruir a pagina
  }

} // as props dessa função da para ser acessada pelo componente desse arquivo


/*
as tres formas de fazer chamadas a api no react pesquisar sobre como fazer melhor uso desses metodos dpois
- client-side ex useEffect
- server-side e pelo getServerSideProps e da para utilizar as info de forma dinamica esse metodo demora um pouco mais pois e uma chamada mais complexa 
- Static site generation e pelo getStaticProps para informações que todos vao ter acesso e que não muda com muita frequencia
*/


// o head acima serve para inserir as informaçoes de cada pagina caso queria
// como titulo meta tag etc

// o retrieve do stripe acima e para trazer um so o 'price....' e o id do price que da para pegar no site do stripe aii vai no price do produto que vc quer  

// e para usar o  expand traz as info do product relacionado ao price ou seja o product que tem o price com o id fornecido o expand vair depois do  ex. 'price_ ...' ,{ expand: ['product'] }