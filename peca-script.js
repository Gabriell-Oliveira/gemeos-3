// ========== CONFIGURAÇÃO DOS DESAFIOS ==========
const desafios = [
  { nome: "Jogo da Memória", proximo: "associacao/index.html" },
  { nome: "Associação", proximo: "quiz/index.html" },
  { nome: "Quiz Relâmpago", proximo: "caca-palavras/index.html" },
  { nome: "Caça-Palavras", proximo: "mensagem-biblica.html" }
];

const mensagensMotivacionais = [
  "Continue assim! Cada peça te aproxima da grande revelação! ✨",
  "Você está indo muito bem! Metade do caminho já foi percorrido! 🌟",
  "Incrível! Falta apenas uma peça para descobrir o mistério! 🎯",
  "Última peça conquistada! Prepare-se para a revelação final! 🎊"
];

// ========== OBTER PEÇA ATUAL DO LOCALSTORAGE ==========
let pecaAtual = parseInt(localStorage.getItem('pecasConquistadas') || '1');

// Garantir que está entre 1 e 4
if (pecaAtual < 1) pecaAtual = 1;
if (pecaAtual > 4) pecaAtual = 4;

// ========== ATUALIZAR INTERFACE ==========
function atualizarInterface() {
  // Atualizar número da peça
  document.getElementById('peca-numero').textContent = pecaAtual;
  document.getElementById('piece-number').textContent = pecaAtual;

  // Atualizar mini peças
  const miniPecas = document.querySelectorAll('.mini-piece');
  miniPecas.forEach((peca, index) => {
    if (index < pecaAtual) {
      peca.classList.remove('locked');
      peca.classList.add('collected');
    }
  });

  // Atualizar barra de progresso
  const progresso = (pecaAtual / 4) * 100;
  document.getElementById('progress-fill').style.width = `${progresso}%`;

  // Atualizar mensagem motivacional
  document.getElementById('motivational-message').textContent = mensagensMotivacionais[pecaAtual - 1];

  // Atualizar texto do botão se for a última peça
  if (pecaAtual === 4) {
    document.getElementById('continue-btn').innerHTML = '📖 Ver Mensagem Especial';
  }
}

// ========== CRIAR CONFETES ========== 
function criarConfetes() {
  const confettiContainer = document.getElementById('confetti');
  const cores = ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#4CAF50', '#FF69B4'];
  
  for (let i = 0; i < 50; i++) {
    const confete = document.createElement('div');
    confete.style.position = 'absolute';
    confete.style.width = '10px';
    confete.style.height = '10px';
    confete.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
    confete.style.left = Math.random() * 100 + '%';
    confete.style.top = '-20px';
    confete.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confete.style.opacity = Math.random() * 0.7 + 0.3;
    confete.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
    confete.style.animationDelay = Math.random() * 0.5 + 's';
    
    confettiContainer.appendChild(confete);
  }

  // Adicionar animação de queda
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fall {
      to {
        transform: translateY(100vh) rotate(${Math.random() * 360}deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// ========== FUNÇÃO: IR PARA PRÓXIMO DESAFIO ==========
function proximoDesafio() {
  const indice = pecaAtual - 1;
  
  if (indice < desafios.length) {
    // Adicionar efeito de transição
    document.querySelector('.container').style.opacity = '0';
    document.querySelector('.container').style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      window.location.href = desafios[indice].proximo;
    }, 300);
  }
}

// ========== SOM DE VITÓRIA (OPCIONAL) ==========
function tocarSomVitoria() {
  // Se você tiver um arquivo de som, pode adicionar aqui
  // const audio = new Audio('sons/vitoria.mp3');
  // audio.play();
}

// ========== INICIALIZAR ==========
window.addEventListener('DOMContentLoaded', () => {
  atualizarInterface();
  criarConfetes();
  tocarSomVitoria();

  // Animação extra na peça
  setTimeout(() => {
    document.querySelector('.puzzle-piece').style.transform = 'scale(1.1)';
    setTimeout(() => {
      document.querySelector('.puzzle-piece').style.transform = 'scale(1)';
    }, 200);
  }, 800);
});