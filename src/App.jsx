import React, { useState, useRef, useEffect } from 'react'

export default function App() {
  const [players, setPlayers] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [firstClick, setFirstClick] = useState(true)
  const [showRemoveContainer, setShowRemoveContainer] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const draggedIndex = useRef(null)
  const touchDraggedIndex = useRef(null)

  // Load players from localStorage on mount
  useEffect(() => {
    const savedPlayers = localStorage.getItem('shotpuno_players')
    const savedIndex = localStorage.getItem('shotpuno_currentIndex')
    const savedFirstClick = localStorage.getItem('shotpuno_firstClick')

    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers))
    }
    if (savedIndex !== null) {
      setCurrentIndex(parseInt(savedIndex, 10))
    }
    if (savedFirstClick !== null) {
      setFirstClick(JSON.parse(savedFirstClick))
    }
  }, [])

  // Save players to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('shotpuno_players', JSON.stringify(players))
  }, [players])

  // Save currentIndex to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shotpuno_currentIndex', currentIndex.toString())
  }, [currentIndex])

  // Save firstClick to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shotpuno_firstClick', JSON.stringify(firstClick))
  }, [firstClick])

  const addPlayer = () => {
    if (playerName.trim()) {
      setPlayers([...players, playerName])
      setPlayerName('')
    } else {
      alert('Please enter a name')
    }
  }

  const nextName = () => {
    if (players.length > 0) {
      if (firstClick) {
        setCurrentIndex(1 % players.length)
        setFirstClick(false)
      } else {
        setCurrentIndex((prev) => (prev + 1) % players.length)
      }
    }
  }

  const toggleRemovePlayer = () => {
    setShowRemoveContainer(!showRemoveContainer)
  }

  const removePlayer = (index) => {
    const newPlayers = players.filter((_, i) => i !== index)
    setPlayers(newPlayers)
    if (currentIndex >= newPlayers.length && newPlayers.length > 0) {
      setCurrentIndex(0)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addPlayer()
    }
  }

  const onDragStart = (e, index) => {
    draggedIndex.current = index
    e.dataTransfer.effectAllowed = 'move'
    e.target.style.opacity = '0.5'
  }

  const onDragOver = (e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    const listItems = document.querySelectorAll('#player-list li')
    listItems.forEach((li, idx) => {
      if (idx === index) {
        li.classList.add('drop-target')
      } else {
        li.classList.remove('drop-target')
      }
    })
  }

  const onDrop = (e, index) => {
    e.preventDefault()
    const listItems = document.querySelectorAll('#player-list li')
    listItems.forEach((li) => li.classList.remove('drop-target'))

    if (draggedIndex.current === null || draggedIndex.current === index) return

    const newPlayers = [...players]
    const movedPlayer = newPlayers.splice(draggedIndex.current, 1)[0]
    newPlayers.splice(index, 0, movedPlayer)
    setPlayers(newPlayers)
    draggedIndex.current = null
  }

  const onDragEnd = (e) => {
    e.target.style.opacity = ''
    const listItems = document.querySelectorAll('#player-list li')
    listItems.forEach((li) => li.classList.remove('drop-target'))
  }

  const onTouchStart = (e, index) => {
    if (e.target.tagName === 'BUTTON') return
    touchDraggedIndex.current = index
    e.target.style.opacity = '0.5'
  }

  const onTouchMove = (e, index) => {
    e.preventDefault()
    const touchY = e.touches[0].clientY
    const listItems = document.querySelectorAll('#player-list li')
    listItems.forEach((item) => {
      const rect = item.getBoundingClientRect()
      if (touchY > rect.top && touchY < rect.bottom) {
        item.classList.add('drop-target')
      } else {
        item.classList.remove('drop-target')
      }
    })
  }

  const onTouchEnd = (e) => {
    const listItems = document.querySelectorAll('#player-list li')
    let dropIndex = null
    listItems.forEach((item, idx) => {
      if (item.classList.contains('drop-target')) {
        dropIndex = idx
        item.classList.remove('drop-target')
      }
      item.style.opacity = ''
    })

    if (dropIndex !== null && dropIndex !== touchDraggedIndex.current) {
      const newPlayers = [...players]
      const movedPlayer = newPlayers.splice(touchDraggedIndex.current, 1)[0]
      newPlayers.splice(dropIndex, 0, movedPlayer)
      setPlayers(newPlayers)
    }
    touchDraggedIndex.current = null
  }

  const displayedName = players.length > 0 ? players[currentIndex] : 'Click to change name'

  return (
    <div className="app" onClick={(e) => {
      const tag = e.target.tagName.toLowerCase()
      if (['input', 'button', 'ul', 'li'].includes(tag) || 
          e.target.id === 'player-list' || 
          e.target.id === 'remove-player-container' ||
          e.target.closest('#remove-player-container')) {
        return
      }
      nextName()
    }}>
      <div className="box-input">
        <div className="border">
          <input
            type="text"
            id="playerName"
            className="input"
            placeholder="Enter Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>

      <div>
        <button onClick={addPlayer} className="button">
          <span className="shadow"></span>
          <span className="edge"></span>
          <div className="front">
            <span>Add Player</span>
            <svg fill="currentColor" viewBox="0 0 20 20" className="arrow">
              <path
                clipRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
        </button>
        <button
          id="remove-player-btn"
          onClick={toggleRemovePlayer}
          className={`button ${showRemoveContainer ? 'remove-active' : ''}`}
        >
          <span className="shadow"></span>
          <span className="edge"></span>
          <div className="front">
            <span>Remove Player</span>
            <svg fill="currentColor" viewBox="0 0 20 20" className="arrow">
              <path
                clipRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
        </button>
      </div>

      <div id="name-display">{displayedName}</div>

      <div id="remove-player-container" className={showRemoveContainer ? 'show' : ''}>
        <h3>Current Players:</h3>
        <ul id="player-list">
          {players.map((player, index) => (
            <li
              key={index}
              draggable
              onDragStart={(e) => onDragStart(e, index)}
              onDragOver={(e) => onDragOver(e, index)}
              onDrop={(e) => onDrop(e, index)}
              onDragEnd={onDragEnd}
              onTouchStart={(e) => onTouchStart(e, index)}
              onTouchMove={(e) => onTouchMove(e, index)}
              onTouchEnd={(e) => onTouchEnd(e, index)}
              className={player === displayedName && displayedName !== 'Click to change name' ? 'active-player' : ''}
            >
              {player}
              <button
                className="normal remove-btn"
                onClick={() => removePlayer(index)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
