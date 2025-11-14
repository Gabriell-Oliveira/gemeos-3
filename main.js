function iniciarAventura() {
      // Animação de transição
      document.querySelector('.start-button').textContent = 'Preparando desafios...';
      document.querySelector('.start-button').style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
      
      // setTimeout(() => {
      //   alert('🎮 Primeiro Desafio: Quiz Bíblico!\n\nVocê terá 10 perguntas e 3 vidas.\nBoa sorte! 💚💚💚');
      //   // Aqui você redirecionará para o primeiro jogo
      //   // window.location.href = 'quiz/index.html';
      // }, 1000);
    }

    // Animação dos ícones ao carregar
    window.addEventListener('load', () => {
      const icons = document.querySelectorAll('.game-icon');
      icons.forEach((icon, index) => {
        icon.style.opacity = '0';
        icon.style.transform = 'translateY(20px)';
        setTimeout(() => {
          icon.style.transition = 'all 0.5s ease';
          icon.style.opacity = '1';
          icon.style.transform = 'translateY(0)';
        }, 100 * index);
      });
    });