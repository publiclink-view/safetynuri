const scenarioTabs = document.querySelector('.scenario-tabs');

if (scenarioTabs) {
  const tabLinks = [...scenarioTabs.querySelectorAll('a[href^="#stage-"]')];
  const stages = tabLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  let ticking = false;

  const updateActiveTab = () => {
    const activationLine = scenarioTabs.getBoundingClientRect().height + 1;
    const activeStage = stages.find((stage) => {
      const rect = stage.getBoundingClientRect();
      return rect.top <= activationLine && rect.bottom > activationLine;
    });

    tabLinks.forEach((link) => {
      const isActive = activeStage && link.getAttribute('href') === `#${activeStage.id}`;
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });

    ticking = false;
  };

  const requestActiveTabUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateActiveTab);
  };

  window.addEventListener('scroll', requestActiveTabUpdate, { passive: true });
  window.addEventListener('resize', requestActiveTabUpdate);
  updateActiveTab();
}
