// Núcleo: estado, mazo de 78 cartas, rutas y vistas de estudio.
'use strict';

/* ---------- utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const azar = (n) => Math.floor(Math.random() * n);
function barajar(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = azar(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const hoy = () => new Date().toISOString().slice(0, 10);

/* ---------- estado guardado en el dispositivo ---------- */
const CLAVE = 'tarot-jodorowsky-v1';
const S = Object.assign({ lecciones: {}, notas: {}, vistos: {}, diario: [], ejercicios: {}, practica: { ok: 0, total: 0 }, ajustes: { modelo: 'claude-opus-5-5' }, desbloqueo: false }, (() => { try { return JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch { return {}; } })());
function guardar() {
  try { localStorage.setItem(CLAVE, JSON.stringify(S)); return true; }
  catch (e) { alert('No se pudo guardar: el almacenamiento del navegador está lleno. Borra entradas antiguas del diario.'); return false; }
}
const cursoHecho = () => LECCIONES.filter((l) => S.lecciones[l.n]?.ok).length;
const fotoAbierta = () => cursoHecho() === LECCIONES.length || S.desbloqueo;

/* ---------- el mazo ---------- */
const NOMBRES_NUM = ['', 'As', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve', 'Diez'];
const ROMANOS = ['', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'VIIII', 'X'];
const CARTAS = [];
const POR_ID = {};
MAYORES.forEach((m) => CARTAS.push({ ...m, tipo: 'mayor', img: `cartas/${m.id}.jpg`, titulo: (m.rom ? m.rom + ' · ' : '') + m.nombre }));
ORDEN_PALOS.forEach((p) => {
  ['paje', 'reina', 'rey', 'caballero'].forEach((f) => {
    const id = `${p}-${f}`;
    CARTAS.push({ id, tipo: 'menor', palo: p, figura: f, n: null, nombre: `${FIGURAS[f].nombre} de ${PALOS[p].nombre}`, img: `cartas/${id}.jpg` });
  });
  for (let n = 1; n <= 10; n++) {
    const id = `${p}-${String(n).padStart(2, '0')}`;
    CARTAS.push({ id, tipo: 'menor', palo: p, n, nombre: `${NOMBRES_NUM[n]} de ${PALOS[p].nombre}`, img: MENORES_SIN_IMAGEN.includes(id) ? null : `cartas/${id}.jpg` });
  }
});
CARTAS.forEach((c) => { POR_ID[c.id] = c; if (!c.titulo) c.titulo = c.nombre; });
const mayor = (n) => POR_ID['m' + String(n).padStart(2, '0')];
const rutaCarta = (c) => (c.tipo === 'mayor' ? `#/carta/${c.id}` : `#/menor/${c.id}`);

// Esquema dibujado para las menores que faltan en el escaneo histórico
function svgMenor(c) {
  const col = PALOS[c.palo].color, n = c.n;
  const pos = [];
  const cols = n <= 3 ? 1 : 2, filas = Math.ceil(n / cols);
  for (let i = 0; i < n; i++) {
    const fila = Math.floor(i / cols), col_ = i % cols;
    const enFila = Math.min(cols, n - fila * cols);
    const x = enFila === 1 ? 50 : 32 + col_ * 36;
    const y = 30 + (fila + .5) * (126 / filas);
    pos.push([x, y]);
  }
  const fig = c.palo === 'oros'
    ? pos.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="#e9c24a" stroke="#8a6a1a" stroke-width="2"/><circle cx="${x}" cy="${y}" r="3" fill="#c0392b"/>`).join('')
    : pos.map(([x, y], i) => `<path d="M${x - 14} ${y + 10} Q ${x} ${y - 22} ${x + 14} ${y + 10}" fill="none" stroke="${i % 2 ? '#2c5aa0' : '#c0392b'}" stroke-width="3"/>`).join('');
  return `<svg class="svgc" viewBox="0 0 100 186" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(c.nombre)} (esquema)">
    <rect x="1" y="1" width="98" height="184" rx="6" fill="#f2e6c9" stroke="#3a2a18" stroke-width="2"/>
    <rect x="6" y="6" width="88" height="174" rx="3" fill="none" stroke="#3a2a18" stroke-width="1"/>
    <text x="9" y="100" font-size="9" font-family="Georgia" fill="#3a2a18" transform="rotate(-90 9 100)" text-anchor="middle">${ROMANOS[n]}</text>
    <text x="91" y="100" font-size="9" font-family="Georgia" fill="#3a2a18" transform="rotate(90 91 100)" text-anchor="middle">${ROMANOS[n]}</text>
    ${fig}
    <text x="50" y="176" font-size="7" font-family="Georgia" fill="#6b5a45" text-anchor="middle">esquema · falta en el mazo de 1760</text>
  </svg>`;
}
function imgCarta(c, cls = '') {
  return c.img ? `<img src="${c.img}" alt="${esc(c.titulo)}" class="${cls}" loading="lazy">` : svgMenor(c).replace('class="svgc"', `class="svgc ${cls}"`);
}
function miniCarta(c, etiqueta = true) {
  return `<a class="carta-mini" href="${rutaCarta(c)}">${imgCarta(c)}${etiqueta ? `<span>${esc(c.tipo === 'mayor' ? (c.rom || '0') + ' ' + c.nombre.replace(/^(El|La) /, '') : c.nombre)}</span>` : ''}</a>`;
}

/* ---------- numerología de cada carta ---------- */
function numeroDeMayor(c) {
  if (c.n === 0) return { titulo: 'El cero', texto: 'Energía sin definición, fuera de la serie. Puede ir al principio, al final o en medio.' };
  if (c.n <= 10) return { titulo: `${c.n} · ${NUMEROS[c.n].nombre}`, texto: NUMEROS[c.n].texto + ' (Serie de arriba, I-X: la relación con el mundo, lo exterior.)' };
  if (c.n <= 20) { const b = c.n - 10; return { titulo: `${c.n} → ${b} · ${NUMEROS[b].nombre}`, texto: NUMEROS[b].texto + ' (Serie de abajo, XI-XX: lo que pasa en el interior, en el inconsciente.)' }; }
  return { titulo: '21 · La totalidad', texto: '21 = 3 × 7: la realización. El Mat va al Mundo y el Mundo al Mat.' };
}
function sentidoMenor(c) {
  const p = PALOS[c.palo];
  if (c.figura) {
    const f = FIGURAS[c.figura];
    return { corto: `${f.nombre} (nivel ${f.nivel.join('-')}) en ${p.centro}`, texto: `${f.texto} Su terreno: ${p.centro} (${p.lenguaje}).` };
  }
  const k = NUMEROS[c.n];
  return { corto: `${k.verbo} en ${p.centro}`, texto: `${k.nombre} en ${p.centro} (${p.lenguaje}). ${k.texto}` };
}
function pareja(c) { if (c.tipo !== 'mayor' || c.n === 0 || c.n === 21) return null; return c.n <= 10 ? mayor(c.n + 10) : mayor(c.n - 10); }
function textoPareja(c) { const k = c.n <= 10 ? c.n : c.n - 10; return PAREJAS_NUM[k]; }
const parecidos = (c) => (c.tipo === 'mayor' ? PARECIDOS.filter((p) => p.ids.includes(c.n)) : []);
const MIRADA = { izquierda: '← mira a la izquierda', derecha: 'mira a la derecha →', frente: '↓ mira de frente' };

/* ---------- carta del día (igual para todo el día) ---------- */
function cartaDelDia() {
  const d = hoy().replace(/-/g, '');
  let h = 0; for (const ch of d) h = (h * 31 + ch.charCodeAt(0)) % 9973;
  return MAYORES[h % 22] && mayor(MAYORES[h % 22].n);
}

/* ---------- modal ---------- */
function abrirModal(html) { const m = $('#modal'); m.innerHTML = `<div class="caja">${html}</div>`; m.hidden = false; }
function cerrarModal() { const m = $('#modal'); m.hidden = true; m.innerHTML = ''; }
document.addEventListener('click', (e) => {
  if (e.target.id === 'modal') cerrarModal();
  if (e.target.closest('[data-cerrar]')) cerrarModal();
  const z = e.target.closest('[data-zoom]');
  if (z) { const m = $('#modal'); m.innerHTML = `<img class="zoom" src="${z.dataset.zoom}" alt="">`; m.hidden = false; }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarModal(); });

/* ---------- rutas ---------- */
const RUTAS = [];
function ruta(patron, fn) { RUTAS.push([patron, fn]); }
function render() {
  const h = location.hash.replace(/^#\/?/, '') || 'inicio';
  const sec = h.split('/')[0];
  $$('[data-sec]').forEach((a) => a.classList.toggle('activo', a.dataset.sec === sec || (sec === 'carta' || sec === 'menor') && a.dataset.sec === 'cartas' || sec === 'leccion' && a.dataset.sec === 'curso'));
  for (const [p, fn] of RUTAS) {
    const m = h.match(p);
    if (m) { const v = $('#vista'); v.innerHTML = ''; fn(v, ...m.slice(1)); window.scrollTo(0, 0); return; }
  }
  location.hash = '#/inicio';
}
window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', () => setTimeout(render));

/* ---------- INICIO ---------- */
ruta(/^inicio$/, (v) => {
  const cd = cartaDelDia(), hechas = cursoHecho();
  v.innerHTML = `
    <h1>Aprender el Tarot de Marsella</h1>
    <p class="suave">Según el curso de Alejandro Jodorowsky. Un espejo para conocerte, no una máquina de adivinar.</p>
    <div class="panel">
      <div class="fila" style="align-items:flex-start;flex-wrap:nowrap">
        <a href="${rutaCarta(cd)}" style="width:90px;flex:none;display:block">${imgCarta(cd)}</a>
        <div>
          <h3 style="margin-top:0">Carta del día: ${esc(cd.titulo)}</h3>
          <p>${esc(cd.esencia)}</p>
          <p class="suave">Llévala hoy contigo (en el bolsillo o en la pantalla). Esta noche, mírala de nuevo y busca un detalle nuevo.</p>
          <a class="boton peq" href="${rutaCarta(cd)}">Ver la carta</a> <a class="boton peq sec" style="color:var(--tinta);border-color:#b9a77f" href="#/ejercicios">Ejercicios de hoy</a>
        </div>
      </div>
    </div>
    <div class="panel oscuro">
      <div class="fila entre"><b>Tu curso</b><span>${hechas} / ${LECCIONES.length} clases</span></div>
      <div class="progreso"><i style="width:${(hechas / LECCIONES.length) * 100}%"></i></div>
      <a class="boton peq" href="#/curso">${hechas ? 'Continuar' : 'Empezar'} el curso</a>
    </div>
    <div class="cuadricula">
      <a class="tarjeta" href="#/curso"><h3>❦ Curso</h3><p>Las 10 clases de Jodorowsky, resumidas, con preguntas para fijar lo aprendido.</p></a>
      <a class="tarjeta" href="#/cartas"><h3>❖ Las 78 cartas</h3><p>Cada arcano con sus detalles para mirar, sus parejas y tus notas.</p></a>
      <a class="tarjeta" href="#/numeros"><h3>Ⅳ Números</h3><p>La escalera del doble cuadrado: del 1 al 10, los palos y las figuras.</p></a>
      <a class="tarjeta" href="#/estructura"><h3>✷ El mandala de los 22</h3><p>El Mat, el Mundo y las dos filas de 10 que se responden.</p></a>
      <a class="tarjeta" href="#/practica"><h3>◇ Práctica</h3><p>Memoriza nombres, números, parejas e imágenes jugando.</p></a>
      <a class="tarjeta" href="#/ejercicios"><h3>✎ Ejercicios</h3><p>Llevar la carta, dibujarla, meterse en ella, salirse del marco…</p></a>
      <a class="tarjeta" href="#/tirar"><h3>✦ Tirar las cartas</h3><p>3 cartas, 3 números, dos mazos, carta cruzada, dos series… con lectura guiada.</p></a>
      <a class="tarjeta ${fotoAbierta() ? '' : 'bloq'}" href="#/foto"><h3>◉ Foto de la mesa ${fotoAbierta() ? '' : '🔒'}</h3><p>${fotoAbierta() ? 'Fotografía tu tirada y te ayudo a interpretarla.' : 'Se abre cuando termines el curso.'}</p></a>
      <a class="tarjeta" href="#/diario"><h3>☾ Diario</h3><p>Tus lecturas guardadas (${S.diario.length}).</p></a>
    </div>
    <div class="panel oscuro">
      <h3 style="margin-top:0">Lo esencial del método</h3>
      <ul class="lista">${ETICA.slice(0, 5).map((e) => `<li>${esc(e)}</li>`).join('')}</ul>
      <p class="cita">"El tarot no evoluciona: evolucionas tú."</p>
    </div>`;
});

/* ---------- CURSO ---------- */
ruta(/^curso$/, (v) => {
  v.innerHTML = `<h1>El curso</h1>
    <p class="suave">Diez clases de Jodorowsky en video, resumidas a partir de mis notas. Mira la clase, lee lo esencial, haz la práctica y responde las preguntas (3 de 4 para aprobar). Al terminar las 10 se abre el modo <b>Foto de la mesa</b>.</p>
    <div class="progreso"><i style="width:${(cursoHecho() / LECCIONES.length) * 100}%"></i></div>
    <div class="cuadricula">${LECCIONES.map((l) => `
      <a class="tarjeta" href="#/leccion/${l.n}"><h3>${S.lecciones[l.n]?.ok ? '✓ ' : ''}Clase ${l.n}</h3><p>${esc(l.titulo)}</p></a>`).join('')}
    </div>`;
});
ruta(/^leccion\/(\d+)$/, (v, num) => {
  const l = LECCIONES.find((x) => x.n === +num);
  if (!l) return (location.hash = '#/curso');
  const st = S.lecciones[l.n];
  v.innerHTML = `
    <p><a href="#/curso">← Curso</a></p>
    <h1>Clase ${l.n}: ${esc(l.titulo)}</h1>
    <div class="fila">
      <a class="boton" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=${l.video}&list=${VIDEO_PLAYLIST}">▶ Ver la clase en YouTube</a>
      <button class="sec" id="incrustar">Ver aquí</button>
      ${st?.ok ? '<span class="ok-msg">✓ Aprobada</span>' : ''}
    </div>
    <div id="video"></div>
    <div class="panel"><h2>Lo esencial</h2><ul class="lista">${l.puntos.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div>
    <div class="panel oscuro"><h3 style="margin-top:0">Práctica: ${esc(l.practica.t)}</h3><p>${esc(l.practica.d)}</p><a class="boton peq" href="${l.practica.ruta}">Ir</a></div>
    <div class="panel" id="quiz"><h2>Preguntas</h2>
      ${l.quiz.map((q, i) => `<div class="preg" data-i="${i}"><p><b>${i + 1}. ${esc(q.p)}</b></p>
        ${q.o.map((o, j) => `<button class="opcion" data-j="${j}">${esc(o)}</button>`).join('')}<p class="suave expl"></p></div>`).join('')}
      <p id="resultado"></p>
    </div>
    <div class="fila entre">
      ${l.n > 1 ? `<a class="boton sec" href="#/leccion/${l.n - 1}">← Clase ${l.n - 1}</a>` : '<span></span>'}
      ${l.n < LECCIONES.length ? `<a class="boton sec" href="#/leccion/${l.n + 1}">Clase ${l.n + 1} →</a>` : '<a class="boton" href="#/foto">Foto de la mesa →</a>'}
    </div>`;
  $('#incrustar').onclick = () => {
    $('#video').innerHTML = `<div style="position:relative;padding-top:56.25%;margin:.8rem 0"><iframe style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:10px" src="https://www.youtube-nocookie.com/embed/${l.video}" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`;
  };
  const resp = {};
  $$('.preg', v).forEach((div) => {
    const i = +div.dataset.i, q = l.quiz[i];
    $$('.opcion', div).forEach((b) => (b.onclick = () => {
      if (i in resp) return;
      const j = +b.dataset.j; resp[i] = j === q.ok;
      b.classList.add(j === q.ok ? 'bien' : 'mal');
      $$('.opcion', div)[q.ok].classList.add('bien');
      $('.expl', div).textContent = (j === q.ok ? '¡Bien! ' : 'No exactamente. ') + (q.e || '');
      if (Object.keys(resp).length === l.quiz.length) {
        const ok = Object.values(resp).filter(Boolean).length, aprobado = ok >= l.quiz.length - 1;
        if (aprobado) { S.lecciones[l.n] = { ok: true, nota: ok, fecha: hoy() }; guardar(); }
        $('#resultado').innerHTML = aprobado
          ? `<b class="ok-msg" style="color:var(--verde)">✓ ${ok}/${l.quiz.length}: clase aprobada.</b> ${cursoHecho() === LECCIONES.length ? '¡Terminaste el curso! El modo <a href="#/foto">Foto de la mesa</a> ya está abierto.' : ''}`
          : `<b style="color:var(--rojo)">${ok}/${l.quiz.length}.</b> Repasa lo esencial y vuelve a intentarlo. <button class="peq" onclick="render()">Repetir</button>`;
      }
    }));
  });
});

