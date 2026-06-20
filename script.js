/* =====================================================================
   TAHU BERKAH — SCRIPT.JS
   Seluruh interaktivitas landing page.
   Daftar isi:
   1. Navbar: efek scroll & auto-close menu mobile
   2. Reveal animation saat elemen masuk viewport (IntersectionObserver)
   3. Animasi counter angka statistik
   4. Filter galeri foto
   5. Validasi & pengiriman form kontak ke WhatsApp
   6. Tombol "Kembali ke Atas"
   7. Tahun berjalan otomatis di footer
   ===================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* -------------------------------------------------------------
     1. NAVBAR — efek scroll & auto-close menu saat link diklik
  ----------------------------------------------------------------*/
  const navbar = document.getElementById("mainNavbar");
  const navLinks = document.querySelectorAll("#navMenu .nav-link");
  const navCollapseEl = document.getElementById("navMenu");

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  handleNavbarScroll(); // jalankan sekali saat load
  window.addEventListener("scroll", handleNavbarScroll);

  // Tutup menu hamburger otomatis di mobile setelah salah satu link diklik
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (navCollapseEl.classList.contains("show")) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapseEl);
        bsCollapse.hide();
      }
    });
  });

  // Highlight menu aktif sesuai section yang sedang dilihat (scrollspy ringan)
  const sections = document.querySelectorAll("section[id]");
  function highlightActiveLink() {
    let currentId = "";
    const scrollPos = window.scrollY + 120; // offset untuk navbar fixed

    sections.forEach(function (section) {
      if (scrollPos >= section.offsetTop) {
        currentId = section.getAttribute("id");
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentId) {
        link.classList.add("active");
      }
    });
  }
  window.addEventListener("scroll", highlightActiveLink);
  highlightActiveLink();


  /* -------------------------------------------------------------
     2. REVEAL ANIMATION — elemen muncul halus saat di-scroll
  ----------------------------------------------------------------*/
  const revealElements = document.querySelectorAll("[data-reveal]");

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute("data-reveal-delay") || 0;
          setTimeout(function () {
            entry.target.classList.add("is-visible");
          }, parseInt(delay, 10));
          revealObserver.unobserve(entry.target); // cukup animasi sekali saja
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });


  /* -------------------------------------------------------------
     3. COUNTER ANGKA STATISTIK — animasi hitung naik
  ----------------------------------------------------------------*/
  const statNumbers = document.querySelectorAll(".stat-number");

  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const duration = 1600; // ms
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // easeOutQuad supaya pergerakan angka terasa halus di akhir
      const eased = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target; // pastikan angka akhir presisi
      }
    }
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(function (el) {
    counterObserver.observe(el);
  });


  /* -------------------------------------------------------------
     4. FILTER GALERI FOTO
  ----------------------------------------------------------------*/
  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const filterValue = btn.getAttribute("data-filter");

      // update tombol aktif
      filterButtons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");

      // tampilkan/sembunyikan item galeri sesuai kategori
      galleryItems.forEach(function (item) {
        const category = item.getAttribute("data-category");
        const shouldShow = filterValue === "all" || category === filterValue;
        item.classList.toggle("gallery-hidden", !shouldShow);
      });
    });
  });


  /* -------------------------------------------------------------
     5. FORM KONTAK — validasi Bootstrap + kirim pesan via WhatsApp
     Catatan: karena halaman ini statis (tanpa server/backend),
     pesan dikirim dengan membuka WhatsApp Web/App berisi teks
     yang sudah otomatis terisi dari isian form.
  ----------------------------------------------------------------*/
  const contactForm = document.getElementById("contactForm");

  // GANTI nomor WhatsApp tujuan form di bawah ini (format internasional tanpa "+")
  const WHATSAPP_NUMBER = "6285877660079";

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (!contactForm.checkValidity()) {
        // tampilkan style validasi merah Bootstrap pada field yang kosong/invalid
        contactForm.classList.add("was-validated");
        return;
      }

      const nama = document.getElementById("namaInput").value.trim();
      const hp = document.getElementById("hpInput").value.trim();
      const produk = document.getElementById("produkInput").value;
      const pesan = document.getElementById("pesanInput").value.trim();

      // susun teks pesan WhatsApp secara rapi
      const teksPesan =
        "Halo Tahu Berkah, saya ingin memesan:\n" +
        "Nama: " + nama + "\n" +
        "No. HP: " + hp + "\n" +
        "Produk: " + produk + "\n" +
        "Pesan: " + pesan;

      const waUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(teksPesan);
      window.open(waUrl, "_blank", "noopener");

      // reset form setelah terkirim
      contactForm.reset();
      contactForm.classList.remove("was-validated");
    });
  }


  /* -------------------------------------------------------------
     6. TOMBOL "KEMBALI KE ATAS"
  ----------------------------------------------------------------*/
  const backToTopBtn = document.getElementById("backToTop");

  function toggleBackToTop() {
    if (window.scrollY > 480) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  }
  window.addEventListener("scroll", toggleBackToTop);
  toggleBackToTop();

  backToTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });


  /* -------------------------------------------------------------
     7. TAHUN BERJALAN OTOMATIS DI FOOTER
  ----------------------------------------------------------------*/
  const yearSpan = document.getElementById("currentYear");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

});