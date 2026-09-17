/**
 * VERDANT ESG - CLIENT PORTAL & DASHBOARD CONTROLLER
 * Charts, Skeleton loader lifecycle, File Drag-and-Drop, Benchmarks, and Billing
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. SKELETON LOADER LIFECYCLE
     ========================================================================== */
  function initSkeletonLifecycle() {
    const skeletonElements = document.querySelectorAll('.skeleton-wrapper');
    const realContent = document.querySelectorAll('.real-content');

    setTimeout(() => {
      skeletonElements.forEach(el => el.style.display = 'none');
      realContent.forEach(el => {
        el.style.display = 'block';
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.4s ease-in';
        requestAnimationFrame(() => {
          el.style.opacity = '1';
        });
      });

      // Render charts once layout elements are visible
      renderProgressChart('monthly');
      renderBenchmarkChart();
    }, 650);
  }

  /* ==========================================================================
     2. ESG SCORE & EMISSIONS PROGRESS CANVAS CHART
     ========================================================================== */
  function renderProgressChart(timeframe) {
    const canvas = document.getElementById('progressChartCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const isMobile = width <= 480;
    const padding = { top: 30, right: isMobile ? 15 : 30, bottom: 40, left: isMobile ? 35 : 50 };

    ctx.clearRect(0, 0, width, height);

    // Data points (Quarterly or Monthly)
    const labels = timeframe === 'monthly'
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
      : ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025'];

    // Overall ESG Score (Rising)
    const esgScores = timeframe === 'monthly'
      ? [68, 71, 73, 76, 79, 81, 82, 85, 88]
      : [68, 73, 77, 80, 83, 86, 88];

    // Carbon Emissions in tCO2e (Declining)
    const carbonEmissions = timeframe === 'monthly'
      ? [1420, 1380, 1310, 1260, 1180, 1120, 1050, 980, 910]
      : [1420, 1310, 1210, 1140, 1020, 960, 910];

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Draw horizontal grid lines
    ctx.strokeStyle = document.documentElement.getAttribute('data-theme') === 'dark' ? '#1E2D27' : '#E2E8E4';
    ctx.lineWidth = 1;
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'dark' ? '#9BB0A6' : '#64748B';

    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const val = 100 - i * 15;
      ctx.fillText(val.toString(), padding.left - 30, y + 4);
    }

    // Draw X-axis labels
    const stepX = chartW / (labels.length - 1);
    labels.forEach((lbl, idx) => {
      const x = padding.left + idx * stepX;
      ctx.fillText(lbl, x - 12, height - 12);
    });

    // Draw ESG Score Curve (Emerald)
    ctx.beginPath();
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#10B981';

    const points = [];
    esgScores.forEach((score, idx) => {
      const x = padding.left + idx * stepX;
      // Map 60-100 to chartH
      const normalized = (score - 50) / 50;
      const y = padding.top + chartH - normalized * chartH;
      points.push({ x, y });
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill under curve
    ctx.lineTo(padding.left + (labels.length - 1) * stepX, padding.top + chartH);
    ctx.lineTo(padding.left, padding.top + chartH);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, padding.top, 0, height);
    grad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
    grad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Draw dots
    points.forEach((pt, idx) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#10B981';
      ctx.stroke();

      // Highlight latest
      if (idx === points.length - 1) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.stroke();
      }
    });
  }

  /* ==========================================================================
     3. BENCHMARK COMPARISON BAR CHART
     ========================================================================== */
  function renderBenchmarkChart() {
    const canvas = document.getElementById('benchmarkChartCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const isMobile = width <= 480;
    const padding = { top: 25, right: isMobile ? 35 : 25, bottom: 45, left: isMobile ? 110 : 140 };

    ctx.clearRect(0, 0, width, height);

    const categories = [
      'Carbon Decarbonization',
      'Renewable Energy %',
      'Board Gender Diversity',
      'Supply Chain Audits',
      'CSRD Transparency'
    ];

    const clientScores = [88, 75, 92, 85, 94];
    const industryMedian = [62, 54, 68, 59, 70];
    const topLeaders = [95, 90, 94, 91, 98];

    const chartW = width - padding.left - padding.right;
    const rowHeight = (height - padding.top - padding.bottom) / categories.length;

    categories.forEach((cat, idx) => {
      const y = padding.top + idx * rowHeight;

      // Label
      ctx.font = isMobile ? '600 10px "Plus Jakarta Sans", sans-serif' : '600 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'dark' ? '#F1F5F3' : '#12201B';
      ctx.textAlign = 'right';
      ctx.fillText(cat, padding.left - (isMobile ? 5 : 15), y + 18);

      // Background Track
      const barH = 12;
      const trackY = y + 8;
      ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'dark' ? '#1E2D27' : '#E2E8E4';
      ctx.beginPath();
      ctx.roundRect(padding.left, trackY, chartW, barH, 6);
      ctx.fill();

      // Industry Median marker
      const medX = padding.left + (industryMedian[idx] / 100) * chartW;
      ctx.strokeStyle = '#F59E0B'; // Amber
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(medX, trackY - 4);
      ctx.lineTo(medX, trackY + barH + 4);
      ctx.stroke();

      // Client Company Bar (Emerald)
      const clientW = (clientScores[idx] / 100) * chartW;
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.roundRect(padding.left, trackY, clientW, barH, 6);
      ctx.fill();

      // Value label
      ctx.textAlign = 'left';
      ctx.font = '700 11px "Outfit", sans-serif';
      ctx.fillStyle = '#10B981';
      ctx.fillText(`${clientScores[idx]}%`, padding.left + clientW + 8, trackY + 10);
    });
  }

  /* ==========================================================================
     4. DRAG-AND-DROP FILE UPLOAD SIMULATION
     ========================================================================== */
  function initFileUpload() {
    const dropzone = document.getElementById('uploadDropzone');
    const fileInput = document.getElementById('operationalFileInput');
    const uploadList = document.getElementById('uploadedFilesList');
    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      handleFiles(files);
    });

    fileInput.addEventListener('change', (e) => {
      handleFiles(e.target.files);
    });

    function handleFiles(files) {
      if (!files.length) return;
      Array.from(files).forEach(file => {
        simulateFileUpload(file.name, file.size);
      });
    }

    function simulateFileUpload(name, size) {
      const item = document.createElement('div');
      item.className = 'uploaded-file-item';
      item.style.padding = '12px 16px';
      item.style.backgroundColor = document.documentElement.getAttribute('data-theme') === 'dark' ? '#141F1A' : '#F1F5F2';
      item.style.borderRadius = '8px';
      item.style.marginTop = '10px';
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.justifyContent = 'space-between';
      item.style.border = '1px solid var(--color-border)';

      const kbSize = (size / 1024).toFixed(1);
      item.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <div>
            <div style="font-weight: 700; font-size: 0.9rem;">${name}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">${kbSize} KB • Ingesting energy telemetry...</div>
          </div>
        </div>
        <div class="upload-status-badge" style="font-size: 0.8rem; font-weight: 700; color: #D97706;">
          Verifying...
        </div>
      `;

      if (uploadList) {
        uploadList.prepend(item);
        setTimeout(() => {
          const badge = item.querySelector('.upload-status-badge');
          if (badge) {
            badge.style.color = '#059669';
            badge.innerHTML = `✓ Scope 1 &amp; 2 Mapped`;
          }
        }, 1200);
      }
    }
  }

  /* ==========================================================================
     5. DASHBOARD SIDEBAR MOBILE TOGGLE
     ========================================================================== */
  function initDashboardSidebarToggle() {
    const toggleBtn = document.getElementById('dashSidebarToggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (!toggleBtn || !sidebar) return;

    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      sidebar.classList.toggle('mobile-open');
    });

    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('mobile-open')) {
        if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
          sidebar.classList.remove('mobile-open');
        }
      }
    });
  }

  /* ==========================================================================
     6. TIMEFRAME TOGGLE
     ========================================================================== */
  function initTimeframeToggle() {
    const timeframeBtns = document.querySelectorAll('.js-timeframe-btn');
    timeframeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        timeframeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tf = btn.getAttribute('data-timeframe');
        renderProgressChart(tf);
      });
    });
  }

  /* ==========================================================================
     INITIALIZE DASHBOARD
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initSkeletonLifecycle();
    initFileUpload();
    initDashboardSidebarToggle();
    initTimeframeToggle();

    window.addEventListener('resize', () => {
      renderProgressChart('monthly');
      renderBenchmarkChart();
    });
  });

})();
