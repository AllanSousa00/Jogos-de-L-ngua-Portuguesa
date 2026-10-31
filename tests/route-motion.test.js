const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createCaravanRoute } = require("../apps/trilha-das-habilidades/route-motion");

function harness(animations = true, geometry) {
  const frames = new Map();
  const progressValues = [];
  const headings = [];
  const classes = new Set();
  let clock = 0;
  let next = 0;
  const marker = {
    style: {},
    classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name) }
  };
  const route = createCaravanRoute({
    path: geometry || {
      getTotalLength: () => 1200,
      getPointAtLength: (distance) => ({ x: distance, y: 350 })
    },
    marker,
    startPosition: { x: 0, y: 50 },
    positions: [20, 40, 60, 80, 100].map((x) => ({ x, y: 50 })),
    canAnimate: () => animations,
    onProgress: (progress) => progressValues.push(progress),
    onHeading: (heading) => headings.push(heading),
    now: () => clock,
    requestFrame: (callback) => {
      const id = ++next;
      frames.set(id, callback);
      return id;
    },
    cancelFrame: (id) => frames.delete(id)
  });
  function advance(ms) {
    clock += ms;
    const queued = [...frames.values()];
    frames.clear();
    queued.forEach((callback) => callback(clock));
  }
  return { route, marker, frames, classes, advance, progressValues, headings };
}

test("caravana: deslocamento avança pela estrada e encerra o quadro de animação", () => {
  const h = harness();
  const duration = h.route.moveTo(3);
  assert.ok(duration >= 400 && duration <= 1400);
  assert.equal(h.frames.size, 1);
  h.advance(duration / 2);
  const halfway = Number(h.marker.style.left.replace("%", ""));
  assert.ok(halfway > 20 && halfway < 40);
  assert.equal(h.frames.size, 1);
  h.advance(duration / 2 + 1);
  assert.ok(Math.abs(Number(h.marker.style.left.replace("%", "")) - 60) < 0.05);
  assert.equal(h.frames.size, 0);
  assert.equal(h.classes.has("is-moving"), false);
});

test("caravana: erro permite voltar pelo mesmo caminho", () => {
  const h = harness();
  h.route.reset(4);
  const duration = h.route.moveTo(1);
  h.advance(duration / 2);
  assert.ok(Number(h.marker.style.left.replace("%", "")) > 20);
  assert.ok(Number(h.marker.style.left.replace("%", "")) < 80);
  h.advance(duration);
  assert.ok(Math.abs(Number(h.marker.style.left.replace("%", "")) - 20) < 0.05);
});

test("caravana: movimento reduzido chega imediatamente e não cria quadros", () => {
  const h = harness(false);
  assert.equal(h.route.moveTo(5), 0);
  assert.ok(Math.abs(Number(h.marker.style.left.replace("%", "")) - 100) < 0.05);
  assert.equal(h.frames.size, 0);
  assert.equal(h.classes.has("is-moving"), false);
});

test("caravana: reiniciar no meio do caminho cancela o movimento antigo", () => {
  const h = harness();
  h.route.moveTo(5);
  h.advance(100);
  h.route.reset();
  const position = h.marker.style.left;
  h.advance(2000);
  assert.equal(h.marker.style.left, position);
  assert.ok(Number(position.replace("%", "")) < 0.05);
  assert.equal(h.frames.size, 0);
});

test("caravana: interromper a visualização conclui o trajeto sem quadros pendentes", () => {
  const h = harness();
  h.route.moveTo(2);
  h.advance(150);
  h.route.finish();
  assert.ok(Math.abs(Number(h.marker.style.left.replace("%", "")) - 40) < 0.05);
  assert.equal(h.frames.size, 0);
  assert.equal(h.route.moveTo(-1), 0);
  assert.equal(h.route.moveTo(99), 0);
});

