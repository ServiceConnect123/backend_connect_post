// Script personalizado para mejorar la experiencia de Swagger UI
(function() {
  'use strict';

  // Esperar a que Swagger UI se cargue completamente
  function waitForSwaggerUI() {
    if (typeof window.ui !== 'undefined') {
      initCustomFeatures();
    } else {
      setTimeout(waitForSwaggerUI, 100);
    }
  }

  function initCustomFeatures() {
    // Agregar información adicional al header
    setTimeout(() => {
      addCustomHeader();
      addQuickStats();
      addThemeToggle();
      addCopyButtons();
      enhanceResponses();
    }, 1000);
  }

  function addCustomHeader() {
    const infoSection = document.querySelector('.swagger-ui .info');
    if (infoSection && !document.querySelector('.custom-api-header')) {
      const customHeader = document.createElement('div');
      customHeader.className = 'custom-api-header';
      customHeader.innerHTML = `
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 20px; border-radius: 12px; margin: 20px 0; box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
            <div>
              <h3 style="margin: 0; font-size: 1.5rem; display: flex; align-items: center; gap: 10px;">
                🚀 BackConnectPost API
                <span style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: normal;">v2.0</span>
              </h3>
              <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 1rem;">API moderna para gestión de blog con arquitectura hexagonal</p>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
              <div style="text-align: center; padding: 8px 12px; background: rgba(255,255,255,0.15); border-radius: 8px;">
                <div style="font-size: 1.2rem; font-weight: bold;">⚡</div>
                <div style="font-size: 0.8rem; opacity: 0.9;">Fast</div>
              </div>
              <div style="text-align: center; padding: 8px 12px; background: rgba(255,255,255,0.15); border-radius: 8px;">
                <div style="font-size: 1.2rem; font-weight: bold;">🔒</div>
                <div style="font-size: 0.8rem; opacity: 0.9;">Secure</div>
              </div>
              <div style="text-align: center; padding: 8px 12px; background: rgba(255,255,255,0.15); border-radius: 8px;">
                <div style="font-size: 1.2rem; font-weight: bold;">📱</div>
                <div style="font-size: 0.8rem; opacity: 0.9;">Mobile</div>
              </div>
            </div>
          </div>
        </div>
      `;
      infoSection.appendChild(customHeader);
    }
  }

  function addQuickStats() {
    const operationsContainer = document.querySelector('.swagger-ui .operations-container');
    if (operationsContainer && !document.querySelector('.api-quick-stats')) {
      const stats = {
        auth: document.querySelectorAll('.swagger-ui .opblock-tag[data-tag*="Authentication"]').length || 4,
        locations: document.querySelectorAll('.swagger-ui .opblock-tag[data-tag*="Locations"]').length || 2,
        posts: document.querySelectorAll('.swagger-ui .opblock-tag[data-tag*="Posts"]').length || 5,
      };

      const quickStats = document.createElement('div');
      quickStats.className = 'api-quick-stats';
      quickStats.innerHTML = `
        <div style="background: white; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
          <h3 style="margin: 0 0 15px 0; color: #2d3748; display: flex; align-items: center; gap: 8px;">
            📊 Estadísticas de la API
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
            <div style="text-align: center; padding: 15px; background: linear-gradient(135deg, #fef5e7 0%, #fed7aa 100%); border-radius: 8px;">
              <div style="font-size: 2rem; color: #ea580c;">${stats.auth}</div>
              <div style="color: #9a3412; font-weight: 600;">🔐 Auth Endpoints</div>
            </div>
            <div style="text-align: center; padding: 15px; background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%); border-radius: 8px;">
              <div style="font-size: 2rem; color: #38a169;">${stats.locations}</div>
              <div style="color: #2f855a; font-weight: 600;">📍 Location Endpoints</div>
            </div>
            <div style="text-align: center; padding: 15px; background: linear-gradient(135deg, #eff6ff 0%, #bfdbfe 100%); border-radius: 8px;">
              <div style="font-size: 2rem; color: #3182ce;">${stats.posts}</div>
              <div style="color: #2c5aa0; font-weight: 600;">📚 Post Endpoints</div>
            </div>
            <div style="text-align: center; padding: 15px; background: linear-gradient(135deg, #fdf2f8 0%, #f9a8d4 100%); border-radius: 8px;">
              <div style="font-size: 2rem; color: #db2777;">${stats.auth + stats.locations + stats.posts}</div>
              <div style="color: #be185d; font-weight: 600;">🎯 Total Endpoints</div>
            </div>
          </div>
        </div>
      `;
      operationsContainer.parentNode.insertBefore(quickStats, operationsContainer);
    }
  }

  function addThemeToggle() {
    const topbar = document.querySelector('.swagger-ui .topbar');
    if (topbar && !document.querySelector('.theme-toggle')) {
      const themeToggle = document.createElement('div');
      themeToggle.className = 'theme-toggle';
      themeToggle.innerHTML = `
        <button onclick="toggleTheme()" style="
          background: rgba(255,255,255,0.2); 
          border: none; 
          color: white; 
          padding: 8px 12px; 
          border-radius: 6px; 
          cursor: pointer; 
          font-size: 14px;
          transition: all 0.3s ease;
        " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
          🌙 Tema Oscuro
        </button>
      `;
      topbar.appendChild(themeToggle);
    }
  }

  function addCopyButtons() {
    // Agregar botones de copia a los ejemplos de código
    document.querySelectorAll('.swagger-ui .highlight-code').forEach((codeBlock, index) => {
      if (!codeBlock.querySelector('.copy-button')) {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '📋 Copiar';
        copyButton.style.cssText = `
          position: absolute;
          top: 10px;
          right: 10px;
          background: #4299e1;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          z-index: 1000;
        `;
        
        copyButton.addEventListener('click', () => {
          const text = codeBlock.textContent;
          navigator.clipboard.writeText(text).then(() => {
            copyButton.innerHTML = '✅ Copiado';
            setTimeout(() => {
              copyButton.innerHTML = '📋 Copiar';
            }, 2000);
          });
        });
        
        codeBlock.style.position = 'relative';
        codeBlock.appendChild(copyButton);
      }
    });
  }

  function enhanceResponses() {
    // Mejorar la visualización de respuestas
    document.querySelectorAll('.swagger-ui .response .response-col_status').forEach(statusElement => {
      const status = statusElement.textContent.trim();
      let emoji = '';
      let color = '';
      
      switch(status) {
        case '200':
        case '201':
          emoji = '✅';
          color = '#48bb78';
          break;
        case '400':
          emoji = '❌';
          color = '#f56565';
          break;
        case '401':
          emoji = '🚫';
          color = '#ed8936';
          break;
        case '404':
          emoji = '🔍';
          color = '#a0aec0';
          break;
        case '429':
          emoji = '⏰';
          color = '#d69e2e';
          break;
        case '500':
          emoji = '🔥';
          color = '#e53e3e';
          break;
      }
      
      if (emoji) {
        statusElement.innerHTML = \`\${emoji} \${status}\`;
        statusElement.style.color = color;
        statusElement.style.fontWeight = 'bold';
      }
    });
  }

  // Función global para toggle del tema
  window.toggleTheme = function() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
      body.classList.remove('dark-theme');
      localStorage.setItem('swagger-theme', 'light');
    } else {
      body.classList.add('dark-theme');
      localStorage.setItem('swagger-theme', 'dark');
    }
  };

  // Aplicar tema guardado
  const savedTheme = localStorage.getItem('swagger-theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  // Inicializar cuando el documento esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForSwaggerUI);
  } else {
    waitForSwaggerUI();
  }

  // Re-aplicar mejoras cuando se actualice la interfaz
  const observer = new MutationObserver(() => {
    setTimeout(() => {
      addCopyButtons();
      enhanceResponses();
    }, 500);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();