/* ---------- CARTAS ---------- */
ruta(/^cartas(?:\/(\w+))?$/, (v, grupo = 'mayores') => {
  const grupos = { mayores: 'Arcanos Mayores', oros: 'Oros', bastos: 'Bastos', copas: 'Copas', espadas: 'Espadas' };
  const lista = grupo === 'mayores' ? CARTAS.filter((c) => c.tipo === 'mayor') : CARTAS.filter((c) => c.palo === grupo).sort((a, b) => (a.n ?? 10 + FIGURAS[a.figura].orden) - (b.n ?? 10 + FIGURAS[b.figura].orden));
  v.innerHTML = `<h1>Las cartas</h1>
    <div class="pestanas">${Object.entries(grupos).map(([k, t]) => `<button class="${k === grupo ? 'on' : ''}" onclick="location.hash='#/cartas/${k}'">${t}</button>`).join('')}</div>
    ${grupo === 'mayores' ? '<p class="suave">Empieza por aquí: Jodorowsky enseña primero los 22 Mayores. Aprende nombre y número de cada uno.</p>'
      : `<div class="panel oscuro"><b>${PALOS[grupo].nombre}: ${PALOS[grupo].centro}</b> (${PALOS[grupo].tipo}). ${esc(PALOS[grupo].texto)}</div>`}
    <div class="mazo">${lista.map((c) => miniCarta(c)).join('')}</div>
    <p class="suave" style="font-size:.85rem">Imágenes: Tarot de Nicolas Conver, Marsella 1760 (Bibliothèque nationale de France, dominio público). Las cartas que faltan en ese ejemplar se muestran en esquema.</p>`;
});

