import Stripe from 'stripe'
import { version } from '../../package.json' // pegar a versao do projeto no package

export const stripe = new Stripe(
  process.env.STRIPE_API_KEY,
  {
    apiVersion: '2020-08-27',
    appInfo: {
      name: 'Ignews',
      version
    }
  }
)

// o stripe o 1 parametro a chave key nesse caso ela esta em uma variavel ambiente
// e o 2 parametro são algums info obrigatorias como acima

// no pagamento do stripe da para usar o cartao com o 4242 4242 4242 4242 para teste quando esta em desenvolvimento e os dados do cartao pd ser qlqr coisa
// para visualiazar os eventos utizar o stripe listen --forward-to localhost:3000/api/webhooks o nome dpois do api/ e para onde os eventos estao sendo enviados pode ser outro arquivo ver esse projeto dpois caso for usar e tem que baixar e installar o stripe cli e pelo cmd com admin