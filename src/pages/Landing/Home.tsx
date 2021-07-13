import { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

import { useAuth } from '../../hooks/useAuth'
import { useRoom } from '../../hooks/useRoom'
import { Button } from '../../components/Button'
import { database } from '../../services/firebase'

import illustrationImg from '../../assets/images/illustration.svg'
import logoImg from '../../assets/images/logo.svg'
import googleIcon from '../../assets/images/google-icon.svg'
import './styles.scss'


export function Home() {
  const history = useHistory()
  const { user, signInWithGoogle } = useAuth()
  const [roomCode, setRoomCode] = useState('')
  const { authorId } = useRoom(roomCode)


  async function handleCreateRoom() {
    if(!user) {
      await signInWithGoogle()
    }

    history.push('/rooms/new')
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    if (roomCode.trim() === '') {
      return
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get()

    if (!roomRef.exists()) {
      toast.error('The room does not exist!')
      return
    }

    if (roomRef.val().endedAt) {
      toast.error('Room already closed!')
      return
    }

    if (user?.id === authorId ) {
      history.push(`/admin/rooms/${roomCode}`)
    } else {
      history.push(`rooms/${roomCode}`)
    }
  }

  return (
    <div id="page-auth">
      <Toaster />
      <aside>
        <img src={illustrationImg} alt="Home page illustration" />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="App's logo letmeask" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIcon} alt="Google's logo" />
            Crie sua sala com Google
          </button>

          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input 
              type="text" 
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}