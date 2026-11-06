// Tiradas y lectura guiada según el método de Jodorowsky.
'use strict';

/* ---------- motor de lectura: hace "conversar" las cartas ---------- */
function reducirA22(s) { while (s > 21) s = String(s).split('').reduce((a, b) => a + +b, 0); return s; }
const nombreCorto = (c) => c.nombre;
function sentido(c) { return c.tipo === 'mayor' ? c.esencia : sentidoMenor(c).texto; }
function valorNum(c) { return c.tipo === 'mayor' ? c.n : c.n || null; }

function frasesMirada(cs, i, roles) {
  const c = cs[i], ult = cs.length - 1;
  if (c.tipo !== 'mayor' || !c.mira) return '';
  const prev = cs[i - 1], sig = cs[i + 1];
  let t = '';
  if (c.mira === 'frente') t = `Mira de frente: está en el presente, te mira a ti.`;
  if (c.mira === 'izquierda') t = i === 0 ? 'Mira hacia la izquierda, fuera de la frase: hacia el pasado, hacia lo que deja atrás.'
    : `Mira hacia la izquierda, hacia ${nombreCorto(prev)}.` + (i === ult ? ' Al final de la frase mira todo lo vivido.' : '');
  if (c.mira === 'derecha') t = i === ult ? 'Mira hacia la derecha, fuera de la frase: hacia lo que viene, un porvenir abierto.'
    : `Mira hacia la derecha, hacia ${nombreCorto(sig)}.` + (i === 0 ? ' Al comienzo de la frase tiene todo por delante.' : '');
  if (c.n === 14) {
    const mirada = c.mira === 'derecha' ? sig : c.mira === 'izquierda' ? prev : null;
    if (mirada) t += ` Templanza ilumina a la carta que mira: ${nombreCorto(mirada)} recibe su luz.`;
  }
  return t;
}

function relaciones(cs) {
  const out = [];
  for (let i = 0; i < cs.length - 1; i++) {
    const a = cs[i], b = cs[i + 1];
    if (a.tipo === 'mayor' && b.tipo === 'mayor' && a.mira && b.mira) {
      if (a.mira === 'derecha' && b.mira === 'izquierda') out.push(`<b>${a.nombre}</b> y <b>${b.nombre}</b> se miran: se comunican, se reconocen.`);
      else if (a.mira === 'izquierda' && b.mira === 'derecha') out.push(`<b>${a.nombre}</b> y <b>${b.nombre}</b> se dan la espalda: ¿conflicto, o dos extremos de un mismo bastón? Busca qué carta podría ponerse entre ellas.`);
    }
  }
  const mays = cs.filter((c) => c.tipo === 'mayor');
  for (let i = 0; i < mays.length; i++) for (let j = i + 1; j < mays.length; j++) {
    const a = mays[i], b = mays[j], [lo, hi] = a.n < b.n ? [a, b] : [b, a];
    if (lo.n >= 1 && lo.n <= 10 && hi.n === lo.n + 10) out.push(`<b>${lo.nombre}</b> y <b>${hi.nombre}</b> son pareja numérica (${lo.n} ↔ ${hi.n}): ${PAREJAS_NUM[lo.n]}`);
    const par = PARECIDOS.find((p) => p.ids.includes(a.n) && p.ids.includes(b.n));
    if (par) out.push(`<b>${a.nombre}</b> y <b>${b.nombre}</b> se parecen: ${par.texto}`);
  }
  if (mays.some((c) => c.n === 0) && cs.length > 1) out.push('Está <b>el Mat</b>: refuerza o quita fuerza a la carta que acompaña. Si es un vicio, el vicio devora; si es una virtud, triunfas siendo lo que eres.');
  if (mays.some((c) => c.n === 0) && mays.some((c) => c.n === 1)) out.push('El Mat y el Mago: el Mat le dice "muévete, entra al mundo, no tengas miedo a las críticas". Su bastón y la varita del Mago tienen la misma inclinación.');
  // centros (menores)
  const men = cs.filter((c) => c.tipo === 'menor');
  if (men.length) {
    const cuenta = {}; men.forEach((c) => (cuenta[c.palo] = (cuenta[c.palo] || 0) + 1));
    out.push('Centros presentes: ' + Object.entries(cuenta).map(([p, k]) => `<b style="color:${PALOS[p].color}">${PALOS[p].nombre}</b> (${PALOS[p].centro}) ×${k}`).join(', ') + '. ¿Qué centro falta? ¿Cuál domina?');
  }
  return out;
}

