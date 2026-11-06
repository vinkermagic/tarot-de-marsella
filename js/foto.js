// Foto de la mesa: fotografías tu tirada, indicas (o la IA identifica) las cartas y recibes una lectura guiada.
'use strict';

/* ---------- imagen ---------- */
function cargarImagen(archivo) {
  return new Promise((ok, mal) => {
    const url = URL.createObjectURL(archivo), img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); ok(img); };
    img.onerror = () => { URL.revokeObjectURL(url); mal(new Error('No se pudo leer la imagen.')); };
    img.src = url;
  });
}
function reducir(img, lado, calidad) {
  const k = Math.min(1, lado / Math.max(img.naturalWidth, img.naturalHeight));
  const c = document.createElement('canvas');
  c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', calidad);
}

/* ---------- llamada a la API de Claude (con la clave del propio usuario) ---------- */
async function llamarClaude({ system, content, maxTokens = 16000 }) {
  const a = S.ajustes;
  if (!a.clave) throw new Error('Falta tu clave de API (Ajustes).');
  let res;
  try {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': a.clave,
        'anthropic-version': '2026-10-21',
        'anthropic-beta': 'server-side-fallback-2026-07-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: a.modelo || 'claude-opus-5-5',
        max_tokens: maxTokens,
        output_config: { effort: 'medium' },
        fallbacks: 'default',
        system,
        messages: [{ role: 'user', content }]
      })
    });
  } catch {
    throw new Error('Sin conexión con api.anthropic.com. La IA necesita internet (el resto de la app funciona sin conexión).');
  }
  const datos = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = datos?.error?.message || res.statusText;
    if (res.status === 401) throw new Error('La clave de API no es válida. Revísala en Ajustes.');
    if (res.status === 429) throw new Error('Demasiadas consultas seguidas. Espera un minuto y vuelve a intentarlo.');
    if (res.status === 529 || res.status >= 500) throw new Error('El servicio de Claude está ocupado. Inténtalo en un rato.');
    throw new Error(`Error ${res.status}: ${msg}`);
  }
  if (datos.stop_reason === 'refusal') throw new Error('Claude no pudo responder a esta consulta.');
  const texto = (datos.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();
  return { texto, cortado: datos.stop_reason === 'max_tokens' };
}

const LISTA_IDS = () => CARTAS.map((c) => `${c.id} = ${c.tipo === 'mayor' ? (c.rom || 'sin número') + ' ' + c.nombre + ' (' + c.fr + ')' : c.nombre + ' (' + PALOS[c.palo].fr + ')'}`).join('\n');

const SISTEMA_IDENTIFICAR = `Identificas cartas de Tarot de Marsella (o de mazos de tipo Marsella) en fotos de una mesa.
Ordena las cartas como se leen: de izquierda a derecha y, si hay varias filas, de arriba abajo. Si una carta está cruzada encima de otra, ponla justo después de la carta que cruza y dilo en "notas".
Usa exclusivamente estos identificadores:
${'{LISTA}'}
Si no puedes reconocer una carta con razonable seguridad, pon "?" en su lugar.
Responde SOLO con un objeto JSON, sin texto alrededor: {"cartas": ["m03", "m11", "?"], "notas": "breve comentario en español"}`;

