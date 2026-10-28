(() => {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- theme ---------- */

  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const THEME_KEY = "cy-theme";

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeMeta) themeMeta.setAttribute("content", theme === "dark" ? "#12110f" : "#f3efe6");
    if (themeToggle) {
      const isDark = theme === "dark";
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute("aria-label", isDark ? "切换到浅色模式" : "切换到深色模式");
    }
  }

  applyTheme(root.getAttribute("data-theme") || "light");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {
        /* storage may be unavailable */
      }
    });
  }

  /* ---------- header state ---------- */

  const header = document.querySelector(".site-header");
  let ticking = false;

  function syncHeader() {
    if (!header) return;
    const scrolled = window.scrollY > 8;
    header.classList.toggle("is-scrolled", scrolled);

    const contact = document.getElementById("contact");
    let overDarkBand = false;
    if (contact && scrolled && !document.body.classList.contains("menu-open")) {
      const rect = contact.getBoundingClientRect();
      overDarkBand = rect.top <= header.offsetHeight && rect.bottom > header.offsetHeight;
    }
    header.classList.toggle("is-inverted", overDarkBand);
    ticking = false;
  }

  if (header) {
    syncHeader();
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(syncHeader);
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", syncHeader, { passive: true });
    document.addEventListener("toggle", () => window.requestAnimationFrame(syncHeader), true);
  }

  /* ---------- mobile menu ---------- */

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];
  const pageMain = document.getElementById("main");
  const pageFooter = document.querySelector(".site-footer");

  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    }
    if (mobileMenu) mobileMenu.setAttribute("aria-hidden", String(!open));
    [pageMain, pageFooter].forEach((el) => {
      if (!el) return;
      if (open) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    });
    syncHeader();
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      setMenu(!document.body.classList.contains("menu-open"));
    });
    menuLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
        setMenu(false);
        menuToggle.focus();
      }
    });
    window.matchMedia("(min-width: 861px)").addEventListener("change", (event) => {
      if (event.matches) setMenu(false);
    });
  }

  /* ---------- reveal on scroll ---------- */

  const revealEls = document.querySelectorAll("[data-reveal]");

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- active nav link ---------- */

  const navLinks = Array.from(document.querySelectorAll(".nav a[href^='#']"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));

  if (navLinks.length && sections.length && "IntersectionObserver" in window) {
    const linkById = new Map(
      navLinks.map((link) => [link.getAttribute("href").slice(1), link])
    );

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            link.classList.remove("is-active");
            link.removeAttribute("aria-current");
          });
          const active = linkById.get(entry.target.id);
          if (active) {
            active.classList.add("is-active");
            active.setAttribute("aria-current", "location");
          }
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------- floating work preview ---------- */

  const workList = document.querySelector("[data-work-list]");
  const preview = document.querySelector("[data-project-preview]");

  if (workList && preview && finePointer && !reduceMotion) {
    const card = preview.querySelector(".project-preview-card");
    const ppIndex = preview.querySelector(".pp-index");
    const ppTitle = preview.querySelector(".pp-title");
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let visible = false;
    let frame = null;

    function render() {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      preview.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      if (visible || Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        frame = window.requestAnimationFrame(render);
      } else {
        frame = null;
      }
    }

    function show(item, x, y) {
      if (!card || !ppTitle || !ppIndex) return;
      targetX = x;
      targetY = y;
      if (!visible) {
        currentX = x;
        currentY = y;
      }
      ppIndex.textContent = item.dataset.index || "";
      ppTitle.textContent = item.dataset.title || "";
      preview.style.setProperty("--pc1", item.dataset.c1 || "#2e3828");
      preview.style.setProperty("--pc2", item.dataset.c2 || "#8b9768");
      preview.classList.add("is-visible");
      visible = true;
      if (!frame) frame = window.requestAnimationFrame(render);
    }

    function hide() {
      visible = false;
      preview.classList.remove("is-visible");
    }

    workList.querySelectorAll(".work-item").forEach((item) => {
      item.addEventListener("pointerenter", (event) => {
        if (event.pointerType !== "mouse") return;
        show(item, event.clientX, event.clientY);
      });
      item.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse") return;
        targetX = event.clientX;
        targetY = event.clientY;
      });
    });

    workList.addEventListener("pointerleave", hide);
    window.addEventListener("scroll", hide, { passive: true });
  }

  /* ---------- email copy ---------- */

  const copyBtn = document.querySelector("[data-copy-email]");
  const copyStatus = document.querySelector("[data-copy-status]");

  if (copyBtn) {
    const email = copyBtn.dataset.email || "hello@chenyu.design";
    const label = copyBtn.querySelector("[data-copy-label]");
    const defaultLabel = label ? label.textContent : "复制邮箱";
    let resetTimer = null;

    function markCopied(success) {
      if (!label) return;
      label.textContent = success ? "已复制" : "请手动复制";
      copyBtn.classList.toggle("is-copied", success);
      if (copyStatus) copyStatus.textContent = success ? "邮箱地址已复制到剪贴板" : "复制失败，请手动选择邮箱地址";
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        label.textContent = defaultLabel;
        copyBtn.classList.remove("is-copied");
        if (copyStatus) copyStatus.textContent = "";
      }, 2000);
    }

    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(email);
        markCopied(true);
      } catch (e) {
        const field = document.createElement("textarea");
        field.value = email;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        let ok = false;
        try {
          ok = document.execCommand("copy");
        } catch (err) {
          ok = false;
        }
        document.body.removeChild(field);
        markCopied(ok);
      }
    });
  }

  /* ---------- clocks & year ---------- */

  const clocks = document.querySelectorAll("[data-clock]");
  if (clocks.length) {
    const formatter = new Intl.DateTimeFormat("zh-CN", {
      timeZone: "Asia/Shanghai",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => {
      const time = formatter.format(new Date());
      clocks.forEach((el) => {
        el.textContent = time;
      });
    };
    tick();
    window.setInterval(tick, 30000);
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
