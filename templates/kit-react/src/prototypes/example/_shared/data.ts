/*
 * Mock data for the `example` prototype.
 *
 * Nothing under _shared/ is routed. It contains the shell, mock data, and
 * helpers shared by a prototype's screens.
 *
 * Realistic content instead of Lorem Ipsum: real names, lengths, and states are
 * necessary to determine whether a layout works.
 */

export type Status = 'open' | 'in progress' | 'completed'

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
    titel: 'Replace cafeteria water dispenser filters',
    kunde: 'Harborview Utilities',
    ort: 'Harborview, 25 Dockyard Avenue',
    faellig: 'Sep 2, 2026',
    status: 'open',
    beschreibung:
      'Scheduled filter replacement for two dispensers in the cafeteria. Access is available only between 7:00 and 9:00 a.m.; the serving area is occupied afterward.',
    positionen: [
      { bezeichnung: 'P3000 filter cartridge', menge: 2 },
      { bezeichnung: 'Standard gasket set', menge: 2 },
    ],
  },
  {
    id: 'A-2477',
    titel: 'Fault: CO₂ supply interrupted',
    kunde: 'Green Valley Medical Center',
    ort: 'Green Valley, 9 Willow Crescent',
    faellig: 'Aug 30, 2026',
    status: 'in progress',
    beschreibung:
      'The unit has reported no pressure since Wednesday. A replacement cylinder is available on site; the connection is probably leaking. Contact Facilities, not the ward.',
    positionen: [
      { bezeichnung: '6 bar pressure regulator', menge: 1 },
      { bezeichnung: '1.5 m CO₂ hose', menge: 1 },
    ],
  },
  {
    id: 'A-2465',
    titel: 'Commission new reception unit',
    kunde: 'Riverstone Brewing Company',
    ort: 'Riverstone, 250 Malt Lane',
    faellig: 'Aug 27, 2026',
    status: 'completed',
    beschreibung:
      'Install and commission the unit in the visitor reception area. The reception team has been trained and the handover report signed.',
    positionen: [
      { bezeichnung: 'Model L water dispenser', menge: 1 },
      { bezeichnung: 'Under-counter connection kit', menge: 1 },
    ],
  },
]

export function auftragById(id: string | null): Auftrag | undefined {
  if (!id) return undefined
  return auftraege.find((auftrag) => auftrag.id === id)
}

export const statusFarbe: Record<Status, string> = {
  open: 'bg-surface text-ink-muted',
  'in progress': 'bg-accent text-on-accent',
  completed: 'bg-surface text-success',
}
