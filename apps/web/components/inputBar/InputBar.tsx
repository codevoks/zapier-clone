export const InputBar = ({
  inputType,
  inputPlaceholder,
  value,
  onChange,
}: {
  inputType: string
  inputPlaceholder: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  return (
    <div>
      <input
        className="input input-md"
        type={inputType}
        placeholder={inputPlaceholder}
        value={value}
        onChange={onChange}
      ></input>
    </div>
  )
}
