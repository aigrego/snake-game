import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'

type Position = {
  x: number
  y: number
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

const GRID_SIZE = 20
const CELL_SIZE = 25
const INITIAL_SPEED = 150
const SPEED_INCREMENT = 5
const MIN_SPEED = 50

function App() {
  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ])
  const [food, setFood] = useState<Position>({ x: 15, y: 15 })
  const [direction, setDirection] = useState<Direction>('RIGHT')
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const directionRef = useRef<Direction>('RIGHT')

  // 更新方向引用
  useEffect(() => {
    directionRef.current = direction
  }, [direction])

  // 生成随机食物位置
  const generateFood = useCallback((currentSnake: Position[]) => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  // 检查碰撞
  const checkCollision = useCallback((head: Position, body: Position[]) => {
    // 撞墙
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true
    }
    // 撞自己
    return body.some(segment => segment.x === head.x && segment.y === head.y)
  }, [])

  // 移动蛇
  const moveSnake = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return

    setSnake(currentSnake => {
      const newSnake = [...currentSnake]
      const head = { ...newSnake[0] }

      switch (directionRef.current) {
        case 'UP':
          head.y -= 1
          break
        case 'DOWN':
          head.y += 1
          break
        case 'LEFT':
          head.x -= 1
          break
        case 'RIGHT':
          head.x += 1
          break
      }

      // 检查碰撞
      if (checkCollision(head, newSnake)) {
        setGameOver(true)
        return currentSnake
      }

      newSnake.unshift(head)

      // 检查是否吃到食物
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10)
        setFood(generateFood(newSnake))
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [gameOver, isPaused, gameStarted, food, checkCollision, generateFood])

  // 游戏循环
  useEffect(() => {
    const speed = Math.max(MIN_SPEED, INITIAL_SPEED - Math.floor(score / 50) * SPEED_INCREMENT)
    gameLoopRef.current = setInterval(moveSnake, speed)

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [moveSnake, score])

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) {
        if (e.key === ' ' || e.key === 'Enter') {
          setGameStarted(true)
        }
        return
      }

      if (gameOver) {
        if (e.key === ' ' || e.key === 'Enter') {
          resetGame()
        }
        return
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current !== 'DOWN') {
            setDirection('UP')
          }
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current !== 'UP') {
            setDirection('DOWN')
          }
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current !== 'RIGHT') {
            setDirection('LEFT')
          }
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current !== 'LEFT') {
            setDirection('RIGHT')
          }
          break
        case ' ':
          e.preventDefault()
          setIsPaused(p => !p)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameStarted, gameOver])

  // 重置游戏
  const resetGame = () => {
    const initialSnake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ]
    setSnake(initialSnake)
    setFood(generateFood(initialSnake))
    setDirection('RIGHT')
    directionRef.current = 'RIGHT'
    setGameOver(false)
    setScore(0)
    setIsPaused(false)
    setGameStarted(true)
  }

  // 渲染网格
  const renderGrid = () => {
    const grid = []
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnakeHead = snake[0].x === x && snake[0].y === y
        const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y)
        const isFood = food.x === x && food.y === y

        let cellClass = 'cell'
        if (isSnakeHead) cellClass += ' snake-head'
        else if (isSnakeBody) cellClass += ' snake-body'
        else if (isFood) cellClass += ' food'

        grid.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          />
        )
      }
    }
    return grid
  }

  return (
    <div className="game-container">
      <h1 className="game-title">🐍 贪吃蛇游戏</h1>

      <div className="game-info">
        <div className="score">得分: {score}</div>
        <div className="high-score">最高分: {Math.max(score, parseInt(localStorage.getItem('snakeHighScore') || '0'))}</div>
      </div>

      <div
        className="game-board"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {renderGrid()}

        {!gameStarted && (
          <div className="overlay">
            <div className="overlay-content">
              <h2>准备好了吗？</h2>
              <p>按空格键或回车键开始游戏</p>
              <div className="controls-hint">
                <p>🎮 操作方式:</p>
                <p>方向键 或 WASD - 移动</p>
                <p>空格键 - 暂停</p>
              </div>
            </div>
          </div>
        )}

        {isPaused && gameStarted && (
          <div className="overlay">
            <div className="overlay-content">
              <h2>⏸️ 游戏暂停</h2>
              <p>按空格键继续</p>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="overlay">
            <div className="overlay-content">
              <h2>💀 游戏结束</h2>
              <p>最终得分: {score}</p>
              <p>按空格键或回车键重新开始</p>
            </div>
          </div>
        )}
      </div>

      <div className="mobile-controls">
        <div className="control-row">
          <button className="control-btn" onClick={() => direction !== 'DOWN' && setDirection('UP')}>↑</button>
        </div>
        <div className="control-row">
          <button className="control-btn" onClick={() => direction !== 'RIGHT' && setDirection('LEFT')}>←</button>
          <button className="control-btn" onClick={() => setIsPaused(p => !p)}>{isPaused ? '▶' : '⏸'}</button>
          <button className="control-btn" onClick={() => direction !== 'LEFT' && setDirection('RIGHT')}>→</button>
        </div>
        <div className="control-row">
          <button className="control-btn" onClick={() => direction !== 'UP' && setDirection('DOWN')}>↓</button>
        </div>
      </div>

      <div className="instructions">
        <p>💡 提示: 使用方向键或 WASD 控制蛇的移动，空格键暂停</p>
      </div>
    </div>
  )
}

export default App