function cartaSuma(cs) {
  const vals = cs.map(valorNum).filter((x) => x !== null);
  if (vals.length < 2) return null;
  const s = vals.reduce((a, b) => a + b, 0);
  if (s === 0) return null;
  const r = reducirA22(s);
  return { suma: s, carta: mayor(r), expr: vals.join(' + ') + ` = ${s}` + (r !== s ? ` → ${r}` : '') };
}

function rolesPara(k, modo) {
  if (modo === 'cruzada') return ['La persona (quien tiene el problema)', 'El problema (cruzado encima)'];
  if (modo === 'series') return ['Pregunta (serie I-X: el mundo, lo exterior)', 'Respuesta (serie XI-XXI: el interior)'];
  if (k === 3) return ['Comienzo de la frase', 'Centro de la frase', 'Final de la frase'];
  return Array.from({ length: k }, (_, i) => `Carta ${i + 1}`);
}

// Devuelve el HTML de la lectura guiada; ids en orden de izquierda a derecha
function lecturaGuiada(ids, { modo = 'frase', pregunta = '', titulo = 'Lectura guiada' } = {}) {
  const cs = ids.map((id) => POR_ID[id]).filter(Boolean);
  const roles = rolesPara(cs.length, modo);
  const rel = relaciones(cs), suma = cartaSuma(cs);
  const cols = ['', 'r', 'a', 'v'];
  return `<div class="panel lectura">
    <h2>${esc(titulo)}</h2>
    ${pregunta ? `<p><b>Pregunta:</b> <i>${esc(pregunta)}</i></p>` : ''}
    <p class="suave">Léela como una frase, de izquierda a derecha. No es "la" respuesta: es una forma de empezar a ver. Lo que más te llame la atención tiene que ver contigo (o con quien consulta).</p>
    ${cs.map((c, i) => `<div class="paso ${cols[i % 4]}">
      <div class="fila" style="flex-wrap:nowrap;align-items:flex-start">
        <div style="width:64px;flex:none">${miniCarta(c, false)}</div>
        <div><span class="suave">${esc(roles[i] || '')}</span>
          <h3 style="margin:.1em 0">${esc(c.titulo)}</h3>
          <p>${esc(sentido(c))}</p>
          ${c.tipo === 'mayor' ? `<p class="suave">${esc(numeroDeMayor(c).titulo)} · luz: ${esc(c.luz)} · sombra: ${esc(c.sombra)}</p>` : ''}
          ${frasesMirada(cs, i, roles) ? `<p>👁 ${esc(frasesMirada(cs, i, roles))}</p>` : ''}
          ${c.tipo === 'mayor' ? `<p><b>Mira:</b> ${esc(c.detalles[azar(c.detalles.length)])}</p>` : NOTAS_MENORES[c.id] ? `<p>${esc(NOTAS_MENORES[c.id])}</p>` : ''}
        </div></div></div>`).join('')}
    ${modo === 'cruzada' && cs.length === 2 ? `<div class="relacion">La carta cruzada es lo que pesa sobre la persona. Pregunta: ¿cómo puede ${esc(cs[0].nombre)} usar sus cualidades (${esc(cs[0].luz || '')}) frente a ${esc(cs[1].nombre)}?</div>` : ''}
    ${rel.length ? `<h3>Cómo conversan</h3>${rel.map((r) => `<div class="relacion">${r}</div>`).join('')}` : ''}
    ${suma && suma.carta ? `<h3>La carta que las reúne (suma)</h3><div class="fila" style="flex-wrap:nowrap;align-items:flex-start">
      <div style="width:64px;flex:none">${miniCarta(suma.carta, false)}</div>
      <p>${suma.expr}: <b>${esc(suma.carta.titulo)}</b>. Jodorowsky suma, nunca resta (IIII + V = VIIII: el Ermitaño reconcilia al Emperador y al Papa). Ponla en medio y mira qué cambia.</p></div>` : ''}
    <h3>Ahora tú: haz la frase</h3>
    <ol class="lista">
      <li>Mira las cartas juntas, sin leer nada. ¿Qué detalle te salta?</li>
      <li>¿Hacia dónde mira cada personaje y a quién?</li>
      <li>¿Qué números aparecen? ¿En qué escalón está la persona?</li>
      <li>Busca las cualidades: ¿qué valor de la persona muestra cada carta?</li>
      <li>Escribe la frase como si contaras un sueño.</li>
    </ol>
    <textarea class="frase" placeholder="Mi frase: …"></textarea>
    <h3>Cómo decirlo</h3>
    <ul class="lista">
      <li>"Según lo que yo sé, hasta cierto punto, veo esto… ¿Te habla?"</li>
      <li>"Si haces esto, puede pasar esto positivo; si haces aquello, esto otro. Tú eliges."</li>
      <li>Si no le habla, no insistas: vuelve a tirar teniendo en cuenta lo que te dijo.</li>
    </ul>
    <p><button class="guardar-lectura">Guardar en el diario</button> <span class="msg"></span></p>
  </div>`;
}
function activarGuardado(cont, datos) {
  const b = $('.guardar-lectura', cont); if (!b) return;
  b.onclick = () => {
    const frase = $('.frase', cont).value.trim();
    if (guardarEnDiario({ ...datos(), frase })) { $('.msg', cont).innerHTML = '✓ Guardada. <a href="#/diario">Ver diario</a>'; b.disabled = true; }
  };
}