ruta(/^carta\/(m\d\d)$/, (v, id) => {
  const c = POR_ID[id]; if (!c) return (location.hash = '#/cartas');
  const vis = S.vistos[id] || {}, pj = pareja(c), num = numeroDeMayor(c);
  const ant = c.n > 0 ? mayor(c.n - 1) : mayor(21), sig = c.n < 21 ? mayor(c.n + 1) : mayor(0);
  v.innerHTML = `
    <div class="fila entre"><a href="#/cartas">← Las cartas</a><span><a href="#/carta/${ant.id}">‹ ${esc(ant.nombre)}</a> · <a href="#/carta/${sig.id}">${esc(sig.nombre)} ›</a></span></div>
    <div class="ficha">
      <div>${imgCarta(c, 'img-grande').replace('<img ', `<img data-zoom="${c.img}" `)}
        <p class="centro suave" style="font-size:.85rem">Toca la imagen para ampliarla</p></div>
      <div>
        <h1>${c.rom ? c.rom + ' · ' : ''}${esc(c.nombre)}</h1>
        <p class="suave">${esc(c.fr)}${c.alt ? ' · ' + esc(c.alt) : ''} ${c.mira ? '· ' + MIRADA[c.mira] : ''}</p>
        <p class="cita">${esc(c.esencia)}</p>
        <p>${c.claves.map((k, i) => `<span class="chip ${['r', 'a', 'am', 'v'][i % 4]}">${esc(k)}</span>`).join('')}</p>
        <div class="panel"><h3>Número: ${esc(num.titulo)}</h3><p>${esc(num.texto)}</p></div>
      </div>
    </div>
    <div class="panel"><h2>Detalles para mirar</h2>
      <p class="suave">Búscalos en la imagen y márcalos cuando los veas. "La conciencia se desarrolla con el ver".</p>
      ${c.detalles.map((d, i) => `<label class="detalle-item"><input type="checkbox" data-i="${i}" ${vis[i] ? 'checked' : ''}><span>${esc(d)}</span></label>`).join('')}
    </div>
    <div class="panel"><h3>Luz</h3><p>${esc(c.luz)}</p><h3>Sombra</h3><p>${esc(c.sombra)}</p>
      <p class="suave">Toda carta es positiva y negativa a la vez: depende de ti.</p>
      <h3>Lo que la carta te pregunta</h3><ul class="lista">${c.preguntas.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
      <p><b>Nota de Jodorowsky:</b> ${esc(c.nota)}</p></div>
    ${pj ? `<div class="panel"><h2>Su pareja numérica</h2><div class="fila" style="flex-wrap:nowrap;align-items:flex-start">
      <div style="width:80px;flex:none">${miniCarta(pj)}</div><p>${esc(textoPareja(c))}</p></div></div>` : ''}
    ${parecidos(c).length ? `<div class="panel"><h2>Se parece a…</h2>${parecidos(c).map((p) => `
      <div class="fila" style="flex-wrap:nowrap;align-items:flex-start;margin:.6em 0">
        ${p.ids.filter((n) => n !== c.n).map((n) => `<div style="width:70px;flex:none">${miniCarta(mayor(n))}</div>`).join('')}
        <p>${esc(p.texto)}</p></div>`).join('')}</div>` : ''}
    <div class="panel"><h2>Mis notas y mi poema</h2>
      <textarea id="nota" placeholder="Lo que ves, lo que sientes, tu poema a esta carta…">${esc(S.notas[id] || '')}</textarea>
      <p class="suave" id="guardado"></p></div>`;
  $$('.detalle-item input', v).forEach((i) => (i.onchange = () => { (S.vistos[id] ||= {})[i.dataset.i] = i.checked; guardar(); }));
  let t; $('#nota').oninput = (e) => { clearTimeout(t); t = setTimeout(() => { S.notas[id] = e.target.value; guardar(); $('#guardado').textContent = 'Guardado en este dispositivo.'; }, 500); };
});

