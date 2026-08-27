import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/two-factor')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/two-factor"!</div>
}
