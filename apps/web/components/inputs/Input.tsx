export const Input = ({
  inputType,
  inputPlaceholder,
}: {
  inputType: string
  inputPlaceholder: string
}) => {
  return (
    <div>
      <input
        className="input input-md"
        type={inputType}
        placeholder={inputPlaceholder}
      ></input>
    </div>
  )
}