/* ---------- mesa con cartas boca abajo ---------- */
function cartaMesaHTML(c, { x = false, etq = '' } = {}) {
  return `<div class="carta-mesa ${x ? 'x' : ''}" data-id="${c.id}">
    <div class="dentro"><div class="dorso">✶</div><div class="cara">${c.img ? `<img src="${c.img}" alt="${esc(c.titulo)}">` : svgMenor(c)}</div></div>
    <div class="etq">${esc(etq)}</div></div>`;
}
// Pinta cartas boca abajo; al voltear todas, ejecuta alFinal
function mesaParaVoltear(cont, cartas, alFinal, { cruzada = false } = {}) {
  cont.innerHTML = cruzada
    ? `<div class="mesa"><div class="cruzada">${cartaMesaHTML(cartas[0])}${cartaMesaHTML(cartas[1], { x: true })}</div></div><p class="centro suave">Toca la carta de abajo y luego la cruzada.</p>`
    : `<div class="mesa">${cartas.map((c) => cartaMesaHTML(c)).join('')}</div><p class="centro suave">Toca cada carta para darla vuelta.</p>`;
  let vueltas = 0;
  $$('.carta-mesa', cont).forEach((el, i) => (el.onclick = () => {
    if (el.classList.contains('vuelta')) return;
    if (cruzada && i === 1 && !$$('.carta-mesa', cont)[0].classList.contains('vuelta')) return;
    el.classList.add('vuelta');
    $('.etq', el).textContent = cartas[i].tipo === 'mayor' ? `${cartas[i].rom || '0'} · ${cartas[i].nombre}` : cartas[i].nombre;
    if (++vueltas === cartas.length) setTimeout(alFinal, 650);
  }));
}

