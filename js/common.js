const layoutIncludes = document.querySelectorAll('[data-include]');

async function loadLayoutPart(element) {
  const source = element.dataset.include;

  try {
    const response = await fetch(source);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

    element.innerHTML = await response.text();
    element.removeAttribute('aria-busy');
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
