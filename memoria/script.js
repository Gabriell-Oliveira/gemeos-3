// ========== CONFIGURAÇÃO DOS SANTOS ==========
const santos = [
  { id: 1, nome: "Padre Pio", imagem: "../imagens/padre-pio.jpg" },
  { id: 2, nome: "Santa Teresinha", imagem: "../imagens/santa-teresinha.jpg" },
  { id: 3, nome: "São José", imagem: "../imagens/sao-jose.jpg" },
  { id: 4, nome: "São João Paulo II", imagem: "../imagens/sao-joao-paulo-ii.jpg" },
  { id: 5, nome: "São Francisco de Assis", imagem: "../imagens/sao-francisco.jpg" },
  { id: 6, nome: "Santa Clara de Assis", imagem: "../imagens/santa-clara.jpg" }
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

  cartasEmbaralhadas = embaralhar([...santos, ...santos]);

  cartasEmbaralhadas.forEach((santo, index) => {
    const carta = document.createElement("div");
    carta.classList.add("carta");
    carta.dataset.id = santo.id;

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

// ========== FUNÇÃO: VIRAR CARTA ==========
function virarCarta(carta, santo) {
  if (bloqueado || carta.classList.contains("virada") || carta.classList.contains("matched")) {
    return;
  }

  carta.classList.add("virada");

  if (!primeiraCarta) {
    primeiraCarta = { carta, santo };
    return;
  }

  segundaCarta = { carta, santo };
  bloqueado = true;
  tentativas++;
  atualizarStats();

  // --- Testar par ---
  if (primeiraCarta.santo.id === segundaCarta.santo.id) {
    // PAR CORRETO
    setTimeout(() => {
      primeiraCarta.carta.classList.add("matched");
      segundaCarta.carta.classList.add("matched");
      paresEncontrados++;
      atualizarStats();
      resetarCartas();

      // Vitória
      if (paresEncontrados === santos.length) {
        setTimeout(mostrarVitoria, 500);
      }
    }, 700);

  } else {
    // PAR ERRADO
    setTimeout(() => {
      primeiraCarta.carta.classList.add("wrong");
      segundaCarta.carta.classList.add("wrong");

      setTimeout(() => {
        primeiraCarta.carta.classList.remove("virada", "wrong");
        segundaCarta.carta.classList.remove("virada", "wrong");
        resetarCartas();
      }, 1000);

    }, 700);
  }
}

// ========== FUNÇÃO: RESETAR ==========
function resetarCartas() {
  primeiraCarta = null;
  segundaCarta = null;
  bloqueado = false;
}

// ========== FUNÇÃO: ATUALIZAR ESTATÍSTICAS ==========
function atualizarStats() {
  paresEncontradosEl.textContent = `${paresEncontrados} / ${santos.length}`;
  tentativasEl.textContent = tentativas;

  progressEl.style.width = `${(paresEncontrados / santos.length) * 100}%`;
}

// ========== FUNÇÃO: MOSTRAR VITÓRIA ==========
function mostrarVitoria() {
  mensagemEl.textContent = `🏆 PARABÉNS! Você completou em ${tentativas} tentativas!`;
  mensagemEl.className = "message win";

  localStorage.setItem('pecasConquistadas', '1');
  localStorage.setItem('desafioAtual', '2');

  setTimeout(() => {
    window.location.href = '../pecas/peca-conquistada.html?peca=1';
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
}

// ========== INICIALIZAR ==========
window.addEventListener("DOMContentLoaded", () => {
  criarTabuleiro();
  atualizarStats();
});
