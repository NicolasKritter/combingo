import { Cell, SeededRandom } from "./classes"

export default class BingoGame {
  grid: Cell[] = []
  private freeCellIndex = 12
  private levelTracker = { lineLevels: new Map<number, number>(), max: 0 }
  private gameWon = false
  private rng: SeededRandom
  private bingoItems: string[]
  constructor(seed: string, state: number[] = [], bingoItems: string[]) {
    this.bingoItems = bingoItems
    this.initializeGame(seed, state)
  }

  hideVictoryScreen() {
    document.getElementById('victoryScreen')!.style.display = 'none'
    document.body.style.overflow = 'auto'
  }

  initializeGame(seed: string = '', state: number[] = []) {
    this.rng = new SeededRandom(seed)
    this.levelTracker = { lineLevels: new Map<number, number>(), max: 0 } //TODO implement 
    this.generateGrid(state)
    this.renderGrid()
    this.updateStatus()
    this.gameWon = false
  }

  private generateGrid(state: number[] = []) {

    this.grid = []
    const shuffled = [...this.bingoItems]
    // Fisher-Yates shuffle with seeded random
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng.next() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    for (let i = 0; i < 25; i++) {
      let cell: Cell
      //TODO pass freecellindex in state param
      if (i === this.freeCellIndex) { // Center cell (FREE)
        cell = new Cell('FREE SPACE')
        cell.isFree = true
        // Auto-select the FREE space at max level
        cell.counter = 3
        this.grid.push(cell)
      }
      else {
        // handle cases with less than 25 words
        const text = shuffled[i] ? shuffled[i] : shuffled[Math.floor(this.rng.next() * shuffled.length)]
        cell = new Cell(text)

        if (state && state.includes(i)) {

          //TODO implement level from state and counting completed row (do after first render? )
          //TODo so use index:count and parse (state.find e.i=i, cell.counter ) e.counter?
          cell.counter += 1
        }
        this.grid.push(cell)
      }
    }
  }

  private renderGrid() {
    const gridContainer = document.getElementById('bingoGrid')!
    gridContainer.innerHTML = ''
    this.grid.forEach((cell, index) => {
      //  todo create function to create the cell element and use it to rerender only the togelled cell
      //todo so need to add cell id and replace cell content (chec if can replace html element directly ?) 
      const cellElement = document.createElement('div')
      const cellState = cell.counter > 0 ? 'selected' : ''
      cellElement.className = 'bingo-cell cursor-pointer p-3 rounded-lg text-white text-center text-sm font-bold min-h-20 flex items-center justify-center '
      if (cellState) {
        cellElement.classList.add(cellState)
      }
      cellElement.textContent = cell.text
      if (cell.counter > 0) {
        cellElement.textContent += ' X' + cell.counter
      }
      cellElement.addEventListener('click', () => this.toggleCell(index))
      gridContainer.appendChild(cellElement)
    })
  }

  private toggleCell(index: number) {
    if (this.gameWon) return
    const cell = this.grid[index]
    cell.counter += 1
    //TODO only render changed cell 
    this.renderGrid()
    this.checkWinConditions()
    this.updateStatus()
  }

  private checkWinConditions() {
    const lines = [
      // Rows
      [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
      // Columns
      [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22],
      [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
      // Diagonals
      [0, 6, 12, 18, 24], [4, 8, 12, 16, 20],
    ]


    lines.forEach((line, lineIndex) => {
      const targetLevel = this.levelTracker.lineLevels.get(lineIndex) || 0
      const isComplete = line.every(cellIndex => this.grid[cellIndex].counter > targetLevel)

      if (isComplete) {
        // newCompletedLines.add(lineIndex)
        if (!this.levelTracker.lineLevels.has(lineIndex)) {
          this.levelTracker.lineLevels.set(lineIndex, 1)
        } else {
          this.levelTracker.lineLevels.set(lineIndex, targetLevel + 1)
        }
        this.animateWinningLine(line)
        this.showSuccessAnimation(false)
      }
    })

    // TODO  game won by level and button restart or continue win cond = has newNew and count >0 (handle level up)
    // Check for full card
    //12 lines +col +diag or 25 cell
    if (this.levelTracker.lineLevels.size === 12) {
      this.gameWon = true
      setTimeout(() => {
        this.showSuccessAnimation(true)
      }, 1000) // Delay to show line completion first
    }
  }

  private animateWinningLine(line: number[]) {
    const cells = document.querySelectorAll('.bingo-cell') as NodeListOf<HTMLElement>
    line.forEach((cellIndex: number, i: number) => {
      setTimeout(() => {
        const cell = cells[cellIndex]
        cell.classList.add('winning')

        // Add golden sweep effect
        const effect = document.createElement('div')
        effect.className = 'line-complete-effect'
        cell.style.position = 'relative'
        cell.appendChild(effect)

        setTimeout(() => {
          effect.remove()
        }, 1000)
      }, i * 100)
    })

    setTimeout(() => {
      line.forEach((cellIndex) => {
        cells[cellIndex].classList.remove('winning')
      })
    }, 2000)
  }

  private showSuccessAnimation(isFullCard = false) {

    if (isFullCard) {
      // Show full victory screen like SC2
      document.getElementById('victoryScreen')!.style.display = 'block'
      document.body.style.overflow = 'hidden'
    }
    else {
      // Show line complete message
      const successMessage = document.getElementById('successMessage')!
      successMessage.classList.remove('hidden')

      setTimeout(() => {
        successMessage.classList.add('hidden')
      }, 2000)
    }
  }

  private updateStatus() {
    document.getElementById('linesCount')!.textContent = this.levelTracker.lineLevels.size + ''
    const status = this.gameWon
      ? 'VICTORY!'
      : this.levelTracker.lineLevels.size > 0 ? 'LINES COMPLETE' : 'ACTIVE'
    document.getElementById('gameStatus')!.textContent = status
    document.getElementById('gameStatus')!.className
      = `font-bold ${this.gameWon
        ? 'text-green-400'
        : this.levelTracker.lineLevels.size > 0 ? 'text-orange-400' : 'text-yellow-400'}`
  }

}