ruta(/^menor\/([a-z]+-[a-z0-9]+)$/, (v, id) => {
  const c = POR_ID[id]; if (!c || c.tipo !== 'menor') return (location.hash = '#/cartas');
  const p = PALOS[c.palo], s = sentidoMenor(c);
  const mismos = c.n ? [mayor(c.n), c.n < 10 ? mayor(c.n + 10) : mayor(20)] : FIGURAS[c.figura].nivel.map((k) => mayor(k));
  v.innerHTML = `
    <p><a href="#/cartas/${c.palo}">← ${p.nombre}</a></p>
    <div class="ficha">
      <div>${c.img ? `<img class="img-grande" src="${c.img}" data-zoom="${c.img}" alt="${esc(c.nombre)}">` : svgMenor(c)}</div>
      <div>
        <h1>${esc(c.nombre)}</h1>
        <p class="cita">${esc(s.corto.charAt(0).toUpperCase() + s.corto.slice(1))}.</p>
        <div class="panel"><h3>Cómo leerla</h3><p>${esc(s.texto)}</p>
          ${NOTAS_MENORES[id] ? `<p><b>Jodorowsky:</b> ${esc(NOTAS_MENORES[id])}</p>` : ''}</div>
        <div class="panel"><h3>${p.nombre}: ${p.centro}</h3><p>${esc(p.texto)}</p>
          <p class="suave">Palo ${p.tipo}. Pregunta: ¿en qué nivel del ser actúa esto? Aquí: ${p.lenguaje}.</p></div>
      </div>
    </div>
    <div class="panel"><h3>Mayores del mismo número</h3><div class="fila">${mismos.map((m) => `<div style="width:80px">${miniCarta(m)}</div>`).join('')}</div>
      <p class="suave">Jodorowsky lee los números de los Menores con la misma escalera que los Mayores. <a href="#/numeros">Ver la escalera</a></p></div>
    <p class="suave" style="font-size:.9rem">Recuerda: para leer a una persona Jodorowsky usa sobre todo los Mayores; los Menores sirven para ver en qué grado de desarrollo está alguien en cada centro.</p>`;
});

