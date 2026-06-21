const layoutIncludes = document.querySelectorAll('[data-include]');

function initializeHeader(element) {
  if (!element.classList.contains('site-header')) return;

  const menuButton = element.querySelector('.menu-icon');
  if (!menuButton) return;

  const setMenuState = (isOpen) => {
    element.classList.toggle('is-menu-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  };

  menuButton.addEventListener('click', () => {
    setMenuState(!element.classList.contains('is-menu-open'));
  });

  element.querySelectorAll('.main-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      setMenuState(false);
    });
  });

  element.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !element.classList.contains('is-menu-open')) return;
    setMenuState(false);
    menuButton.focus();
  });
}

async function loadLayoutPart(element) {
  const source = element.dataset.include;

  try {
    const response = await fetch(source);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

    element.innerHTML = await response.text();
    element.removeAttribute('aria-busy');
    initializeHeader(element);
    element.dispatchEvent(new CustomEvent('layout:loaded', { bubbles: true }));
  } catch (error) {
    element.removeAttribute('aria-busy');
    element.dataset.includeError = '';
    console.error(`공통 레이아웃을 불러오지 못했습니다: ${source}`, error);
  }
}

layoutIncludes.forEach((element) => {
  element.setAttribute('aria-busy', 'true');
  loadLayoutPart(element);
});
