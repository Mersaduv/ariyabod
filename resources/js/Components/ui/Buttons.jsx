import InlineLoading from "../loading/InlineLoading"

export const Button = (props) => {
  // ? Props
  const { type = 'button', isLoading = false, children, className = '', i } = props

  // ? Render
  return (
    <button
      type={type}
      disabled={isLoading}
      className={`button ${className}
      `}
    >
      {isLoading ? <InlineLoading /> : children}
    </button>
  )
}