/* ---------- panel "antes de tirar" ---------- */
function antesDeTirar() {
  return `<details class="panel oscuro"><summary><b>Antes de tirar</b>: mira a quien consulta y recuerda la ética</summary>
    <h3>Mira a la persona (de abajo hacia arriba)</h3>
    <ul class="lista">${MIRAR_PERSONA.map((m) => `<li><b>${m.t}:</b> ${esc(m.d)}</li>`).join('')}</ul>
    <h3>Ética</h3><ul class="lista">${ETICA.map((e) => `<li>${esc(e)}</li>`).join('')}</ul></details>
    <label for="pregunta">Pregunta o tema (opcional; Jodorowsky a veces prefiere no saberlo)</label>
    <input id="pregunta" placeholder="Por ejemplo: mi trabajo, mi relación con mi padre…">`;
}

/* ---------- menú de tiradas ---------- */
const TIRADAS = [
  { id: 'tres', t: 'Tres cartas', d: 'La base. Eliges 3 cartas boca abajo del mazo mezclado y las lees como una frase.' },
  { id: 'numeros', t: 'Tres números', d: 'La persona dice 3 números del 1 al 22 (lo que dice su inconsciente). El 22 es el Mat.' },
  { id: 'dosmazos', t: 'Dos mazos', d: 'Los 3 números en el mazo ordenado (el inconsciente) y en un mazo mezclado (el azar). Haz que las dos frases conversen.' },
  { id: 'cruzada', t: 'Carta cruzada', d: 'Una carta vertical (la persona) y otra cruzada encima (su problema).' },
  { id: 'series', t: 'Las dos series', d: 'Una carta de I-X y otra de XI-XXI: "unir, separar y que se contesten".' },
  { id: 'tresentres', t: 'De tres en tres', d: 'Mezcla los 22 y léelos en frases de tres.' },
  { id: 'escalera', t: 'Escalera de menores', d: 'Saca numerales y míralos en la escalera del doble cuadrado: qué escalón y qué centro.' },
  { id: 'tronos', t: 'La frase de los tronos', d: 'Ejemplo fijo: II-III-VIII-IIII-V, los 5 personajes sentados.' }
];
ruta(/^tirar$/, (v) => {
  v.innerHTML = `<h1>Tirar las cartas</h1>
    <p class="suave">"No hay tiradas obligatorias: cada persona debe inventar su manera de leer". Estas son las formas que Jodorowsky muestra en el curso. Todas las cartas se leen al derecho.</p>
    <div class="cuadricula">${TIRADAS.map((x) => `<a class="tarjeta" href="#/tirar/${x.id}"><h3>${x.t}</h3><p>${x.d}</p></a>`).join('')}</div>
    <div class="panel oscuro"><b>¿Tienes tu mazo físico?</b> Haz la tirada en la mesa y usa <a href="#/foto">Foto de la mesa</a> ${fotoAbierta() ? '' : '(se abre al terminar el curso)'} o elige las cartas a mano en "Tres números".</div>`;
});

function cabeceraTirada(v, id) {
  const t = TIRADAS.find((x) => x.id === id);
  v.innerHTML = `<p><a href="#/tirar">← Tiradas</a></p><h1>${t.t}</h1><p class="suave">${t.d}</p>`;
}

