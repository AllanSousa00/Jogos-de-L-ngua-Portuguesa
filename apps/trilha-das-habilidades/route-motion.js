"use strict";

// A estrada SVG é a referência do movimento. Coordenadas em porcentagem preservam
// o caminho ao redimensionar o tabuleiro, sem ler o layout a cada quadro.
(function exposeCaravanRoute() {
  function createCaravanRoute({
    path,
    marker,
    positions,
    startPosition,
    viewBox = { width: 1200, height: 700 },
    canAnimate = () => true,
    onProgress = () => {},
    onHeading = () => {},
    requestFrame = (callback) => window.requestAnimationFrame(callback),
    cancelFrame = (id) => window.cancelAnimationFrame(id),
    now = () => performance.now()
  }) {
    const length = path.getTotalLength();
    if (!Number.isFinite(length) || length <= 0) {
      throw new Error("A estrada não contém um caminho válido.");
    }
    const step = length / 300;
    const samples = Array.from({ length: 301 }, (_, index) => {
      const distance = index * step;
      return { distance, point: path.getPointAtLength(distance) };
    });
    let minimum = 0;
    const stops = [startPosition, ...positions].map((position) => {
      const target = { x: (position.x / 100) * viewBox.width, y: (position.y / 100) * viewBox.height };
      const errorAt = (distance) => {
        const point = path.getPointAtLength(distance);
        return (point.x - target.x) ** 2 + (point.y - target.y) ** 2;
      };
      let closest = samples[samples.length - 1];
      let bestError = Infinity;
      for (const sample of samples) {
        if (sample.distance < minimum) continue;
        const error = (sample.point.x - target.x) ** 2 + (sample.point.y - target.y) ** 2;
        if (error < bestError) {
          closest = sample;
          bestError = error;
        }
      }
      let low = Math.max(minimum, closest.distance - step);
      let high = Math.min(length, closest.distance + step);
      for (let index = 0; index < 8; index += 1) {
        const left = low + (high - low) / 3;
        const right = high - (high - low) / 3;
        if (errorAt(left) < errorAt(right)) high = right;
        else low = left;
      }
      minimum = (low + high) / 2;
      return minimum;
    });

    let frame = 0;
    let current = stops[0];
    let target = current;
    let lastDistance = current;
    let facing = 1;
    let travelDirection = 1;
    function place(distance) {
      const point = path.getPointAtLength(distance);
      marker.style.left = `${((point.x / viewBox.width) * 100).toFixed(3)}%`;
      marker.style.top = `${((point.y / viewBox.height) * 100).toFixed(3)}%`;
      onProgress(Math.max(0, Math.min(1, distance / length)));
      if (Math.abs(distance - lastDistance) > 0.01) travelDirection = distance < lastDistance ? -1 : 1;
      const direction = travelDirection;
      const before = path.getPointAtLength(Math.max(0, Math.min(length, distance - direction * 2)));
      const after = path.getPointAtLength(Math.max(0, Math.min(length, distance + direction * 2)));
      const dx = after.x - before.x;
      const dy = after.y - before.y;
      if (Math.abs(dx) > 0.1) facing = dx < 0 ? -1 : 1;
      const lean = Math.max(-7, Math.min(7, Math.atan2(dy, Math.max(1, Math.abs(dx))) * 7 * facing));
      onHeading({ facing, lean });
      lastDistance = distance;
    }
    function cancel() {
      if (frame) cancelFrame(frame);
      frame = 0;
      marker.classList.remove("is-moving");
    }
    function finish() {
      cancel();
      current = target;
      place(current);
      onHeading({ facing, lean: 0 });
    }
    function moveTo(index, immediate = false) {
      if (!Number.isInteger(index) || index < 0 || index >= stops.length) return 0;
      const destination = stops[index];
      if (destination === target && frame) return 0;
      cancel();
      target = destination;
      const from = current;
      const delta = target - from;
      if (Math.abs(delta) > 0.5) travelDirection = delta < 0 ? -1 : 1;
      if (immediate || !canAnimate() || Math.abs(delta) < 0.5) {
        finish();
        return 0;
      }
      const duration = Math.min(1400, Math.max(400, Math.abs(delta) * 0.85));
      const began = now();
      marker.classList.add("is-moving");
      function tick(timestamp) {
        const progress = Math.max(0, Math.min(1, (timestamp - began) / duration));
        const ease = progress < 0.5 ? 2 * progress ** 2 : 1 - (-2 * progress + 2) ** 2 / 2;
        current = from + delta * ease;
        place(current);
        if (progress < 1) frame = requestFrame(tick);
        else finish();
      }
      frame = requestFrame(tick);
      return duration;
    }
    function reset(index = 0) {
      cancel();
      target = stops[index] ?? stops[0];
      current = target;
      lastDistance = target;
      travelDirection = 1;
      place(current);
      onHeading({ facing, lean: 0 });
    }
    place(current);
    onHeading({ facing, lean: 0 });
    return { moveTo, reset, finish, cancel };
  }

  if (typeof module !== "undefined" && module.exports) module.exports = { createCaravanRoute };
  else window.createCaravanRoute = createCaravanRoute;
})();
