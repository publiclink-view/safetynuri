document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector("[data-video-carousel]");
    const track = document.querySelector("[data-video-track]");
    const pagination = document.querySelector("[data-video-pagination]");

    if (!carousel || !track || !pagination) return;

    const originals = [...track.querySelectorAll(".video-card")];
    const dots = [...pagination.querySelectorAll("[data-video-index]")];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const firstClone = originals[0].cloneNode(true);
    const lastClone = originals[originals.length - 1].cloneNode(true);

    firstClone.dataset.videoClone = "first";
    lastClone.dataset.videoClone = "last";
    track.prepend(lastClone);
    track.append(firstClone);

    const cards = [...track.querySelectorAll(".video-card")];
    let activeIndex = 0;
    let activePosition = 1;
    let timer;
    let isMoving = false;

    const normalize = (index) => (index + originals.length) % originals.length;

    const centerCard = (position, immediate = false) => {
        const card = cards[position];
        const rootSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
        const offset = (carousel.clientWidth - card.offsetWidth) / 2 - card.offsetLeft;

        track.classList.toggle("is-positioning", immediate);
        track.style.transform = `translateX(${offset / rootSize}rem)`;

        if (immediate) {
            window.requestAnimationFrame(() => track.classList.remove("is-positioning"));
        }
    };

    const updateState = () => {
        cards.forEach((card, position) => {
            const isActive = position === activePosition;
            const link = card.querySelector("a");
            card.classList.toggle("is-active", isActive);
            card.setAttribute("aria-hidden", String(!isActive));
            link.tabIndex = isActive ? 0 : -1;
        });

        dots.forEach((dot, index) => {
            const isActive = index === activeIndex;
            dot.classList.toggle("is-active", isActive);
            if (isActive) dot.setAttribute("aria-current", "true");
            else dot.removeAttribute("aria-current");
        });
    };

    const resetLoopPosition = () => {
        if (activePosition === cards.length - 1) activePosition = 1;
        else if (activePosition === 0) activePosition = originals.length;
        else return;

        updateState();
        centerCard(activePosition, true);
    };

    const moveTo = (position, logicalIndex) => {
        if (isMoving) return;

        isMoving = true;
        activePosition = position;
        activeIndex = normalize(logicalIndex);
        updateState();
        centerCard(activePosition, reduceMotion);

        window.setTimeout(() => {
            resetLoopPosition();
            isMoving = false;
        }, reduceMotion ? 0 : 620);
    };

    const moveNext = () => moveTo(activePosition + 1, activeIndex + 1);
    const movePrev = () => moveTo(activePosition - 1, activeIndex - 1);

    const stopAutoPlay = () => window.clearInterval(timer);
    const startAutoPlay = () => {
        stopAutoPlay();
        if (!reduceMotion) timer = window.setInterval(moveNext, 1500);
    };

    cards.forEach((card, position) => {
        card.addEventListener("click", (event) => {
            if (position === activePosition) return;

            event.preventDefault();
            const logicalIndex = Number(card.dataset.videoIndex);
            moveTo(position, logicalIndex);
            startAutoPlay();
        });
    });

    dots.forEach((dot) => {
        dot.addEventListener("click", () => {
            const targetIndex = Number(dot.dataset.videoIndex);

            if (activeIndex === originals.length - 1 && targetIndex === 0) moveNext();
            else if (activeIndex === 0 && targetIndex === originals.length - 1) movePrev();
            else moveTo(targetIndex + 1, targetIndex);

            startAutoPlay();
        });
    });

    carousel.addEventListener("mouseenter", stopAutoPlay);
    carousel.addEventListener("mouseleave", startAutoPlay);
    carousel.addEventListener("focusin", stopAutoPlay);
    carousel.addEventListener("focusout", startAutoPlay);
    window.addEventListener("resize", () => centerCard(activePosition, true));

    updateState();
    centerCard(activePosition, true);
    startAutoPlay();
});