ruta(/^tirar\/tres$/, (v) => {
  cabeceraTirada(v, 'tres');
  v.insertAdjacentHTML('beforeend', `${antesDeTirar()}
    <div class="pestanas"><button class="on" data-m="22">Solo los 22 Mayores</button><button data-m="78">Las 78 cartas</button></div>
    <div id="zona"></div>`);
  let mazo = 22;
  const empezar = () => {
    const base = mazo === 22 ? CARTAS.filter((c) => c.tipo === 'mayor') : CARTAS;
    const mezclado = barajar(base), elegidas = [];
    $('#zona').innerHTML = `<p class="centro">Mezcladas. Elige <b>3</b> cartas con la mano izquierda, sin pensar.</p><div class="mazo-boca-abajo">${mezclado.map((_, i) => `<button data-i="${i}" aria-label="carta boca abajo"></button>`).join('')}</div><div id="mesa"></div>`;
    $$('.mazo-boca-abajo button').forEach((b) => (b.onclick = () => {
      if (elegidas.length >= 3) return;
      b.classList.add('tomada'); elegidas.push(mezclado[+b.dataset.i]);
      if (elegidas.length === 3) {
        $('.mazo-boca-abajo').remove(); $('#zona p').remove();
        mesaParaVoltear($('#mesa'), elegidas, () => {
          const preg = $('#pregunta').value;
          $('#mesa').insertAdjacentHTML('beforeend', lecturaGuiada(elegidas.map((c) => c.id), { pregunta: preg }) + '<p class="centro"><button class="sec" id="otra">Nueva tirada</button></p>');
          activarGuardado($('#mesa'), () => ({ tipo: 'Tres cartas', cartas: elegidas.map((c) => c.id), pregunta: preg }));
          $('#otra').onclick = empezar;
        });
      }
    }));
  };
  $$('.pestanas button', v).forEach((b) => (b.onclick = () => { mazo = +b.dataset.m; $$('.pestanas button', v).forEach((x) => x.classList.toggle('on', x === b)); empezar(); }));
  empezar();
});

function formNumeros(v, alEnviar) {
  v.insertAdjacentHTML('beforeend', `${antesDeTirar()}
    <div class="panel"><p>Pide a la persona (o a ti) <b>tres números del 1 al 22</b>, sin pensar.</p>
      <div class="fila"><input type="number" min="1" max="22" class="n" style="width:5.5em"><input type="number" min="1" max="22" class="n" style="width:5.5em"><input type="number" min="1" max="22" class="n" style="width:5.5em">
      <button id="ver">Ver las cartas</button></div><p class="err-msg" id="err"></p></div><div id="zona"></div>`);
  $('#ver').onclick = () => {
    const ns = $$('.n', v).map((i) => +i.value);
    if (ns.some((n) => !(n >= 1 && n <= 22))) { $('#err').textContent = 'Escribe tres números entre 1 y 22.'; return; }
    $('#err').textContent = '';
    alEnviar(ns, $('#pregunta').value);
  };
}
const cartaPorNumero = (n) => mayor(n === 22 ? 0 : n);

ruta(/^tirar\/numeros$/, (v) => {
  cabeceraTirada(v, 'numeros');
  formNumeros(v, (ns, preg) => {
    const cs = ns.map(cartaPorNumero);
    $('#zona').innerHTML = `<div class="mesa">${cs.map((c) => `<div class="carta-mesa vuelta"><div class="dentro"><div class="dorso"></div><div class="cara"><img src="${c.img}" alt=""></div></div><div class="etq">${c.rom || '0'} · ${esc(c.nombre)}</div></div>`).join('')}</div>` + lecturaGuiada(cs.map((c) => c.id), { pregunta: preg });
    activarGuardado($('#zona'), () => ({ tipo: 'Tres números (' + ns.join('-') + ')', cartas: cs.map((c) => c.id), pregunta: preg }));
  });
});

