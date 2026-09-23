/**
 * Summer Beats Festival 2026 - Main Interactive Scripts
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Navigation Toggle
  const mobileToggle = document.getElementById("mobileToggle");
  const mainNav = document.getElementById("mainNav");

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      mobileToggle.setAttribute("aria-expanded", isOpen);
      const icon = mobileToggle.querySelector("i");
      if (icon) {
        icon.className = isOpen ? "ph-bold ph-x" : "ph-bold ph-list";
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!mainNav.contains(e.target) && !mobileToggle.contains(e.target) && mainNav.classList.contains("open")) {
        mainNav.classList.remove("open");
        mobileToggle.setAttribute("aria-expanded", "false");
        const icon = mobileToggle.querySelector("i");
        if (icon) icon.className = "ph-bold ph-list";
      }
    });
  }

  // 2. Countdown Timer to Summer Beats 2026 (Jan 15, 2026)
  const daysEl = document.getElementById("countdownDays");
  const hoursEl = document.getElementById("countdownHours");
  const minutesEl = document.getElementById("countdownMinutes");
  const secondsEl = document.getElementById("countdownSeconds");

  if (daysEl && hoursEl && minutesEl && secondsEl) {
    const festivalDate = new Date("2026-01-15T12:00:00").getTime();

    function updateCountdown() {
      const now = new Date().getTime();
      let diff = festivalDate - now;

      if (diff <= 0) {
        // If event passed in local time simulation, set to 0 or fixed celebration
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = days < 10 ? "0" + days : days;
      hoursEl.textContent = hours < 10 ? "0" + hours : hours;
      minutesEl.textContent = minutes < 10 ? "0" + minutes : minutes;
      secondsEl.textContent = seconds < 10 ? "0" + seconds : seconds;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // 3. Gallery Category Filters & Lightbox (galeria.html)
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-card");

  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const targetCategory = btn.getAttribute("data-filter");

        galleryItems.forEach((item) => {
          const itemCategory = item.getAttribute("data-category");
          if (targetCategory === "all" || itemCategory === targetCategory) {
            item.style.display = "flex";
            setTimeout(() => {
              item.style.opacity = "1";
              item.style.transform = "scale(1)";
            }, 20);
          } else {
            item.style.opacity = "0";
            item.style.transform = "scale(0.96)";
            setTimeout(() => {
              item.style.display = "none";
            }, 200);
          }
        });
      });
    });
  }

  // Lightbox Modal for Gallery Images
  const galleryImages = document.querySelectorAll(".gallery-photo-click");
  const lightboxModal = document.getElementById("lightboxModal");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  if (galleryImages.length > 0 && lightboxModal && lightboxImg) {
    galleryImages.forEach((img) => {
      img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || "Summer Beats Festival";
        if (lightboxCaption) {
          lightboxCaption.textContent = img.getAttribute("data-caption") || img.alt || "";
        }
        lightboxModal.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove("active");
      document.body.style.overflow = "auto";
    };

    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightboxModal.classList.contains("active")) {
        closeLightbox();
      }
    });
  }

  // 4. Interactive Ticket Selection & Pricing (compra.html)
  const ticketCards = document.querySelectorAll(".ticket-select-card");
  const planoSelect = document.getElementById("plano");
  const summaryPlan = document.getElementById("summaryPlan");
  const summaryPrice = document.getElementById("summaryPrice");
  const summaryFee = document.getElementById("summaryFee");
  const summaryTotal = document.getElementById("summaryTotal");
  const ticketQtyInput = document.getElementById("ticketQuantity");
  const checkoutForm = document.getElementById("checkoutForm");
  const confirmationModal = document.getElementById("confirmationModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");

  const ticketPrices = {
    diario: { name: "Ingresso Diário (1 Dia)", price: 150.0 },
    passaporte: { name: "Passaporte Completo (3 Dias VIP)", price: 350.0 },
    universitario: { name: "Camping Universitário + Ingresso", price: 0.0, reqRe: true }
  };

  function updateOrderSummary() {
    if (!planoSelect) return;
    const selectedKey = planoSelect.value;
    const qty = ticketQtyInput ? parseInt(ticketQtyInput.value, 10) || 1 : 1;
    const ticketInfo = ticketPrices[selectedKey] || ticketPrices["passaporte"];

    const subtotal = ticketInfo.price * qty;
    const fee = ticketInfo.price > 0 ? subtotal * 0.05 : 0.0;
    const total = subtotal + fee;

    if (summaryPlan) summaryPlan.textContent = `${ticketInfo.name} (x${qty})`;
    if (summaryPrice) summaryPrice.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
    if (summaryFee) summaryFee.textContent = fee === 0 ? "Grátis" : `R$ ${fee.toFixed(2).replace(".", ",")}`;
    if (summaryTotal) summaryTotal.textContent = total === 0 ? "Gratuito (Com RE)" : `R$ ${total.toFixed(2).replace(".", ",")}`;

    // Highlight corresponding ticket card
    ticketCards.forEach((card) => {
      if (card.getAttribute("data-plan") === selectedKey) {
        card.classList.add("selected");
      } else {
        card.classList.remove("selected");
      }
    });

    // Toggle requirement for RE
    const reField = document.getElementById("RE");
    const reContainer = document.getElementById("reContainer");
    if (reField && reContainer) {
      if (selectedKey === "universitario") {
        reField.setAttribute("required", "required");
        reContainer.classList.add("highlight-re");
      } else {
        reField.removeAttribute("required");
        reContainer.classList.remove("highlight-re");
      }
    }
  }

  if (ticketCards.length > 0 && planoSelect) {
    ticketCards.forEach((card) => {
      card.addEventListener("click", () => {
        const plan = card.getAttribute("data-plan");
        if (plan) {
          planoSelect.value = plan;
          updateOrderSummary();
          // Scroll smoothly to form on mobile
          if (window.innerWidth < 768) {
            document.querySelector(".checkout-section")?.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    });

    planoSelect.addEventListener("change", updateOrderSummary);
    if (ticketQtyInput) {
      ticketQtyInput.addEventListener("input", updateOrderSummary);
    }
    updateOrderSummary();
  }

  // Handle Checkout Submission
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const name = document.getElementById("Name")?.value.trim() || "";
      const email = document.getElementById("email")?.value.trim() || "";
      const plan = planoSelect ? planoSelect.options[planoSelect.selectedIndex].text : "";
      
      if (!name || !email) {
        showToast("Por favor, preencha todos os campos obrigatórios.", "warning");
        return;
      }

      // Show confirmation modal
      if (confirmationModal) {
        const modalName = document.getElementById("modalCustomerName");
        const modalPlan = document.getElementById("modalTicketPlan");
        if (modalName) modalName.textContent = name;
        if (modalPlan) modalPlan.textContent = plan;

        confirmationModal.classList.add("active");
        document.body.style.overflow = "hidden";
      } else {
        showToast(`Parabéns, ${name}! Seu ingresso foi reservado com sucesso. Enviamos a confirmação para ${email}.`, "success");
        checkoutForm.reset();
        updateOrderSummary();
      }
    });

    const cancelBtn = document.getElementById("btnCancelOrder");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (confirm("Deseja realmente limpar as informações do formulário?")) {
          checkoutForm.reset();
          if (planoSelect) planoSelect.value = "passaporte";
          updateOrderSummary();
          showToast("Formulário cancelado e limpo.", "info");
        }
      });
    }

    if (modalCloseBtn && confirmationModal) {
      modalCloseBtn.addEventListener("click", () => {
        confirmationModal.classList.remove("active");
        document.body.style.overflow = "auto";
        checkoutForm.reset();
        if (planoSelect) planoSelect.value = "passaporte";
        updateOrderSummary();
      });
    }
  }

  // 5. Contact Form Submission (contatos.html)
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = document.getElementById("nome")?.value.trim();
      const email = document.getElementById("email")?.value.trim();

      if (!nome || !email) {
        showToast("Por favor, preencha os campos obrigatórios.", "warning");
        return;
      }

      showToast(`Obrigado, ${nome}! Sua mensagem foi enviada à equipe Summer Beats. Responderemos em breve em ${email}.`, "success");
      contactForm.reset();
    });
  }

  // FAQ Accordion (contatos.html)
  const faqItems = document.querySelectorAll(".faq-item");
  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      if (question) {
        question.addEventListener("click", () => {
          const isOpen = item.classList.contains("open");
          faqItems.forEach((i) => i.classList.remove("open"));
          if (!isOpen) {
            item.classList.add("open");
          }
        });
      }
    });
  }

  // Toast Notification Utility
  function showToast(message, type = "info") {
    let toast = document.getElementById("siteToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "siteToast";
      toast.className = "site-toast";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = `site-toast ${type} show`;

    setTimeout(() => {
      toast.classList.remove("show");
    }, 4500);
  }
});
