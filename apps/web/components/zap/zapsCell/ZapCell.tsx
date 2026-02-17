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
    <div onClick={onClick} className="zapcell">
      <div className="text-xl flex">
        <div className="zapcell-text">
          {index}. {name}
        </div>
      </div>
    </div>
  )
}
