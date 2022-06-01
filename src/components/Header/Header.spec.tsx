import { render, screen } from '@testing-library/react'
import { Header } from "."

jest.mock('next/router', () => { 
  return {
    useRouter() { 
      return {
        asPath: '/'
      }
    }
  }
})

jest.mock('next-auth/client', () => {
  return {
    useSession() { // o useSession retorna como 1 parametro os dados do user caso nao tenha ele retorna ou null ou undefined, o 2 e um boolean se esta carregando ou nao
      return [null, false]
    }
  }
})

describe('Header component', () => { 
  it('renders correctly', () => { 
    render( 
      <Header />
    )

    expect(screen.getByText('Home')).toBeInTheDocument() 
    expect(screen.getByText('Posts')).toBeInTheDocument() 
  })

})
