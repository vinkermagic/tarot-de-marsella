// Contenido de la app: el método de Alejandro Jodorowsky según su curso en video (ver notas/notas_curso.md).
// "mira": hacia dónde mira el personaje desde el punto de vista de quien observa la carta
// (izquierda / derecha / frente). Es una guía para empezar: compruébalo siempre en la imagen.

const MAYORES = [
  { n: 0, id: 'm00', nombre: 'El Mat', alt: 'El Loco', fr: 'Le Mat', rom: '', mira: 'derecha',
    esencia: 'Energía pura, sin definición: la libertad que viene del origen y lleva todas las cartas en su bolsa.',
    claves: ['energía total', 'libertad', 'viaje', 'el cero'],
    detalles: [
      'El gorro se sale del marco: su mente está en el infinito.',
      'El animal que lo toca viene de atrás: el pasado completo (y también el ego).',
      'El puntito blanco junto al pie: "cuidado con tus pasos, no te encierres en definiciones".',
      'La bolsa con la cucharita azul: lleva las otras 21 cartas para darlas. Trae la conciencia.',
      'Cascabeles: la vida es celebración. Cuatro en el cinturón: los 4 centros en armonía.',
      'Zapatos rojos: marcha sobre la vida. Sale del amarillo y camina sobre el azul (el inconsciente).',
      'Su bastón rojo tiene exactamente la misma inclinación que la varita del Mago.'
    ],
    luz: 'Energía creativa sin límites, entusiasmo, ponerse en marcha, liberarse.',
    sombra: 'Huida, dispersión, no querer definirse nunca, locura.',
    preguntas: ['¿Hacia dónde voy, y qué me empuja desde atrás?', '¿Qué llevo en mi bolsa para dar?'],
    nota: 'No tiene número: es el cero. Puede ir al principio, al final o en medio de una lectura; refuerza o quita fuerza a la carta que acompaña.' },
  { n: 1, id: 'm01', nombre: 'El Mago', alt: 'Le Bateleur, el prestidigitador', fr: 'Le Bateleur', rom: 'I', mira: 'izquierda',
    esencia: 'El primer paso: alguien que lo tiene todo sobre la mesa y empieza.',
    claves: ['comienzo', 'habilidad', 'potencial', 'la trampa sagrada'],
    detalles: [
      'Mesa de 3 patas: la cuarta está escondida (búscala en la Papisa).',
      'Sobre la mesa están los 4 palos: copas, monedas, cuchillo, saco.',
      'Tres dados que suman 21: el Mundo.',
      'Un dedo de más en una mano: el truco al servicio del bien.',
      'Sombrero en forma de infinito, como la Fuerza (XI).',
      'Varita (activa) en una mano, moneda (receptiva) en la otra; el brazo de la varita es más largo.',
      'Está cortado en la cintura por la mesa, como el Carro.'
    ],
    luz: 'Empezar, atreverse, usar todos tus recursos, la astucia puesta al servicio de lo sagrado.',
    sombra: 'Engaño, inseguridad del principiante, depender del público.',
    preguntas: ['¿Cuál es el primer paso que no me atrevo a dar?', '¿Qué tengo ya sobre mi mesa que no estoy usando?'],
    nota: 'Mira al pasado (hacia la izquierda). Con el Mat: "muévete, entra al mundo, no temas a la crítica".' },
  { n: 2, id: 'm02', nombre: 'La Papisa', fr: 'La Papesse', rom: 'II', mira: 'derecha',
    esencia: 'La acumulación: la madre que gesta en silencio, lee el libro de su propio cuerpo.',
    claves: ['acumulación', 'gestación', 'estudio', 'la madre'],
    detalles: [
      'A su lado hay un huevo: está empollando el ser esencial.',
      'Encerrada tras un velo, sola; siente al Papa, que está fuera.',
      'Lee un libro: el libro sagrado de su cuerpo.',
      'Es blanca (suma de todos los colores): pureza.'
    ],
    luz: 'Paciencia, sabiduría, intuición femenina, preparar en silencio lo que vendrá.',
    sombra: 'Madre dominante o fría, rigidez, encierro, acumular sin actuar nunca.',
    preguntas: ['¿Qué estoy gestando en silencio?', '¿Qué me enseñó mi madre sin decirlo?'],
    nota: 'Es tu mamá en el inconsciente. Su pareja espiritual es el Papa (V): no se miran, están hombro con hombro.' },
  { n: 3, id: 'm03', nombre: 'La Emperatriz', fr: "L'Impératrice", rom: 'III', mira: 'frente',
    esencia: 'La explosión creadora: energía femenina viviente que no sabe adónde va.',
    claves: ['explosión', 'creatividad', 'fertilidad', 'recibir'],
    detalles: [
      'El cetro parte de su sexo: establece el poder desde sí misma.',
      'Sostiene un escudo con un águila macho: una parte masculina aceptada.',
      'Ojos azules, el color más receptivo: "te recibo".',
      'Una hojita verde abajo: la vida eterna está en la reproducción.'
    ],
    luz: 'Creatividad desbordante, belleza, seducción, abundancia, juventud.',
    sombra: 'Acción sin rumbo, coquetería vacía, desilusión que vuelve neuróticamente al 2.',
    preguntas: ['¿Qué está naciendo en mí con fuerza?', '¿Sé adónde quiero llevar esta energía?'],
    nota: 'Con el Emperador forma la pareja material: se miran (si ella está a su izquierda).' },
  { n: 4, id: 'm04', nombre: 'El Emperador', fr: "L'Empereur", rom: 'IIII', mira: 'izquierda',
    esencia: 'La estabilidad: el poder legal, la paz del mundo, las cuatro patas de la realidad.',
    claves: ['estabilidad', 'poder', 'ley', 'el padre'],
    detalles: [
      'Sostiene el cetro en el aire, sin esfuerzo: el poder no viene de él.',
      'Pierna cruzada que forma un 4. El 4 es secretamente un 10 (1+2+3+4).',
      'Bajo el trono, un pájaro hembra con un huevo: su alma.',
      'La mano del cetro es grande; la del cinturón, chiquita.'
    ],
    luz: 'Seguridad, orden, protección, realismo, construir algo duradero.',
    sombra: 'Autoritarismo, rigidez, posesión, el padre que controla.',
    preguntas: ['¿Dónde está mi suelo firme?', '¿Qué relación tengo con el poder y con mi padre?'],
    nota: 'Con el Papa (V) se dan la espalda: 4+5 = 9. Pon el Ermitaño en medio y descubren que son dos extremos del mismo bastón.' },
  { n: 5, id: 'm05', nombre: 'El Papa', fr: 'Le Pape', rom: 'V', mira: 'derecha',
    esencia: 'El nuevo ideal: el puente entre el cielo y la tierra que transmite a sus discípulos.',
    claves: ['ideal', 'enseñanza', 'puente', 'transmisión'],
    detalles: [
      'Dos columnas detrás: está en la puerta del templo, fuera, enseñando.',
      'Dos discípulos abajo, de espaldas a nosotros.',
      'Sus manos llevan cruces: bendice y comunica.'
    ],
    luz: 'Guía espiritual, comunicación, maestro, un ideal que te hace ir más lejos.',
    sombra: 'Dogma, sermón, moralismo; le falta la satisfacción del cuerpo.',
    preguntas: ['¿Qué ideal me llama más allá de lo material?', '¿A quién escucho como maestro?'],
    nota: 'El 5 es la tentación de ir más allá: hacia lo alto (Papa) o hacia lo profundo (Diablo, XV).' },
  { n: 6, id: 'm06', nombre: 'El Enamorado', fr: "L'Amoureux", rom: 'VI', mira: 'frente',
    esencia: 'El encuentro contigo mismo: elegir lo que amas, el placer de la unión.',
    claves: ['amor', 'elección', 'placer', 'relación'],
    detalles: [
      'Tres personajes y un ángel: ley del 3 + 1.',
      'Detrás del angelito hay un sol blanco: el verdadero enamorado es ese sol.',
      'Es la carta con más versiones: pregunta a otros quiénes son los tres.'
    ],
    luz: 'Hacer lo que te gusta, unión, comunidad, alegría, encontrarte.',
    sombra: 'Indecisión, triángulos, confusión emocional, la madre que se mete.',
    preguntas: ['¿Quiénes son esos tres en mi vida?', '¿Qué amo realmente hacer?'],
    nota: 'Su pareja es la Casa Dios (XVI): el ángel lanza una flecha y los prejuicios estallan.' },
  { n: 7, id: 'm07', nombre: 'El Carro', fr: 'Le Chariot', rom: 'VII', mira: 'frente',
    esencia: 'La acción en el mundo: el príncipe que viaja, conquista, avanza.',
    claves: ['acción', 'viaje', 'conquista', 'voluntad'],
    detalles: [
      'Cortado en la cintura, como el Mago.',
      'Los caballos no están guiados: son como mellizos en un mismo cuerpo.',
      'Detrás de los caballos, una gota verde: la gota de inmortalidad.',
      'Tiene 4 dedos en una mano, como la Justicia.',
      'Las ruedas están enterradas: ¿avanza o está empantanado?'
    ],
    luz: 'Triunfo, movimiento, unir ego y ser esencial en una misma dirección.',
    sombra: 'Huida hacia adelante, dictadura si actúa sin haberse encontrado.',
    preguntas: ['¿Hacia dónde voy y quién lleva las riendas?', '¿Tiran mis caballos hacia el mismo lado?'],
    nota: 'Con la Estrella (XVII): hay que ser al mismo tiempo nómade y sedentario.' },
  { n: 8, id: 'm08', nombre: 'La Justicia', fr: 'La Justice', rom: 'VIII', mira: 'frente',
    esencia: 'El equilibrio, la perfección: darte lo que mereces, ni más ni menos.',
    claves: ['equilibrio', 'perfección', 'madre justa', 'cortar lo que sobra'],
    detalles: [
      'Balanza de dos platillos vacíos: ¿va a juzgar o ya juzgó?',
      'Espada azul: espiritual, no sangrante, para defenderse con cariño.',
      'Tiene algo en el cuello (como el Juicio).',
      '4 dedos en una mano, como el Carro.'
    ],
    luz: 'Equilibrio interior, claridad, reconocer tus valores, la madre perfecta.',
    sombra: 'Juicio severo, perfeccionismo, culpa, rigidez.',
    preguntas: ['¿Qué tengo que cortar porque sobra?', '¿Me doy lo que merezco?'],
    nota: 'En medio de la frase de los tronos (II-III-VIII-IIII-V) equilibra espiritualidad y materia.' },
  { n: 9, id: 'm09', nombre: 'El Ermitaño', fr: "L'Hermite", rom: 'VIIII', mira: 'izquierda',
    esencia: 'La crisis y la sabiduría: retirarse, despedirse, iluminar desde la propia luz.',
    claves: ['sabiduría', 'crisis', 'retiro', 'el padre sabio'],
    detalles: [
      'La H de Hermite: Hermes, el sabio hermético.',
      'Una lámpara que ilumina en la noche; una luna en la nuca.',
      'Bastón rojo con ondulaciones (vida), como el del Mat.',
      'Mira hacia atrás: revisa lo vivido.'
    ],
    luz: 'Sabiduría, introspección, guía, aprender a soltar.',
    sombra: 'Aislamiento, soledad amarga, crisis que paraliza.',
    preguntas: ['¿De qué me estoy despidiendo?', '¿A quién ilumina mi experiencia?'],
    nota: '9 en el tarot es VIIII (5+4), nunca X−1: el tarot siempre suma.' },
  { n: 10, id: 'm10', nombre: 'La Rueda de la Fortuna', fr: 'La Roue de Fortune', rom: 'X', mira: 'frente',
    esencia: 'Fin de un ciclo y comienzo de otro: llegaste a un límite y necesitas ayuda.',
    claves: ['ciclo', 'fin y comienzo', 'cambio', 'misterio'],
    detalles: [
      'Una esfinge arriba: el misterio.',
      'Un animal sube y otro baja: materia y espíritu aún no colaboran.',
      'La rueda tiene una manivela: alguien tiene que girarla (una meta espiritual).'
    ],
    luz: 'Nuevo ciclo, cambio de etapa, aceptar los altibajos.',
    sombra: 'Estancamiento, esperar que otro gire la rueda.',
    preguntas: ['¿Qué ciclo termina en mi vida?', '¿Quién gira mi manivela?'],
    nota: 'Su pareja es el Juicio (XX): cuando materia y espíritu colaboran, nace la obra.' },
  { n: 11, id: 'm11', nombre: 'La Fuerza', fr: 'La Force', rom: 'XI', mira: 'izquierda',
    esencia: 'El nuevo comienzo en lo profundo: la fuerza que trabaja con el instinto y lo hace hablar.',
    claves: ['instinto', 'energía', 'dominio', 'sexualidad'],
    detalles: [
      'Sombrero en forma de infinito, como el Mago.',
      'Un pie con seis dedos y una uña violeta (el violeta: pureza).',
      'Seis piquitos en el sombrero.',
      '¿Abre o cierra la boca del león? No lo sabemos.'
    ],
    luz: 'Energía vital, creatividad, dominio de sí, relación sana con el deseo.',
    sombra: 'Represión del instinto o ser esclavo de él.',
    preguntas: ['¿Qué animal llevo dentro y cómo lo trato?', '¿Abro o cierro la boca a mi deseo?'],
    nota: 'Es el 1 de la serie interior: el Mago trabaja del ombligo hacia arriba, la Fuerza del ombligo hacia abajo.' },
  { n: 12, id: 'm12', nombre: 'El Colgado', fr: 'Le Pendu', rom: 'XII', mira: 'frente',
    esencia: 'La pausa: entregarse al presente, buscar lo genuino dentro de uno.',
    claves: ['pausa', 'entrega', 'meditación', 'cambiar de punto de vista'],
    detalles: [
      'Manos en la espalda: no escoge (¿o esconde algo?).',
      'Ramas cortadas en los árboles: los parásitos que absorbían al ser.',
      'Un pie atado: está ahí por decisión propia, no es un castigo.',
      'Gira la carta: 12 al revés es 21, el Mundo.'
    ],
    luz: 'Detenerse, meditar, ofrendarse, ver la vida desde otro ángulo.',
    sombra: 'Inmovilidad, sacrificio inútil, victimismo.',
    preguntas: ['¿De qué tengo que dejar de alimentar a los parásitos?', '¿Me detengo por decisión o por miedo?'],
    nota: 'Con la Papisa (II): los dos cortan las ramas del árbol genealógico.' },
  { n: 13, id: 'm13', nombre: 'Arcano XIII', alt: 'el arcano sin nombre', fr: '(sin nombre)', rom: 'XIII', mira: 'derecha',
    esencia: 'La transformación: limpiar lo viejo para que crezca lo nuevo.',
    claves: ['transformación', 'limpieza', 'cambio profundo', 'cortar'],
    detalles: [
      'No tiene nombre, para que nadie lo llame "muerte".',
      'La guadaña es una herramienta de labranza, no un arma.',
      'Azul en la columna; una planta crece en su cabeza; hierbas azules en el suelo.',
      'En la sombra de su cabeza está la letra yod.',
      'Camina en la misma dirección que el Mat: es su esqueleto.'
    ],
    luz: 'Cambio radical, eliminar lo inútil, renovación, revolución.',
    sombra: 'Miedo al cambio, destrucción, duelo no hecho.',
    preguntas: ['¿Qué tengo que terminar?', '¿Qué está creciendo en el terreno que limpio?'],
    nota: 'Si te asusta, estudia por qué: "como domar a un animal". Su pareja es la Emperatriz (III).' },
  { n: 14, id: 'm14', nombre: 'Templanza', fr: 'Tempérance', rom: 'XIIII', mira: 'derecha',
    esencia: 'La paz del corazón: el ángel que mezcla los contrarios y protege.',
    claves: ['armonía', 'circulación', 'protección', 'paz interior'],
    detalles: [
      'Pasa un líquido de un vaso a otro: ¿sube o baja? No lo sabemos.',
      'Ojos amarillos: luz. La carta a la que mira recibe su luz.',
      'Dos serpientes a sus pies: ni masculina ni femenina.',
      'Rojo y azul: la unión de los contrarios.'
    ],
    luz: 'Equilibrio emocional, sanación, el ángel de la guarda, moderación.',
    sombra: 'Tibieza, evitar el conflicto, no decidir.',
    preguntas: ['¿Qué opuestos necesito mezclar en mí?', '¿A quién ilumino con mi mirada?'],
    nota: 'Su pareja es el Emperador (IIII): la paz del mundo y la paz del corazón.' },
  { n: 15, id: 'm15', nombre: 'El Diablo', fr: 'Le Diable', rom: 'XV', mira: 'frente',
    esencia: 'La tentación en lo profundo: el inconsciente oscuro donde está la creatividad.',
    claves: ['pasión', 'inconsciente', 'creatividad', 'ataduras'],
    detalles: [
      'Andrógino: senos y sexo masculino.',
      'Sostiene una antorcha: luz en lo oscuro.',
      'Saca la lengua, hace chistes: no tiene miedo de verse.',
      'Dos diablillos encadenados abajo: libera a la persona de sus cadenas, no de sus diablos.'
    ],
    luz: 'Energía creativa enorme, deseo, dinero, aceptar tu sombra para transformarla.',
    sombra: 'Dependencia, manipulación, adicción, pactos que esclavizan.',
    preguntas: ['¿Qué me ata?', '¿Qué parte de mí rechazo y podría ser mi fuerza?'],
    nota: '"No expulses al diablo: transfórmalo". Con el Papa (V): luz y oscuridad van juntas.' },
  { n: 16, id: 'm16', nombre: 'La Casa Dios', alt: 'no "La Torre"', fr: 'La Maison Dieu', rom: 'XVI', mira: null,
    esencia: 'La apertura: los prejuicios estallan y la luz entra. Parece destrucción y es unión.',
    claves: ['apertura', 'liberación', 'alegría', 'iluminación'],
    detalles: [
      'Los ladrillos son prejuicios; la corona de la torre se abre.',
      'Los dos personajes ¿caen, escapan o danzan celebrando?',
      'Bolitas de colores: busca 19 (el Sol) y 18 (la Luna).',
      'Solo esta carta y el Sol tienen ladrillos.'
    ],
    luz: 'Liberación, salir del encierro, explosión de alegría, iluminación.',
    sombra: 'Ruptura brusca, caída, desorden.',
    preguntas: ['¿Qué estructura de mi vida necesita abrirse?', '¿Caigo o danzo?'],
    nota: 'Tu cuerpo es la casa de Dios. Su pareja es el Enamorado (VI).' },
  { n: 17, id: 'm17', nombre: 'La Estrella', fr: "L'Étoile", rom: 'XVII', mira: 'izquierda',
    esencia: 'Encontrar tu lugar en el mundo y dar lo que recibiste.',
    claves: ['generosidad', 'esperanza', 'tu lugar', 'belleza'],
    detalles: [
      'Mujer desnuda, como el Mundo: no esconde nada.',
      'Un pajarito negro en el árbol: la esperanza.',
      'Estrellas amarillas (materia iluminada) y azules (vida espiritual).',
      'Una pierna parece deforme: Jodorowsky leyó síntomas en ese detalle.'
    ],
    luz: 'Dar sin esfuerzo, sanación, fe, sentirse bella, actuar en armonía con el universo.',
    sombra: 'Derrochar, darse demasiado, no saber recibir.',
    preguntas: ['¿Dónde está mi lugar sagrado?', '¿Qué doy y qué me guardo?'],
    nota: 'Con el Carro (VII): el sedentario que da y el nómade que conquista.' },
  { n: 18, id: 'm18', nombre: 'La Luna', fr: 'La Lune', rom: 'XVIII', mira: 'izquierda',
    esencia: 'El inconsciente profundo, la receptividad, la madre divina.',
    claves: ['inconsciente', 'intuición', 'imaginación', 'lo femenino'],
    detalles: [
      'Un cangrejo en el estanque: el cerebro primitivo, la base del inconsciente.',
      'Dos perros (¿o lobos?) que aúllan: lo domesticado y lo salvaje.',
      'Un astro sobre tres (como el Enamorado y el Juicio): aquí sobre animales.',
      'Gotas que suben hacia la Luna: lo de abajo alimenta lo de arriba.'
    ],
    luz: 'Intuición, poesía, sueños, receptividad absoluta.',
    sombra: 'Confusión, miedo, ilusiones, nostalgia de la madre.',
    preguntas: ['¿Qué sale del fondo de mi estanque?', '¿Qué intuición estoy ignorando?'],
    nota: 'Con la Justicia (VIII): el lado humano y el lado divino de la madre.' },
  { n: 19, id: 'm19', nombre: 'El Sol', fr: 'Le Soleil', rom: 'XVIIII', mira: 'frente',
    esencia: 'La luz y el amor para todos: una vida nueva, la colaboración.',
    claves: ['amor', 'luz', 'colaboración', 'nueva vida'],
    detalles: [
      'Dos personajes: el más evolucionado ayuda al que tiene cola.',
      'Un pequeño muro de ladrillos: separa del pasado.',
      'Como los caballos del Carro, uno guía (mano en el hombro) y el otro sigue.'
    ],
    luz: 'Amor incondicional, éxito, fraternidad, el padre divino.',
    sombra: 'Quemarse por exceso, dependencia de la aprobación.',
    preguntas: ['¿A quién ayudo a cruzar?', '¿Qué muro me separa del pasado?'],
    nota: 'Con el Ermitaño (VIIII): el lado humano y el lado divino del padre.' },
  { n: 20, id: 'm20', nombre: 'El Juicio', fr: 'Le Jugement', rom: 'XX', mira: 'frente',
    esencia: 'El llamado: la humanidad que sale de la tierra y la obra de la pareja.',
    claves: ['llamado', 'renacer', 'conciencia', 'la obra'],
    detalles: [
      'No son muertos: es la humanidad que sale del interior de la tierra.',
      'El personaje azul de espaldas: el andrógino creativo, la obra de la pareja.',
      'El ángel: el ser humano futuro.',
      'Un astro sobre tres, como el Enamorado y la Luna.'
    ],
    luz: 'Vocación, despertar, un deseo irresistible de ser, nacimiento de la conciencia.',
    sombra: 'Esperar a ser llamado, juicio ajeno, nostalgia de los padres.',
    preguntas: ['¿Qué me llama?', '¿Qué obra estoy haciendo con quien amo?'],
    nota: 'Con la Rueda (X): cuando el espíritu se encarna y la materia se espiritualiza.' },
  { n: 21, id: 'm21', nombre: 'El Mundo', fr: 'Le Monde', rom: 'XXI', mira: 'izquierda',
    esencia: 'La realización total: el alma del mundo en el centro de los cuatro centros.',
    claves: ['realización', 'totalidad', 'éxito', 'el alma'],
    detalles: [
      'En las esquinas: águila (intelecto, Espadas), ángel (corazón, Copas), león (sexo, Bastos), animal color carne (cuerpo, Oros).',
      'Ley del 3 + 1: tres con aureola y el animal de la materia sin ella.',
      'El óvalo es el alma; la mujer danza con un bastón y un frasco.',
      'Sus piernas, como las del Colgado: XII girado es XXI.'
    ],
    luz: 'Plenitud, logro, unión de los cuatro centros, salir al mundo.',
    sombra: 'Encierro en el propio éxito, dificultad para empezar de nuevo.',
    preguntas: ['¿Están mis cuatro centros en armonía?', '¿Qué se completa en mi vida?'],
    nota: '21 = 3 × 7. El Mat va al Mundo y el Mundo al Mat.' }
];

