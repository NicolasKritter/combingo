// Starcraft-themed bingo items

import BingoGame from "./BingoGame"

const bingoDefaultItems = [
  'Tourelles', 'cacanecdote', 'funka s\'emballe au cast', 'blague de tkl', 'clip de zeratool',
  'y joue kan clem', 'famélique', 'ça parle pas de la game', 'ça parle de la game', 'LOULOU!', 'move dinguerie', 'cheese', 'camping', 'balance whine',
  'aligulac mentionné', 'n\'a pas check liquipedia', 'le chat parle pas de la game', 'chat endormis', 'chat spam', 'sub hype', 'big donation', 'big brain move', 'supply block',
  'doom drop', 'les casteurs se font troll', 'les casteurs trollent le chat', 'le chat dit un truc bête', 'le chat dit un truc intelligent',
  'c\'est une rediff ?', 'copy pasta', 'star dans le chat', 'pov', 'gg', 'BM!',
  //
  'Build SCV', 'Construct Barracks', 'Train Marines',
  'Build Supply Depot', 'Upgrade Infantry',
  'Research Stim Pack', 'Deploy Bunker', 'Call Down MULE',
  'Construct Factory', 'Build Siege Tank', 'Train Medivac',
  'Orbital Command', 'Engineering Bay',
  'Ghost Academy', 'Nuclear Silo', 'Battlecruiser', 'Viking Fighter',
  'Marauder Squad', 'Reaper Unit', 'Hellion Patrol', 'Thor Mech',
  'Banshee Stealth', 'Raven Drone', 'Sensor Tower', 'Planetary Fortress',
  'Macro Hatch', 'Spawn Larva', 'Mutate Zergling', 'Overlord Scout',
  'Creep Spread', 'Hydralisk Den', 'Spire Evolution', 'Ultralisk Cavern',
  'Infestor Pit', 'Nydus Network', 'Spine Crawler', 'Spore Crawler',
  'Queen Inject', 'Baneling Nest', 'Roach Warren', 'Corruptor Flock',
  'Brood Lord', 'Viper Ability', 'Swarm Host', 'Lurker Den',
  'Probe Warp', 'Pylon Power', 'Gateway Train', 'Cybernetics Core',
  'Stalker Blink', 'Zealot Charge', 'Sentry Shield', 'Phoenix Lift',
  'Void Ray Beam', 'Carrier Fleet', 'Colossus March', 'Immortal Guard',
  'High Templar', 'Dark Templar', 'Archon Merge', 'Observer Scout',
  'Warp Prism', 'Robotics Bay', 'Templar Archives', 'Fleet Beacon',
  'Photon Cannon', 'Shield Battery', 'Nexus Recall', 'Chrono Boost',
]
let bingoItems: string[] = []
let currentGame: BingoGame

function bindEvents(game: BingoGame): void {

  document.getElementById('newGameBtn')!.addEventListener('click', () => {
    const seed = (document.getElementById('seedInput') as HTMLInputElement).value.trim() || ''
    game.initializeGame(seed)
    document.getElementById('successMessage')!.classList.add('hidden')
    this.hideVictoryScreen()
  })

  document.getElementById('victoryNewGameBtn')!.addEventListener('click', () => {
    const seed = (document.getElementById('seedInput') as HTMLInputElement).value.trim() || ''
    game.initializeGame(seed)
    game.hideVictoryScreen()
  })

  // Allow Enter key to start new game
  document.getElementById('seedInput')!.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const seed = (e.target! as HTMLInputElement).value.trim()
      game.initializeGame(seed)
      document.getElementById('successMessage')!.classList.add('hidden')
      game.hideVictoryScreen()
    }
  })

  const sidebar = document.getElementById('wordSidebar')!
  document.getElementById('openSidebarBtn')!.addEventListener('click', () => {
    sidebar.classList.remove('-translate-x-full');
  });
  document.getElementById('closeSidebarBtn')!.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
  });

  const shareBtn = document.getElementById('shareBtn')!;
  const shareUrlContainer = document.getElementById('shareUrlContainer')!;
  const shareUrlInput = document.getElementById('shareUrlInput') as HTMLInputElement;
  const copyUrlBtn = document.getElementById('copyUrlBtn')!;

  shareBtn.addEventListener('click', () => {
    const url = generateShareURL();
    shareUrlInput.value = url;
    shareUrlContainer.classList.remove('hidden');
    shareUrlInput.select();
  });

  copyUrlBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(shareUrlInput.value);

      // Show feedback
      const originalText = copyUrlBtn.textContent;
      copyUrlBtn.textContent = 'Copied!';
      copyUrlBtn.classList.add('bg-green-600');

      setTimeout(() => {
        copyUrlBtn.textContent = originalText;
        copyUrlBtn.classList.remove('bg-green-600');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      alert('Failed to copy URL to clipboard');
    }
  });
}

function setItems(): void {
  bingoItems = (document.getElementById('wordListArea') as HTMLInputElement)!.value.split('\n').filter((e: string) => e && e.trim())
}


function getDataFromURL(): { seed: string, state: string[] } {
  const currentURL = new URL(window.location as any)
  const stateParam = currentURL.searchParams.get('state')
  return { seed: currentURL.searchParams.get('seed') || Date.now() + '', state: stateParam ? stateParam.split(',') : [] }
}


function generateShareURL(): string {
  const baseURL = window.location.href.split('?')[0];
  const seed = (document.getElementById('seedInput') as HTMLInputElement).value;

  // Get indexes of selected cells (counter > 0)
  const selectedCells = currentGame.grid
    .map((cell, index) => ({ index, counter: cell.counter }))
    .filter(cell => cell.counter > 0)
    .map(cell => cell.index)
    .join(',');

  const params = new URLSearchParams();
  if (seed) params.set('seed', seed);
  if (selectedCells) params.set('state', selectedCells);

  return `${baseURL}?${params.toString()}`;
}
// Initialize the game when page loads
window.addEventListener('DOMContentLoaded', () => {
  const config = getDataFromURL()
  const inputSeed = document.getElementById('seedInput')! as HTMLInputElement
  inputSeed.value = config.seed
  const wordListArea = document.getElementById('wordListArea') as HTMLInputElement
  wordListArea.value = bingoDefaultItems.join('\n')
  document.getElementById('validateWordList')!.addEventListener('click', setItems)
  setItems()

  // Store game instance globally
  currentGame = new BingoGame(config.seed, config.state.map(i => Number.parseInt(i, 10)), bingoItems)
  bindEvents(currentGame)
})
