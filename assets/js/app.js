/**
 * app.js — UD Sarana Agro Makmur (SAM)
 * -----------------------------------------------------------------------
 * Semua logic interaktif halaman: loading screen, progress bar scroll,
 * render katalog, ganti rak/kategori, pencarian produk, navigasi mobile,
 * animasi reveal + hitung angka saat scroll, dan form kontak (dikirim
 * lewat WhatsApp karena situs ini murni katalog, tanpa backend/keranjang).
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
  // LOADING SCREEN — tampil sebentar saat halaman pertama dibuka
  // ---------------------------------------------------------------------
  function initLoader() {
    const loader = qs("#pageLoader");
    if (!loader) return;
    document.body.classList.add("is-loading");

    const hide = () => {
      loader.classList.add("is-hidden");
      document.body.classList.remove("is-loading");
    };

    // Beri jeda minimum supaya animasi terlihat (bukan sekadar berkedip),
    // tapi tetap menunggu semua aset (font, gambar) selesai dimuat.
    const minDelay = new Promise((res) => setTimeout(res, 650));
    const pageReady = new Promise((res) => {
      if (document.readyState === "complete") res();
      else window.addEventListener("load", res, { once: true });
    });
    Promise.all([minDelay, pageReady]).then(hide);

    // Jaring pengaman: jangan sampai loader nyangkut kalau ada aset lambat
    setTimeout(hide, 4000);
  }

  // ---------------------------------------------------------------------
  // PROGRESS BAR SCROLL
  // ---------------------------------------------------------------------
  function initScrollProgress() {
    const bar = qs("#scrollProgress");
    if (!bar) return;
    const update = () => {
      const scrollTop = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = pct + "%";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

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
      btn.addEventListener("click", () => selectCategory(btn.dataset.cat));
    });
  }

  function selectCategory(id) {
    activeCategory = id;
    searchTerm = "";
    const search = qs("#productSearch");
    if (search) search.value = "";
    renderTabs();
    renderCategoryPanel();
    renderProducts();
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
  // RENDER: daftar produk kategori aktif (+ pencarian). Katalog murni —
  // tidak ada tombol tambah keranjang, hanya CTA tanya via WhatsApp.
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
      grid.classList.remove("stagger", "is-visible");
      empty.hidden = false;
      empty.textContent = `Tidak ada produk "${searchTerm}" di rak ${cat.rak}.`;
      return;
    }
    empty.hidden = true;

    grid.innerHTML = items
      .map((p, i) => {
        const kode = `${cat.rak}-${String(i + 1).padStart(2, "0")}`;
        const waText = encodeURIComponent(
          `Halo ${STORE_INFO.nama}, saya mau tanya stok & harga:\n${p.nama} (${p.satuan}) — kode ${kode}`
        );
        return `
        <li class="product-card">
          <span class="product-card__code">${kode}</span>
          <span class="product-card__name">${p.nama}</span>
          <span class="product-card__unit">${p.satuan}</span>
          <span class="product-card__price">${rupiah(p.harga)}</span>
          <span class="product-card__stock"><i class="bi bi-check-circle-fill"></i> Stok Tersedia</span>
          <a class="product-card__cta"
             href="https://wa.me/${STORE_INFO.whatsapp}?text=${waText}"
             target="_blank" rel="noopener">
            <i class="bi bi-whatsapp" aria-hidden="true"></i> Tanya Stok
          </a>
        </li>`;
      })
      .join("");

    // Re-trigger animasi stagger tiap kali daftar berganti
    grid.classList.remove("stagger", "is-visible");
    void grid.offsetWidth; // reflow paksa
    grid.classList.add("stagger");
    requestAnimationFrame(() => grid.classList.add("is-visible"));
  }

  // ---------------------------------------------------------------------
  // RENDER: ubin "Kategori Populer"
  // ---------------------------------------------------------------------
  function renderCategoryTiles() {
    const el = qs("#catTiles");
    if (!el) return;
    el.innerHTML = CATALOG.map((cat) => `
      <li>
        <button type="button" class="cat-tile" data-cat="${cat.id}">
          <span class="cat-tile__icon"><i class="bi bi-${cat.icon}" aria-hidden="true"></i></span>
          <span class="cat-tile__name">${cat.nama}</span>
          <span class="cat-tile__count">${cat.produk.length} produk</span>
        </button>
      </li>`).join("");

    qsa("[data-cat]", el).forEach((btn) => {
      btn.addEventListener("click", () => {
        selectCategory(btn.dataset.cat);
        qs("#katalog").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
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
        selectCategory(btn.dataset.cat);
        qs("#katalog").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  // Link cepat di category-bar bawah header (data-jump="<id-kategori>")
  function initCategoryBarLinks() {
    qsa(".category-bar__list a[data-jump]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        selectCategory(link.dataset.jump);
        qs("#katalog").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  // ---------------------------------------------------------------------
  // Pencarian produk (di dalam katalog, debounced ringan)
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

  // Pencarian di header: langsung lompat ke katalog + isi kata kunci
  function initHeaderSearch() {
    const form = qs("#headerSearchForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = qs("#headerSearchInput").value;
      const target = qs("#productSearch");
      if (target) {
        target.value = val;
        searchTerm = val;
        renderProducts();
      }
      qs("#katalog").scrollIntoView({ behavior: "smooth", block: "start" });
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
  // Header menyusut saat scroll, tombol kembali ke atas, tandai tab
  // kategori aktif di category-bar sesuai section yang terlihat
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
  // Reveal saat scroll + hitung angka statistik (dimatikan otomatis
  // kalau prefers-reduced-motion)
  // ---------------------------------------------------------------------
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || "";
    const duration = 900;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function initReveal() {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const targets = qsa(".reveal, .reveal-scale, .stagger");
    const counters = qsa("[data-count]");

    if (prefersReduced || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      counters.forEach((el) => {
        el.textContent = (el.dataset.count || "0") + (el.dataset.suffix || "");
      });
      return;
    }

    // rootMargin menggeser "garis pemicu" sedikit ke atas/bawah viewport
    // supaya elemen sempat benar-benar keluar layar dulu sebelum status
    // is-visible dicabut — animasi jadi terasa mulus dua arah, bukan
    // berkedip persis di tepi layar.
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Toggle dua arah: masuk viewport → animasi muncul,
          // keluar viewport → status dicabut supaya animasi yang sama
          // terputar ulang saat elemen itu terlihat lagi (scroll naik
          // ataupun turun), tanpa perlu refresh halaman.
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
          if (entry.isIntersecting && entry.target.hasAttribute("data-count")) {
            animateCount(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "-4% 0px -4% 0px" }
    );
    targets.forEach((el) => obs.observe(el));
    counters.forEach((el) => obs.observe(el));
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
    initLoader();
    initScrollProgress();
    renderTabs();
    renderCategoryPanel();
    renderProducts();
    renderCategoryTiles();
    renderOverview();
    initSearch();
    initHeaderSearch();
    initCategoryBarLinks();
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