// Aproxima a geometria Bézier do SVG para conferir as 20 paradas reais sem abrir
// um navegador. O movimento em produção usa a geometria nativa do próprio SVG.
function readGameRoad() {
  const html = fs.readFileSync(path.join(__dirname, "../apps/trilha-das-habilidades/index.html"), "utf8");
  const definition = html.match(/class="route-base"\s+d="([^"]+)"/)[1];
  const tokens = definition.match(/[MC]|-?\d+(?:\.\d+)?/g);
  let cursor = 0;
  assert.equal(tokens[cursor++], "M");
  let point = { x: Number(tokens[cursor++]), y: Number(tokens[cursor++]) };
  const points = [{ ...point, distance: 0 }];
  const nextPoint = () => ({ x: Number(tokens[cursor++]), y: Number(tokens[cursor++]) });
  while (cursor < tokens.length) {
    assert.equal(tokens[cursor++], "C");
    const begin = point;
    const first = nextPoint();
    const second = nextPoint();
    const end = nextPoint();
    for (let sample = 1; sample <= 240; sample += 1) {
      const t = sample / 240;
      const u = 1 - t;
      const x = u ** 3 * begin.x + 3 * u ** 2 * t * first.x + 3 * u * t ** 2 * second.x + t ** 3 * end.x;
      const y = u ** 3 * begin.y + 3 * u ** 2 * t * first.y + 3 * u * t ** 2 * second.y + t ** 3 * end.y;
      const previous = points[points.length - 1];
      points.push({ x, y, distance: previous.distance + Math.hypot(x - previous.x, y - previous.y) });
    }
    point = end;
  }
  return {
    getTotalLength: () => points[points.length - 1].distance,
    getPointAtLength(distance) {
      let low = 0;
      let high = points.length - 1;
      while (low < high) {
        const middle = Math.floor((low + high) / 2);
        if (points[middle].distance < distance) low = middle + 1;
        else high = middle;
      }
      if (low === 0) return points[0];
      const before = points[low - 1];
      const after = points[low];
      const t = (distance - before.distance) / (after.distance - before.distance);
      return { x: before.x + (after.x - before.x) * t, y: before.y + (after.y - before.y) * t };
    }
  };
}

test("caravana: todas as casas originais continuam próximas da estrada real", () => {
  const sandbox = { window: {} };
  vm.runInNewContext(
    fs.readFileSync(path.join(__dirname, "../apps/trilha-das-habilidades/game-data.js"), "utf8"),
    sandbox
  );
  const data = sandbox.window.TRILHA_DATA;
  const marker = { style: {}, classList: { add() {}, remove() {} } };
  const route = createCaravanRoute({
    path: readGameRoad(),
    marker,
    positions: data.tilePositions,
    startPosition: data.startPosition,
    canAnimate: () => false
  });
  data.tilePositions.forEach((position, index) => {
    route.moveTo(index + 1);
    const actualX = Number(marker.style.left.replace("%", "")) * 12;
    const actualY = Number(marker.style.top.replace("%", "")) * 7;
    const distance = Math.hypot(actualX - position.x * 12, actualY - position.y * 7);
    assert.ok(distance < 12, `Casa ${index + 1}: distância de ${distance.toFixed(2)} unidades.`);
  });
});

test("estrada: tinta acompanha avanço, retorno e reinício sem ultrapassar os limites", () => {
  const h = harness();
  const duration = h.route.moveTo(4);
  h.advance(duration / 2);
  const halfway = h.progressValues.at(-1);
  assert.ok(halfway > 0.3 && halfway < 0.5);
  h.advance(duration);
  assert.ok(Math.abs(h.progressValues.at(-1) - 0.8) < 0.001);
  const returnDuration = h.route.moveTo(1);
  h.advance(returnDuration / 2);
  assert.ok(h.progressValues.at(-1) < 0.8 && h.progressValues.at(-1) > 0.2);
  h.advance(returnDuration);
  assert.ok(Math.abs(h.progressValues.at(-1) - 0.2) < 0.001);
  h.route.reset();
  assert.ok(h.progressValues.at(-1) < 0.001);
  assert.ok(h.progressValues.every((value) => Number.isFinite(value) && value >= 0 && value <= 1));
});

test("caravana: acompanha a direção de ida e volta e se estabiliza na parada", () => {
  const h = harness();
  const duration = h.route.moveTo(4);
  h.advance(duration);
  assert.equal(h.headings.at(-1).facing, 1);
  assert.equal(h.headings.at(-1).lean, 0);
  const backward = h.route.moveTo(1);
  h.advance(backward / 2);
  assert.equal(h.headings.at(-1).facing, -1);
  h.advance(backward);
  assert.equal(h.headings.at(-1).facing, -1);
  assert.equal(h.headings.at(-1).lean, 0);
  assert.ok(h.headings.every(({ lean }) => Number.isFinite(lean) && Math.abs(lean) <= 7));
});

test("caravana: inclinação acompanha a curva e termina nivelada", () => {
  const h = harness(true, {
    getTotalLength: () => 1200,
    getPointAtLength: (distance) => ({ x: distance, y: 350 + Math.sin(distance / 200) * 100 })
  });
  const duration = h.route.moveTo(4);
  h.advance(duration / 3);
  assert.ok(Math.abs(h.headings.at(-1).lean) > 0.1);
  assert.ok(Math.abs(h.headings.at(-1).lean) <= 7);
  h.advance(duration);
  assert.equal(h.headings.at(-1).lean, 0);
});
