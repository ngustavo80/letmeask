import { useParams } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { Question } from '../components/Question'
import { CodeRoom } from '../components/CodeRoom'
import { Button } from '../components/Button'
import { LougoutButton } from '../components/LogoutButton'
import { useRoom } from '../hooks/useRoom'


import logoImg from '../assets/images/logo.svg'
import '../styles/room.scss'

type ParamsProps = {
  id: string;
}

export function AdminRoom() {
  const params = useParams<ParamsProps>()
  
  const roomId = params.id
  
  const { questions, title } = useRoom(roomId)

  return (
    <div id="page-room">
      <Toaster />
      <header>
        <div className="content">
          <img src={logoImg} alt="" />
          <div>
            <CodeRoom code={roomId} />
            <Button isOutlined>Encerrar Sala</Button> 
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
                <div></div>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}