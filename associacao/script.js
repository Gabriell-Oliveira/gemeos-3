// ========== CONFIGURAÇÃO DAS ASSOCIAÇÕES ==========
const associacoes = [
  {
    id: 1,
    descricao: "Livro composto por 150 capítulos, normalmente são cantados",
    livro: "Salmos"
  },
  {
    id: 2,
    descricao: "Livro que relata a história da criação do mundo",
    livro: "Gênesis"
  },
  {
    id: 3,
    descricao: "Livro que relata a saída do povo Hebreu do Egito",
    livro: "Êxodo"
  },
  {
    id: 4,
    descricao: "Evangelho escrito pelo discípulo amado de Jesus",
    livro: "João"
  },
  {
    id: 5,
    descricao: "Último livro da Bíblia, revela acontecimentos futuros",
    livro: "Apocalipse"
  }
];

// ========== VARIÁVEIS DO JOGO ==========
let vidas = 3;
let acertos = 0;
let cartaSelecionada = null;
let linhasConexao = [];
let jogoAtivo = true;

const vidasEl = document.getElementById("vidas");
const acertosEl = document.getElementById("acertos");
const progressEl = document.getElementById("progress");
const mensagemEl = document.getElementById("mensagem");
const svgLines = document.getElementById("svg-lines");

// ========== FUNÇÃO: EMBARALHAR ARRAY ==========
function embaralhar(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// ========== FUNÇÃO: CRIAR TABULEIRO ==========
function criarTabuleiro() {
  const descricoesContainer = document.getElementById("cards-descricoes");
  const livrosContainer = document.getElementById("cards-livros");
  
  descricoesContainer.innerHTML = "";
  livrosContainer.innerHTML = "";
  
  // Embaralhar descrições e livros separadamente
  const descricoesEmbaralhadas = embaralhar(associacoes);
  const livrosEmbaralhados = embaralhar(associacoes);
  
  // Criar cards de descrições
  descricoesEmbaralhadas.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card", "card-descricao");
    card.dataset.id = item.id;
    card.dataset.tipo = "descricao";
    card.textContent = item.descricao;
    
    card.addEventListener("click", () => selecionarCard(card, item));
    descricoesContainer.appendChild(card);
  });
  
  // Criar cards de livros
  livrosEmbaralhados.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card", "card-livro");
    card.dataset.id = item.id;
    card.dataset.tipo = "livro";
    card.textContent = item.livro;
    
    card.addEventListener("click", () => selecionarCard(card, item));
    livrosContainer.appendChild(card);
  });
}

// ========== FUNÇÃO: SELECIONAR CARD ==========
function selecionarCard(card, item) {
  if (!jogoAtivo) return;
  if (card.classList.contains("matched")) return;
  if (card.classList.contains("disabled")) return;
  
  // Se não há carta selecionada
  if (!cartaSelecionada) {
    cartaSelecionada = { card, item };
    card.classList.add("selected");
    return;
  }
  
  // Se clicou na mesma carta
  if (cartaSelecionada.card === card) {
    cartaSelecionada.card.classList.remove("selected");
    cartaSelecionada = null;
    return;
  }
  
  // Se clicou em duas cartas do mesmo tipo (ambas descrições ou ambos livros)
  if (cartaSelecionada.card.dataset.tipo === card.dataset.tipo) {
    cartaSelecionada.card.classList.remove("selected");
    cartaSelecionada = { card, item };
    card.classList.add("selected");
    return;
  }
  
  // Verificar se é a associação correta
  if (cartaSelecionada.item.id === item.id) {
    // ACERTOU! ✓
    acertoCorreto(card);
  } else {
    // ERROU! ✗
    erroIncorreto(card);
  }
}

// ========== FUNÇÃO: ACERTO CORRETO ==========
function acertoCorreto(segundaCard) {
  const primeiraCard = cartaSelecionada.card;
  
  // Marcar como matched
  primeiraCard.classList.add("matched");
  segundaCard.classList.add("matched");
  primeiraCard.classList.remove("selected");
  
  // Desenhar linha verde permanente
  desenharLinha(primeiraCard, segundaCard, "correct", true);
  
  acertos++;
  atualizarStats();
  cartaSelecionada = null;
  
  // Verificar vitória
  if (acertos === associacoes.length) {
    setTimeout(mostrarVitoria, 500);
  }
}

