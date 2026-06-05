export const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export const DAY_LABELS = {
  monday: 'Lun',
  tuesday: 'Mar',
  wednesday: 'Mié',
  thursday: 'Jue',
  friday: 'Vie',
  saturday: 'Sáb',
  sunday: 'Dom',
}

export const DAY_NAMES = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
}

// Days with training (5 active slots/week)
export const ACTIVE_DAYS = ['monday', 'tuesday', 'wednesday', 'friday', 'saturday']

// Days that are always rest
export const REST_DAYS = ['thursday', 'sunday']

export const REST_SESSION = {
  id: 'descanso',
  label: 'Descanso',
  tag: 'Recuperación activa',
  type: 'rest',
  color: 'slate',
  exercises: [],
}

// ─────────────────────────────────────────────────────────────
// 6-session rotating cycle
// Slot mapping per week: Mon→0, Tue→1, Wed→2, Fri→3, Sat→4
// Cycle: EmpujeA → JalónA → PiernaA → EmpujeB → JalónB → PiernaB → repeat
// ─────────────────────────────────────────────────────────────
export const WORKOUT_CYCLE = [
  // ── 0: Empuje A ──────────────────────────────────────────
  {
    id: 'empuje-a',
    label: 'Empuje A',
    tag: 'Pecho · Hombro · Tríceps',
    type: 'strength',
    color: 'blue',
    exercises: [
      {
        id: 'banco-plano',
        name: 'Banco Plano',
        muscles: ['Pecho', 'Deltoides Anterior', 'Tríceps'],
        description:
          'Movimiento compuesto principal de empuje horizontal. Mantén la retracción escapular y un leve arco lumbar. Baja la barra al pecho inferior de forma controlada y empuja de vuelta al bloqueo.',
        guide: { type: 'youtube', src: 'https://www.youtube.com/watch?v=tuwHzzPdaGc', placeholder: 'banco-plano' },
        restSeconds: 120,
        sets: [
          { id: 0, reps: 8, targetWeight: 60 },
          { id: 1, reps: 8, targetWeight: 65 },
          { id: 2, reps: 6, targetWeight: 70 },
          { id: 3, reps: 6, targetWeight: 70 },
        ],
      },
      {
        id: 'aperturas-cabina',
        name: 'Aperturas en Cabina',
        muscles: ['Pecho', 'Serratum Anterior'],
        description:
          'Poleas altas. Ligera inclinación hacia adelante. Mantén los codos a 15° de flexión fija durante todo el movimiento. Aprieta en el punto de máxima contracción al centro.',
        guide: { type: 'image', src: 'https://cdn.shopify.com/s/files/1/1497/9682/files/MicrosoftTeams-image_5_c40117c8-4452-4801-b272-c56dcde1c0f0.jpg?v=1659021798', placeholder: 'aperturas-cabina' },
        restSeconds: 60,
        sets: [
          { id: 0, reps: 12, targetWeight: 15 },
          { id: 1, reps: 12, targetWeight: 15 },
          { id: 2, reps: 10, targetWeight: 17 },
        ],
      },
      {
        id: 'lagartijas',
        name: 'Lagartijas',
        muscles: ['Pecho', 'Deltoides', 'Tríceps'],
        description:
          'Cuerpo completamente recto de cabeza a talones. Baja el pecho hasta casi tocar el suelo. Empuja de forma explosiva hacia arriba. Manos a la anchura del hombro.',
        guide: { type: 'youtube', src: 'https://www.youtube.com/watch?v=KEFQyLkDYtI', placeholder: 'lagartijas' },
        restSeconds: 60,
        sets: [
          { id: 0, reps: 15, targetWeight: 0 },
          { id: 1, reps: 15, targetWeight: 0 },
          { id: 2, reps: 12, targetWeight: 0 },
        ],
      },
      {
        id: 'elevaciones-laterales-a',
        name: 'Elevaciones Laterales',
        muscles: ['Deltoides Medial'],
        description:
          'Ligera inclinación del torso hacia adelante. Lidera con los codos, no con las muñecas. Llega a la altura del hombro. El descenso lento y controlado es fundamental para el crecimiento.',
        guide: { type: 'image', src: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif', placeholder: 'elevaciones-laterales' },
        restSeconds: 60,
        sets: [
          { id: 0, reps: 15, targetWeight: 8 },
          { id: 1, reps: 15, targetWeight: 8 },
          { id: 2, reps: 12, targetWeight: 10 },
        ],
      },
      {
        id: 'polea-al-frente',
        name: 'Polea al Frente',
        muscles: ['Deltoides Anterior', 'Pecho Superior'],
        description:
          'Polea en posición baja. Eleva el brazo extendido hacia el frente hasta la altura del hombro con el codo levemente flexionado. Controla el retorno y evita el balanceo.',
        guide: { type: 'image', src: null, placeholder: 'polea-frente' },
        restSeconds: 60,
        sets: [
          { id: 0, reps: 12, targetWeight: 10 },
          { id: 1, reps: 12, targetWeight: 12 },
          { id: 2, reps: 10, targetWeight: 12 },
        ],
      },
      {
        id: 'jalones-polea-triceps-a',
        name: 'Jalones con Polea',
        muscles: ['Tríceps Cabeza Larga', 'Cabeza Lateral'],
        description:
          'Codos pegados a los costados durante todo el movimiento. Usa cuerda o barra en V. Extiende completamente y separa la cuerda al fondo. Controla el retorno lentamente.',
        guide: { type: 'image', src: null, placeholder: 'jalones-triceps' },
        restSeconds: 60,
        sets: [
          { id: 0, reps: 12, targetWeight: 20 },
          { id: 1, reps: 12, targetWeight: 22 },
          { id: 2, reps: 10, targetWeight: 25 },
        ],
      },
      {
        id: 'copa-mancuerna',
        name: 'Copa con Mancuerna',
        muscles: ['Tríceps Cabeza Larga'],
        description:
          'Sujeta una mancuerna con ambas manos sobre la cabeza en agarre de copa. Baja detrás de la nuca manteniendo los codos apuntando al techo. Extiende hasta bloqueo completo.',
        guide: { type: 'image', src: null, placeholder: 'copa-mancuerna' },
        restSeconds: 60,
        sets: [
          { id: 0, reps: 12, targetWeight: 16 },
          { id: 1, reps: 12, targetWeight: 18 },
          { id: 2, reps: 10, targetWeight: 20 },
        ],
      },
    ],
  },

  // ── 1: Jalón A ───────────────────────────────────────────
  {
    id: 'jalon-a',
    label: 'Jalón A',
    tag: 'Espalda · Trapecio · Bíceps',
    type: 'strength',
    color: 'violet',
    exercises: [
      {
        id: 'peso-muerto-a',
        name: 'Peso Muerto',
        muscles: ['Erectores', 'Glúteos', 'Isquiotibiales', 'Trapecios'],
        description:
          'Barra sobre el metatarso, posición de cadera. Activa los dorsales antes de jalar. Empuja el suelo con los pies — no jales la barra. Mantén la columna neutral durante todo el movimiento.',
        guide: { type: 'video', src: null, placeholder: 'peso-muerto' },
        restSeconds: 180,
        sets: [
          { id: 0, reps: 5, targetWeight: 80 },
          { id: 1, reps: 5, targetWeight: 90 },
          { id: 2, reps: 3, targetWeight: 100 },
          { id: 3, reps: 3, targetWeight: 100 },
        ],
      },
      {
        id: 'jalones-barra',
        name: 'Jalones con Barra',
        muscles: ['Dorsal Ancho', 'Bíceps', 'Redondo Mayor'],
        description:
          'Agarre prono ancho. Jala hasta el pecho superior liderando con los codos hacia las caderas. Ligera inclinación hacia atrás. Aprieta los dorsales en el punto de máxima contracción.',
        guide: { type: 'video', src: null, placeholder: 'jalones-barra' },
        restSeconds: 90,
        sets: [
          { id: 0, reps: 10, targetWeight: 50 },
          { id: 1, reps: 10, targetWeight: 55 },
          { id: 2, reps: 8, targetWeight: 60 },
          { id: 3, reps: 8, targetWeight: 60 },
        ],
      },
      {
        id: 'elevaciones-polea-trapecio',
        name: 'Elevaciones con Polea (Trapecio)',
        muscles: ['Trapecio Superior', 'Elevador de Escápula'],
        description:
          'Polea baja, agarre neutro. Encoge los hombros verticalmente hacia las orejas sin rotar. Mantén 1 segundo en la cima. Descenso lento y controlado.',
        guide: { type: 'image', src: null, placeholder: 'elevaciones-polea' },
        restSeconds: 60,
        sets: [
          { id: 0, reps: 15, targetWeight: 20 },
          { id: 1, reps: 15, targetWeight: 22 },
          { id: 2, reps: 12, targetWeight: 25 },
        ],
      },
      {
        id: 'predicador-polea',
        name: 'Predicador con Polea',
        muscles: ['Bíceps Braquial', 'Braquial'],
        description:
          'Codo apoyado firmemente en la almohadilla del banco predicador. Flexión completa hasta contracción máxima con supinación en la cima. Descenso controlado con estiramiento completo.',
        guide: { type: 'image', src: null, placeholder: 'predicador' },
        restSeconds: 60,
        sets: [
          { id: 0, reps: 12, targetWeight: 15 },
          { id: 1, reps: 12, targetWeight: 17 },
          { id: 2, reps: 10, targetWeight: 20 },
        ],
      },
      {
        id: 'barra-z-biceps-a',
        name: 'Barra Z (Bíceps)',
        muscles: ['Bíceps Braquial', 'Braquiorradial'],
        description:
          'Agarre supinado en la barra Z, separación al ancho de hombros. Minimiza el movimiento del codo hacia adelante. Aprieta en el punto máximo de contracción. Descenso de 2 segundos.',
        guide: { type: 'image', src: null, placeholder: 'barra-z' },
        restSeconds: 75,
        sets: [
          { id: 0, reps: 10, targetWeight: 25 },
          { id: 1, reps: 10, targetWeight: 27 },
          { id: 2, reps: 8, targetWeight: 30 },
        ],
      },
    ],
  },

  // ── 2: Pierna A ──────────────────────────────────────────
  {
    id: 'pierna-a',
    label: 'Pierna A',
    tag: 'Cuádriceps · Glúteos',
    type: 'strength',
    color: 'emerald',
    exercises: [
      {
        id: 'sentadillas',
        name: 'Sentadillas',
        muscles: ['Cuádriceps', 'Glúteos', 'Isquiotibiales', 'Core'],
        description:
          'Barra en posición alta. Rompe en cadera y rodillas simultáneamente. Empuja las rodillas hacia afuera sobre la línea del pie. Profundidad paralela o por debajo. Columna neutral.',
        guide: { type: 'video', src: null, placeholder: 'sentadillas' },
        restSeconds: 180,
        sets: [
          { id: 0, reps: 8, targetWeight: 70 },
          { id: 1, reps: 6, targetWeight: 80 },
          { id: 2, reps: 5, targetWeight: 90 },
          { id: 3, reps: 5, targetWeight: 90 },
        ],
      },
      {
        id: 'empuje-cadera-barra',
        name: 'Empuje de Cadera con Barra',
        muscles: ['Glúteos', 'Isquiotibiales', 'Core'],
        description:
          'Espalda apoyada en banco a la altura de las escápulas. Barra sobre la cadera con almohadilla de protección. Empuja la cadera hacia arriba hasta extensión completa. Aprieta los glúteos en la cima.',
        guide: { type: 'image', src: null, placeholder: 'hip-thrust' },
        restSeconds: 90,
        sets: [
          { id: 0, reps: 12, targetWeight: 60 },
          { id: 1, reps: 12, targetWeight: 70 },
          { id: 2, reps: 10, targetWeight: 80 },
        ],
      },
      {
        id: 'extension-pierna',
        name: 'Extensión de Pierna',
        muscles: ['Cuádriceps'],
        description:
          'Aislamiento completo de cuádriceps. Extiende hasta bloqueo y mantén 1 segundo de contracción. Descenso controlado. No permitas que las rodillas se bloqueen de golpe.',
        guide: { type: 'image', src: null, placeholder: 'extension-pierna' },
        restSeconds: 60,
        sets: [
          { id: 0, reps: 15, targetWeight: 40 },
          { id: 1, reps: 15, targetWeight: 45 },
          { id: 2, reps: 12, targetWeight: 50 },
        ],
      },
    ],
  },

  // ── 3: Empuje B ──────────────────────────────────────────
  {
    id: 'empuje-b',
    label: 'Empuje B',
    tag: 'Pecho · Hombro · Tríceps',
    type: 'strength',
    color: 'rose',
    exercises: [
      {
        id: 'fondos',
        name: 'Fondos (Dips)',
        muscles: ['Pecho Inferior', 'Deltoides Anterior', 'Tríceps'],
        description:
          'Inclínate hacia adelante para énfasis en pecho. Baja hasta que los hombros queden por debajo de los codos. Extiende hasta bloqueo completo. Agrega peso con cinturón si es posible.',
        guide: { type: 'youtube', src: 'https://www.youtube.com/watch?v=FG1ENBFsdHU', placeholder: 'fondos' },
        restSeconds: 90,
        sets: [
          { id: 0, reps: 10, targetWeight: 0 },
          { id: 1, reps: 10, targetWeight: 0 },
          { id: 2, reps: 8, targetWeight: 0 },
          { id: 3, reps: 8, targetWeight: 0 },
        ],
      },
      {
        id: 'apertura-mancuernas',
        name: 'Apertura con Mancuernas',
        muscles: ['Pecho', 'Deltoides Anterior'],
        description:
          'Banco plano o ligeramente inclinado. Baja abriendo los brazos con el codo levemente flexionado. Siente el estiramiento máximo del pecho. Cierra sin chocar las mancuernas.',
        guide: { type: 'youtube', src: 'https://www.youtube.com/watch?v=-lcbvOddoi8', placeholder: 'apertura-mancuernas' },
        restSeconds: 60,
        sets: [
          { id: 0, reps: 12, targetWeight: 14 },
          { id: 1, reps: 12, targetWeight: 16 },
          { id: 2, reps: 10, targetWeight: 18 },
        ],
      },
      {
        id: 'banco-inclinado-mancuernas',
        name: 'Banco Inclinado con Mancuernas',
        muscles: ['Pecho', 'Deltoides Anterior', 'Tríceps'],
        description:
          'Mayor rango de movimiento que la barra. Controla el descenso en 3 segundos. Enfócate en sentir el estiramiento del pecho en el punto más bajo antes de empujar.',
        guide: { type: 'youtube', src: 'https://www.youtube.com/watch?v=8nNi8jbbUPE', placeholder: 'banco-inclinado-mancuernas' },
        restSeconds: 90,
        sets: [
          { id: 0, reps: 10, targetWeight: 24 },
          { id: 1, reps: 8, targetWeight: 26 },
          { id: 2, reps: 8, targetWeight: 28 },
        ],
      },
      {
        id: 'elevaciones-frontales',
        name: 'Elevaciones Frontales',
        muscles: ['Deltoides Anterior'],
        description:
          'Mancuerna o disco. Brazo extendido, eleva hacia el frente hasta ligeramente por encima de la línea del hombro. Descenso lento y controlado para máximo estímulo.',
        guide: { type: 'image', src: null, placeholder: 'elevaciones-frontales' },
        restSeconds: 60,
        sets: [
          { id: 0, reps: 12, targetWeight: 8 },
          { id: 1, reps: 12, targetWeight: 10 },
          { id: 2, reps: 10, targetWeight: 10 },
        ],
      },
      {
        id: 'vuelos',
        name: 'Vuelos (Deltoides Posterior)',
        muscles: ['Deltoides Posterior', 'Romboides'],
        description:
          'Inclinación hacia adelante a 45°. Mancuernas cuelgan al frente. Abre los brazos hacia los lados con el codo levemente doblado hasta la altura del hombro. Aprieta espalda alta.',
        guide: { type: 'image', src: null, placeholder: 'vuelos' },
        restSeconds: 60,
        sets: [
          { id: 0, reps: 15, targetWeight: 8 },
          { id: 1, reps: 15, targetWeight: 8 },
          { id: 2, reps: 12, targetWeight: 10 },
        ],
      },
      {
        id: 'lagartijas-diamante',
        name: 'Lagartijas en Diamante',
        muscles: ['Tríceps', 'Pecho Interior'],
        description:
          'Manos formando un rombo directamente bajo el esternón. Mayor activación del tríceps versus la lagartija estándar. Mantén el cuerpo completamente recto.',
        guide: { type: 'image', src: null, placeholder: 'lagartijas-diamante' },
        restSeconds: 60,
        sets: [
          { id: 0, reps: 12, targetWeight: 0 },
          { id: 1, reps: 12, targetWeight: 0 },
          { id: 2, reps: 10, targetWeight: 0 },
        ],
      },
      {
        id: 'barra-z-triceps',
        name: 'Barra Z (Tríceps)',
        muscles: ['Tríceps'],
        description:
          'Acostado en banco. Baja la barra Z hacia la frente manteniendo los codos apuntando al techo y estáticos. Extiende hasta el bloqueo sin abrir los codos hacia los lados.',
        guide: { type: 'image', src: null, placeholder: 'barra-z-triceps' },
        restSeconds: 75,
        sets: [
          { id: 0, reps: 10, targetWeight: 20 },
          { id: 1, reps: 10, targetWeight: 22 },
          { id: 2, reps: 8, targetWeight: 25 },
        ],
      },
    ],
  },

  // ── 4: Jalón B ───────────────────────────────────────────
  {
    id: 'jalon-b',
    label: 'Jalón B',
    tag: 'Espalda · Trapecio · Bíceps',
    type: 'strength',
    color: 'cyan',
    exercises: [
      {
        id: 'dominadas',
        name: 'Dominadas',
        muscles: ['Dorsal Ancho', 'Bíceps', 'Redondo Mayor'],
        description:
          'Agarre prono. Cuelga completamente antes de cada repetición. Jala hasta que el mentón supere la barra liderando con los codos. Descenso controlado hasta extensión total.',
        guide: { type: 'video', src: null, placeholder: 'dominadas' },
        restSeconds: 120,
        sets: [
          { id: 0, reps: 8, targetWeight: 0 },
          { id: 1, reps: 6, targetWeight: 0 },
          { id: 2, reps: 6, targetWeight: 0 },
          { id: 3, reps: 5, targetWeight: 0 },
        ],
      },
      {
        id: 'jalones-polea-espalda',
        name: 'Jalones con Polea',
        muscles: ['Dorsal Ancho', 'Bíceps', 'Teres Mayor'],
        description:
          'Agarre prono ancho. Jala hasta el pecho superior. Lidera con los codos hacia las caderas. Ligera inclinación hacia atrás. Aprieta dorsales en la posición más baja.',
        guide: { type: 'video', src: null, placeholder: 'jalones-polea' },
        restSeconds: 90,
        sets: [
          { id: 0, reps: 10, targetWeight: 45 },
          { id: 1, reps: 10, targetWeight: 50 },
          { id: 2, reps: 8, targetWeight: 55 },
        ],
      },
      {
        id: 'elevaciones-barra-trapecio',
        name: 'Elevaciones con Barra (Trapecio)',
        muscles: ['Trapecio Superior', 'Deltoides Posterior'],
        description:
          'Barra colgando con agarre prono. Encoge los hombros verticalmente hacia las orejas sin rotar. Pausa de 1 segundo en la cima. Descenso lento con estiramiento completo.',
        guide: { type: 'image', src: null, placeholder: 'elevaciones-barra' },
        restSeconds: 60,
        sets: [
          { id: 0, reps: 12, targetWeight: 40 },
          { id: 1, reps: 12, targetWeight: 45 },
          { id: 2, reps: 10, targetWeight: 50 },
        ],
      },
      {
        id: 'polea-biceps',
        name: 'Polea (Bíceps)',
        muscles: ['Bíceps Braquial', 'Braquial'],
        description:
          'Polea baja con cuerda o barra recta. Codo fijo durante toda la ejecución. Flexiona completamente y aprieta en la cima. Descenso lento con estiramiento completo en el fondo.',
        guide: { type: 'image', src: null, placeholder: 'polea-biceps' },
        restSeconds: 60,
        sets: [
          { id: 0, reps: 12, targetWeight: 15 },
          { id: 1, reps: 12, targetWeight: 17 },
          { id: 2, reps: 10, targetWeight: 20 },
        ],
      },
      {
        id: 'martillo',
        name: 'Martillo',
        muscles: ['Braquial', 'Braquiorradial'],
        description:
          'Agarre neutro durante todo el movimiento. Alterna brazos o ejecuta simultáneamente. Mantén el torso erguido sin balanceo. Prioriza el braquial para mayor grosor de brazo.',
        guide: { type: 'image', src: null, placeholder: 'martillo' },
        restSeconds: 60,
        sets: [
          { id: 0, reps: 12, targetWeight: 14 },
          { id: 1, reps: 12, targetWeight: 16 },
          { id: 2, reps: 10, targetWeight: 18 },
        ],
      },
    ],
  },

  // ── 5: Pierna B ──────────────────────────────────────────
  {
    id: 'pierna-b',
    label: 'Pierna B',
    tag: 'Isquiotibiales · Pantorrilla',
    type: 'strength',
    color: 'amber',
    exercises: [
      {
        id: 'buenos-dias',
        name: 'Buenos Días',
        muscles: ['Isquiotibiales', 'Glúteos', 'Erectores'],
        description:
          'Barra en la espalda alta. Rodillas levemente flexionadas. Bisagra de cadera empujando los glúteos hacia atrás. Siente el estiramiento máximo en isquiotibiales. Levanta extendiendo la cadera.',
        guide: { type: 'video', src: null, placeholder: 'buenos-dias' },
        restSeconds: 90,
        sets: [
          { id: 0, reps: 10, targetWeight: 40 },
          { id: 1, reps: 10, targetWeight: 45 },
          { id: 2, reps: 8, targetWeight: 50 },
          { id: 3, reps: 8, targetWeight: 50 },
        ],
      },
      {
        id: 'peso-muerto-rumano',
        name: 'Peso Muerto Rumano',
        muscles: ['Isquiotibiales', 'Glúteos', 'Erectores'],
        description:
          'Rodillas semiflexionadas y fijas. Barra desliza por los muslos hacia abajo mientras empujas las caderas hacia atrás. Estiramiento máximo en isquiotibiales. Extiende la cadera para volver.',
        guide: { type: 'image', src: null, placeholder: 'peso-muerto-rumano' },
        restSeconds: 120,
        sets: [
          { id: 0, reps: 10, targetWeight: 60 },
          { id: 1, reps: 10, targetWeight: 65 },
          { id: 2, reps: 8, targetWeight: 70 },
        ],
      },
      {
        id: 'pantorrilla',
        name: 'Elevación de Pantorrilla',
        muscles: ['Gastrocnemio', 'Sóleo'],
        description:
          'Estiramiento completo en el fondo con pausa de 1 segundo. Sube de puntillas hasta la cima, mantén 1 segundo apretando la pantorrilla. Descenso lento de 3 segundos.',
        guide: { type: 'image', src: null, placeholder: 'pantorrilla' },
        restSeconds: 45,
        sets: [
          { id: 0, reps: 20, targetWeight: 40 },
          { id: 1, reps: 20, targetWeight: 45 },
          { id: 2, reps: 15, targetWeight: 50 },
        ],
      },
    ],
  },
]
