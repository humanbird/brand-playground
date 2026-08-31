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

export type WorkOrder = {
  id: string
  title: string
  customer: string
  location: string
  dueDate: string
  status: Status
  description: string
  items: { name: string; quantity: number }[]
}

export const workOrders: WorkOrder[] = [
  {
    id: 'A-2481',
    title: 'Replace cafeteria water dispenser filters',
    customer: 'Harborview Utilities',
    location: 'Harborview, 25 Dockyard Avenue',
    dueDate: 'Sep 2, 2026',
    status: 'open',
    description:
      'Scheduled filter replacement for two dispensers in the cafeteria. Access is available only between 7:00 and 9:00 a.m.; the serving area is occupied afterward.',
    items: [
      { name: 'FX-300 filter cartridge', quantity: 2 },
      { name: 'Standard gasket set', quantity: 2 },
    ],
  },
  {
    id: 'A-2477',
    title: 'Fault: CO₂ supply interrupted',
    customer: 'Green Valley Medical Center',
    location: 'Green Valley, 9 Willow Crescent',
    dueDate: 'Aug 30, 2026',
    status: 'in progress',
    description:
      'The unit has reported no pressure since Wednesday. A replacement cylinder is available on site; the connection is probably leaking. Contact Facilities, not the ward.',
    items: [
      { name: '6 bar pressure regulator', quantity: 1 },
      { name: '1.5 m CO₂ hose', quantity: 1 },
    ],
  },
  {
    id: 'A-2465',
    title: 'Commission new reception unit',
    customer: 'Riverstone Brewing Company',
    location: 'Riverstone, 250 Malt Lane',
    dueDate: 'Aug 27, 2026',
    status: 'completed',
    description:
      'Install and commission the unit in the visitor reception area. The reception team has been trained and the handover report signed.',
    items: [
      { name: 'Model L water dispenser', quantity: 1 },
      { name: 'Under-counter connection kit', quantity: 1 },
    ],
  },
]

export function workOrderById(id: string | null): WorkOrder | undefined {
  if (!id) return undefined
  return workOrders.find((workOrder) => workOrder.id === id)
}

export const statusColor: Record<Status, string> = {
  open: 'bg-surface text-ink-muted',
  'in progress': 'bg-accent text-on-accent',
  completed: 'bg-surface text-success',
}