// ========== FUNÇÃO: ERRO INCORRETO ==========
function erroIncorreto(segundaCard) {
  const primeiraCard = cartaSelecionada.card;
  
  // Desenhar linha vermelha temporária
  desenharLinha(primeiraCard, segundaCard, "wrong", false);
  
  // Remover seleção
  primeiraCard.classList.remove("selected");
  cartaSelecionada = null;
  
  // Perder vida
  vidas--;
  atualizarStats();
  
  // Remover linha vermelha após 800ms
  setTimeout(() => {
    removerLinhasErradas();
  }, 800);
  
  // Verificar se perdeu
  if (vidas === 0) {
    setTimeout(mostrarDerrota, 1000);
  }
}

// ========== FUNÇÃO: DESENHAR LINHA ==========
function desenharLinha(card1, card2, tipo, permanente) {
  const rect1 = card1.getBoundingClientRect();
  const rect2 = card2.getBoundingClientRect();
  const svgRect = svgLines.getBoundingClientRect();
  
  // Calcular posições relativas ao SVG
  const x1 = rect1.right - svgRect.left;
  const y1 = rect1.top + rect1.height / 2 - svgRect.top;
  const x2 = rect2.left - svgRect.left;
  const y2 = rect2.top + rect2.height / 2 - svgRect.top;
  
  // Criar linha SVG
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.classList.add("connection-line", tipo);
  
  svgLines.appendChild(line);
  
  if (permanente) {
    linhasConexao.push(line);
  }
}

// ========== FUNÇÃO: REMOVER LINHAS ERRADAS ==========
function removerLinhasErradas() {
  const linhasErradas = svgLines.querySelectorAll(".connection-line.wrong");
  linhasErradas.forEach(linha => linha.remove());
}

// ========== FUNÇÃO: ATUALIZAR ESTATÍSTICAS ==========
function atualizarStats() {
  // Atualizar vidas
  const coracoes = "💚".repeat(vidas) + "🖤".repeat(3 - vidas);
  vidasEl.textContent = coracoes;
  
  // Atualizar acertos
  acertosEl.textContent = `${acertos} / ${associacoes.length}`;
  
  // Atualizar barra de progresso
  const progresso = (acertos / associacoes.length) * 100;
  progressEl.style.width = `${progresso}%`;
}

// ========== FUNÇÃO: MOSTRAR VITÓRIA ==========
function mostrarVitoria() {
  jogoAtivo = false;
  mensagemEl.textContent = `🏆 PARABÉNS! Você completou com ${3 - vidas} erro(s)!`;
  mensagemEl.className = "message win";
  
  // Desabilitar todas as cartas
  document.querySelectorAll(".card").forEach(card => {
    card.classList.add("disabled");
  });
  
  // Salvar peça conquistada
  localStorage.setItem('pecasConquistadas', '2');
  localStorage.setItem('desafioAtual', '2');
  
  // Avançar para próximo desafio após 3 segundos
  setTimeout(() => {
    const avancar = confirm('🎉 Peça #2 conquistada!\n\n🧩 Ir para o próximo desafio?');
    if (avancar) {
      window.location.href = '../quiz/index.html';
    }
  }, 2000);
}

// ========== FUNÇÃO: MOSTRAR DERROTA ==========
function mostrarDerrota() {
  jogoAtivo = false;
  mensagemEl.textContent = `💀 Você perdeu todas as vidas! Tente novamente.`;
  mensagemEl.className = "message lose";
  
  // Desabilitar todas as cartas
  document.querySelectorAll(".card").forEach(card => {
    card.classList.add("disabled");
  });
}

// ========== FUNÇÃO: REINICIAR JOGO ==========
function reiniciarJogo() {
  vidas = 3;
  acertos = 0;
  cartaSelecionada = null;
  linhasConexao = [];
  jogoAtivo = true;
  
  mensagemEl.textContent = "";
  mensagemEl.className = "message";
  
  // Limpar linhas
  svgLines.innerHTML = "";
  
  atualizarStats();
  criarTabuleiro();
  
  // Animar entrada dos cards
  setTimeout(() => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        card.style.transition = 'all 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 30 * index);
    });
  }, 50);
}

// ========== INICIALIZAR JOGO ==========
window.addEventListener("DOMContentLoaded", () => {
  criarTabuleiro();
  atualizarStats();
  
  // Animar entrada dos cards
  setTimeout(() => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        card.style.transition = 'all 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 30 * index);
    });
  }, 100);
});