const SISTEMA_LEER = `Eres un guía de estudio del Tarot de Marsella que sigue fielmente el método de Alejandro Jodorowsky tal como lo enseña en su curso. La persona que usa esta app está aprendiendo a leer; tu respuesta debe ayudarla a ver, no reemplazar su mirada.

Principios del método que debes respetar:
- El tarot no predice el futuro: hay un abanico de futuros que cambia con cada paso. Nunca hagas predicciones.
- Todas las cartas se leen al derecho. Si alguna está invertida en la foto, léela al derecho.
- Las cartas hablan en frases: léelas juntas, de izquierda a derecha, como se cuenta un sueño. Una carta junto a otra cambia de sentido.
- Mira hacia dónde miran los personajes y a qué carta; el sentido de una mirada depende de su posición en la frase (mirar "al pasado" al final de la frase es mirar todo lo vivido; mirar "al futuro" al comienzo es tener todo por delante). La carta que mira la Templanza recibe su luz.
- Hace conversar las cartas: parejas numéricas n y n+10 (1↔11 … 10↔20), cartas que se parecen (Mat-XIII, Mago-Carro, Papisa-Papa, Emperatriz-Emperador, Rueda-Diablo, Ermitaño-Colgado, Casa Dios-Sol, Estrella-Mundo, Fuerza-Justicia-Templanza, Enamorado-Luna-Juicio), sumas (el tarot suma, nunca resta: IIII + V = VIIII).
- Numerología del doble cuadrado: 1 potencial, 2 acumulación, 3 explosión sin saber adónde, 4 estabilidad, 5 tentación/nuevo ideal, 6 encuentro contigo y placer, 7 acción en el mundo, 8 equilibrio/perfección, 9 crisis/sabiduría/despedida, 10 fin y comienzo de ciclo. Pares receptivos, impares activos. Figuras: Paje 2-3, Reina 4-5, Rey 6-7, Caballero 8-9.
- Cuatro centros: Espadas intelecto (palabras), Copas corazón (sentimientos), Bastos sexo y creatividad (deseos), Oros cuerpo (necesidades).
- Toda carta es a la vez luminosa y sombría. Busca las cualidades y los valores de la persona, no sus defectos.
- No des consejos ni órdenes: ofrece elecciones ("si haces esto puede pasar esto; si haces aquello, esto otro; tú eliges").
- Habla con humildad: "según lo que yo sé, hasta cierto punto". Termina preguntando si la lectura le habla.
- No asustes: el XIII no es muerte sino transformación y limpieza; la Casa Dios es apertura; el Diablo es energía creativa encadenada.

Formato de la respuesta, en español, breve y concreta (unas 350-550 palabras), con estos apartados:
1. **Lo que veo en la mesa** (detalles concretos de las cartas en la foto: miradas, colores, gestos, lo que se sale del marco).
2. **La frase** (la lectura de las cartas juntas como una frase).
3. **Cómo conversan** (parejas, parecidos, números, centros).
4. **Elecciones** (dos o tres posibilidades positivas, sin decidir por la persona).
5. **Para tu estudio** (uno o dos detalles que conviene mirar y una pregunta para la persona).`;

/* ---------- selector de cartas ---------- */
function abrirSelector(alElegir) {
  let grupo = 'mayores';
  const pinta = () => {
    const lista = grupo === 'mayores' ? CARTAS.filter((c) => c.tipo === 'mayor') : CARTAS.filter((c) => c.palo === grupo);
    abrirModal(`<div class="fila entre"><b>Elige la carta</b><button class="peq sec" data-cerrar>Cerrar</button></div>
      <div class="pestanas">${['mayores', ...ORDEN_PALOS].map((g) => `<button data-g="${g}" class="${g === grupo ? 'on' : ''}">${g === 'mayores' ? 'Mayores' : PALOS[g].nombre}</button>`).join('')}</div>
      <div class="mazo">${lista.map((c) => `<a class="carta-mini" href="javascript:void 0" data-id="${c.id}">${imgCarta(c)}<span>${esc(c.tipo === 'mayor' ? (c.rom || '0') + ' ' + c.nombre : c.nombre)}</span></a>`).join('')}</div>`);
    $$('#modal [data-g]').forEach((b) => (b.onclick = () => { grupo = b.dataset.g; pinta(); }));
    $$('#modal [data-id]').forEach((a) => (a.onclick = () => { alElegir(a.dataset.id); cerrarModal(); }));
  };
  pinta();
}

function textoIA(t) {
  return esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/^#{1,4}\s*(.+)$/gm, '<b>$1</b>');
}

