import { useEffect, useState } from "react"

import { database } from '../services/firebase'

type QuestionType = {
  id: string;
  author: {
    avatar: string;
    name: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}

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

export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState()
  


  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)

    roomRef.on('value', room => {
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

  return { questions, title }
}