ruta(/^tirar\/dosmazos$/, (v) => {
  cabeceraTirada(v, 'dosmazos');
  formNumeros(v, (ns, preg) => {
    const orden = ns.map(cartaPorNumero);
    const mezclado = barajar(CARTAS.filter((c) => c.tipo === 'mayor'));
    const azarC = ns.map((n) => mezclado[n - 1]);
    $('#zona').innerHTML = `
      <h2>1 · El inconsciente (mazo ordenado)</h2>
      <div class="mesa">${orden.map((c) => `<div class="carta-mesa vuelta"><div class="dentro"><div class="dorso"></div><div class="cara"><img src="${c.img}" alt=""></div></div><div class="etq">${esc(c.nombre)}</div></div>`).join('')}</div>
      <h2>2 · El azar (mazo mezclado, mismas posiciones)</h2><div id="mesa2"></div><div id="lect"></div>`;
    mesaParaVoltear($('#mesa2'), azarC, () => {
      $('#lect').innerHTML = lecturaGuiada(orden.map((c) => c.id), { pregunta: preg, titulo: 'Lo que dice el inconsciente' })
        + lecturaGuiada(azarC.map((c) => c.id), { titulo: 'Lo que dice el azar' })
        + `<div class="panel oscuro"><b>Haz conversar las dos versiones</b> hasta llegar a una conclusión: ¿qué repiten?, ¿qué contradicen?, ¿qué completa una a la otra?</div>`;
      activarGuardado($('#lect'), () => ({ tipo: 'Dos mazos (' + ns.join('-') + ')', cartas: [...orden, ...azarC].map((c) => c.id), pregunta: preg }));
    });
  });
});

ruta(/^tirar\/cruzada$/, (v) => {
  cabeceraTirada(v, 'cruzada');
  v.insertAdjacentHTML('beforeend', `${antesDeTirar()}<p><button id="sacar">Mezclar y sacar dos cartas</button></p><div id="zona"></div>`);
  $('#sacar').onclick = () => {
    const [a, b] = barajar(CARTAS.filter((c) => c.tipo === 'mayor'));
    const preg = $('#pregunta').value;
    mesaParaVoltear($('#zona'), [a, b], () => {
      $('#zona').insertAdjacentHTML('beforeend', lecturaGuiada([a.id, b.id], { modo: 'cruzada', pregunta: preg }));
      activarGuardado($('#zona'), () => ({ tipo: 'Carta cruzada', cartas: [a.id, b.id], pregunta: preg }));
    }, { cruzada: true });
  };
});

ruta(/^tirar\/series$/, (v) => {
  cabeceraTirada(v, 'series');
  v.insertAdjacentHTML('beforeend', `${antesDeTirar()}<p><button id="sacar">Mezclar cada serie y sacar</button></p><div id="zona"></div>`);
  $('#sacar').onclick = () => {
    const a = mayor(1 + azar(10)), b = mayor(11 + azar(11));
    const preg = $('#pregunta').value;
    mesaParaVoltear($('#zona'), [a, b], () => {
      $('#zona').insertAdjacentHTML('beforeend', lecturaGuiada([a.id, b.id], { modo: 'series', pregunta: preg }));
      activarGuardado($('#zona'), () => ({ tipo: 'Dos series', cartas: [a.id, b.id], pregunta: preg }));
    });
  };
});

ruta(/^tirar\/tresentres$/, (v) => {
  cabeceraTirada(v, 'tresentres');
  const m = barajar(CARTAS.filter((c) => c.tipo === 'mayor'));
  const grupos = []; for (let i = 0; i < 21; i += 3) grupos.push(m.slice(i, i + 3));
  const resto = m[21];
  v.insertAdjacentHTML('beforeend', `<p class="suave">Siete frases de tres y una carta que queda sola (${esc(resto.nombre)}): ¿qué dice esa carta sobre el conjunto? Toca una frase para leerla.</p>
    ${grupos.map((g, i) => `<div class="panel oscuro"><div class="fila entre"><b>Frase ${i + 1}</b><button class="peq" data-g="${i}">Leer</button></div>
      <div class="fila">${g.map((c) => `<div style="width:70px">${miniCarta(c, false)}</div>`).join('')}</div><div class="lect-${i}"></div></div>`).join('')}
    <div class="panel oscuro"><b>La que queda:</b><div style="width:70px">${miniCarta(resto, false)}</div></div>
    <p><button onclick="render()">Volver a mezclar</button></p>`);
  $$('[data-g]', v).forEach((b) => (b.onclick = () => {
    const i = +b.dataset.g, c = $(`.lect-${i}`, v);
    c.innerHTML = lecturaGuiada(grupos[i].map((x) => x.id), { titulo: `Frase ${i + 1}` });
    activarGuardado(c, () => ({ tipo: 'De tres en tres', cartas: grupos[i].map((x) => x.id) }));
    b.remove();
  }));
});

