export function ZapCell({
  name,
  index,
  onClick,
}: {
  name?: string
  index: number
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="border border-black py-8 px-8 flex w-[300px] justify-center cursor-pointer"
    >
      <div className="text-xl flex">
        <div className="font-bold">{index}. </div>
        <div>{name}</div>
      </div>
    </div>
  )
}
