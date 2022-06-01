import { render, screen } from '@testing-library/react'
import { ActiveLink } from "."

jest.mock('next/router', () => { // tbm da para fazer o retorno do mock diferente tipo um retorno para um teste ver o arquivo de teste do SignInButton
  return {
    useRouter() { // akie e o metodo que o componente esta usando e qual retorno esse metodo tem voce pode difinir ele e bom qual o retorno desse metodo no caso desse componente ele esta usando o asPath do useRouter mais vc pd definit outras coisas desde que o componente espere o retorno que vc vai colocar
      return {
        asPath: '/'
      }
    }
  }
})

describe('ActiveLink component', () => { // quando tiver realizando mais de um teste em um componente e bacana colocar os testes em um describe que serva para categoriza a descriçao vc que coloca como exeemplo esse colocar uma descriçao que faça sentido ou relaçao ao que esta sendo testado
  it('renders correctly', () => { // o test que vai ser realizado voce pod utilizar o test ou it 
    render( // oque vai ser renderizado 
      <ActiveLink href="/" activeClassName="active">
        <a>home</a>
      </ActiveLink>
    )

    expect(screen.getByText('home')).toBeInTheDocument() // oque voce espera que tenha no elemento que vai ser rederizado no caso o elemento que esta no render acima
  })

  it('adds active clss if the link as currently active', () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>home</a>
      </ActiveLink>
    )

    expect(screen.getByText('home')).toHaveClass('active')
  })
})

// mock serve para imitar o comportamente de um modulo ou funçao externo e parecido com oque foi mostrado no projeto do naruto da digital one e da para fazer para outros metodos tbm depende do que o componente esta usando isso nesse caso que e um teste unitario

// Obs. em vez de desestruturar o getByText do render da para importar o screen e usa ele antes do getBytext

// getByText() vai preocurar se o texto existe no elemento que esta sendo renderizado pelo render vc pode desestruturar do render ex const { getByText } = render(...)
// toBeInTheDocument() meio q voce espera que esta no documento exemplo que o texto home esteja no activelink que e o elemento que esta no render
// toHaveClass() espera que tenha determinada classe
// debug() e como o console.log caso queira usar tem que desestrurar de uma funçao tipo o render ex const { debug } = render(...)