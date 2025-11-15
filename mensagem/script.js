// Criar estrelas animadas
    function criarEstrelas() {
      const starsContainer = document.querySelector('.stars');
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 2 + 2) + 's';
        starsContainer.appendChild(star);
      }
    }

    function revelarNomes() {
      const btn = document.querySelector('.reveal-button');
      btn.textContent = 'Carregando revelação...';
      btn.style.background = 'linear-gradient(135deg, #4ECDC4, #44A08D)';
      
      setTimeout(() => {
        window.location.href = '../quebra-cabeca/index.html';
      }, 1000);
    }

    // Inicializar
    window.addEventListener('DOMContentLoaded', () => {
      criarEstrelas();
      
      // Animação de entrada
      setTimeout(() => {
        document.querySelector('.bible-box').style.opacity = '1';
        document.querySelector('.bible-box').style.transform = 'translateY(0)';
      }, 300);
    });