const PALOS = {
  oros:    { nombre: 'Oros', fr: 'Deniers', centro: 'el cuerpo', lenguaje: 'necesidades', tipo: 'receptivo', color: '#d8a62b', simbolo: '●', orden: 1,
             texto: 'El cuerpo, la materia, lo más físico: el dinero, la casa, la salud. Las monedas echan ramas: la materia crece.' },
  bastos:  { nombre: 'Bastos', fr: 'Bâtons', centro: 'el sexo y la creatividad', lenguaje: 'deseos', tipo: 'activo', color: '#2f7d4a', simbolo: '|', orden: 2,
             texto: 'El deseo, lo único natural ("no puedes inventarte un deseo"): sexualidad y creatividad. Nace de lo más profundo, como la semilla que crece hasta árbol.' },
  copas:   { nombre: 'Copas', fr: 'Coupes', centro: 'el corazón', lenguaje: 'sentimientos', tipo: 'receptivo', color: '#c0392b', simbolo: 'U', orden: 3,
             texto: 'El templo de las emociones: recibir y dar amor. La recepción absoluta y el don absoluto (el ángel del Mundo).' },
  espadas: { nombre: 'Espadas', fr: 'Épées', centro: 'el intelecto', lenguaje: 'palabras', tipo: 'activo', color: '#2c5aa0', simbolo: '†', orden: 4,
             texto: 'El pensamiento, las palabras. El intelecto no es natural: lo forman la familia, la cultura, la época. Se libera cuando la espada entra en la corona.' }
};
const ORDEN_PALOS = ['oros', 'bastos', 'copas', 'espadas'];

