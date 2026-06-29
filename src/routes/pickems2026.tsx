import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pickems2026')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/pickems2026"!</div>
}
