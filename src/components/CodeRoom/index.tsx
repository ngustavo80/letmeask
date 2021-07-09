import toast from 'react-hot-toast'

import copyImg from '../../assets/images/copy.svg'

import './styles.scss'

type RoomCodeProps = {
  code: string;
}

export function CodeRoom(props: RoomCodeProps) {
  const notify = () => toast.success('Código copiado com sucesso')

  async function copyRoomCodeToClipboard() {
    await navigator.clipboard.writeText(props.code)
  }

  function handleButtonClick () {
    copyRoomCodeToClipboard()
    notify()
  }

  return (
    <button 
      onClick={handleButtonClick} 
      className="room-code"
    >
      <div>
        <img src={copyImg} alt="Copy the room code." />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  )
}