ruta(/^tirar\/escalera$/, (v) => {
  cabeceraTirada(v, 'escalera');
  v.insertAdjacentHTML('beforeend', `<div class="fila"><label style="margin:0">¿Cuántas cartas?</label><select id="cuantas" style="width:auto">${[4, 5, 6, 8, 10].map((n) => `<option ${n === 6 ? 'selected' : ''}>${n}</option>`).join('')}</select><button id="sacar">Sacar numerales</button></div><div id="zona"></div>`);
  $('#sacar').onclick = () => {
    const k = +$('#cuantas').value;
    const cs = barajar(CARTAS.filter((c) => c.tipo === 'menor' && c.n)).slice(0, k);
    const por = {}; cs.forEach((c) => (por[c.n] ||= []).push(c));
    const celda = (n) => `<div style="background:var(--papel);color:var(--tinta);border-radius:8px;padding:.4rem;min-height:70px;border-left:6px solid ${NUMEROS[n].tipo === 'activo' ? 'var(--rojo)' : NUMEROS[n].tipo === 'receptivo' ? 'var(--azul)' : 'var(--amarillo)'}">
      <b>${n}</b> <small>${esc(NUMEROS[n].nombre)}</small><div class="fila">${(por[n] || []).map((c) => `<div style="width:46px">${miniCarta(c, false)}</div>`).join('')}</div></div>`;
    $('#zona').innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem;max-width:520px;margin:1rem auto">
      <div style="grid-column:1/-1">${celda(1)}</div>${[2, 4, 6, 8].map((n) => celda(n) + celda(n + 1)).join('')}<div style="grid-column:1/-1">${celda(10)}</div></div>
      <div class="panel"><h2>Lectura</h2>${cs.sort((a, b) => a.n - b.n).map((c) => `<p><b style="color:${PALOS[c.palo].color}">${esc(c.nombre)}</b>: ${esc(sentidoMenor(c).corto)}.</p>`).join('')}
      <p class="suave">¿En qué escalones se agrupan? ¿Hay escalones vacíos? ¿Qué centro domina? Jodorowsky: cuando sale un número, pregunta de qué palo es para saber en qué nivel del ser actúa.</p></div>`;
  };
});

ruta(/^tirar\/tronos$/, (v) => {
  cabeceraTirada(v, 'tronos');
  const ids = [2, 3, 8, 4, 5].map((n) => mayor(n).id);
  v.insertAdjacentHTML('beforeend', `<div class="mesa">${ids.map((id) => `<div class="carta-mesa vuelta" style="width:clamp(60px,17vw,130px)"><div class="dentro"><div class="dorso"></div><div class="cara"><img src="${POR_ID[id].img}" alt=""></div></div><div class="etq">${POR_ID[id].rom}</div></div>`).join('')}</div>
    <div class="panel"><p>Son las únicas cartas con personajes sentados en un trono: los 5 personajes de poder. II + III + VIII + IIII + V = <b>22</b>: la frase resume a los Mayores. Las parejas suman 7 (III + IIII, II + V) y con la Justicia en medio: 7 y 8, <b>78</b>, el número de cartas.</p>
    <p>La pareja espiritual (Papisa y Papa) no se mira; la material (Emperatriz y Emperador) sí. La Justicia, con su balanza, equilibra espíritu y materia.</p></div>`
    + lecturaGuiada(ids, { titulo: 'La frase leída con el motor' }));
  activarGuardado(v, () => ({ tipo: 'Frase de los tronos', cartas: ids }));
});
