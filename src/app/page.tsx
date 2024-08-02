import { auth } from "@/auth"

export default async function Page() {
  const session = await auth()

  if (!session) {
    return (
      <div className="flex items-center justify-center">
        Not authenticated
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}