// La escalera del "doble cuadrado" (clase 9)
const NUMEROS = {
  1:  { nombre: 'Potencial', tipo: 'marco', corto: 'todo está en germen', texto: 'La totalidad en potencia: el marco que contiene a todos. Hay que dar el primer paso.', verbo: 'el potencial, el primer impulso' },
  2:  { nombre: 'Acumulación', tipo: 'receptivo', escalon: 1, corto: 'acumular, gestar', texto: 'Acumulación de conocimiento, de necesidad, de deseo, de emoción, antes de actuar. Encierro, preparación.', verbo: 'la acumulación, preparar sin actuar todavía' },
  3:  { nombre: 'Explosión', tipo: 'activo', escalon: 1, corto: 'estallar sin saber adónde', texto: 'La primera acción: explosión creativa "sin saber adónde se va". Entusiasmo, juventud. Puede decepcionarse y volver al 2.', verbo: 'la explosión, actuar sin saber todavía adónde' },
  4:  { nombre: 'Estabilidad', tipo: 'receptivo', escalon: 2, corto: 'suelo firme', texto: 'Una realidad estable donde hacer una vida: la mesa de patas cortas, centro de gravedad bajo. Seguridad.', verbo: 'la estabilidad, tener suelo firme' },
  5:  { nombre: 'Tentación / nuevo ideal', tipo: 'activo', escalon: 2, corto: 'ir más lejos', texto: 'Salir de lo estable hacia un ideal: hacia lo alto (el Papa) o hacia lo profundo (el Diablo). Buscar tus tentaciones y equilibrarlas.', verbo: 'la tentación de ir más lejos, un nuevo ideal' },
  6:  { nombre: 'Encuentro contigo', tipo: 'receptivo', escalon: 3, corto: 'el espejo, el placer', texto: 'El espejo: el ego busca al ser esencial, descubres tus valores y lo que amas. El placer de hacer lo que te gusta.', verbo: 'el encuentro contigo, el placer de lo que amas' },
  7:  { nombre: 'Acción en el mundo', tipo: 'activo', escalon: 3, corto: 'actuar en el mundo', texto: 'Unir ego y ser esencial (los dos caballos) y actuar. "No puedes cambiar el mundo: empieza a cambiarte". Si actúas sin haberte encontrado, te vuelves dictador.', verbo: 'la acción en el mundo' },
  8:  { nombre: 'Equilibrio / perfección', tipo: 'receptivo', escalon: 4, corto: 'nada de más', texto: 'Equilibrio de interior y exterior; bien y mal como complementarios. La espada corta lo que sobra: "nada de más, nada de menos".', verbo: 'la perfección, el equilibrio pleno' },
  9:  { nombre: 'Crisis / sabiduría', tipo: 'activo', escalon: 4, corto: 'despedirse', texto: 'Despedida, crisis, retirarse hacia el ser esencial; la sabiduría de soltar y "aprender a morir feliz" para cambiar de etapa.', verbo: 'la crisis y la sabiduría, despedirse de una etapa' },
  10: { nombre: 'Fin y comienzo', tipo: 'marco', corto: 'cambio de ciclo', texto: 'El cuadrado lleno: fin de un ciclo y comienzo de otro (10 = 1 + 0). Ya anuncia el palo siguiente.', verbo: 'el final de un ciclo que ya anuncia otro' }
};

