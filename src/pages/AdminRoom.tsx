import { useHistory, useParams } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { Question } from '../components/Question'
import { CodeRoom } from '../components/CodeRoom'
import { Button } from '../components/Button'
import { LougoutButton } from '../components/LogoutButton'
import { useRoom } from '../hooks/useRoom'


import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import '../styles/room.scss'
import { database } from '../services/firebase'

type ParamsProps = {
  id: string;
}

export function AdminRoom() {
  const params = useParams<ParamsProps>()
  const history = useHistory()
  const roomId = params.id
  
  const { questions, title } = useRoom(roomId)

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })

    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  return (
    <div id="page-room">
      <Toaster />
      <header>
        <div className="content">
          <img src={logoImg} alt="" />
          <div>
            <CodeRoom code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button> 
            <LougoutButton />
          </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span> {questions.length} pergunta(s)</span> }
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id} 
                content={question.content}
                author={question.author}
              >
                <button
                className="delete-question"
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}