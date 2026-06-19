/* ============================================================
   레이아웃 로더 (inc/header.html, inc/footer.html 주입)
   ============================================================ */
async function loadLayout() {
    try {
        const header = document.querySelector('.site-header');
        const footer = document.querySelector('.site-footer');

        if (header) {
            const res = await fetch('inc/header.html');
            header.innerHTML = await res.text();
        }
        if (footer) {
            const res = await fetch('inc/footer.html');
            footer.innerHTML = await res.text();
        }

        markActiveMenu();
        initNav();
    } catch (err) {
        console.error('레이아웃을 불러오는데 실패했습니다:', err);
    }
}

/* 현재 페이지 메뉴 활성화 (body[data-page] 기준) */
function markActiveMenu() {
    const page = document.body.dataset.page;
    if (!page) return;
    document.querySelectorAll('[data-menu]').forEach((el) => {
        if (el.dataset.menu === page) el.classList.add('active');
    });
}

/* ============================================================
   내비게이션 (메가메뉴 / 스크롤 / 모바일 드로어)
   ============================================================ */
function initNav() {
    const siteHeader = document.querySelector('.site-header');
    const hamburger = document.querySelector('.menu-toggle');
    const drawer = document.getElementById('drawer');
    const drawerClose = document.querySelector('.drawer-close');

    if (!document.querySelector('.drawer-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'drawer-overlay';
        document.body.appendChild(overlay);
        overlay.addEventListener('click', () => toggleDrawer(false, drawer, overlay, hamburger));
    }
    const overlay = document.querySelector('.drawer-overlay');

    /* 스크롤 시 헤더 상태 */
    const onScroll = () => {
        if (window.scrollY > 40) siteHeader.classList.add('scrolled');
        else siteHeader.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll);
    onScroll();

    /* 모바일 드로어 */
    if (hamburger) {
        hamburger.addEventListener('click', () => toggleDrawer(true, drawer, overlay, hamburger));
    }
    if (drawerClose) {
        drawerClose.addEventListener('click', () => toggleDrawer(false, drawer, overlay, hamburger));
    }
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) toggleDrawer(false, drawer, overlay, hamburger);
    });
}

function toggleDrawer(isOpen, drawer, overlay, hamburger) {
    if (!drawer) return;
    if (isOpen) {
        drawer.classList.add('open');
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        hamburger.setAttribute('aria-expanded', 'true');
    } else {
        drawer.classList.remove('open');
        overlay.style.display = 'none';
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
    }
}

/* ============================================================
   캐러셀 (영상 / 카드뉴스) — 좌우 버튼 스크롤
   ============================================================ */
function initCarousels() {
    const groups = document.querySelectorAll('.carousel, .video-carousel, .cardnews-carousel');
    groups.forEach((carousel) => {
        const track = carousel.querySelector('.carousel-track, .video-track, .cardnews-track');
        const prev = carousel.querySelector('.arrow-btn.prev');
        const next = carousel.querySelector('.arrow-btn.next');
        if (!track) return;

        const step = () => {
            const first = track.firstElementChild;
            const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 24;
            return first ? first.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
        };

        if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
        if (next) next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    });
}

/* 실행 */
loadLayout();
document.addEventListener('DOMContentLoaded', initCarousels);
