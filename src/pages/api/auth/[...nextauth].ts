import { query as q } from 'faunadb'

import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import { fauna } from '../../../services/fauna'

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user' // para ter acesso as info que vc quer no caso do git ver a documentação onde falo do scope e para pegar mais scopes so color a , dpois do scope anterior
    }),
  ],
  callbacks: {
    async session(session) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([ // para ver elementos que antenden nesse caso as duas condiçoes
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                "active"
              )
            ])
          )
        )
  
        return {
          ...session,
          activeSubscription: userActiveSubscription
        }
      } catch (error) {
        return {
          ...session,
          activeSubscription: null
        }
      }
    },
    async signIn(user, account, profile) {
      const { email } = user

      try {
        await fauna.query(
          q.If(
            q.Not( // = nao
              q.Exists(
                q.Match( // = where do sql
                  q.Index('user_by_email'), // oque ele vai comparar
                  q.Casefold(user.email) // a info que vai ser comparada o casefold e para fazer todos as letras ficarem no mesmo formato caso uma seja minuscula e outra maiuscula
                )
              )
            ),
            q.Create( // akie no caso se o user nao existir aii faiz a criaçao
              q.Collection('users'),
              { data: { email }}
            ), // else
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )
        
        return true
      } catch  {
        return false
      }    
    },
  }
})

// para buscar info no faunadb tem que ter um index configurado se nao tiver nao da para buscar a info pelo nome por exemplo