const FIGURAS = {
  paje:      { nombre: 'Paje', nivel: [2, 3], orden: 1, texto: 'Duda entre acumular y explotar (2-3): "está en la cosa o no está en la cosa". Es el hijo que empieza.' },
  reina:     { nombre: 'Reina', nivel: [4, 5], orden: 2, texto: 'Domina su palo de forma receptiva (4-5): estabilidad y tentación del ideal.' },
  rey:       { nombre: 'Rey', nivel: [6, 7], orden: 3, texto: 'Domina su palo de forma activa (6-7): se encontró y actúa en el mundo.' },
  caballero: { nombre: 'Caballero', nivel: [8, 9], orden: 4, texto: 'Sale del palacio (8-9): aceptó su árbol y salta al palo siguiente. El Caballero de Oros ya lleva un bastón.' }
};

// Notas propias de Jodorowsky sobre menores concretas
const NOTAS_MENORES = {
  'oros-paje': 'Una moneda en alto y otra enterrada a sus pies: no sabe si es rico o pobre. Dinero que desarrolla el espíritu y dinero que es obstáculo. "El dinero no es malo ni bueno".',
  'bastos-paje': 'Campesino con gorra apoyado en un bastón enorme que toca la tierra: acumula el deseo, no sabe si usar su poder creativo.',
  'copas-paje': 'Delicado, sostiene la tapa de la copa: ¿abre o cierra lo emocional, la ofrece o la guarda? Puede ser femenino.',
  'espadas-paje': 'Espada desenvainada y la vaina en la otra mano: ¿la usa o la guarda?',
  'oros-reina': 'Mira su moneda enorme junto a la cabeza: obsesionada con la materialidad (y consigo misma).',
  'bastos-reina': 'La más sexual: cabello largo, manto abierto.',
  'espadas-reina': 'Seca, con un escudo y una herida en el vientre.',
  'oros-rey': 'Salió del palacio, pierna doblada, monedas flotando en el cielo: "le da una lección" a su reina.',
  'bastos-rey': 'Campesino realista con armadura.',
  'espadas-rey': 'Elegante, ágil.',
  'copas-rey': 'Delicado.',
  'oros-caballero': 'Lleva un bastón al hombro: ya salta a la creatividad (Bastos). Puede ser una mujer.',
  'oros-01': 'El único as horizontal: ley del 3 + 1 (tres energías y la realidad carnal, diferente). Echa ramas: crece.',
  'bastos-01': 'Andrógino: un falo con un sexo femenino arriba; una mano divina, el inconsciente supremo, lo sostiene.',
  'espadas-01': 'La espada entra en la corona: el intelecto que se abre a lo divino.',
  'copas-06': 'Un espejo: el 3 frente al 3. Tu reflejo igual a lo que eres.',
  'copas-10': 'La décima copa está cerrada: "ya es un oro". El ciclo anuncia otro mundo.',
  'espadas-10': 'Dos espadas se salen del centro: ya anuncian otro mundo.'
};