document.addEventListener("DOMContentLoaded", () => {
    const layout = document.querySelector(".cardnews-layout");
    const prevButton = document.querySelector(".cardnews-arrow-prev");
    const nextButton = document.querySelector(".cardnews-arrow-next");
    const pagination = document.querySelector("[data-cardnews-pagination]");
    const viewport = layout?.closest(".cardnews-viewport");

    if (!layout || !prevButton || !nextButton || !pagination || !viewport) return;

    const originalCards = [...layout.children];
    const totalCards = originalCards.length;
    const section = layout.closest(".cardnews-section");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dots = originalCards.map((card, index) => {
        const dot = document.createElement("button");
        card.dataset.cardnewsIndex = String(index);
        dot.type = "button";
        dot.dataset.cardnewsIndex = String(index);
        dot.setAttribute("aria-label", `${index + 1}번 카드뉴스`);
        pagination.append(dot);
        return dot;
    });
    let activeIndex = 0;
    let isMoving = false;
    let timer;
    let dragStart = 0;
    let dragDistance = 0;
    let isDragging = false;
    let suppressClick = false;

    const normalize = (index) => (index + totalCards) % totalCards;

    const updatePagination = () => {
        dots.forEach((dot, index) => {
            const isActive = index === activeIndex;
            dot.classList.toggle("is-active", isActive);
            if (isActive) dot.setAttribute("aria-current", "true");
            else dot.removeAttribute("aria-current");
        });
    };

    const getStep = () => {
        const firstCard = layout.querySelector(".cardnews-card");
        const rootSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
        const gap = Number.parseFloat(getComputedStyle(layout).columnGap);
        return (firstCard.offsetWidth + gap) / rootSize;
    };

    const moveNext = (count = 1) => {
        if (isMoving) return;
        isMoving = true;
        const step = getStep() * count;
        activeIndex = normalize(activeIndex + count);
        updatePagination();

        layout.style.transition = "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
        layout.style.transform = `translateX(-${step}rem)`;

        window.setTimeout(() => {
            for (let index = 0; index < count; index += 1) {
                layout.append(layout.firstElementChild);
            }
            layout.style.transition = "none";
            layout.style.transform = "translateX(0)";
            isMoving = false;
        }, 480);
    };

    const movePrev = (count = 1) => {
        if (isMoving) return;
        isMoving = true;
        const step = getStep() * count;
        activeIndex = normalize(activeIndex - count);
        updatePagination();

        for (let index = 0; index < count; index += 1) {
            layout.prepend(layout.lastElementChild);
        }
        layout.style.transition = "none";
        layout.style.transform = `translateX(-${step}rem)`;

        window.requestAnimationFrame(() => {
            layout.style.transition = "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
            layout.style.transform = "translateX(0)";
        });

        window.setTimeout(() => {
            layout.style.transition = "none";
            isMoving = false;
        }, 480);
    };

    const stopAutoPlay = () => window.clearInterval(timer);
    const startAutoPlay = () => {
        stopAutoPlay();
        if (!reduceMotion) timer = window.setInterval(() => moveNext(), 1500);
    };

    prevButton.addEventListener("click", () => {
        movePrev();
        startAutoPlay();
    });

    nextButton.addEventListener("click", () => {
        moveNext();
        startAutoPlay();
    });

    dots.forEach((dot) => {
        dot.addEventListener("click", () => {
            const targetIndex = Number(dot.dataset.cardnewsIndex);
            const forward = normalize(targetIndex - activeIndex);
            const backward = normalize(activeIndex - targetIndex);

            if (forward === 0) return;
            if (forward <= backward) moveNext(forward);
            else movePrev(backward);
            startAutoPlay();
        });
    });

    const endDrag = (event) => {
        if (!isDragging) return;

        const rootSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
        const threshold = rootSize * 1.5;
        const shouldMove = Math.abs(dragDistance) >= threshold;

        isDragging = false;
        viewport.classList.remove("is-dragging");
        if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
        layout.style.transition = shouldMove ? "none" : "transform 0.25s ease";
        layout.style.transform = "translateX(0)";

        if (shouldMove) {
            suppressClick = true;
            if (dragDistance < 0) moveNext();
            else movePrev();
            startAutoPlay();
        }
    };

    viewport.addEventListener("pointerdown", (event) => {
        if (isMoving || event.button !== 0) return;

        stopAutoPlay();
        isDragging = true;
        suppressClick = false;
        dragStart = event.clientX;
        dragDistance = 0;
        viewport.classList.add("is-dragging");
        viewport.setPointerCapture(event.pointerId);
        layout.style.transition = "none";
    });

    viewport.addEventListener("dragstart", (event) => event.preventDefault());

    viewport.addEventListener("pointermove", (event) => {
        if (!isDragging) return;

        const rootSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
        dragDistance = event.clientX - dragStart;
        layout.style.transform = `translateX(${dragDistance / rootSize}rem)`;
    });

    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("click", (event) => {
        if (!suppressClick) return;
        event.preventDefault();
        suppressClick = false;
    }, true);

    section.addEventListener("mouseenter", stopAutoPlay);
    section.addEventListener("mouseleave", startAutoPlay);
    section.addEventListener("focusin", stopAutoPlay);
    section.addEventListener("focusout", startAutoPlay);

    updatePagination();
    startAutoPlay();
});
