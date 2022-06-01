import { query as q } from 'faunadb'

import { fauna } from "../../../services/fauna";
import { stripe } from '../../../services/stripe';

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false
) {
  // buscar o user no bd do faunadb com o id  (customerID)
  const userRef = await fauna.query(
    q.Select( // para selecionar o campo ou os campos que quer buscar 
      "ref",
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  )

  const subscription = await stripe.subscriptions.retrieve(subscriptionId) // pegar os dados da subscription

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  }        

  // salvar os dados da subscription no faunadb
  if(createAction) {
    await fauna.query(
      q.Create(
        q.Collection('subscriptions'),
        { data: subscriptionData }
      )
    )
  } else { // atualizar a subscription
    await fauna.query(
      q.Replace( // substitui todo o conteudo do elemento ja o update so atualiza um ou dois campos
        q.Select(
          "ref",
          q.Get(
            q.Match(
              q.Index('subscription_by_id'),
              subscriptionId,
            )
          )
        ), // os novos dados
        { data: subscriptionData }
      )
    )
  }
}