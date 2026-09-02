export default function Card({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-black p-5">
      <div className="font-bold text-xl pb-2">{title}</div>
      <p className="text-sm text-black">{children}</p>
    </div>
  )
}
