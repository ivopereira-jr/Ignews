import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import { signIn, signOut, useSession } from 'next-auth/client'

import styles from './styles.module.scss'

export function SignInButton() {
  const [ session ] = useSession() // config para next auth verifica se o user estalogado ou não não precisa passar parametos

  return session ? (
    <button 
      type="button"
      className={styles.signInButton}
      onClick={() => signOut()} // config para next auth encera a sessão
    >
      <FaGithub color="#04d361" />
      {session.user.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button 
      type="button"
      className={styles.signInButton}
      onClick={() => signIn('github')} // config para next auth o signIn recebe no parametro o metodo que vai fazer a autenticação
    >
      <FaGithub color="#eba417" />
      Sign in with Github
    </button>
  );
}