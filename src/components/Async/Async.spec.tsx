import { render, screen, waitFor } from "@testing-library/react";
import { Async } from ".";

// dicas para testes asyncronos

test('it renders correctly', async () => {
  render(<Async />)
  
  expect(screen.getByText('Hello world')).toBeInTheDocument()

  // metodo asyncrono para ver se o elemento esta em tela nesses metodos utilizar os metodos que comesao com  query ou find pq os que com get no momento que ele e executado se ele nao achar o elemento ele ja da erro os outros metodos nao como o query e o find

  await waitFor(() => { // esse metodo fica execuntado ate encontrat o elemento definido ou ate chegar no limite do timeout ai da erro tem como definir nas opçoes o timeout de quanto em quanto tempo ele vai ser executado ver a doc do testing-library em async methos para mais infos
    // tem outros metodos alem desse para buscas asyncronas e alguns tem a opçao de timeout que e o tempo que esse metodo meio que vai esperar para algo acontecer ou nesse caso o elemento aparecer em tela intao caso for usar cuidar nisso ou ficarra dando erro pois o timeout padrao acho que e 1s e nesse expemplo se colocar o timeout do component async em 3s ai da erro pois o button so vai aparecer em tela depois de 3 segundos
    return expect(screen.queryByText('Button')).toBeInTheDocument()
  })

});

// metodos de busca dos elementos esses metodos tem varias opçoes para vc vai uma busca por exemplo vc pode buscar pelo nome en casos de input pelo placeholder enfim tem varias opçoes 
// os que comesão com .get screen.get sao asincronos ele sao executados assim que a função e chamada mais caso não encontre o elemento difinido ele vai dar erro
// os que comesão com .query e semelhante ao get mais ele não vai dar erro se não encontrar o elemento definido
// e o .find vai ficar buscando o elemento ate o mesmo aparecer em tela ai caso não aparece ou não seja encotrado ai da erro 
// ver a doc do testing-library para ver os metodos de busca async

// caso vc nao saiba qual o melhor metodo a ser usado em uma busca por exemplo vc pode colocar no teste o screen.logTestingPlaygroundURL() ele vai retornar uma url no terminal quando executar os testes e nessa url vc abre ela que vc vai ser redirecionado para o testing playground onde vc vai os componentes que vc esta testando e ao clicar no componente vai ser exibido a forma para buscar aquele elemento