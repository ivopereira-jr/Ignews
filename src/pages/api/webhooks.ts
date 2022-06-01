import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream'
import Stripe from "stripe";
import { stripe } from "../../services/stripe"
import { saveSubscription } from "./_lib/manageSubsription";

// função para meio que converter  os eventos recebidos pelo stripe cli
async function buffer(readable: Readable) {
  const chunks = []

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === 'string' ? Buffer.from(chunk) : chunk
    );
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false
  }
}

const relevantEvents = new Set([ // eventos que serao ouvidos
  'checkout.session.completed',
  // 'customer.subscription.created', sem esta ouvindo esse evendo a compra so pode ser feita pelo site se caso fosse permitir para comprar fora do site desse projeto teria que fazer um if tipo se ja existe faiz isso se nao cria meio que isso
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'POST') {
    const buf = await buffer(req)
    const secret = req.headers['stripe-signature']

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      return res.status(400).send(`Webhook error ${err.mensage}`)
    }
    
    const { type } = event;

    if(relevantEvents.has(type)) {
      try {
        switch (type) {
          // case 'customer.subscription.created':
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
            const subscription = event.data.object as Stripe.Subscription

            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false
            );

            break;
          case 'checkout.session.completed': // quando o use finaliza a compra
          
            const checkoutSession = event.data.object as Stripe.Checkout.Session
            
            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            )

            break;
          default:
            throw new Error('Unhandled event.')  
        }
      } catch (error) {
        return res.json({ error: 'Webhook hadler failed.' })
      }
    }
    
    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}

// esse arquivo se torna uma rota externa tbm e da para ser acessada por outras pessoas caso eles tentem por isso esta sendo feito uma verificação no try catch acima para ver se a pessoa a chave de acesso para esse arquivo e meio que isso e tbm pegar os eventos da requisação e algums informaçoes qualquer colocar um conole.log(event) paa ver oque vem 