// Imágenes que no existen en el escaneo de 1760 (BnF): se dibujan en esquema
const MENORES_SIN_IMAGEN = ['oros-03', 'oros-04', 'oros-06', 'oros-07', 'espadas-03', 'espadas-04', 'espadas-05', 'espadas-06', 'espadas-07', 'espadas-08', 'espadas-09', 'espadas-10'];

// Cartas que se parecen (clase 7)
const PARECIDOS = [
  { ids: [0, 13], texto: 'Uno tiene nombre y no número, el otro número y no nombre; caminan igual: la transformación, la vida que va hacia otra forma.' },
  { ids: [1, 7], texto: 'Los dos únicos personajes cortados en la cintura: misterio abajo. El Mago sedentario llama al público; el Carro, que creemos vencedor, está empantanado.' },
  { ids: [2, 5], texto: 'Pareja espiritual: ella encerrada estudiándose; él en la puerta del templo enseñando. No se miran: están hombro con hombro.' },
  { ids: [3, 4], texto: 'Pareja material: ella de frente con el cetro en su sexo (poder desde su ser íntimo); él de perfil, cetro alejado (poder de las leyes).' },
  { ids: [10, 15], texto: 'Seres de color azul/esfinge y dos personajes bajo uno. En la Rueda llegas a un límite y necesitas ayuda: llega el Diablo.' },
  { ids: [9, 12], texto: 'Dos seres aislados, solos.' },
  { ids: [16, 19], texto: 'Un astro y dos personajes; las únicas con ladrillos. En la XVI los prejuicios se abren; en el Sol empieza una vida nueva.' },
  { ids: [17, 21], texto: 'Las dos únicas mujeres desnudas.' },
  { ids: [8, 11, 14], texto: 'Manipulan algo con las manos: ¿abre o cierra la boca del león? ¿Qué platillo pesa más? ¿Sube o baja el líquido? No lo sabemos: se mezclan los extremos.' },
  { ids: [6, 18, 20], texto: 'Un astro sobre tres: sobre humanos (Enamorado), sobre animales (Luna), sobre una familia y su obra (Juicio).' },
  { ids: [12, 21], texto: 'Gira el XII y tienes el XXI: las mismas piernas cruzadas. El que se busca, al encontrarse, es el Mundo.' }
];

// Las 10 parejas de la clase 10 (n y n+10)
const PAREJAS_NUM = {
  1: 'Mismo sombrero de infinito. Él trabaja del ombligo hacia arriba, hasta el intelecto; ella, del ombligo hacia abajo: puede abrir o cerrar la boca del deseo.',
  2: 'La Papisa acumula conocimiento encerrada tras su velo; el Colgado, al aire libre, se encierra en sí mismo. Los dos cortan las ramas del árbol genealógico.',
  3: 'La explosión creadora que no sabe adónde va y su alter ego: el XIII no mata, labra. Limpia lo inútil y prepara el camino. Vida y muerte se completan.',
  4: 'El Emperador establece la ley en el mundo (la paz del mundo); la Templanza la establece en el interior (la paz del corazón).',
  5: 'Un engranaje: el Papa lleva a sus discípulos hacia lo celeste; el Diablo pone raíces en los pies de los suyos hacia la oscuridad. Luz y oscuridad van juntas.',
  6: 'Una comunidad unida; la flecha del ángel hace estallar los prejuicios. En la Casa Dios el rayo separa la corona del poder: parece destrucción y es unión.',
  7: 'El nómade que conquista y la sedentaria que da lo que recibió. Hay que ser al mismo tiempo nómade y sedentario.',
  8: 'La Justicia es la madre perfecta que te da lo que mereces; la Luna, la madre divina, el reflejo receptivo del mundo.',
  9: 'El lado humano y el lado divino del padre: la sabiduría que logró su luz interior y la luz y el amor para todos.',
  10: 'En la Rueda materia y espíritu aún no colaboran; cuando el espíritu se encarna y la materia se espiritualiza sucede el Juicio: la obra que hacen juntos.'
};

const ETICA = [
  'El tarot no es para ver el futuro: hay un abanico de futuros que cambia con cada paso.',
  'Todas las cartas al derecho. No se usan cartas invertidas.',
  'No des consejos: ofrece elecciones. "Si haces esto puede pasar esto; si haces aquello, esto otro; tú eliges".',
  'Habla con humildad: "según lo que yo sé, hasta cierto punto; tienes derecho a no creerlo".',
  'Busca las cualidades, no los defectos. Lo que lees en el otro es lo que tú llevas.',
  'Si la lectura no le habla, no insistas: busca otra forma de leer.',
  'Nunca lleves a la persona más lejos de lo que puede soportar.',
  'No hables de ti cuando lees: el lector es un humilde servidor del tarot.'
];

const MIRAR_PERSONA = [
  { t: 'Cuerpo', d: 'Cómo se viste, adornos, piel, cómo mira (directo, de costado), cómo respira.' },
  { t: 'Sexualidad', d: '¿Está en el recibir, en el dar, en el conquistar? ¿Satisfecha, creativa?' },
  { t: 'Emoción', d: '¿Realizada o no? ¿En comunicación con el mundo o encerrada?' },
  { t: 'Mente', d: '¿Cómo piensa? ¿De qué le puedes hablar y de qué no?' },
  { t: 'Tú', d: 'Luego interrógate a ti: ¿qué de tu propio problema estás proyectando?' }
];

