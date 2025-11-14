// ========== CONFIGURAÇÃO DO QUIZ ==========
const TEMPO_TOTAL = 30; // segundos
const RESPOSTA_CORRETA = "André";

// ========== VARIÁVEIS DO JOGO ==========
let tempoRestante = TEMPO_TOTAL;
let timerInterval = null;
let jogoAtivo = true;

const timerNumberEl = document.getElementById("timer-number");
const timerProgressEl = document.getElementById("timer-progress");
const mensagemEl = document.getElementById("mensagem");
const restartBtn = document.getElementById("restart-btn");
const alternativasEl = document.getElementById("alternatives");

// Circunferência do círculo (2 * PI * raio)
const CIRCUNFERENCIA = 2 * Math.PI * 45; // raio = 45

// ========== FUNÇÃO: INICIAR TIMER ==========
function iniciarTimer() {
  // Atualizar a cada segundo
  timerInterval = setInterval(() => {
    tempoRestante--;
    atualizarTimer();

    // Verificar se o tempo acabou
    if (tempoRestante <= 0) {
      clearInterval(timerInterval);
      tempoEsgotado();
    }
  }, 1000);
}

// ========== FUNÇÃO: ATUALIZAR TIMER VISUAL ==========
function atualizarTimer() {
  // Atualizar número
  timerNumberEl.textContent = tempoRestante;

  // Calcular progresso (de 0 a CIRCUNFERENCIA)
  const progresso = (tempoRestante / TEMPO_TOTAL) * CIRCUNFERENCIA;
  timerProgressEl.style.strokeDashoffset = CIRCUNFERENCIA - progresso;

  // Mudar cor baseado no tempo
  if (tempoRestante <= 5) {
    // PERIGO: Vermelho
    timerProgressEl.classList.add("danger");
    timerProgressEl.classList.remove("warning");
  } else if (tempoRestante <= 10) {
    // AVISO: Laranja
    timerProgressEl.classList.add("warning");
    timerProgressEl.classList.remove("danger");
  }
}

// ========== FUNÇÃO: SELECIONAR ALTERNATIVA ==========
function selecionarAlternativa(botao, resposta) {
  if (!jogoAtivo) return;

  // Parar o timer
  clearInterval(timerInterval);
  jogoAtivo = false;

  // Desabilitar todas as alternativas
  const todasAlternativas = document.querySelectorAll(".alternative");
  todasAlternativas.forEach(alt => alt.classList.add("disabled"));

  // Verificar se está correto
  if (resposta === RESPOSTA_CORRETA) {
    // ACERTOU! ✓
    botao.classList.add("correct");
    mostrarVitoria();
  } else {
    // ERROU! ✗
    botao.classList.add("wrong");
    
    // Mostrar a resposta correta
    setTimeout(() => {
      todasAlternativas.forEach(alt => {
        if (alt.querySelector(".alt-text").textContent.includes("André")) {
          alt.classList.remove("disabled");
          alt.classList.add("correct");
        }
      });
      mostrarDerrota();
    }, 1000);
  }
}

// ========== FUNÇÃO: TEMPO ESGOTADO ==========
function tempoEsgotado() {
  jogoAtivo = false;

  // Piscar o timer
  timerNumberEl.style.color = "#FF6B6B";
  timerNumberEl.textContent = "0";

  // Desabilitar todas as alternativas
  const todasAlternativas = document.querySelectorAll(".alternative");
  todasAlternativas.forEach(alt => alt.classList.add("disabled"));

  // Mostrar a resposta correta
  setTimeout(() => {
    todasAlternativas.forEach(alt => {
      if (alt.querySelector(".alt-text").textContent.includes("André")) {
        alt.classList.remove("disabled");
        alt.classList.add("correct");
      }
    });
    
    mensagemEl.textContent = "⏰ Tempo esgotado! A resposta correta era Santo André.";
    mensagemEl.className = "message lose";
    restartBtn.classList.remove("hidden");
  }, 500);
}

// ========== FUNÇÃO: MOSTRAR VITÓRIA ==========
function mostrarVitoria() {
  const tempoGasto = TEMPO_TOTAL - tempoRestante;
  
  mensagemEl.textContent = `🏆 CORRETO! Você respondeu em ${tempoGasto} segundos!`;
  mensagemEl.className = "message win";

  // Salvar peça conquistada
  localStorage.setItem('pecasConquistadas', '3');
  localStorage.setItem('desafioAtual', '3');

  // Avançar para próximo desafio após 3 segundos
  setTimeout(() => {
    const avancar = confirm('🎉 Peça #3 conquistada!\n\n🧩 Ir para o próximo desafio?');
    if (avancar) {
      window.location.href = '../caca-palavras/index.html';
    }
  }, 2000);
}

// ========== FUNÇÃO: MOSTRAR DERROTA ==========
function mostrarDerrota() {
  mensagemEl.textContent = "❌ Resposta incorreta! A resposta correta era Santo André.";
  mensagemEl.className = "message lose";
  restartBtn.classList.remove("hidden");
}

// ========== FUNÇÃO: REINICIAR JOGO ==========
function reiniciarJogo() {
  // Resetar variáveis
  tempoRestante = TEMPO_TOTAL;
  jogoAtivo = true;

  // Resetar timer visual
  timerNumberEl.textContent = TEMPO_TOTAL;
  timerNumberEl.style.color = "white";
  timerProgressEl.style.strokeDashoffset = 0;
  timerProgressEl.classList.remove("warning", "danger");

  // Limpar mensagem
  mensagemEl.textContent = "";
  mensagemEl.className = "message";

  // Esconder botão reiniciar
  restartBtn.classList.add("hidden");

  // Resetar alternativas
  const todasAlternativas = document.querySelectorAll(".alternative");
  todasAlternativas.forEach(alt => {
    alt.classList.remove("disabled", "correct", "wrong");
  });

  // Reiniciar timer
  iniciarTimer();
}

// ========== INICIALIZAR JOGO ==========
window.addEventListener("DOMContentLoaded", () => {
  // Configurar stroke-dasharray inicial
  timerProgressEl.style.strokeDasharray = CIRCUNFERENCIA;
  timerProgressEl.style.strokeDashoffset = 0;

  // Iniciar timer após 1 segundo (dar tempo para ler)
  setTimeout(() => {
    iniciarTimer();
  }, 1000);

  // Animação de entrada das alternativas
  const alternativas = document.querySelectorAll(".alternative");
  alternativas.forEach((alt, index) => {
    alt.style.opacity = "0";
    alt.style.transform = "translateX(-20px)";

    setTimeout(() => {
      alt.style.transition = "all 0.5s ease";
      alt.style.opacity = "1";
      alt.style.transform = "translateX(0)";
    }, 100 * index);
  });
});