import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/gettingstarted')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/gettingstarted"!</div>
}