/* ---------- vista ---------- */
ruta(/^foto$/, (v) => {
  if (!fotoAbierta()) {
    const h = cursoHecho();
    v.innerHTML = `<h1>Foto de la mesa 🔒</h1>
      <div class="panel"><p>Este modo se abre cuando termines el curso: primero aprende a tirar y a mirar las cartas; luego la app te ayudará a interpretar la mesa a partir de una foto.</p>
      <div class="progreso"><i style="width:${(h / LECCIONES.length) * 100}%"></i></div>
      <p>${h} de ${LECCIONES.length} clases aprobadas.</p>
      <a class="boton" href="#/curso">Seguir el curso</a></div>
      <p class="suave">Mientras tanto, practica con <a href="#/tirar">las tiradas</a>. (Si ya sabes leer, puedes abrirlo en Ajustes.)</p>`;
    return;
  }
  const est = { foto: null, miniatura: null, cartas: [], ia: '', notasIA: '' };
  const hayClave = !!S.ajustes.clave;
  v.innerHTML = `<h1>Foto de la mesa</h1>
    <p class="suave">Haz tu tirada con tu mazo, tómale una foto con todas las cartas al derecho y bien iluminadas, y te ayudo a leerla.</p>
    <div class="panel">
      <h3>1 · La foto</h3>
      <div class="fila">
        <label class="boton" style="margin:0">📷 Tomar foto<input type="file" accept="image/*" capture="environment" id="camara" hidden></label>
        <label class="boton sec" style="margin:0;color:var(--tinta);border-color:#b9a77f">Elegir de la galería<input type="file" accept="image/*" id="galeria" hidden></label>
      </div>
      <div id="prev"></div>
    </div>
    <div class="panel">
      <h3>2 · Las cartas, en orden de izquierda a derecha</h3>
      ${hayClave ? '<p><button id="identificar" disabled>✶ Identificar las cartas con IA</button> <span id="msg-id" class="suave"></span></p>' : '<p class="suave">Indica las cartas que hay en la foto. (Con tu clave de API en <a href="#/ajustes">Ajustes</a>, Claude puede identificarlas por ti.)</p>'}
      <div class="seleccion" id="sel"></div>
      <p><button class="sec" style="color:var(--tinta);border-color:#b9a77f" id="anadir">+ Añadir carta</button></p>
      <label for="modo">Forma de la tirada</label>
      <select id="modo"><option value="frase">Una frase (de izquierda a derecha)</option><option value="cruzada">Carta cruzada (persona + problema)</option><option value="series">Dos series (pregunta I-X, respuesta XI-XXI)</option></select>
      <label for="preg">Pregunta o tema (opcional)</label>
      <input id="preg" placeholder="¿Sobre qué es la consulta?">
      <label for="quien">Lo que ves de quien consulta (opcional: cuerpo, sexualidad, emoción, mente)</label>
      <textarea id="quien" style="min-height:3.5em" placeholder="Por ejemplo: habla rápido, ropa oscura, muy cerebral…"></textarea>
      <p><button id="interpretar" disabled>3 · Interpretar</button></p>
    </div>
    <div id="resultado"></div>`;

  const pintaSel = () => {
    $('#sel').innerHTML = est.cartas.map((id, i) => {
      const c = POR_ID[id];
      return `<div class="sel">${c ? imgCarta(c) : '<div style="aspect-ratio:1/1.86;background:#ddd;border-radius:5px;display:grid;place-items:center">?</div>'}<span>${i + 1}. ${esc(c ? c.nombre : 'sin identificar')}</span><button data-q="${i}" aria-label="quitar">×</button></div>`;
    }).join('') || '<p class="suave">Aún no hay cartas.</p>';
    $$('#sel [data-q]').forEach((b) => (b.onclick = () => { est.cartas.splice(+b.dataset.q, 1); pintaSel(); }));
    $('#interpretar').disabled = !est.cartas.filter((id) => POR_ID[id]).length;
  };
  pintaSel();

  const alFoto = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const img = await cargarImagen(f);
      est.foto = reducir(img, 1568, .85);
      est.miniatura = reducir(img, 480, .7);
      $('#prev').innerHTML = `<img class="foto-prev" src="${est.foto}" data-zoom="${est.foto}" alt="tu tirada">`;
      if ($('#identificar')) $('#identificar').disabled = false;
    } catch (err) { $('#prev').innerHTML = `<p class="err-msg">${esc(err.message)}</p>`; }
  };
  $('#camara').onchange = alFoto; $('#galeria').onchange = alFoto;
  $('#anadir').onclick = () => abrirSelector((id) => { est.cartas.push(id); pintaSel(); });

  if ($('#identificar')) $('#identificar').onclick = async () => {
    const b = $('#identificar'); b.disabled = true; $('#msg-id').textContent = 'Mirando la foto…';
    try {
      const { texto } = await llamarClaude({
        system: SISTEMA_IDENTIFICAR.replace('{LISTA}', LISTA_IDS()),
        maxTokens: 2000,
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: est.foto.split(',')[1] } },
          { type: 'text', text: 'Identifica las cartas de esta tirada.' }
        ]
      });
      const j = JSON.parse((texto.match(/\{[\s\S]*\}/) || ['{}'])[0]);
      if (!Array.isArray(j.cartas) || !j.cartas.length) throw new Error('No reconocí cartas en la foto. Añádelas a mano.');
      est.cartas = j.cartas.map((id) => (POR_ID[id] ? id : '?'));
      est.notasIA = j.notas || '';
      pintaSel();
      $('#msg-id').innerHTML = `Listo. <b>Revisa</b> que sean correctas (quita o añade si hace falta). ${esc(est.notasIA)}`;
    } catch (err) { $('#msg-id').innerHTML = `<span class="err-msg">${esc(err.message)}</span>`; }
    b.disabled = false;
  };

  $('#interpretar').onclick = () => {
    const ids = est.cartas.filter((id) => POR_ID[id]);
    const preg = $('#preg').value, modo = $('#modo').value;
    $('#resultado').innerHTML = lecturaGuiada(ids, { modo, pregunta: preg, titulo: 'Tu mesa, leída con el método' })
      + (hayClave ? `<div class="panel" id="panel-ia"><h2>Lectura de Claude al estilo Jodorowsky</h2>
          <p class="suave">Primero haz tu propia frase arriba. Luego compárala con esta lectura: aprendes más contrastando.</p>
          <button id="pedir-ia">✶ Pedir la lectura</button><div id="texto-ia" class="ia-texto" style="margin-top:.8rem"></div></div>` : '');
    const datosDiario = () => ({ tipo: 'Foto de la mesa', cartas: ids, pregunta: preg, foto: est.miniatura, ia: est.ia });
    activarGuardado($('#resultado'), datosDiario);
    if ($('#pedir-ia')) $('#pedir-ia').onclick = async () => {
      const b = $('#pedir-ia'); b.disabled = true; $('#texto-ia').innerHTML = '<p class="suave">Leyendo la mesa… (puede tardar un poco)</p>';
      const descr = ids.map((id, i) => {
        const c = POR_ID[id];
        return `${i + 1}. ${c.titulo}${c.tipo === 'mayor' && c.mira ? ` (en el Marsella suele mirar: ${c.mira})` : ''}`;
      }).join('\n');
      const contexto = `Forma de la tirada: ${modo === 'cruzada' ? 'carta cruzada (la primera es la persona, la segunda el problema)' : modo === 'series' ? 'dos series (la primera pregunta, la segunda responde)' : 'una frase de izquierda a derecha'}.
Cartas confirmadas por la persona, en orden:\n${descr}
${preg ? `Pregunta o tema: ${preg}` : 'Sin pregunta explícita.'}
${$('#quien').value ? `Lo que el lector observa de quien consulta: ${$('#quien').value}` : ''}
${$('.frase', $('#resultado'))?.value ? `La frase que escribió el estudiante: ${$('.frase', $('#resultado')).value}\n(Comenta con cariño qué vio bien y qué más podría mirar.)` : ''}`;
      const content = [];
      if (est.foto) content.push({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: est.foto.split(',')[1] } });
      content.push({ type: 'text', text: contexto });
      try {
        const { texto, cortado } = await llamarClaude({ system: SISTEMA_LEER, content });
        est.ia = texto;
        $('#texto-ia').innerHTML = textoIA(texto) + (cortado ? '<p class="suave">(La respuesta quedó cortada.)</p>' : '');
      } catch (err) { $('#texto-ia').innerHTML = `<p class="err-msg">${esc(err.message)}</p>`; }
      b.disabled = false;
    };
    $('#resultado').scrollIntoView({ behavior: 'smooth' });
  };
});
