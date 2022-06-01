import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils'

import { stripe } from '../../services/stripe'
import Home, { getStaticProps } from '../../pages';

jest.mock('next/router')
jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false]
  }
})
jest.mock('../../services/stripe')

describe('Home page', () => {
  it('renders correctly', () => {
    render(<Home product={{ priceId: 'fake-´rice-id', amount: 'R$10,00' }} />)

    expect(screen.getByText('for R$10,00 month')).toBeInTheDocument()
  });

  it('loads initial data', async () => {
    const retriveStripePricesMocked = mocked(stripe.prices.retrieve) // quando vc nao mockar a funçao inteira voce pode definir o metodo que vc vai usar dentro desse funcao como nesse caso do stripe

    // quando o retorno da funçao ou d metodo for uma promise usar o mockResolved
    retriveStripePricesMocked.mockReturnValueOnce({ 
      id: 'fake-price-id',
      unit_amount: 1000, // o 1000 e 10 no caso reais o stripe salva todo preço vezes 100
      // akie vc pode retornar mais dados mas akie so esta sendo usado esses dois o as any e para o typescript nao ficar dando erro
    } as any ) 

    const response = await getStaticProps({}) // aki vc pd ou nao passar algo para o getStaticprops
  
    expect(response).toEqual( // outra maneira para ver se tem oque vc espera no caso o response. com esse metodo se voce usar so ele sem o objectContainig ele vai verificar se no response tem um objeto totalmenti igual ao que vc difinir nesse caso o props: {...}
      expect.objectContaining({ // aki e oque vc espera que tenha dentro do objeto. com esse metodo ele vai verificar se o obojeto contem as props que vc difiniu pode ter mais informaçoes alem das que vc difiniu o teste vai continuar passando 
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    )
  });
})