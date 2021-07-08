import { FormEvent, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

import { CodeRoom } from '../components/CodeRoom'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'

import logoImg from '../assets/images/logo.svg'
import '../styles/room.scss'

type FirebaseQuestions = Record<string, {
  author: {
    avatar: string;
    name: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}> // Record é usado para tipagem de vetores no typescript onde o que está dentro do sinal de maior e menor
  // é o conteúdo do vetor.

type Questions = {
  id: string;
  author: {
    avatar: string;
    name: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}

type ParamsProps = {
  id: string;
}

export function Room() {
  const { user, signInWithGoogle } = useAuth()
  const params = useParams<ParamsProps>()
  const [newQuestion, setNewQuestion] = useState('')
  const [questions, setQuestions] = useState<Questions[]>([])
  const [title, setTitle] = useState()

  const roomId = params.id

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)

    roomRef.once('value', room => {
      const databaseRoom = room.val()
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)
    })
  }, [roomId])

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()

    if (newQuestion.trim() === '') {
      return
    }

    if (!user) {
      throw new Error('You must be logged!')
    }

    const question = {
      content: newQuestion,
      author : {
        name: user?.name,
        avatar: user?.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    }

    await database.ref(`rooms/${roomId}/questions`).push(question)

    toast.success('Pergunta enviada com sucesso')

    setNewQuestion('')
  }

  return (
    <div id="page-room">
      <Toaster />
      <header>
        <div className="content">
          <img src={logoImg} alt="" />
          <CodeRoom code={roomId} />
          <Button 
            className="button-logout"
          >Logout</Button> 
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span> {questions.length} pergunta(s)</span> }
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea 
            placeholder="O que você quer perguntar?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            { user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, 
                <button onClick={signInWithGoogle}>faça seu login</button> .
              </span>
            ) }
            <Button
              className="button" 
              type="submit" 
              disabled={!user}
            >Enviar pergunta</Button>
          </div>
        </form>
      </main>
    </div>
  )
}