import { Link, useHistory, useParams } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { Question } from '../../components/Question'
import { CodeRoom } from '../../components/CodeRoom'
import { Button } from '../../components/Button'
import { LougoutButton } from '../../components/LogoutButton'
import { useAuth } from '../../hooks/useAuth'
import { useRoom } from '../../hooks/useRoom'
import { database } from '../../services/firebase'


import logoImg from '../../assets/images/logo.svg'
import deleteImg from '../../assets/images/delete.svg'
import checkImg from '../../assets/images/check.svg'
import answerImg from '../../assets/images/answer.svg'
import authImg from '../../assets/images/auth.svg'
import emptyQuestionsImg from '../../assets/images/empty-questions.svg'

import './styles.scss'
import firebase from 'firebase'

type ParamsProps = {
  id: string;
}

export function AdminRoom() {
  const params = useParams<ParamsProps>()
  const { user } = useAuth()
  const history = useHistory()
  const roomId = params.id
  
  const { questions, title, authorId } = useRoom(roomId)

  function refreshPage(){ 
    window.location.reload(); 
  }

  function handleReturn() {
    history.goBack()
  }

  async function handleLogout() {
    await firebase.auth().signOut()
    
    history.push('/')

    refreshPage()
  }

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

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    })
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    })
  }

  if (user?.id === authorId) {
    return (
      <div id="page-room">
        <Toaster />
        <header>
          <div className="content">
            <img src={logoImg} alt="" className="logo-img" />
            <div>
              <CodeRoom code={roomId} />
              <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button> 
              <LougoutButton onClick={handleLogout} />
            </div>
          </div>
        </header>
  
        <main className="content">
          <div className="room-title">
            <h1>Sala {title}</h1>
            { questions.length > 0 && <span> {questions.length} pergunta(s)</span> }
          </div>
  
          <div className="question-list">
            { questions.length > 0 ? 
              questions.map(question => {
                return (
                  <Question
                    key={question.id} 
                    content={question.content}
                    author={question.author}
                    isAnswered={question.isAnswered}
                    isHighlighted={question.isHighlighted}
                  >
                    {!question.isAnswered && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCheckQuestionAsAnswered(question.id)}
                        >
                          <img src={checkImg} alt="Marcar pergunta como respondida." />
                        </button>
    
                        <button
                          type="button"
                          onClick={() => handleHighlightQuestion(question.id)}
                        >
                          <img src={answerImg} alt="Deixar pergunta em destaque." />
                        </button>
                      </>
                    )}
    
                    <button
                    className="delete-question"
                      type="button"
                      onClick={() => handleDeleteQuestion(question.id)}
                    >
                      <img src={deleteImg} alt="Remover pergunta" />
                    </button>
                  </Question>
                )
              })
              :
                <div className="empty-questions">
                  <img src={emptyQuestionsImg} alt="" />
                  <h2>Nenhuma pergunta por aqui...</h2>
                  <p>Envie o código desta sala para seus amigos e</p>
                  <p> comece a responder perguntas!</p>
                </div>
            }
          </div>
        </main>
      </div>
    )
  } else {
    return (
      <div id="page-room">
        <Toaster />
        <header>
          <div className="content">
            <Link to="/">
              <img src={logoImg} alt="" className="logo-img" />
            </Link>
            <div>
              <Button onClick={handleReturn}>Voltar para sala</Button> 
            </div>
          </div>
        </header>

        <main className="content">
          <div className="admin-warning">
            <h1>Página de administrador</h1>
            <p> Você não tem permissão de administrador para acessar esta página. </p>
            
            <img src={authImg} alt="" />
          </div>
        </main>
      </div>
    )
  }
}