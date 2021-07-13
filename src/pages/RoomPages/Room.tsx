import { FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

import { Question } from '../../components/Question'
import { CodeRoom } from '../../components/CodeRoom'
import { Button } from '../../components/Button'
import { LougoutButton } from '../../components/LogoutButton'
import { useAuth } from '../../hooks/useAuth'
import { useRoom } from '../../hooks/useRoom'
import { database } from '../../services/firebase'
import { firebase } from '../../services/firebase'


import logoImg from '../../assets/images/logo.svg'
import likeImg from '../../assets/images/like.svg'

import './styles.scss'

type ParamsProps = {
  id: string;
}

export function Room() {
  const { user, signInWithGoogle } = useAuth()
  const [newQuestion, setNewQuestion] = useState('')
  const params = useParams<ParamsProps>()
  
  const roomId = params.id
  
  const { questions, title } = useRoom(roomId)

  function refreshPage(){ 
    window.location.reload(); 
  } 

  async function handleLogout() {
    await firebase.auth().signOut()
    refreshPage()
  }

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

    toast.success('Pergunta enviada com sucesso!')

    setNewQuestion('')
  }

  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    if (likeId) {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove()
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id,
      })
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
            <LougoutButton onClick={() => handleLogout()} />
          </div>
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

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id} 
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <button
                    className={`like-button ${question.likeId ? 'liked' : ''}`}
                    type="button"
                    aria-label="Marcar como gostei"
                    onClick={() => handleLikeQuestion(question.id, question.likeId)}
                  >
                    { question.likeCount > 0 && <span>{question.likeCount}</span>}
                    <img src={likeImg} alt="Like" />
                  </button>           
                )}
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}