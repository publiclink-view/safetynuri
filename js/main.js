const carousels = new Map();

const heroSlides = [...document.querySelectorAll('[data-hero-slide]')];
let activeHero = 0;

document.querySelectorAll('[data-hero-direction]').forEach((button) => {
  button.addEventListener('click', () => {
    heroSlides[activeHero].classList.remove('is-active');
    heroSlides[activeHero].setAttribute('aria-hidden', 'true');
    activeHero = (activeHero + Number(button.dataset.heroDirection) + heroSlides.length) % heroSlides.length;
    heroSlides[activeHero].classList.add('is-active');
    heroSlides[activeHero].setAttribute('aria-hidden', 'false');
  });
});

document.querySelectorAll('[data-track]').forEach((track) => {
  const name = track.dataset.track;
  const buttons = [...document.querySelectorAll(`[data-scroll="${name}"]`)];

  const updateButtons = () => {
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    buttons.forEach((button) => {
      const direction = Number(button.dataset.direction);
      button.disabled = direction < 0
        ? track.scrollLeft <= 1
        : track.scrollLeft >= maxScroll - 1;
    });
  };

  track.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);
  carousels.set(name, { track, updateButtons });
  updateButtons();
});

document.querySelectorAll('[data-scroll]').forEach((button) => {
  button.addEventListener('click', () => {
    const carousel = carousels.get(button.dataset.scroll);
    if (!carousel) return;

    const { track } = carousel;
    const items = [...track.children];
    const step = items.length > 1
      ? items[1].offsetLeft - items[0].offsetLeft
      : track.clientWidth * .8;

    track.scrollBy({
      left: step * Number(button.dataset.direction),
      behavior: 'smooth'
    });
  });
});
