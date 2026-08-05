/**
 * app.js
 * -----------------------------------------------------------------------
 * Semua logic interaktif halaman: render katalog, ganti rak/kategori,
 * pencarian produk, navigasi mobile, scroll-reveal, dan form kontak
 * (dikirim lewat WhatsApp karena situs ini belum punya backend sendiri).
 *
 * Bergantung pada CATALOG & STORE_INFO dari data.js — muat data.js
 * SEBELUM app.js di index.html.
 * -----------------------------------------------------------------------
 */
(function () {
  "use strict";

  const rupiah = (n) =>
    "Rp " + n.toLocaleString("id-ID", { maximumFractionDigits: 0 });

  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  let activeCategory = CATALOG[0].id;
  let searchTerm = "";

  // ---------------------------------------------------------------------
  // RENDER: tab rak/kategori
  // ---------------------------------------------------------------------
  function renderTabs() {
    const nav = qs("#rakNav");
    nav.innerHTML = CATALOG.map((cat) => {
      const isActive = cat.id === activeCategory;
      return `
        <button type="button"
                class="rak-tab${isActive ? " is-active" : ""}"
                data-cat="${cat.id}"
                aria-pressed="${isActive}">
          <span class="rak-tab__num">RAK ${cat.rak}</span>
          <span class="rak-tab__name">
            <i class="bi bi-${cat.icon}" aria-hidden="true"></i>
            ${cat.nama}
          </span>
        </button>`;
    }).join("");

    qsa("[data-cat]", nav).forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.cat;
        searchTerm = "";
        const search = qs("#productSearch");
        if (search) search.value = "";
        renderTabs();
        renderCategoryPanel();
        renderProducts();
      });
    });
  }

  // ---------------------------------------------------------------------
  // RENDER: panel deskripsi kategori aktif
  // ---------------------------------------------------------------------
  function renderCategoryPanel() {
    const cat = CATALOG.find((c) => c.id === activeCategory);
    qs("#categoryPanel").innerHTML = `
      <div class="cat-panel">
        <div class="cat-panel__icon"><i class="bi bi-${cat.icon}" aria-hidden="true"></i></div>
        <div>
          <p class="cat-panel__eyebrow">Rak ${cat.rak} · ${cat.produk.length} item</p>
          <h3 class="cat-panel__title">${cat.nama}</h3>
          <p class="cat-panel__desc">${cat.deskripsi}</p>
        </div>
      </div>`;
  }

  // ---------------------------------------------------------------------
  // RENDER: daftar produk kategori aktif (+ pencarian)
  // ---------------------------------------------------------------------
  function renderProducts() {
    const cat = CATALOG.find((c) => c.id === activeCategory);
    const term = searchTerm.trim().toLowerCase();
    const items = cat.produk.filter((p) =>
      p.nama.toLowerCase().includes(term)
    );

    const grid = qs("#productGrid");
    const empty = qs("#productEmpty");

    if (items.length === 0) {
      grid.innerHTML = "";
      empty.hidden = false;
      empty.textContent = `Tidak ada produk "${searchTerm}" di rak ${cat.rak}.`;
      return;
    }
    empty.hidden = true;

    grid.innerHTML = items
      .map((p, i) => {
        const waText = encodeURIComponent(
          `Halo ${STORE_INFO.nama}, saya mau tanya stok & harga:\n${p.nama} (${p.satuan}) — kode rak ${cat.rak}-${String(i + 1).padStart(2, "0")}`
        );
        return `
        <li class="price-tag">
          <span class="price-tag__code">${cat.rak}-${String(i + 1).padStart(2, "0")}</span>
          <span class="price-tag__name">${p.nama}</span>
          <span class="price-tag__unit">${p.satuan}</span>
          <span class="price-tag__price">${rupiah(p.harga)}</span>
          <a class="price-tag__cta"
             href="https://wa.me/${STORE_INFO.whatsapp}?text=${waText}"
             target="_blank" rel="noopener">
            Tanya stok <i class="bi bi-whatsapp" aria-hidden="true"></i>
          </a>
        </li>`;
      })
      .join("");
  }

  // ---------------------------------------------------------------------
  // RENDER: ringkasan semua rak (section #semua-rak)
  // ---------------------------------------------------------------------
  function renderOverview() {
    qs("#overviewGrid").innerHTML = CATALOG.map((cat) => `
      <li class="overview-card">
        <div class="overview-card__head">
          <span class="overview-card__rak">Rak ${cat.rak}</span>
          <i class="bi bi-${cat.icon}" aria-hidden="true"></i>
        </div>
        <h3>${cat.nama}</h3>
        <p>${cat.deskripsi}</p>
        <button type="button" class="overview-card__link" data-cat="${cat.id}">
          Lihat ${cat.produk.length} produk
          <i class="bi bi-arrow-right" aria-hidden="true"></i>
        </button>
      </li>`).join("");

    qsa("[data-cat]", qs("#overviewGrid")).forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.cat;
        renderTabs();
        renderCategoryPanel();
        renderProducts();
        qs("#katalog").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  // ---------------------------------------------------------------------
  // Pencarian produk (debounced ringan)
  // ---------------------------------------------------------------------
  function initSearch() {
    const input = qs("#productSearch");
    if (!input) return;
    let handle;
    input.addEventListener("input", () => {
      clearTimeout(handle);
      handle = setTimeout(() => {
        searchTerm = input.value;
        renderProducts();
      }, 120);
    });
  }

  // ---------------------------------------------------------------------
  // Navigasi mobile (buka/tutup + tutup otomatis setelah klik link)
  // ---------------------------------------------------------------------
  function initMobileNav() {
    const toggle = qs("#navToggle");
    const menu = qs("#siteNav");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-open", isOpen);
    });

    qsa("a", menu).forEach((link) =>
      link.addEventListener("click", () => {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      })
    );
  }

  // ---------------------------------------------------------------------
  // Header menyusut saat scroll + tombol kembali ke atas
  // ---------------------------------------------------------------------
  function initScrollEffects() {
    const header = qs("#siteHeader");
    const backTop = qs("#backTop");
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        header.classList.toggle("is-condensed", y > 24);
        backTop.classList.toggle("is-visible", y > 480);
      },
      { passive: true }
    );
  }

  // ---------------------------------------------------------------------
  // Reveal saat scroll (dimatikan otomatis kalau prefers-reduced-motion)
  // ---------------------------------------------------------------------
  function initReveal() {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const targets = qsa(".reveal");
    if (prefersReduced || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    targets.forEach((el) => obs.observe(el));
  }

  // ---------------------------------------------------------------------
  // Form kontak → diteruskan sebagai pesan WhatsApp (situs belum ada backend)
  // ---------------------------------------------------------------------
  function initContactForm() {
    const form = qs("#contactForm");
    if (!form) return;
    const status = qs("#formStatus");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nama = qs("#fNama").value.trim();
      const hp = qs("#fHp").value.trim();
      const kategori = qs("#fKategori").value;
      const pesan = qs("#fPesan").value.trim();

      if (!nama || !hp || !pesan) {
        status.className = "form-status form-status--warn";
        status.textContent = "Nama, No. HP, dan pesan wajib diisi.";
        return;
      }

      const kategoriLabel =
        CATALOG.find((c) => c.id === kategori)?.nama || "Pertanyaan umum";

      const text = encodeURIComponent(
        `Halo ${STORE_INFO.nama}, saya ${nama} (${hp}).\n` +
          `Kategori: ${kategoriLabel}\n` +
          `Pesan: ${pesan}`
      );

      status.className = "form-status form-status--ok";
      status.textContent =
        "Pesan siap dikirim. Melanjutkan ke WhatsApp toko kami…";
      form.reset();

      window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${text}`, "_blank");
    });
  }

  function fillStoreInfo() {
    qsa("[data-store-year]").forEach(
      (el) => (el.textContent = new Date().getFullYear())
    );
  }

  function init() {
    renderTabs();
    renderCategoryPanel();
    renderProducts();
    renderOverview();
    initSearch();
    initMobileNav();
    initScrollEffects();
    initReveal();
    initContactForm();
    fillStoreInfo();
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
