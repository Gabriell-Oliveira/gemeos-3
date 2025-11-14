// ========== CONFIGURAÇÃO DOS SANTOS ==========
const santos = [
  { 
    id: 1, 
    nome: "Padre Pio", 
    imagem: "../imagens/padre-pio.png" 
  },
  { 
    id: 2, 
    nome: "Santa Teresinha", 
    imagem: "../imagens/santa-teresinha.png" 
  },
  { 
    id: 3, 
    nome: "São José", 
    imagem: "../imagens/sao-jose.png" 
  },
  { 
    id: 4, 
    nome: "São João Paulo II", 
    imagem: "../imagens/sao-joao-paulo-ii.png" 
  },
  { 
    id: 5, 
    nome: "São Francisco de Assis", 
    imagem: "../imagens/sao-francisco.png" 
  },
  { 
    id: 6, 
    nome: "Santa Clara de Assis", 
    imagem: "../imagens/santa-clara.png" 
  }
];

// ========== VARIÁVEIS DO JOGO ==========
const tabuleiro = document.getElementById("tabuleiro");
const mensagemEl = document.getElementById("mensagem");
const paresEncontradosEl = document.getElementById("pares-encontrados");
const tentativasEl = document.getElementById("tentativas");
const progressEl = document.getElementById("progress");

let cartas = [];
let primeiraCarta = null;
let segundaCarta = null;
let bloqueado = false;
let paresEncontrados = 0;
let tentativas = 0;

// Criar array com pares duplicados
let cartasEmbaralhadas = [...santos, ...santos];

// ========== FUNÇÃO: EMBARALHAR ARRAY ==========
function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ========== FUNÇÃO: CRIAR TABULEIRO ==========
function criarTabuleiro() {
  tabuleiro.innerHTML = "";
  cartas = [];
  
  // Embaralhar cartas
  cartasEmbaralhadas = embaralhar([...santos, ...santos]);

  cartasEmbaralhadas.forEach((santo, index) => {
    const carta = document.createElement("div");
    carta.classList.add("carta");
    carta.dataset.id = santo.id;
    carta.dataset.index = index;

    carta.innerHTML = `
      <div class="face frente"></div>
      <div class="face verso">
        <img src="${santo.imagem}" alt="${santo.nome}" onerror="this.src='../imagens/default.jpg'">
        <div class="santo-nome">${santo.nome}</div>
      </div>
    `;

    carta.addEventListener("click", () => virarCarta(carta, santo));
    cartas.push(carta);
    tabuleiro.appendChild(carta);
  });
}

// ========== FUNÇÃO: VIRAR CARTA (CORRIGIDA!) ==========
function virarCarta(carta, santo) {
  // Verificar se pode virar
  if (bloqueado) return;
  if (carta.classList.contains("virada")) return;
  if (carta.classList.contains("matched")) return;

  // Virar carta (SEMPRE gira ao clicar!)
  carta.classList.add("virada");

  // Primeira carta
  if (!primeiraCarta) {
    primeiraCarta = { carta, santo };
    return; // Para aqui, aguardando segunda carta
  }

  // Segunda carta
  segundaCarta = { carta, santo };
  bloqueado = true; // Bloqueia novas seleções
  tentativas++;
  atualizarStats();

  // Verificar se é par
  if (primeiraCarta.santo.id === segundaCarta.santo.id) {
    // PAR CORRETO! ✓
    setTimeout(() => {
      // IMPORTANTE: Adicionar classe matched MANTÉM a carta virada!
      primeiraCarta.carta.classList.add("matched");
      segundaCarta.carta.classList.add("matched");
      
      // Remover classe virada (não é mais necessária, matched já deixa virada)
      primeiraCarta.carta.classList.remove("virada");
      segundaCarta.carta.classList.remove("virada");
      
      paresEncontrados++;
      atualizarStats();
      resetarCartas();

      // Verificar vitória
      if (paresEncontrados === santos.length) {
        setTimeout(mostrarVitoria, 500);
      }
    }, 600);
  } else {
    // PAR ERRADO! ✗
    setTimeout(() => {
      primeiraCarta.carta.classList.add("wrong");
      segundaCarta.carta.classList.add("wrong");

      setTimeout(() => {
        // Remover todas as classes para voltar ao estado inicial
        primeiraCarta.carta.classList.remove("virada", "wrong");
        segundaCarta.carta.classList.remove("virada", "wrong");
        resetarCartas();
      }, 2500);
    }, 600);
  }
}

// ========== FUNÇÃO: RESETAR CARTAS SELECIONADAS ==========
function resetarCartas() {
  primeiraCarta = null;
  segundaCarta = null;
  bloqueado = false;
}

// ========== FUNÇÃO: ATUALIZAR ESTATÍSTICAS ==========
function atualizarStats() {
  paresEncontradosEl.textContent = `${paresEncontrados} / ${santos.length}`;
  tentativasEl.textContent = tentativas;

  // Atualizar barra de progresso
  const progresso = (paresEncontrados / santos.length) * 100;
  progressEl.style.width = `${progresso}%`;
}

// ========== FUNÇÃO: MOSTRAR VITÓRIA ==========
function mostrarVitoria() {
  mensagemEl.textContent = `🏆 PARABÉNS! Você completou em ${tentativas} tentativas!`;
  mensagemEl.className = "message win";

  // Salvar peça conquistada
  localStorage.setItem('pecasConquistadas', '1');
  localStorage.setItem('desafioAtual', '1');

  // Avançar para próximo desafio após 3 segundos
  setTimeout(() => {
    const avancar = confirm('🎉 Peça #1 conquistada!\n\n🧩 Ir para o próximo desafio?');
    if (avancar) {
      window.location.href = '../associacao/index.html';
    }
  }, 2000);
}

// ========== FUNÇÃO: REINICIAR JOGO ==========
function reiniciarJogo() {
  paresEncontrados = 0;
  tentativas = 0;
  primeiraCarta = null;
  segundaCarta = null;
  bloqueado = false;
  
  mensagemEl.textContent = "";
  mensagemEl.className = "message";
  
  atualizarStats();
  criarTabuleiro();
  
  // Re-animar as cartas
  setTimeout(() => {
    const todasCartas = document.querySelectorAll('.carta');
    todasCartas.forEach((carta, index) => {
      carta.style.opacity = '0';
      carta.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        carta.style.transition = 'all 0.5s ease';
        carta.style.opacity = '1';
        carta.style.transform = 'translateY(0)';
      }, 50 * index);
    });
  }, 50);
}

// ========== INICIALIZAR JOGO ==========
window.addEventListener("DOMContentLoaded", () => {
  criarTabuleiro();
  atualizarStats();
  
  // Animação de entrada das cartas
  setTimeout(() => {
    const todasCartas = document.querySelectorAll('.carta');
    todasCartas.forEach((carta, index) => {
      carta.style.opacity = '0';
      carta.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        carta.style.transition = 'all 0.5s ease';
        carta.style.opacity = '1';
        carta.style.transform = 'translateY(0)';
      }, 50 * index);
    });
  }, 100);
});