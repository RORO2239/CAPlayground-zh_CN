"use client"

import { Databuddy } from "@databuddy/sdk"

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Databuddy
        clientId="OkGs3cck0KW3jtcYV_N8j"
        enableBatching={true}
      />
    </>
  )
}

export default AppLayout
