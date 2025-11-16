// ========== ELEMENTOS DO DOM ==========
const video = document.getElementById('intro-video');
const progressFill = document.getElementById('video-progress');
const progressText = document.getElementById('progress-text');
const startButton = document.getElementById('start-button');
const videoContainer = document.querySelector('.video-container');

// ========== VERIFICAR SE JÁ VIU A INTRO ==========
function verificarIntroVista() {
  const introVista = localStorage.getItem('introVista');
  
  // Se já viu, mostrar opção de pular direto
  if (introVista === 'true') {
    const skipButton = document.querySelector('.skip-button');
    skipButton.textContent = '⏩ Já vi, ir direto';
    skipButton.style.background = 'rgba(255, 215, 0, 0.2)';
    skipButton.style.borderColor = 'rgba(255, 215, 0, 0.5)';
  }
}

// ========== EVENTOS DO VÍDEO ==========

// Quando o vídeo está carregando
video.addEventListener('loadstart', () => {
  videoContainer.classList.add('video-loading');
  progressText.textContent = '⏳ Carregando vídeo...';
});

// Quando o vídeo pode começar a tocar
video.addEventListener('loadeddata', () => {
  videoContainer.classList.remove('video-loading');
  progressText.textContent = '▶️ Pronto para assistir!';
});

// Atualizar barra de progresso durante reprodução
video.addEventListener('timeupdate', () => {
  if (video.duration) {
    const progress = (video.currentTime / video.duration) * 100;
    progressFill.style.width = `${progress}%`;
    
    const minutosRestantes = Math.ceil((video.duration - video.currentTime) / 60);
    const segundosRestantes = Math.ceil(video.duration - video.currentTime);
    
    if (segundosRestantes > 60) {
      progressText.textContent = `⏱️ ${minutosRestantes} minuto(s) restante(s)`;
    } else if (segundosRestantes > 0) {
      progressText.textContent = `⏱️ ${segundosRestantes} segundo(s) restante(s)`;
    } else {
      progressText.textContent = '✅ Vídeo concluído!';
    }
  }
});

// Quando o vídeo termina
video.addEventListener('ended', () => {
  mostrarBotaoIniciar();
  progressText.textContent = '🎉 Vídeo completo! Pronto para começar?';
  progressFill.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
  
  // Marcar que já viu a intro
  localStorage.setItem('introVista', 'true');
});

// Tratamento de erros
video.addEventListener('error', (e) => {
  console.error('Erro ao carregar vídeo:', e);
  videoContainer.classList.remove('video-loading');
  progressText.textContent = '⚠️ Erro ao carregar vídeo. Você pode pular a introdução.';
  progressText.style.color = '#FF6B6B';
  
  // Mostrar botão de iniciar mesmo com erro
  setTimeout(() => {
    mostrarBotaoIniciar();
  }, 2000);
});

// ========== FUNÇÕES ==========

function mostrarBotaoIniciar() {
  startButton.classList.remove('hidden');
  
  // Animação de entrada
  setTimeout(() => {
    startButton.style.animation = 'fadeIn 0.5s ease-out, pulseGlow 2s ease-in-out infinite';
  }, 100);
}

function pularVideo() {
  // Pausar vídeo
  video.pause();
  
  // Animar transição
  const container = document.querySelector('.intro-container');
  container.style.opacity = '0';
  container.style.transform = 'scale(0.95)';
  
  setTimeout(() => {
    // Marcar que pulou (mas não viu completo)
    localStorage.setItem('introVista', 'pulou');
    window.location.href = 'index.html';
  }, 300);
}

function iniciarAventura() {
  const startBtn = document.getElementById('start-button');
  startBtn.textContent = '🚀 Preparando aventura...';
  startBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
  
  // Animar transição
  const container = document.querySelector('.intro-container');
  container.style.opacity = '0';
  container.style.transform = 'scale(0.95)';
  
  setTimeout(() => {
    // Marcar que viu a intro completa
    localStorage.setItem('introVista', 'true');
    window.location.href = 'index.html';
  }, 800);
}

// ========== AUTO-PLAY (OPCIONAL) ==========
// Tentar reproduzir automaticamente (nem sempre funciona por políticas do navegador)
window.addEventListener('load', () => {
  verificarIntroVista();
  
  // Tentar autoplay (pode falhar devido a políticas do navegador)
  const playPromise = video.play();
  
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        console.log('Vídeo iniciado automaticamente');
      })
      .catch(() => {
        console.log('Autoplay bloqueado. Usuário deve clicar em play.');
        progressText.textContent = '▶️ Clique em PLAY para assistir';
      });
  }
});

// ========== ATALHOS DE TECLADO ==========
document.addEventListener('keydown', (e) => {
  // ESC ou S para pular
  if (e.key === 'Escape' || e.key.toLowerCase() === 's') {
    pularVideo();
  }
  
  // Enter para iniciar (se vídeo terminou)
  if (e.key === 'Enter' && !startButton.classList.contains('hidden')) {
    iniciarAventura();
  }
  
  // Espaço para pausar/retomar
  if (e.key === ' ' && e.target === document.body) {
    e.preventDefault();
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }
});

// ========== PREVENIR SAÍDA ACIDENTAL ==========
// Salvar timestamp caso usuário saia e volte
video.addEventListener('pause', () => {
  if (video.currentTime > 0 && video.currentTime < video.duration) {
    localStorage.setItem('videoTimestamp', video.currentTime.toString());
  }
});

// Restaurar timestamp se houver
window.addEventListener('load', () => {
  const savedTime = localStorage.getItem('videoTimestamp');
  if (savedTime && parseFloat(savedTime) > 5) {
    const resumir = confirm('Você deseja continuar de onde parou?');
    if (resumir) {
      video.currentTime = parseFloat(savedTime);
    } else {
      localStorage.removeItem('videoTimestamp');
    }
  }
});