/* ---------- NÚMEROS ---------- */
ruta(/^numeros$/, (v) => {
  let sel = 1;
  v.innerHTML = `<h1>La escalera de los números</h1>
    <p class="suave">El "doble cuadrado" de la clase 9. El 1 es el marco; dentro hay cuatro escalones de dos números (receptivo en azul, activo en rojo) y el 10 cierra el ciclo. Toca un número.</p>
    <div class="escalera">
      <button class="num marco1" data-n="1"><b>1</b> marco · potencial</button>
      <div class="cab">receptivos (pares)</div><div class="cab">activos (impares)</div>
      ${[2, 4, 6, 8].map((n) => `<button class="num rec" data-n="${n}"><b>${n}</b><small>${esc(NUMEROS[n].nombre)}</small></button><button class="num act" data-n="${n + 1}"><b>${n + 1}</b><small>${esc(NUMEROS[n + 1].nombre)}</small></button>`).join('')}
      <button class="num diez" data-n="10"><b>10</b><small>${esc(NUMEROS[10].nombre)}</small></button>
    </div>
    <div id="detalle-num"></div>
    <div class="panel"><h2>Los cuatro palos (los 4 centros)</h2>
      ${ORDEN_PALOS.map((k) => `<p><b style="color:${PALOS[k].color}">${PALOS[k].nombre}</b> · ${PALOS[k].centro} · ${PALOS[k].lenguaje} · ${PALOS[k].tipo}. ${esc(PALOS[k].texto)}</p>`).join('')}
      <p class="suave">Orden de la rueda: Oros → Bastos → Copas → Espadas. Nace la materia y sube hacia el sexo, el corazón y el intelecto.</p></div>
    <div class="panel"><h2>Las figuras</h2>
      ${Object.values(FIGURAS).map((f) => `<p><b>${f.nombre} = ${f.nivel.join('-')}</b>: ${esc(f.texto)}</p>`).join('')}
      <p class="suave">Orden: Paje → Reina → Rey → Caballero. El Caballero sale del palacio y salta al palo siguiente.</p></div>
    <div class="panel oscuro"><h3 style="margin-top:0">Para practicar</h3><p>Haz la tirada <a href="#/tirar/escalera">escalera de menores</a>: saca cartas numerales y mira en qué escalón y en qué centro cae cada una. Si alguien "pone un 8 en el 2" es un ambicioso que salta escalones; "un 2 en el 8", un acomplejado.</p></div>`;
  const pinta = () => {
    $$('.escalera .num', v).forEach((b) => b.classList.toggle('on', +b.dataset.n === sel));
    const k = NUMEROS[sel];
    const mays = sel === 10 ? [mayor(10), mayor(20)] : sel === 1 ? [mayor(1), mayor(11)] : [mayor(sel), mayor(sel + 10)];
    const fig = Object.entries(FIGURAS).find(([, f]) => f.nivel.includes(sel));
    $('#detalle-num').innerHTML = `<div class="panel"><h2>${sel} · ${esc(k.nombre)} <span class="chip ${k.tipo === 'activo' ? 'r' : k.tipo === 'receptivo' ? 'a' : 'am'}">${k.tipo}</span></h2>
      <p>${esc(k.texto)}</p>
      <h3>En los Mayores</h3><div class="fila">${mays.map((m) => `<div style="width:76px">${miniCarta(m)}</div>`).join('')}</div>
      <h3>En los Menores</h3><div class="fila">${ORDEN_PALOS.map((p) => `<div style="width:66px">${miniCarta(POR_ID[`${p}-${String(sel).padStart(2, '0')}`], false)}</div>`).join('')}</div>
      <p>${ORDEN_PALOS.map((p) => `<b style="color:${PALOS[p].color}">${PALOS[p].nombre}</b>: ${esc(k.corto)} en ${PALOS[p].centro}`).join(' · ')}</p>
      ${fig ? `<p class="suave">Figura de este escalón: <b>${FIGURAS[fig[0]].nombre}</b> (${FIGURAS[fig[0]].nivel.join('-')}).</p>` : ''}</div>`;
  };
  $$('.escalera .num', v).forEach((b) => (b.onclick = () => { sel = +b.dataset.n; pinta(); }));
  pinta();
});

