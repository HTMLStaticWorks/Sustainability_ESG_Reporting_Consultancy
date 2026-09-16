/**
 * VERDANT ESG - 3D EFFECTS & INTERACTIVE SIMULATION ENGINE
 * 1. 3D Tilt Cards with cursor perspective, dynamic glare & watermark reveal
 * 2. Interactive Canvas Carbon Lattice & Molecular Particle Simulation
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. 3D TILT CARDS ENGINE
     ========================================================================== */
  function init3DTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');
    if (!cards.length) return;

    cards.forEach(card => {
      // Ensure glare element exists
      if (!card.querySelector('.card-glare')) {
        const glare = document.createElement('div');
        glare.className = 'card-glare';
        card.appendChild(glare);
      }

      // Ensure watermark element exists
      if (!card.querySelector('.card-watermark')) {
        const watermark = document.createElement('div');
        watermark.className = 'card-watermark';
        card.appendChild(watermark);
      }

      function handleMouseMove(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within card
        const y = e.clientY - rect.top;  // y position within card

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        // Maximum rotation: 12 degrees
        const rotateX = (-deltaY * 10).toFixed(2);
        const rotateY = (deltaX * 10).toFixed(2);

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }

      function handleMouseLeave() {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease';
      }

      function handleMouseEnter() {
        card.style.transition = 'none';
      }

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
      card.addEventListener('mouseenter', handleMouseEnter);

      // Touch screen support
      card.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          const rect = card.getBoundingClientRect();
          if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
              touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            const deltaX = (x - rect.width / 2) / (rect.width / 2);
            const deltaY = (y - rect.height / 2) / (rect.height / 2);
            card.style.transform = `perspective(1000px) rotateX(${(-deltaY * 8).toFixed(2)}deg) rotateY(${(deltaX * 8).toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
          }
        }
      }, { passive: true });

      card.addEventListener('touchend', handleMouseLeave);
    });
  }

  /* ==========================================================================
     2. CARBON LATTICE & MOLECULAR CANVAS SIMULATION
     Lightweight, high-performance HTML5 Canvas physics simulation
     ========================================================================== */
  function initCarbonLatticeCanvas() {
    const canvas = document.getElementById('carbonCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, radius: 140 };

    function resize() {
      const container = canvas.parentElement;
      width = canvas.width = container.offsetWidth;
      height = canvas.height = container.offsetHeight;
      initParticles();
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 3 + 1.5;
        this.density = (Math.random() * 20) + 5;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        // Molecule type: carbon (charcoal/green), oxygen (emerald glow), amber catalyst
        const rand = Math.random();
        if (rand > 0.85) {
          this.color = '#F59E0B'; // Amber action node
          this.glow = true;
        } else if (rand > 0.4) {
          this.color = '#10B981'; // Emerald bio carbon
          this.glow = false;
        } else {
          this.color = '#0A382C'; // Deep forest lattice
          this.glow = false;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();

        if (this.glow) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2, false);
          ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
          ctx.fill();
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off canvas boundaries
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Interactive mouse physics
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = mouse.radius;
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * this.density;
            const directionY = forceDirectionY * force * this.density;

            this.x -= directionX;
            this.y -= directionY;
          }
        }
      }
    }

    function initParticles() {
      particles = [];
      // Calculate count according to area (capped for optimal FPS)
      const numberOfParticles = Math.min(Math.floor((width * height) / 9000), 75);
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    }

    function connect() {
      const maxDistance = 110;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = 1 - (distance / maxDistance);
            ctx.strokeStyle = `rgba(16, 185, 129, ${opacity * 0.25})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    let animationFrameId;
    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connect();

      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animationFrameId);
      resize();
      animate();
    });

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      } else {
        mouse.x = null;
        mouse.y = null;
      }
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    resize();
    animate();
  }

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init3DTiltCards();
      initCarbonLatticeCanvas();
    });
  } else {
    init3DTiltCards();
    initCarbonLatticeCanvas();
  }

  // Export for external hooks if needed
  window.Verdant3D = {
    initTilt: init3DTiltCards,
    initCanvas: initCarbonLatticeCanvas
  };
})();
