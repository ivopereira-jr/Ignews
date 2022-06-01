import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb'

import { getSession } from "next-auth/client";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string;
  }
  data: {
    stripe_customer_id: string;
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'POST') {
    const session = await getSession({ req })

    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      )
    )
    
    let customerId = user.data.stripe_customer_id

    if(!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
      })

      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id), // onde vai atualizar e a referencia doq atualizar
          {
            data: { // os novos dados
              stripe_customer_id: stripeCustomer.id
            }
          }
        )
      )

      customerId = stripeCustomer.id
    }


    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId, // quem esta comprando
      payment_method_types: ['card'], //metodo de pagamento
      billing_address_collection: 'required', // difine se e obrigatorio o user informar o endereço ou nao 
      line_items: [ // products of cart
        { price: 'price_1IaSQ1KPxA7abVsy0Ftwjpdx', quantity: 1 }
      ],
      mode: 'subscription',
      allow_promotion_codes: true, // para cupons de desconto,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL // casos o user cancela a requisição
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id })
  } else {
    res.setHeader('Allow', 'POST') // quer dizer que so aceita requisição do motodo post
    res.status(405).end('Method not allowed')
  }
}