/* ---------- ESTRUCTURA ---------- */
ruta(/^estructura$/, (v) => {
  v.innerHTML = `<h1>El mandala de los 22</h1>
    <p class="suave">La disposición de la clase 10: el Mat al comienzo, el Mundo al final y en medio dos filas de 10. Cada carta de arriba forma pareja con la de abajo, "como los dedos de las manos y de los pies: no son contradictorios, son complementarios". Toca una columna.</p>
    <div class="extremos"><a href="#/carta/m00">${imgCarta(mayor(0))}</a><a href="#/carta/m21">${imgCarta(mayor(21))}</a></div>
    <div class="estructura" id="est">${[1, 11].map((ini) => Array.from({ length: 10 }, (_, i) => `<a href="javascript:void 0" data-k="${i + 1}">${imgCarta(mayor(ini + i))}</a>`).join('')).join('')}</div>
    <div id="par"></div>
    <div class="panel"><h3>Mat → Mundo</h3><p>El Mat es la energía primera, musical, alegre: lleva todas las cartas en su saco y tú lo vas siguiendo. El Mundo es el alma con los cuatro centros. "Tienes 21 años: estás en el Mat que va al Mundo".</p></div>`;
  const mostrar = (k) => {
    $$('#est a').forEach((a) => a.classList.toggle('on', +a.dataset.k === k));
    const a = mayor(k), b = mayor(k + 10);
    $('#par').innerHTML = `<div class="panel"><h2>${a.rom} ${esc(a.nombre)} ↔ ${b.rom} ${esc(b.nombre)}</h2>
      <div class="fila" style="flex-wrap:nowrap;align-items:flex-start"><div style="width:70px;flex:none">${miniCarta(a, false)}</div><div style="width:70px;flex:none">${miniCarta(b, false)}</div><p>${esc(PAREJAS_NUM[k])}</p></div></div>`;
  };
  $$('#est a').forEach((a) => (a.onclick = () => mostrar(+a.dataset.k)));
  mostrar(1);
});

