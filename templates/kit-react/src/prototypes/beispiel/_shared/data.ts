/*
 * Mockdaten des Prototyps `beispiel`.
 *
 * Alles unter _shared/ wird NICHT geroutet — hier leben Shell, Mockdaten und
 * Helfer, die sich die Screens eines Prototyps teilen.
 *
 * Realistische Inhalte statt Lorem Ipsum: erst an echten Namen, echten Längen
 * und echten Zuständen zeigt sich, ob ein Layout trägt.
 */

export type Status = 'offen' | 'in Arbeit' | 'erledigt'

export type Auftrag = {
  id: string
  titel: string
  kunde: string
  ort: string
  faellig: string
  status: Status
  beschreibung: string
  positionen: { bezeichnung: string; menge: number }[]
}

export const auftraege: Auftrag[] = [
  {
    id: 'A-2481',
    titel: 'Filterwechsel Wasserspender Kantine',
    kunde: 'Stadtwerke Nordhafen',
    ort: 'Nordhafen, Werftallee 25',
    faellig: '02.09.2026',
    status: 'offen',
    beschreibung:
      'Turnusmäßiger Filterwechsel an zwei Spendern im Kantinenbereich. Zugang nur zwischen 07:00 und 09:00 Uhr, danach ist die Ausgabe besetzt.',
    positionen: [
      { bezeichnung: 'Filterkartusche P3000', menge: 2 },
      { bezeichnung: 'Dichtungssatz Standard', menge: 2 },
    ],
  },
  {
    id: 'A-2477',
    titel: 'Störung: CO₂-Zufuhr unterbrochen',
    kunde: 'Klinikum Auental',
    ort: 'Auental, Lindenbogen 9',
    faellig: '30.08.2026',
    status: 'in Arbeit',
    beschreibung:
      'Gerät meldet seit Mittwoch keinen Druck. Ersatzflasche vor Ort vorhanden, Anschluss vermutlich undicht. Ansprechpartner ist die Haustechnik, nicht die Station.',
    positionen: [
      { bezeichnung: 'Druckminderer 6 bar', menge: 1 },
      { bezeichnung: 'CO₂-Schlauch 1,5 m', menge: 1 },
    ],
  },
  {
    id: 'A-2465',
    titel: 'Inbetriebnahme Neugerät Empfang',
    kunde: 'Brauerei Steinfeld',
    ort: 'Steinfeld, Hopfenweg 250',
    faellig: '27.08.2026',
    status: 'erledigt',
    beschreibung:
      'Aufstellung und Erstbefüllung im Besucherempfang. Einweisung des Empfangsteams erfolgt, Übergabeprotokoll unterschrieben.',
    positionen: [
      { bezeichnung: 'Wasserspender Modell L', menge: 1 },
      { bezeichnung: 'Anschlussset Untertisch', menge: 1 },
    ],
  },
]

export function auftragById(id: string | null): Auftrag | undefined {
  if (!id) return undefined
  return auftraege.find((auftrag) => auftrag.id === id)
}

export const statusFarbe: Record<Status, string> = {
  offen: 'bg-surface text-ink-muted',
  'in Arbeit': 'bg-accent text-on-accent',
  erledigt: 'bg-surface text-success',
}
