// ========== VARIÁVEIS DO JOGO ==========
let pecasEncaixadas = 0;
const TOTAL_PECAS = 4;

const pecasEncaixadasEl = document.getElementById('pecas-encaixadas');
const statusMessageEl = document.getElementById('status-message');
const confettiContainer = document.getElementById('confetti');

// Som de encaixe (beep simples com Web Audio API)
let audioContext;
try {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
} catch (e) {
  console.log('Web Audio API não suportada');
}

function tocarSomEncaixe() {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.2);
}

function tocarSomVitoria() {
  if (!audioContext) return;
  
  const notas = [523.25, 659.25, 783.99, 1046.50]; // Dó, Mi, Sol, Dó (oitava acima)
  
  notas.forEach((freq, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = freq;
    oscillator.type = 'triangle';
    
    const startTime = audioContext.currentTime + (index * 0.15);
    gainNode.gain.setValueAtTime(0.2, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.3);
  });
}

// ========== FUNÇÕES DE DRAG & DROP ==========
function allowDrop(event) {
  event.preventDefault();
  event.target.closest('.puzzle-slot').classList.add('drag-over');
}

function drag(event) {
  event.dataTransfer.setData('piece', event.target.dataset.piece);
  event.target.classList.add('dragging');
}

function drop(event) {
  event.preventDefault();
  
  const slot = event.target.closest('.puzzle-slot');
  slot.classList.remove('drag-over');
  
  // Verificar se já está preenchido
  if (slot.classList.contains('filled')) {
    return;
  }
  
  const pieceNumber = event.dataTransfer.getData('piece');
  const slotPosition = slot.dataset.pos;
  
  // Verificar se é a posição correta
  if (pieceNumber === slotPosition) {
    encaixarPeca(slot, pieceNumber);
  } else {
    // Feedback de erro (shake)
    slot.style.animation = 'none';
    setTimeout(() => {
      slot.style.animation = 'shake 0.5s ease';
    }, 10);
  }
}

// ========== ENCAIXAR PEÇA ==========
function encaixarPeca(slot, pieceNumber) {
  // Tocar som de encaixe
  tocarSomEncaixe();
  
  // Ocultar peça original
  const originalPiece = document.querySelector(`.pieces-container .puzzle-piece[data-piece="${pieceNumber}"]`);
  originalPiece.classList.add('hidden');
  
  // Criar peça no slot
  const newPiece = document.createElement('div');
  newPiece.className = 'puzzle-piece';
  newPiece.innerHTML = `
    <div class="piece-content">
      <img src="imagens/peca-${pieceNumber}.jpg" 
           alt="Peça ${pieceNumber}" 
           style="width: 100%; height: 100%; object-fit: cover; border-radius: 16px;"
           onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\'piece-number-display\'>${pieceNumber}</span>'">
    </div>
  `;
  
  slot.innerHTML = '';
  slot.appendChild(newPiece);
  slot.classList.add('filled');
  
  // Atualizar contador
  pecasEncaixadas++;
  atualizarContador();
  
  // Verificar vitória
  if (pecasEncaixadas === TOTAL_PECAS) {
    setTimeout(mostrarVitoria, 500);
  }
}

// ========== ATUALIZAR CONTADOR ==========
function atualizarContador() {
  pecasEncaixadasEl.textContent = `${pecasEncaixadas} / ${TOTAL_PECAS}`;
  
  if (pecasEncaixadas === TOTAL_PECAS) {
    pecasEncaixadasEl.style.color = '#4CAF50';
    pecasEncaixadasEl.style.textShadow = '0 0 20px rgba(76, 175, 80, 0.8)';
  }
}

// ========== CRIAR CONFETES ==========
function criarConfetes() {
  const cores = ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#4CAF50', '#FF69B4'];
  
  for (let i = 0; i < 150; i++) {
    const confete = document.createElement('div');
    confete.className = 'confetti';
    confete.style.left = Math.random() * 100 + '%';
    confete.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
    confete.style.animationDelay = Math.random() * 0.5 + 's';
    confete.style.animationDuration = (Math.random() * 2 + 2) + 's';
    
    if (Math.random() > 0.5) {
      confete.style.borderRadius = '50%';
    }
    
    confettiContainer.appendChild(confete);
  }
}

// ========== MOSTRAR VITÓRIA ==========
function mostrarVitoria() {
  // Tocar som de vitória
  tocarSomVitoria();
  
  // Criar confetes
  criarConfetes();
  
  // Mostrar mensagem
  statusMessageEl.textContent = '🎉 PARABÉNS! Você revelou os nomes dos gêmeos! 🎉';
  statusMessageEl.className = 'status-message success';
  
  // Fazer o tabuleiro brilhar
  const board = document.querySelector('.puzzle-board');
  board.style.animation = 'boardGlow 2s ease-in-out infinite';
  
  // Adicionar animação de brilho
  const style = document.createElement('style');
  style.textContent = `
    @keyframes boardGlow {
      0%, 100% {
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
      }
      50% {
        box-shadow: 0 0 60px rgba(255, 215, 0, 0.8);
      }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }
  `;
  document.head.appendChild(style);
  
  // Após 3 segundos, mostrar mensagem final
  setTimeout(() => {
    statusMessageEl.innerHTML = `
      <div style="text-align: center; line-height: 1.8;">
        <div style="font-size: 2rem; margin-bottom: 1rem;">👶 ANDRÉ e PEDRO 👶</div>
        <div style="font-size: 1.2rem;">Os Gêmeos Xavier Calmon</div>
      </div>
    `;
  }, 3000);
}

// ========== REMOVER CLASSE DE DRAGGING ==========
document.addEventListener('dragend', (event) => {
  if (event.target.classList.contains('puzzle-piece')) {
    event.target.classList.remove('dragging');
  }
});

document.addEventListener('dragleave', (event) => {
  if (event.target.classList.contains('puzzle-slot')) {
    event.target.classList.remove('drag-over');
  }
});

// ========== INICIALIZAR ==========
window.addEventListener('DOMContentLoaded', () => {
  atualizarContador();
  
  // Animação de entrada das peças
  const pieces = document.querySelectorAll('.puzzle-piece');
  pieces.forEach((piece, index) => {
    piece.style.opacity = '0';
    piece.style.transform = 'scale(0)';
    
    setTimeout(() => {
      piece.style.transition = 'all 0.6s ease';
      piece.style.opacity = '1';
      piece.style.transform = 'scale(1)';
    }, 200 + (index * 150));
  });
});