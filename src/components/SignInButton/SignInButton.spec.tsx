import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils' 
import { useSession } from 'next-auth/client'

import { SignInButton } from "."

jest.mock('next-auth/client') // para usar o mocked instalar o ts-jest -D que serve para vc poder difinir mais de uma retorno quando uma funçao ou metodo e chamado aki como exemplo o useSession precisa ter dois retornos um qundo o user n esta autenticado e outro quando esta tem outras funçoes tbm ver ms sobre qando for usar

describe('Header component', () => { 
  it('renders correctly when user is not authenticated', () => { 
    const useSessionMocked = mocked(useSession) // serve para quando vc quer usar o mock e difinir diferentes retornos como akie que precisa de dois retornos diferentes para poder testar o componente
    
    useSessionMocked.mockReturnValueOnce([null, false]) // o retorno vc define mais tem que ver oq a funçao que o componente esta usando oque ela retorna esse rotornos sao os parametros que o useSesson retorna caso estaja usando outra funçao ver os retornos da funçao

    render( 
      <SignInButton />
    )

    expect(screen.getByText('Sign in with Github')).toBeInTheDocument() 
  })

  it('renders correctly when user is authenticated', () => { 
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([ // utilizando o Once esse retorno vai ser executado somente nesse teste quando a funçao useSession for chamada se usase so o .mockReturnValue() ele iria retornar sempre o mesmo retorno que vc difiniu quando a funçao useSession fosse chamada 
      { user: { name: 'John Doe', email: 'jshn.doe@example.com'}, expires: 'fake-expires' },
      false
    ])

    render( 
      <SignInButton />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument() 
  })
})

// mockReturnValue oque voce difinir aqui vai ser retornado sempre que a funçao ou o metodo for chamado ex qndo o useSession for chamado independente do teste o useSession vai retorna oque vc definiu nesse metodo
// mockReturnValueOnce ja esse vai mockar o retorno da prosima chamada a funçao ou o metodo como nos tests acima