/* ---------- PRÁCTICA ---------- */
ruta(/^practica$/, (v) => {
  const modos = {
    nombre: 'Imagen → nombre', imagen: 'Nombre → imagen', numero: 'Nombre → número',
    parejas: 'Parejas n ↔ n+10', sentido: 'Número → sentido', menores: 'Menor → centro'
  };
  let modo = 'nombre', racha = 0;
  v.innerHTML = `<h1>Práctica de memoria</h1>
    <p class="suave">"Si no lo memorizo completamente, nunca voy a hacer el tarot". Aciertos totales: <b id="tot">${S.practica.ok}/${S.practica.total}</b> · racha: <b id="racha">0</b></p>
    <div class="pestanas">${Object.entries(modos).map(([k, t]) => `<button data-m="${k}" class="${k === modo ? 'on' : ''}">${t}</button>`).join('')}</div>
    <div class="panel flash" id="juego"></div>`;
  $$('.pestanas button', v).forEach((b) => (b.onclick = () => { modo = b.dataset.m; $$('.pestanas button', v).forEach((x) => x.classList.toggle('on', x === b)); nueva(); }));
  const opcionesDe = (correcta, universo, n = 4) => barajar([correcta, ...barajar(universo.filter((x) => x !== correcta)).slice(0, n - 1)]);
  function responder(ok, botones, idxOk, expl) {
    botones.forEach((b, i) => { b.disabled = true; if (i === idxOk) b.classList.add('bien'); });
    S.practica.total++; if (ok) S.practica.ok++; guardar();
    racha = ok ? racha + 1 : 0;
    $('#tot').textContent = `${S.practica.ok}/${S.practica.total}`; $('#racha').textContent = racha;
    $('#juego').insertAdjacentHTML('beforeend', `<p>${ok ? '<b style="color:var(--verde)">¡Bien!</b>' : '<b style="color:var(--rojo)">No.</b>'} ${expl || ''}</p><button id="otra">Otra →</button>`);
    $('#otra').onclick = nueva; $('#otra').focus();
  }
  function nueva() {
    const j = $('#juego'), mays = CARTAS.filter((c) => c.tipo === 'mayor');
    if (modo === 'nombre' || modo === 'numero') {
      const c = mays[azar(22)];
      const ops = modo === 'nombre' ? opcionesDe(c, mays) : opcionesDe(c, mays);
      j.innerHTML = modo === 'nombre'
        ? `<img src="${c.img}" alt="carta a adivinar"><p class="centro"><b>¿Qué carta es?</b></p>${ops.map((o) => `<button class="opcion">${esc(o.nombre)}</button>`).join('')}`
        : `<p class="centro" style="font-size:1.4rem;font-family:var(--serif)">${esc(c.nombre)}</p><p class="centro"><b>¿Qué número tiene?</b></p>${ops.map((o) => `<button class="opcion">${o.rom || 'sin número (el cero)'}</button>`).join('')}`;
      const bs = $$('.opcion', j), iok = ops.indexOf(c);
      bs.forEach((b, i) => (b.onclick = () => { b.classList.add(i === iok ? 'bien' : 'mal'); responder(i === iok, bs, iok, `${c.rom || '0'} · ${esc(c.nombre)}: ${esc(c.esencia)}`); }));
    } else if (modo === 'imagen') {
      const c = mays[azar(22)], ops = opcionesDe(c, mays);
      j.innerHTML = `<p class="centro" style="font-size:1.4rem;font-family:var(--serif)">${esc(c.nombre)}</p><p class="centro"><b>Toca su imagen</b></p><div class="opciones-img">${ops.map((o) => `<button><img src="${o.img}" alt="opción"></button>`).join('')}</div>`;
      const bs = $$('.opciones-img button', j), iok = ops.indexOf(c);
      bs.forEach((b, i) => (b.onclick = () => { b.classList.add(i === iok ? 'bien' : 'mal'); responder(i === iok, bs, iok, esc(c.detalles[0])); }));
    } else if (modo === 'parejas') {
      const k = 1 + azar(10), arriba = Math.random() < .5, c = mayor(arriba ? k : k + 10), pj = pareja(c);
      const ops = opcionesDe(pj, mays.filter((x) => x.n !== c.n));
      j.innerHTML = `<img src="${c.img}" alt=""><p class="centro"><b>¿Cuál es la pareja de ${esc(c.titulo)}?</b></p><div class="opciones-img">${ops.map((o) => `<button><img src="${o.img}" alt="opción"></button>`).join('')}</div>`;
      const bs = $$('.opciones-img button', j), iok = ops.indexOf(pj);
      bs.forEach((b, i) => (b.onclick = () => { b.classList.add(i === iok ? 'bien' : 'mal'); responder(i === iok, bs, iok, `${esc(pj.titulo)}. ${esc(PAREJAS_NUM[k])}`); }));
    } else if (modo === 'sentido') {
      const n = 1 + azar(10), ops = opcionesDe(n, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      j.innerHTML = `<p class="centro" style="font-size:3rem;font-family:var(--serif);margin:.2em">${n}</p><p class="centro"><b>¿Qué significa?</b></p>${ops.map((o) => `<button class="opcion">${esc(NUMEROS[o].nombre)}</button>`).join('')}`;
      const bs = $$('.opcion', j), iok = ops.indexOf(n);
      bs.forEach((b, i) => (b.onclick = () => { b.classList.add(i === iok ? 'bien' : 'mal'); responder(i === iok, bs, iok, esc(NUMEROS[n].texto)); }));
    } else {
      const nums = CARTAS.filter((c) => c.tipo === 'menor' && c.n), c = nums[azar(nums.length)];
      const ops = barajar(ORDEN_PALOS);
      j.innerHTML = `${c.img ? `<img src="${c.img}" alt="">` : `<div style="width:160px;margin:auto">${svgMenor(c)}</div>`}<p class="centro"><b>¿De qué centro habla esta carta?</b></p>${ops.map((p) => `<button class="opcion">${esc(PALOS[p].centro)} (${PALOS[p].lenguaje})</button>`).join('')}`;
      const bs = $$('.opcion', j), iok = ops.indexOf(c.palo);
      bs.forEach((b, i) => (b.onclick = () => { b.classList.add(i === iok ? 'bien' : 'mal'); responder(i === iok, bs, iok, `${esc(c.nombre)}: ${esc(sentidoMenor(c).corto)}.`); }));
    }
  }
  nueva();
});

/* ---------- EJERCICIOS ---------- */
ruta(/^ejercicios$/, (v) => {
  const cd = cartaDelDia(), reg = (S.ejercicios[hoy()] ||= {});
  v.innerHTML = `<h1>Ejercicios</h1>
    <p class="suave">Lo que hacía Jodorowsky para que el tarot entrara en su inconsciente. Marca lo que hagas hoy.</p>
    <div class="panel"><div class="fila" style="flex-wrap:nowrap;align-items:flex-start">
      <div style="width:80px;flex:none">${miniCarta(cd, false)}</div>
      <div><h3 style="margin-top:0">Carta de hoy: ${esc(cd.titulo)}</h3><p class="suave">Úsala para los ejercicios de hoy.</p></div></div></div>
    ${EJERCICIOS.map((e) => `<div class="panel"><label class="detalle-item" style="margin:0;color:var(--tinta)"><input type="checkbox" data-e="${e.id}" ${reg[e.id] ? 'checked' : ''}><span><b>${esc(e.t)}</b><br>${esc(e.d)}</span></label></div>`).join('')}
    <div class="panel"><h3>Notas de hoy</h3><textarea id="notahoy" placeholder="Sueños, detalles descubiertos, preguntas…">${esc(reg.nota || '')}</textarea></div>
    <p class="suave">Días con ejercicios: ${Object.keys(S.ejercicios).filter((d) => Object.values(S.ejercicios[d]).some((x) => x === true)).length}</p>`;
  $$('[data-e]', v).forEach((i) => (i.onchange = () => { reg[i.dataset.e] = i.checked; guardar(); }));
  let t; $('#notahoy').oninput = (e) => { clearTimeout(t); t = setTimeout(() => { reg.nota = e.target.value; guardar(); }, 500); };
});

/* ---------- DIARIO ---------- */
function guardarEnDiario(entrada) {
  S.diario.unshift({ id: Date.now(), fecha: new Date().toLocaleString('es'), ...entrada });
  if (!guardar()) { S.diario.shift(); return false; }
  return true;
}
ruta(/^diario$/, (v) => {
  v.innerHTML = `<h1>Diario de lecturas</h1>
    <p class="suave">Se guarda solo en este dispositivo. ${S.diario.length} lecturas.</p>
    ${S.diario.length ? '' : '<div class="panel oscuro">Aún no hay lecturas. <a href="#/tirar">Haz una tirada</a> y guárdala.</div>'}
    ${S.diario.map((d) => `<div class="panel">
      <div class="fila entre"><b>${esc(d.tipo || 'Lectura')}</b><span class="suave">${esc(d.fecha)}</span></div>
      ${d.pregunta ? `<p><i>${esc(d.pregunta)}</i></p>` : ''}
      ${d.foto ? `<img src="${d.foto}" style="max-width:220px;border-radius:8px" data-zoom="${d.foto}" alt="foto de la mesa">` : ''}
      <div class="fila">${(d.cartas || []).map((id) => POR_ID[id] ? `<div style="width:60px">${miniCarta(POR_ID[id], false)}</div>` : '').join('')}</div>
      ${d.frase ? `<p class="cita">${esc(d.frase)}</p>` : ''}
      ${d.ia ? `<details><summary>Lectura de la IA</summary><div class="ia-texto">${esc(d.ia)}</div></details>` : ''}
      <button class="peq sec" style="color:var(--tinta);border-color:#b9a77f" data-borrar="${d.id}">Borrar</button></div>`).join('')}`;
  $$('[data-borrar]', v).forEach((b) => (b.onclick = () => { if (confirm('¿Borrar esta lectura del diario?')) { S.diario = S.diario.filter((d) => d.id !== +b.dataset.borrar); guardar(); render(); } }));
});

/* ---------- AJUSTES ---------- */
ruta(/^ajustes$/, (v) => {
  const a = S.ajustes;
  v.innerHTML = `<h1>Ajustes</h1>
    <div class="panel"><h2>Ayuda de IA para el modo foto (opcional)</h2>
      <p>El modo foto funciona sin IA: tú indicas las cartas y la app te guía. Si quieres que Claude identifique las cartas de la foto y te proponga una lectura al estilo de Jodorowsky, pega aquí <b>tu propia</b> clave de la API de Anthropic (se crea en console.anthropic.com). Se guarda solo en este dispositivo y se envía únicamente a api.anthropic.com. Cada consulta tiene un pequeño costo en tu cuenta.</p>
      <label for="clave">Clave de API</label>
      <input id="clave" type="password" autocomplete="off" placeholder="sk-ant-…" value="${esc(a.clave || '')}">
      <label for="modelo">Modelo</label>
      <select id="modelo">
        <option value="claude-opus-5-5" ${a.modelo === 'claude-opus-5-5' ? 'selected' : ''}>Claude Opus 5.5 (recomendado, el más capaz)</option>
        <option value="claude-sonnet-5-5" ${a.modelo === 'claude-sonnet-5-5' ? 'selected' : ''}>Claude Sonnet 5.5 (más económico)</option>
      </select>
      <p><button id="guardar-ia">Guardar</button> <button class="sec" style="color:var(--tinta);border-color:#b9a77f" id="borrar-ia">Quitar la clave</button> <span id="msg-ia"></span></p></div>
    <div class="panel"><h2>Progreso</h2>
      <p>Clases aprobadas: ${cursoHecho()}/${LECCIONES.length}. Lecturas en el diario: ${S.diario.length}.</p>
      <label class="detalle-item"><input type="checkbox" id="desb" ${S.desbloqueo ? 'checked' : ''}><span>Abrir el modo foto aunque no haya terminado el curso</span></label>
      <p class="fila"><button id="exportar">Exportar mis datos</button>
      <label class="boton sec" style="color:var(--tinta);border-color:#b9a77f;margin:0">Importar<input type="file" id="importar" accept="application/json" hidden></label>
      <button class="sec" style="color:var(--rojo);border-color:var(--rojo)" id="reset">Borrar todo</button></p></div>
    <div class="panel"><h2>Créditos</h2>
      <p>Contenido: resumen personal del curso de tarot de Alejandro Jodorowsky en YouTube (<a target="_blank" rel="noopener" href="https://www.youtube.com/playlist?list=${VIDEO_PLAYLIST}">lista de reproducción</a>). Las ideas son de Jodorowsky; los resúmenes, de estas notas de estudio.</p>
      <p>Imágenes: <i>Jeu de tarot à enseignes italiennes de Marseille, dit "tarot Conver"</i>, Nicolas Conver, 1760. Bibliothèque nationale de France, Gallica (btv1b10520316w), vía Wikimedia Commons. Dominio público. El ejemplar no conserva 12 menores (Oros 3, 4, 6, 7 y Espadas 3-10), que se dibujan en esquema.</p></div>`;
  $('#guardar-ia').onclick = () => { a.clave = $('#clave').value.trim(); a.modelo = $('#modelo').value; guardar(); $('#msg-ia').textContent = 'Guardado.'; };
  $('#borrar-ia').onclick = () => { delete a.clave; $('#clave').value = ''; guardar(); $('#msg-ia').textContent = 'Clave quitada.'; };
  $('#desb').onchange = (e) => { S.desbloqueo = e.target.checked; guardar(); };
  $('#exportar').onclick = () => {
    const copia = JSON.parse(JSON.stringify(S)); delete copia.ajustes.clave;
    const url = URL.createObjectURL(new Blob([JSON.stringify(copia, null, 1)], { type: 'application/json' }));
    const l = document.createElement('a'); l.href = url; l.download = `tarot-datos-${hoy()}.json`; l.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  $('#importar').onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { const d = JSON.parse(await f.text()); const clave = S.ajustes.clave; Object.assign(S, d); S.ajustes.clave = clave; guardar(); alert('Datos importados.'); render(); }
    catch { alert('Ese archivo no es válido.'); }
  };
  $('#reset').onclick = () => { if (confirm('¿Borrar progreso, notas y diario de este dispositivo?')) { localStorage.removeItem(CLAVE); location.reload(); } };
});
