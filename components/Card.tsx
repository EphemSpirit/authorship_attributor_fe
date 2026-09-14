import Link from "next/link"

export default function Card({
  title,
  href,
  children,
}: {
  title: string,
  href: string
  children: React.ReactNode
}) {
  return (
    <Link href={href || "#"} className="rounded-lg border border-black p-5 hover:text-white">
      <div className="font-bold text-xl pb-2">{title}</div>
      <p className="text-sm text-black">{children}</p>
    </Link>
  )
}
