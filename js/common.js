const includeElements = document.querySelectorAll("[data-include]");

function initializeHeader(header) {
    const menuButton = header.querySelector(".menu-button");
    const menuLabel = menuButton?.querySelector(".sr-only");

    if (!menuButton) return;

    const setMenuState = (isOpen) => {
        header.classList.toggle("is-menu-open", isOpen);
        menuButton.setAttribute("aria-expanded", String(isOpen));

        if (menuLabel) {
            menuLabel.textContent = isOpen ? "전체 메뉴 닫기" : "전체 메뉴 열기";
        }
    };

    menuButton.addEventListener("click", () => {
        setMenuState(!header.classList.contains("is-menu-open"));
    });

    header.querySelectorAll(".main-navigation a").forEach((link) => {
        link.addEventListener("click", () => setMenuState(false));
    });

    header.addEventListener("keydown", (event) => {
        if (event.key !== "Escape" || !header.classList.contains("is-menu-open")) return;

        setMenuState(false);
        menuButton.focus();
    });
}

async function loadInclude(element) {
    const source = element.dataset.include;

    try {
        const response = await fetch(source);

        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        const template = document.createElement("template");
        template.innerHTML = (await response.text()).trim();

        const header = template.content.querySelector(".site-header");
        element.replaceWith(template.content);

        if (header) initializeHeader(header);
    } catch (error) {
        console.error(`공통 파일을 불러오지 못했습니다: ${source}`, error);
    }
}

includeElements.forEach(loadInclude);