const EJERCICIOS = [
  { id: 'bolsillo', t: 'Carta en el bolsillo', d: 'Lleva hoy la carta del día en un bolsillo cerca del corazón. Tócala de vez en cuando.', diario: true },
  { id: 'almohada', t: 'Dormir con la carta', d: 'Pon la carta del día bajo la almohada. Anota al despertar lo que soñaste o sentiste.', diario: true },
  { id: 'dibujar', t: 'Dibujar en negro y colorear', d: 'Copia la carta solo con líneas negras. Luego coloréala con los colores exactos. Otro día, coloréala en total libertad y compara.' },
  { id: 'detalles', t: 'Buscar 5 detalles', d: 'Mira la carta 5 minutos sin leer nada y anota 5 detalles que nunca habías visto. "Si un detalle te llamó la atención, tiene que ver contigo".' },
  { id: 'poema', t: 'Un poema por carta', d: 'Escribe un poema corto a la carta del día (puedes guardarlo en la ficha de la carta).' },
  { id: 'marco', t: 'Salirse del marco', d: 'Prolonga la carta fuera del marco: ¿cómo sigue el paisaje? ¿Qué animal sigue al Mat? ¿Dónde acaba el muro del Sol? Dibújalo.' },
  { id: 'meterse', t: 'Meterse en la carta', d: 'Cierra los ojos y entra: camina por su suelo, oye sus sonidos, ponte su ropa, abre su bolsa. Vive cada detalle.' },
  { id: 'preguntas', t: 'Lo que la carta te pregunta', d: 'Imagina que la carta te hace preguntas. Las preguntas que te hace son las que te haces a ti.' },
  { id: 'elemento', t: 'Buscar un elemento en todas', d: 'Elige un elemento (el número tres, el azul, las manos, los pájaros, los huevos) y búscalo en las 22 cartas.' },
  { id: 'centros', t: 'Leer con los 4 centros', d: 'Frota la carta en la cabeza, el corazón, el sexo y el cuerpo. ¿Qué te dice cada centro?' },
  { id: 'noche', t: 'Revisión de la noche', d: 'Cada noche revisa sin temor tus errores, prejuicios, egoísmo, cobardía... y acéptalos. "Nunca le digas a tu inconsciente: no quiero ser eso".' },
  { id: 'otros', t: 'Leer a otros', d: 'Antes de leerte a ti, aprende a leer a otros: pide 3 números a alguien y dile solo lo que ves. "Dígame si le habla".' }
];

const VIDEO_PLAYLIST = 'PLx59cnP1TG1AQMLizsZ2t1mDsI6sHLylA';

