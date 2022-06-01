import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils'
import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic';

jest.mock('../../services/prismic')

const posts = [
  { slug: 'my-new-post', title: 'My New Post', excerpt: 'Post excerpt', updatedAt: '10 de abril' }
];

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('My New Post')).toBeInTheDocument()
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)
  
    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValue({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [ // o title e o content ficar com esse formato pq eles nao retorno apenas o texte ou string eles retornao o RichText por isso e preciso passar o formato doque eles retornao caso tenha duvida ver oque o componente ou a pagina usa e quais sao os retorno ai vc usa no teste tbm
                { type: 'heading', text: 'My new post' }
              ],
              content: [
                { type: 'paragraph', text: 'Post excerpt' }
              ],
            },
            last_publication_date: '04-01-2021'
          }
        ]
      })
    } as any) // sempre que vc não for retornar todos as props de um metodo ou funçao que vc esteja usando exemplo o getPrismicClient retorna mais coisas alem do query mais akie so vai ser usado o query intao as any ajuda para o typescript nao ficar dando erro

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'my-new-post',
            title: 'My new post',
            excerpt: 'Post excerpt',
            updatedAt: '01 de abril de 2021'
          }]
        }
      })
    )
  });
})