let current = 0;

function updateSlider(index) {
  const slides = document.querySelectorAll("[data-index]");
  const dots = document.querySelectorAll("[data-dot-index]");
  const bg = document.getElementById("background-blur");

  slides.forEach((slide, i) => {
    if (i === index) {
      slide.classList.add("opacity-100", "z-10");
      slide.classList.remove("opacity-0", "z-0");
      if (bg) {
        bg.style.backgroundImage = `url(${slide.dataset.bg})`;
      }
    } else {
      slide.classList.remove("opacity-100", "z-10");
      slide.classList.add("opacity-0", "z-0");
    }
  });

  dots.forEach((dot, i) => {
    // Limpiar clases anteriores
    dot.classList.remove("bg-gray-600", "bg-gray-300", "scale-125");

    // Aplicar clases nuevas
    if (i === index) {
      dot.classList.add("bg-gray-600", "scale-125");
    } else {
      dot.classList.add("bg-gray-300");
    }
  });

  current = index;
}

function autoAdvance() {
  const total = document.querySelectorAll("[data-index]").length;
  updateSlider((current + 1) % total);
}

window.addEventListener("DOMContentLoaded", () => {
  // Activar dots clicables
  document.querySelectorAll("[data-dot-index]").forEach((dot) => {
    dot.addEventListener("click", () => {
      updateSlider(Number(dot.dataset.dotIndex));
    });
  });

  // Auto scroll cada 6 segundos
  setInterval(autoAdvance, 6000);

  // Fondo inicial
  const firstSlide = document.querySelector('[data-index="0"]');
  if (firstSlide) {
    document.getElementById("background-blur").style.backgroundImage =
      `url(${firstSlide.dataset.bg})`;
  }

  // Inicializar estilo del dot 0
  updateSlider(0);
});
