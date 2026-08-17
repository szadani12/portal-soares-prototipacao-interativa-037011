/**
 * CENTRO EDUCACIONAL SOARES — PAINEL DO ALUNO
 * Lógica de Interatividade, Navegação por Abas e Filtro Dinâmico
 */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initTabNavigation();
  initScheduleSearch();
  initNotifications();
});

/* ==========================================================================
   1. CONTROLE DO SIDEBAR (COLAPSO & MOBILE)
   ========================================================================== */
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');

  // Alternar sidebar recolhido no Desktop
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      
      // Salvar preferência no localStorage
      const isCollapsed = sidebar.classList.contains('collapsed');
      localStorage.setItem('soares_sidebar_collapsed', isCollapsed);
    });

    // Restaurar estado salvo
    const savedState = localStorage.getItem('soares_sidebar_collapsed');
    if (savedState === 'true' && window.innerWidth > 768) {
      sidebar.classList.add('collapsed');
    }
  }

  // Alternar sidebar em dispositivos móveis
  if (mobileMenuToggle && sidebar) {
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('mobile-open');
    });

    // Fechar ao clicar fora no mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        sidebar.classList.remove('mobile-open');
      }
    });
  }
}

/* ==========================================================================
   2. NAVEGAÇÃO ENTRE ABAS
   ========================================================================== */
function initTabNavigation() {
  const navButtons = document.querySelectorAll('.sidebar__nav .nav-link:not(#nav-sair)');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const pageTitle = document.getElementById('pageTitle');
  const sidebar = document.getElementById('sidebar');

  const titlesMap = {
    'grade-horaria': 'Grade Horária',
    'avaliacoes': 'Avaliações & Notas',
    'declaracoes': 'Declarações & Documentos',
    'cardapio': 'Cardápio Semanal',
    'perfil': 'Meu Perfil',
    'configuracoes': 'Configurações da Conta'
  };

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      if (!targetId) return;

      // Atualizar classe ativa nos botões
      navButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Atualizar painéis visíveis
      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `pane-${targetId}`) {
          pane.classList.add('active');
        }
      });

      // Atualizar título da página
      if (pageTitle && titlesMap[targetId]) {
        pageTitle.textContent = titlesMap[targetId];
      }

      // Fechar menu mobile se estiver aberto
      if (window.innerWidth <= 768 && sidebar) {
        sidebar.classList.remove('mobile-open');
      }

      // Feedback Toast sutil para telas que não sejam a Grade Horária
      if (targetId !== 'grade-horaria') {
        showToast(`Exibindo aba: ${titlesMap[targetId]}`);
      }
    });
  });
}

/* ==========================================================================
   3. FILTRO EM TEMPO REAL NA TABELA DE HORÁRIOS
   ========================================================================== */
function initScheduleSearch() {
  const filterInput = document.getElementById('filterInput');
  const classCells = document.querySelectorAll('.schedule-table .cell-class');

  if (!filterInput) return;

  filterInput.addEventListener('input', (e) => {
    const term = e.target.value.trim().toLowerCase();

    if (!term) {
      classCells.forEach(cell => {
        cell.classList.remove('is-highlighted', 'is-dimmed');
      });
      return;
    }

    classCells.forEach(cell => {
      const text = cell.textContent.toLowerCase();
      if (text.includes(term)) {
        cell.classList.add('is-highlighted');
        cell.classList.remove('is-dimmed');
      } else {
        cell.classList.remove('is-highlighted');
        cell.classList.add('is-dimmed');
      }
    });
  });
}

/* ==========================================================================
   4. NOTIFICAÇÕES & TOAST
   ========================================================================== */
function initNotifications() {
  const btnNotifications = document.getElementById('btnNotifications');
  if (btnNotifications) {
    btnNotifications.addEventListener('click', () => {
      showToast('Você tem 2 novas notificações: P1 de Matemática em 24/Ago e Cardápio de amanhã atualizado.');
    });
  }
}

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

function handleLogout() {
  if (confirm('Deseja realmente encerrar a sessão no Painel do Aluno?')) {
    showToast('Sessão finalizada. Redirecionando para a tela de login...');
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  }
}
