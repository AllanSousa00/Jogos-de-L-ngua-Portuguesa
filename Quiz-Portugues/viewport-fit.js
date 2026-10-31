"use strict";

// O layout usa CSS responsivo, sem encolher textos ou controles. Ao mudar a
// área visível (teclado virtual, rotação ou tela cheia), conserva o campo em uso.
(function preserveVisibleFocus() {
  const appRoot = document.querySelector("#app-root");
  if (!(appRoot instanceof HTMLElement)) return;
  let frame = 0;
  function revealFocusedControl() {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(() => {
      const focused = document.activeElement;
      if (!(focused instanceof HTMLElement) || !appRoot.contains(focused)) return;
      if (!focused.matches("button, input, textarea, select")) return;
      const rect = focused.getBoundingClientRect();
      const availableHeight = window.visualViewport?.height || window.innerHeight;
      if (rect.top < 0 || rect.bottom > availableHeight) {
        focused.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
      }
    });
  }
  window.addEventListener("resize", revealFocusedControl);
  window.visualViewport?.addEventListener("resize", revealFocusedControl);
  document.addEventListener("fullscreenchange", revealFocusedControl);
})();
