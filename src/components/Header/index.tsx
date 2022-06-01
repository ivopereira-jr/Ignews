import { SignInButton } from '../SignInButton'
import { ActiveLink } from '../ActiveLink';

import styles from './styles.module.scss'

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ignews"/> 
        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <a className={styles.active}>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts">
            <a>Posts</a>
          </ActiveLink> 
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}

// para usar images no next e como esta no img src=... nao necessita importar mais caso queira tem um plugin ver sobre depois 

// no next o Link serva para fazer a navegação entre as paginas da aplicação sem recarregar as coisas do zero da para usar o prefetch no link dpois do href ou antes que serve para deixar a pagina pre carregada