const LECCIONES = [
  { n: 1, video: 'gxniPWIsm1o', titulo: 'Qué es el Tarot y cómo empezar',
    puntos: [
      'El tarot es un espejo mágico: es lo que tú ves en él (Leonora Carrington).',
      'Se lee con las cartas al derecho: así fueron dibujadas.',
      'Su fin es desarrollar la conciencia, no adivinar el futuro.',
      'Es un cuerpo total: habla en frases, como un abecedario, no en letras sueltas.',
      'Empieza por familiarizarte: tócalas, llévalas, dibújalas, aprende nombre y número.',
      '22 Mayores + 56 Menores. Los 4 palos son los 4 centros: Espadas intelecto, Copas corazón, Bastos sexo/creatividad, Oros cuerpo.',
      'Ética: "según lo que yo sé, hasta cierto punto". El tarot es para ver las cualidades.'
    ],
    practica: { t: 'Aprende los nombres', ruta: '#/practica', d: 'Haz una ronda de práctica de memoria: carta → nombre y número.' },
    quiz: [
      { p: '¿Cómo se colocan las cartas para leer según Jodorowsky?', o: ['Al derecho siempre', 'Al revés para lo negativo', 'Mitad y mitad'], ok: 0, e: 'Todas fueron dibujadas de pie; al revés solo salta lo negativo.' },
      { p: '¿Cómo "habla" el tarot?', o: ['Carta por carta, por separado', 'En frases: las cartas se unen', 'Solo con los Mayores'], ok: 1, e: 'Es como un abecedario: las letras sueltas no hacen frases.' },
      { p: 'El palo de Copas corresponde a…', o: ['El intelecto', 'El cuerpo', 'El corazón, los sentimientos'], ok: 2, e: 'Espadas intelecto, Copas corazón, Bastos sexo/creatividad, Oros cuerpo.' },
      { p: '¿Para qué sirve leerle el tarot a alguien?', o: ['Para decirle sus valores', 'Para predecirle el futuro', 'Para corregir sus defectos'], ok: 0, e: 'El tarot es para ver las cualidades, no los defectos.' }
    ] },
  { n: 2, video: 'pbbYvENssfY', titulo: 'El Mat, el Mundo, el Mago y hacer conversar las cartas',
    puntos: [
      'El Mat es el cero: energía pura sin definición. Lleva en su bolsa todas las cartas.',
      'El Mundo: el alma con los 4 centros en las esquinas (águila, ángel, león, animal color carne).',
      'El Mago: la trampa sagrada, el primer paso, los 4 palos sobre su mesa de 3 patas.',
      'La llave: "no se puede leer hasta que las cartas conversen entre ellas". Al poner una carta al lado, su sentido cambia.',
      'Dos series de 10: I-X (las manos, el mundo) y XI-XX (los pies, el interior). 1↔11, 2↔12… 10↔20.',
      'No tengas miedo de tu interpretación: el tarot no evoluciona, evolucionas tú.'
    ],
    practica: { t: 'Mira el Mat de cerca', ruta: '#/carta/m00', d: 'Abre la ficha del Mat y busca todos sus detalles.' },
    quiz: [
      { p: '¿Qué número tiene el Mat?', o: ['El 22', 'Ninguno: es el cero', 'El 1'], ok: 1, e: 'Tiene nombre pero no número; el XIII tiene número y no nombre.' },
      { p: 'En el Mundo, el águila corresponde a…', o: ['Espadas, el intelecto', 'Bastos, el sexo', 'Oros, el cuerpo'], ok: 0, e: 'Águila–Espadas, león–Bastos, ángel–Copas, animal color carne–Oros.' },
      { p: '¿Cuál es la pareja numérica del Mago (I)?', o: ['El Mundo (XXI)', 'La Fuerza (XI)', 'El Carro (VII)'], ok: 1, e: 'Las dos series de 10 se corresponden: 1↔11.' },
      { p: 'Los tres dados de la mesa del Mago suman…', o: ['21: el Mundo', '13', '7'], ok: 0, e: '21 = 3 × 7: el Mago ya contiene el Mundo.' }
    ] },
  { n: 3, video: '4hjZhyjnEJQ', titulo: 'No hay maestros del tarot · La Papisa',
    puntos: [
      'Solo el Marsella es auténtico. Es un juego de cartas separadas, sin orden fijo: una colección de detalles.',
      'Nadie puede enseñarte a ver el tarot: se puede liberar tu mirada. Todas las interpretaciones son válidas según quien mira.',
      'Se interpreta como un sueño.',
      'La Papisa: tu madre en el inconsciente; empolla un huevo, el ser esencial que se gesta.',
      'Técnica: meterse en la carta y vivir cada detalle. Escribir un poema por carta.',
      'Lee con los 4 centros, no solo con el intelecto.'
    ],
    practica: { t: 'Ejercicio: meterse en la carta', ruta: '#/ejercicios', d: 'Haz el ejercicio "Meterse en la carta" con la Papisa.' },
    quiz: [
      { p: '¿Qué tiene la Papisa a su lado?', o: ['Un perro', 'Un huevo', 'Una espada'], ok: 1, e: 'Está empollando: el ser esencial que se gesta.' },
      { p: 'Según Jodorowsky, el tarot se interpreta…', o: ['Como un libro sagrado fijo', 'Como un sueño', 'Con un diccionario de significados'], ok: 1, e: 'El sueño es el sueño; la interpretación varía según quien mira.' },
      { p: '¿Qué significa el número 2?', o: ['Explosión', 'Acumulación', 'Acción en el mundo'], ok: 1, e: 'La Papisa acumula experiencia para después actuar en la Emperatriz (3).' },
      { p: '¿Quién es el maestro del tarot?', o: ['Jodorowsky', 'El tarot mismo: hay guías, no maestros', 'El más antiguo de la escuela'], ok: 1, e: '"No hay maestro de tarot: hay guía para que te descubras a ti mismo".' }
    ] },
  { n: 4, video: '-zPRXj76V-w', titulo: 'Los personajes en el trono',
    puntos: [
      'El tarot no es para ver el futuro: hay un abanico de futuros.',
      'La frase de los 5 tronos: Papisa (II) – Emperatriz (III) – Justicia (VIII) – Emperador (IIII) – Papa (V). Suman 22.',
      'El tarot siempre suma, nunca resta: el 9 es VIIII, no IX.',
      'Pareja material (Emperatriz-Emperador) se mira; pareja espiritual (Papisa-Papa) no.',
      'Ley del 3 + 1: tres elementos parecidos y uno distinto (el Mundo, el Enamorado…).',
      'Antes de leer, mira a la persona. El tarot es un camaleón al servicio de quien consulta.'
    ],
    practica: { t: 'La frase de los tronos', ruta: '#/tirar/tronos', d: 'Mira la frase II-III-VIII-IIII-V y léela como una frase.' },
    quiz: [
      { p: '¿Cuánto suman los 5 tronos (2+3+8+4+5)?', o: ['22: los Mayores', '21', '78'], ok: 0, e: 'La frase resume todos los Arcanos Mayores.' },
      { p: '¿Dónde apoya su cetro la Emperatriz?', o: ['En el aire', 'En su sexo', 'En el suelo'], ok: 1, e: 'Establece el poder a partir de sí misma. El Emperador lo sostiene en el aire.' },
      { p: 'La "ley del 3 + 1" dice que…', o: ['Hay que sacar 4 cartas', 'Hay tres elementos parecidos y uno distinto', 'Se suman tres números y se resta uno'], ok: 1, e: 'Como el Mundo: tres animales con aureola y uno sin ella.' },
      { p: '¿Qué hace el tarot con el futuro?', o: ['Lo predice', 'Nada: hay un abanico de futuros que cambia con tus pasos', 'Lo fija con la carta final'], ok: 1, e: '"Cada vez que adivinas el futuro, lo cambias".' }
    ] },
  { n: 5, video: 'qnUrK6FhzSM', titulo: 'El tarot es arte: cómo lee Jodorowsky',
    puntos: [
      'No hay tiradas obligatorias: cada persona inventa su manera de leer.',
      'Sus formas: 3 cartas; de tres en tres; carta cruzada (persona + problema); dos mazos (3 números del 1 al 22 + el azar).',
      'Estudia hacia dónde miran los personajes. Pero el sentido de una mirada depende de la posición en la frase.',
      'Los Menores enseñan a vivir; las 16 figuras son el puente a los Mayores.',
      'Nunca des consejos: son tomas de poder. Di "tienes una depresión que va a pasar", no "eres una deprimida".',
      'Sincronicidad: cada vez que preguntas, eres otro.'
    ],
    practica: { t: 'Tirada de 3 números', ruta: '#/tirar/numeros', d: 'Pide 3 números del 1 al 22 (o dítelos tú) y léelos como frase.' },
    quiz: [
      { p: '¿Cuál es la tirada "correcta" de Jodorowsky?', o: ['La cruz celta', 'Ninguna: cada cual inventa su forma; él usa sobre todo 3 cartas', 'Siempre 22 cartas'], ok: 1, e: '"El tarot es un pulpo: acepta la forma que le des".' },
      { p: 'Un personaje que mira "al pasado" al final de la frase…', o: ['Es siempre negativo', 'Mira todo lo que vivió en la frase', 'Hay que cambiarlo de lugar'], ok: 1, e: 'No hay cosas fijas: todo cambia según la posición.' },
      { p: 'En la carta cruzada, la carta de abajo (vertical) es…', o: ['La persona que tiene el problema', 'El futuro', 'El consejo'], ok: 0, e: 'Y la cruzada encima es el problema.' },
      { p: '¿Qué se ofrece en lugar de consejos?', o: ['Órdenes suaves', 'Elecciones: posibilidades para que la persona elija', 'Nada'], ok: 1, e: '"Esta es una posibilidad, esta es otra. Elige la que te conviene".' }
    ] },
  { n: 6, video: 'YHkt3o8N88A', titulo: 'El juego, los Menores como camino, el Carro y la Justicia',
    puntos: [
      'El tarot es un juego: cambia según quién juega. Cada lectura es un encuentro nuevo.',
      'Ejercicio: salirse del marco, prolongar las cartas.',
      'Mira a la persona por los 4 centros y por su vestido.',
      'El "animal" de preguntas: cartas formando un animal; donde cae la pregunta, responde la carta.',
      'Del 1 al 10 son grados de desarrollo en cada centro; las figuras son la vida cotidiana y social.',
      'Tirada de las dos series: I-X por un lado, XI-XXI por otro, y que se contesten.',
      'El alma traduce 4 lenguajes: palabras, sentimientos, deseos, necesidades.'
    ],
    practica: { t: 'Tirada de las dos series', ruta: '#/tirar/series', d: 'Saca una carta de I-X y otra de XI-XXI y haz que se contesten.' },
    quiz: [
      { p: 'Carro (VII) y Justicia (VIII) tienen en común…', o: ['Cuatro dedos en una mano', 'Un perro', 'Están desnudos'], ok: 0, e: 'No es casualidad: el número secreto del 4 es el 10.' },
      { p: 'Las figuras (Paje, Reina, Rey, Caballero) representan…', o: ['El futuro', 'La vida cotidiana y social', 'Los muertos'], ok: 1, e: 'No cuentan en el desarrollo espiritual: son la relación con el poder, la riqueza, la creatividad.' },
      { p: 'Los 4 lenguajes del alma son…', o: ['Palabras, sentimientos, deseos, necesidades', 'Fuego, agua, aire, tierra', 'Pasado, presente, futuro, destino'], ok: 0, e: 'Intelecto, emoción, sexo, cuerpo: un carro tirado por 4 caballos en la misma dirección.' },
      { p: 'Ante los "diablos" de alguien, Jodorowsky…', o: ['Los expulsa', 'Libera a la persona de sus cadenas para que sea lo que es', 'Los ignora'], ok: 1, e: '"No expulses al diablo: transfórmalo".' }
    ] },
  { n: 7, video: 'FKHBmNzetaA', titulo: 'La asimetría, las cartas que se parecen, los 4 palos',
    puntos: [
      'Lo sagrado niega la simetría: en el Marsella un lado nunca es igual al otro.',
      'Los personajes se salen del marco: están hechos para unirse (el mandala).',
      'Memoriza dibujo por dibujo, color por color. El detalle llega cuando ya lo memorizaste.',
      'Todas las cartas son positivas y negativas a la vez.',
      'Cartas que se parecen: Mat-XIII, Mago-Carro, Papisa-Papa, Emperatriz-Emperador, Rueda-Diablo, Ermitaño-Colgado, Casa Dios-Sol, Estrella-Mundo, Fuerza-Justicia-Templanza, Enamorado-Luna-Juicio.',
      'Orden de aprendizaje: Mayores → números → figuras. Figuras: Paje → Reina → Rey → Caballero. Palos: Oros → Bastos → Espadas/Copas.'
    ],
    practica: { t: 'Cartas que se parecen', ruta: '#/cartas', d: 'Abre cada carta y mira su sección "se parece a".' },
    quiz: [
      { p: '¿Qué cartas son las dos únicas cortadas en la cintura?', o: ['Mago y Carro', 'Papa y Papisa', 'Sol y Luna'], ok: 0, e: 'Misterio de la cintura para abajo.' },
      { p: '¿Qué tienen en común Estrella y Mundo?', o: ['Son las dos únicas mujeres desnudas', 'Tienen ladrillos', 'Miran al pasado'], ok: 0, e: '' },
      { p: '¿Cuál es el orden correcto de las figuras?', o: ['Rey, Reina, Caballero, Paje', 'Paje, Reina, Rey, Caballero', 'Caballero, Rey, Reina, Paje'], ok: 1, e: 'El Caballero va al final: sale del palacio hacia el palo siguiente.' },
      { p: 'Según Breton y Jodorowsky, lo sagrado…', o: ['Es simétrico', 'Niega la simetría', 'Solo usa el color azul'], ok: 1, e: '"Donde hay simetría hay muerte, no vida".' }
    ] },
  { n: 8, video: '6gZqA4LFkes', titulo: 'El abecedario, cómo mirar al consultante, los Pajes',
    puntos: [
      '22 Mayores como 22 letras: un abecedario existe cuando se mezclan las letras.',
      'Cada vez que pones una carta junto a otra se establece una relación.',
      'Mira a quien consulta de abajo hacia arriba: cuerpo, sexualidad, emoción, mente; luego interrógate a ti.',
      'Templanza tiene ojos amarillos: la carta que mira recibe su luz. La Emperatriz, ojos azules: recibe.',
      'Memorizar para no tener que comprender: "me lo trago y desde el centro él trabaja".',
      'Los cuatro Pajes dudan: ¿usar o guardar la espada?, ¿abrir o cerrar la copa?…'
    ],
    practica: { t: 'Mirar a la persona', ruta: '#/tirar', d: 'Antes de tu próxima tirada, recorre la lista "Mirar a quien consulta".' },
    quiz: [
      { p: '¿En qué orden se mira a quien consulta?', o: ['Mente, emoción, sexo, cuerpo', 'De abajo hacia arriba: cuerpo, sexualidad, emoción, mente', 'Solo la cara'], ok: 1, e: 'Y después te interrogas a ti mismo.' },
      { p: 'La carta a la que mira la Templanza…', o: ['Recibe su luz', 'Queda anulada', 'Es el pasado'], ok: 0, e: 'Sus ojos amarillos son luz: un ángel de la guarda.' },
      { p: 'El Paje de Oros tiene…', o: ['Una moneda en la mano y otra enterrada', 'Una espada y una vaina', 'Una copa cerrada'], ok: 0, e: 'No sabe si es rico o pobre: "el dinero no es malo ni bueno".' },
      { p: '¿Qué hace un detalle que "te salta" al leer?', o: ['Hay que ignorarlo', 'Tiene que ver contigo y con la persona: ese es el mensaje', 'Es un error de impresión'], ok: 1, e: 'El inconsciente da el detalle cuando ya memorizaste.' }
    ] },
  { n: 9, video: 'F9gJLVgMzlc', titulo: 'Numerología: el doble cuadrado',
    puntos: [
      'Cada carta es un rectángulo: un doble cuadrado (tierra abajo, cielo arriba, y en medio la historia humana).',
      'Espadas y Bastos activos; Copas y Oros receptivos.',
      'La escalera: el 1 es el marco; escalones 2-3, 4-5, 6-7, 8-9; el 10 cierra y abre ciclo.',
      'Pares receptivos (2-4-6-8), impares activos (3-5-7-9).',
      'Figuras: Paje = 2-3, Reina = 4-5, Rey = 6-7, Caballero = 8-9.',
      'Cuando sale un número, pregunta de qué palo es: así sabes en qué nivel del ser actúa.'
    ],
    practica: { t: 'La escalera de los números', ruta: '#/numeros', d: 'Recorre la escalera interactiva y haz la tirada "escalera de menores".' },
    quiz: [
      { p: '¿Qué significa el 4?', o: ['Explosión', 'Estabilidad', 'Crisis'], ok: 1, e: 'Una realidad estable donde hacer una vida.' },
      { p: '¿Qué significa el 9?', o: ['Crisis, sabiduría, despedida', 'Comienzo', 'Acumulación'], ok: 0, e: 'Retirarse al ser esencial y cambiar de etapa.' },
      { p: 'La Reina corresponde a los números…', o: ['2-3', '4-5', '8-9'], ok: 1, e: 'Paje 2-3, Reina 4-5, Rey 6-7, Caballero 8-9.' },
      { p: '¿Cuáles son los palos activos?', o: ['Copas y Oros', 'Espadas y Bastos', 'Todos'], ok: 1, e: 'Copas y Oros son receptivos.' }
    ] },
  { n: 10, video: 'B7cixPH9tQU', titulo: 'La estructura completa de los 22',
    puntos: [
      'El Mat al comienzo, el Mundo al final, y en medio dos filas de 10 (I-X y XI-XX).',
      'Cada carta de arriba forma pareja con la de abajo: no son contradictorias, son complementarias.',
      'Justicia y Luna: la madre humana y la divina. Ermitaño y Sol: el padre humano y el divino.',
      'Emperador y Templanza: la paz del mundo y la paz del corazón.',
      'El tarot no es para ver el futuro: hay que dar los pasos precisos.',
      '"Sé tú mismo y no seas nunca lo que los otros quieren que seas."'
    ],
    practica: { t: 'El mandala de los 22', ruta: '#/estructura', d: 'Mira la estructura completa y toca cada pareja.' },
    quiz: [
      { p: '¿Cuál es la pareja de la Justicia (VIII)?', o: ['La Luna (XVIII)', 'El Sol (XVIIII)', 'El Diablo (XV)'], ok: 0, e: 'El lado humano y el lado divino de la madre.' },
      { p: 'El Ermitaño y el Sol son…', o: ['El padre humano y el padre divino', 'Dos enemigos', 'La madre y el hijo'], ok: 0, e: 'La sabiduría y la luz y el amor para todos.' },
      { p: 'El XIII según Jodorowsky…', o: ['Anuncia una muerte', 'No mata: labra, limpia lo inútil y prepara el camino', 'Es la peor carta'], ok: 1, e: 'Su guadaña es una herramienta de labranza.' },
      { p: 'Las parejas n y n+10 son…', o: ['Contradictorias', 'Complementarias, como dedos de manos y pies', 'Iguales'], ok: 1, e: '' }
    ] }
];
