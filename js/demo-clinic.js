/**
 * demo-clinic.js
 * Lógica interativa para a demonstração da Clínica Nolei (Avaliações do Google)
 */

(function () {
  let confettiCanvas = null;
  let confettiCtx = null;
  let particles = [];
  let animationFrameId = null;
  let isDemoActive = false;
  let currentRating = 0;

  // Variáveis para elementos do DOM
  let clinicContainer = null;
  let stars = [];
  let reviewCta = null;
  let feedbackForm = null;
  let deviceScreen = null;

  function initClinicDemo() {
    clinicContainer = document.querySelector('#demo-clinic-content');
    deviceScreen = document.querySelector('.device-screen');
    
    if (!clinicContainer || !deviceScreen) return;

    stars = Array.from(clinicContainer.querySelectorAll('.star-rating .star'));
    
    // Inicializa ou cria CTA de review
    reviewCta = clinicContainer.querySelector('.review-cta');
    if (!reviewCta) {
      reviewCta = document.createElement('div');
      reviewCta.className = 'review-cta';
      reviewCta.style.display = 'none';
      clinicContainer.appendChild(reviewCta);
    }

    // Inicializa ou cria formulário de feedback
    feedbackForm = clinicContainer.querySelector('.feedback-form');
    if (!feedbackForm) {
      feedbackForm = document.createElement('div');
      feedbackForm.className = 'feedback-form';
      feedbackForm.style.display = 'none';
      
      const formText = document.createElement('p');
      formText.textContent = 'Sentimos muito! Conte-nos como podemos melhorar:';
      
      const textarea = document.createElement('textarea');
      textarea.placeholder = 'Deixe seu feedback aqui...';
      textarea.rows = 3;
      
      const submitBtn = document.createElement('button');
      submitBtn.textContent = 'Enviar Feedback';
      submitBtn.className = 'btn-submit-feedback';
      
      const explanationText = document.createElement('p');
      explanationText.className = 'explanation-text';
      explanationText.textContent = 'Avaliações negativas são capturadas internamente, protegendo seu ranking no Google.';
      
      feedbackForm.appendChild(formText);
      feedbackForm.appendChild(textarea);
      feedbackForm.appendChild(submitBtn);
      feedbackForm.appendChild(explanationText);
      
      clinicContainer.appendChild(feedbackForm);
    }

    // Interatividade das estrelas
    stars.forEach((star, index) => {
      star.addEventListener('mouseenter', () => handleStarHover(index));
      star.addEventListener('mouseleave', () => handleStarLeave());
      star.addEventListener('click', () => handleStarClick(index));
      
      // Suporte para touch
      star.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleStarClick(index);
      }, { passive: false });
    });
  }

  function handleStarHover(index) {
    stars.forEach((star, i) => {
      if (i <= index) {
        star.classList.add('hover');
      } else {
        star.classList.remove('hover');
      }
    });
  }

  function handleStarLeave() {
    stars.forEach((star) => {
      star.classList.remove('hover');
    });
  }

  function handleStarClick(index) {
    currentRating = index + 1;
    
    // Remove active de todas e adiciona até a clicada
    stars.forEach((star, i) => {
      star.classList.remove('active');
      star.classList.remove('hover');
      if (i <= index) {
        star.classList.add('active');
      }
    });

    handleRatingResult(currentRating);
  }

  function handleRatingResult(rating) {
    if (rating >= 4) {
      // Esconder form se estiver visível
      feedbackForm.style.display = 'none';
      
      // Mostrar CTA do Google
      reviewCta.style.display = 'block';
      reviewCta.innerHTML = `
        <div class="redirect-card">
          <h4>Abrindo Avaliação no Google Maps... ⭐</h4>
          <p class="explanation-text">O paciente satisfeito é direcionado diretamente para deixar uma avaliação 5 estrelas no Google.</p>
          <div class="countdown">Redirecionando em <span id="redirect-timer">3</span>...</div>
        </div>
      `;
      
      fireConfetti();
      
      // Fake countdown
      let count = 3;
      const timerSpan = reviewCta.querySelector('#redirect-timer');
      const interval = setInterval(() => {
        count--;
        if (timerSpan) timerSpan.textContent = count;
        if (count <= 0) {
          clearInterval(interval);
          if (timerSpan) timerSpan.textContent = '0 (Simulação concluída)';
        }
      }, 1000);
      
    } else {
      // Notas <= 3
      reviewCta.style.display = 'none';
      feedbackForm.style.display = 'flex';
      feedbackForm.style.flexDirection = 'column';
      feedbackForm.style.gap = '10px';
    }
  }

  function fireConfetti() {
    if (!deviceScreen) return;
    
    // Limpar confetti anterior se houver
    if (confettiCanvas) {
      removeConfetti();
    }

    confettiCanvas = document.createElement('canvas');
    confettiCanvas.style.position = 'absolute';
    confettiCanvas.style.top = '0';
    confettiCanvas.style.left = '0';
    confettiCanvas.style.width = '100%';
    confettiCanvas.style.height = '100%';
    confettiCanvas.style.pointerEvents = 'none';
    confettiCanvas.style.zIndex = '100';
    
    deviceScreen.appendChild(confettiCanvas);
    
    confettiCtx = confettiCanvas.getContext('2d');
    
    const rect = deviceScreen.getBoundingClientRect();
    confettiCanvas.width = rect.width;
    confettiCanvas.height = rect.height;
    
    const colors = ['#FFD700', '#00FF7F', '#00FFFF', '#EE82EE', '#FFFFFF'];
    particles = [];
    const numParticles = Math.floor(Math.random() * 41) + 80; // 80-120
    
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height * 0.2 - confettiCanvas.height * 0.2,
        r: Math.random() * 4 + 2, // raio (2-6px)
        dx: Math.random() * 4 - 2,
        dy: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleInc: (Math.random() * 0.07) + 0.05,
        tiltAngle: 0
      });
    }

    const startTime = performance.now();
    
    function renderConfetti(time) {
      if (!confettiCtx) return;
      
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      
      let allDone = true;
      
      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleInc;
        p.y += p.dy;
        p.x += Math.sin(p.tiltAngle) * 2;
        
        if (p.y < confettiCanvas.height) {
          allDone = false;
          
          confettiCtx.beginPath();
          confettiCtx.lineWidth = p.r;
          confettiCtx.strokeStyle = p.color;
          confettiCtx.moveTo(p.x + p.tilt + p.r, p.y);
          confettiCtx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
          confettiCtx.stroke();
        }
      });
      
      // Stop after 2.5 seconds or if all fallen
      if (time - startTime < 2500 && !allDone) {
        animationFrameId = requestAnimationFrame(renderConfetti);
      } else {
        removeConfetti();
      }
    }
    
    animationFrameId = requestAnimationFrame(renderConfetti);
  }

  function removeConfetti() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (confettiCanvas && confettiCanvas.parentNode) {
      confettiCanvas.parentNode.removeChild(confettiCanvas);
    }
    confettiCanvas = null;
    confettiCtx = null;
    particles = [];
  }

  function activateClinicDemo() {
    isDemoActive = true;
    if (!clinicContainer) {
      initClinicDemo();
    }
    
    clinicContainer = document.querySelector('#demo-clinic-content');
    if (clinicContainer) {
      clinicContainer.style.display = 'block';
      // Animação de entrada
      clinicContainer.style.opacity = '0';
      clinicContainer.style.transform = 'translateY(20px)';
      clinicContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      
      // Trigger reflow
      void clinicContainer.offsetWidth;
      
      clinicContainer.style.opacity = '1';
      clinicContainer.style.transform = 'translateY(0)';
    }
  }

  function resetClinicDemo() {
    isDemoActive = false;
    currentRating = 0;
    
    if (clinicContainer) {
      clinicContainer.style.display = 'none';
      clinicContainer.style.opacity = '0';
      clinicContainer.style.transform = 'translateY(20px)';
    }
    
    stars.forEach(star => {
      star.classList.remove('active', 'hover');
    });
    
    if (reviewCta) reviewCta.style.display = 'none';
    if (feedbackForm) feedbackForm.style.display = 'none';
    
    removeConfetti();
  }

  // Expor globalmente
  window.activateClinicDemo = activateClinicDemo;
  window.initClinicDemo = initClinicDemo;
  window.resetClinicDemo = resetClinicDemo;

})();
