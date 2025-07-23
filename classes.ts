export class Cell {
  counter = 0
  isFree = false
  text: string
  constructor(text: string) {
    this.text = text
  }
}
export class SeededRandom {
  seed: number
  constructor(seed?: string | null) {
    this.seed = seed ? this.hashString(seed) : Date.now()
  }

  hashString(str: string) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }
}
