import { ButtonHTMLAttributes } from 'react'

import logoutImg from '../../assets/images/logout.svg'
import './styles.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function LougoutButton(props: ButtonProps) {
  return (
    <button className="logout-button" {...props}>
      <img src={logoutImg} alt="Logout" />
    </button>
  )
}