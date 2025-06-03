function initSlider(sliderName) {
  const bg = document.getElementById(`background-blur-${sliderName}`);
  const slides = document.querySelectorAll(`[data-index-${sliderName}]`);
  const dots = document.querySelectorAll(`[data-dot-index-${sliderName}]`);
  let current = 0;

  function updateSlider(index) {
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
      dot.classList.remove("bg-gray-600", "bg-gray-300", "scale-125");
      if (i === index) {
        dot.classList.add("bg-gray-600");
      } else {
        dot.classList.add("bg-gray-300");
      }
    });

    current = index;
  }

  function autoAdvance() {
    updateSlider((current + 1) % slides.length);
  }

  // Asignar eventos a los dots
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => updateSlider(i));
  });

  // Inicializar
  if (slides.length > 0 && bg) {
    bg.style.backgroundImage = `url(${slides[0].dataset.bg})`;
    updateSlider(0);
    setInterval(autoAdvance, 6000);
  }
}

// Al cargar la página, inicializamos ambos sliders
window.addEventListener("DOMContentLoaded", () => {
  initSlider("certifications");
  initSlider("projects");
});
