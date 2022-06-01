import { fireEvent, render, screen } from "@testing-library/react"
import { useSession, signIn } from "next-auth/client"
import { useRouter } from "next/router"
import { mocked } from "ts-jest/utils"
import { SubscribeButton } from '.'

jest.mock('next-auth/client');
jest.mock('next/router');

describe('SubscribeNutton component', () => { 
  it('renders correctly', () => { 
    const useSessionMocked = mocked(useSession) // quando for definir o retorno de uma funçao para um teste segue esse esquema 

    // esse retorno e apenas para esse teste
    // abaixo vc faz o uso da funçao useSesson que esta na const useSessionMocked e o . mockRet... e o retorno vai ser o que vc definir cuida para ver oque a funcao ou o metodo retorna com ctrl + click do mouse em cima da funçao vc cosegue ver isso
    useSessionMocked.mockReturnValueOnce([null, false]) // user deslogado 
    
    render(<SubscribeButton />)

    expect(screen.getByText('Subscribe now')).toBeInTheDocument() 
  })

  it('redirects user to sign in when not authenticated', () => {
    const signInMocked = mocked(signIn) // pegar a funçao para saber se ela foi chamafa
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now'); // pegar o button no caso akie

    fireEvent.click(subscribeButton) // dispara o evento de click no button o fireEvent deve ter outros eventos tbm ver ms sobre

    expect(signInMocked).toHaveBeenCalled() // meio que espera que a funçao signIn tenha sido chamada com o evento de click no button
  })

  it('redirects to posts when user already has a subscription', () => {
    const useRouterMocked = mocked(useRouter)
    const useSessionMocked = mocked(useSession)
    const pushMock = jest.fn() // akie e meio que uma forma de mockar o push do useRouter pois nao da para importar e usar ele direto aki nao sei o pq e tbm para usar depois e saber se essa funçao foi acionada ou nao

    useSessionMocked.mockReturnValueOnce([ // user logado 
      { 
        user: { 
          name: 'John Doe', 
          email: 'jshn.doe@example.com'
        }, 
        activeSubscription: 'fake-active-subscription',
        expires: 'fake-expires' 
      },  
      false
    ])  

    useRouterMocked.mockReturnValueOnce({
      push: pushMock // isso seria meio que o metodo push do useRouter o as any e para o typescript nao dar erro pois o useRouter retorna mais coisas alem do push nao nesse componente so esta sendo usado o metodo push
    } as any )

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton) 

    expect(pushMock).toHaveBeenCalledWith('/posts') // vai ver se a funçao foi chamada com o parametro /posts 
  })
})

// o jest.fn() e para quando a funçao nao tem retorno 
// toHaveBeenCalledWith() serve para ver se quando executado o metodo tem o parametro que vc inseriu entre os (...)