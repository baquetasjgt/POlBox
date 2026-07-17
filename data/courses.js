// POLEBOX — catálogo de cursos online.

const COURSE_CATALOG = [
  {
    id: 'curso-basico',
    name: 'Pole Dance Básico',
    level: 'Básico',
    desc: 'Aprende desde cero: agarre, giros, transiciones y tu primera coreografía. Ideal si nunca has entrenado en barra.',
    longDesc: 'Diez clases en vídeo diseñadas para llevarte de cero a tu primera coreografía completa. Cada clase se construye sobre la anterior: empezamos por la seguridad y el agarre, pasamos por los primeros giros y bajadas, y terminamos montando una mini-coreografía que podrás grabar y quedarte.',
    classes: 10, totalMin: 480,
    price: 49,
    accent: '#80E3B7',
    bg: 'linear-gradient(140deg, #1a4a35, #0a2018)',
    includes: ['10 vídeo-clases', '8h de contenido', 'Chromecast · AirPlay', 'Acceso de por vida', 'Subtítulos en español'],
    lessons: [
      { n:  1, title: 'Introducción y seguridad en la barra', min: 30, desc: 'Conoce las partes de la barra, los tipos de agarre y las normas de seguridad esenciales para entrenar sin riesgo desde el primer día.' },
      { n:  2, title: 'Agarre básico: el gancho',            min: 45, desc: 'Los dos agarres fundamentales del pole (normal e invertido). Aprenderás el gancho de pierna y la postura correcta para girar.' },
      { n:  3, title: 'Giro básico de frente',               min: 45, desc: 'Tu primer giro: posición de arranque, impulso y postura en el aire. Lo repetimos hasta que salga solo, con y sin música.' },
      { n:  4, title: 'Giro básico de espalda',              min: 45, desc: 'Variación del giro hacia la espalda. Coordinación de brazos y piernas para un giro limpio y controlado.' },
      { n:  5, title: 'Bajada en serpiente',                 min: 50, desc: 'Primera bajada controlada desde la barra. Técnica de enrolle de pierna y descenso suave hasta el suelo.' },
      { n:  6, title: 'Sentada en la barra',                 min: 45, desc: 'Cómo sentarte y mantenerte suspendida usando la fuerza de muslos y caderas, sin depender de las manos.' },
      { n:  7, title: 'Caminata y transiciones',             min: 45, desc: 'Enlaza movimientos en el suelo con la barra. Fluidez entre posiciones, sin cortes ni pausas visibles.' },
      { n:  8, title: 'Combinación básica',                  min: 60, desc: 'Combinas el giro de frente, la sentada y la bajada en una secuencia de tres elementos encadenados.' },
      { n:  9, title: 'Trucos de suelo',                     min: 50, desc: 'Floor moves: ondulaciones, arabeska y rollouts que complementan tu danza al pie de la barra.' },
      { n: 10, title: 'Coreografía final básica',            min: 65, desc: 'Montas tu primera mini-coreografía con todo lo aprendido. La grabas y te la llevas como recuerdo.' },
    ],
  },
  {
    id: 'curso-intermedio',
    name: 'Pole Dance Intermedio',
    level: 'Intermedio',
    desc: 'Inversiones, ayesha, firefly, drops y coreografía de nivel medio. Requiere haber completado el curso básico.',
    longDesc: 'Diez clases que llevan tu pole al siguiente nivel: aprenderás tu primera inversión real, el Ayesha, el Firefly y los drops que dan espectacularidad a cualquier coreografía. Cada clase incluye correcciones de seguridad y variantes de dificultad ajustable.',
    classes: 10, totalMin: 590,
    price: 69,
    accent: '#c9a8ff',
    bg: 'linear-gradient(140deg, #3e1478, #1f0844)',
    includes: ['10 vídeo-clases', '9h 50min de contenido', 'Chromecast · AirPlay', 'Acceso de por vida', 'Subtítulos en español'],
    lessons: [
      { n:  1, title: 'Revisión y extensión del básico',  min: 45, desc: 'Refuerza los elementos del nivel básico y añade correcciones posturales antes de pasar a movimientos más exigentes.' },
      { n:  2, title: 'Inversa básica: preparación',      min: 50, desc: 'Acondicionamiento de abdominales y hombros específico para la primera inversión. La seguridad es lo primero.' },
      { n:  3, title: 'Pole sit y Chopper',               min: 60, desc: 'Aprende a sentarte en la barra sin manos y el Chopper: tu primera inversión real con apoyo de pierna.' },
      { n:  4, title: 'Ganchos de rodilla',               min: 55, desc: 'Ganchos avanzados que liberan ambas manos para crear líneas expresivas y preparar drops.' },
      { n:  5, title: 'Ayesha: introducción',             min: 60, desc: 'El movimiento más icónico del pole. Aprenderás la versión asistida con una progresión segura paso a paso.' },
      { n:  6, title: 'Spins encadenados',                min: 55, desc: 'Combina dos o tres giros seguidos sin tocar el suelo. Trabajo de timing y centrifugación.' },
      { n:  7, title: 'Firefly y Superman',               min: 60, desc: 'Dos extends clásicos de nivel intermedio. Líneas largas con apoyo de cadera o muslo.' },
      { n:  8, title: 'Drops intermedios',                min: 65, desc: 'Caídas controladas desde la barra que añaden drama y expresividad a cualquier secuencia.' },
      { n:  9, title: 'Combinaciones en barra',           min: 60, desc: 'Secuencias de 4-6 movimientos encadenados. Foco en la fluidez y la musicalidad.' },
      { n: 10, title: 'Coreografía final intermedia',     min: 80, desc: 'Coreografía completa de nivel intermedio. La filmas, la revisas y la analizas con el tutor.' },
    ],
  },
];

window.COURSE_CATALOG = COURSE_CATALOG;
