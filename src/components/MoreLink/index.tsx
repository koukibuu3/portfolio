import { IoIosArrowDown } from 'react-icons/io'

type Props = {
  action: () => void
  disabled?: boolean
}

export const MoreLink: React.FC<Props> = ({ action, disabled }) => {
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <li className="col-span-3">
      <button
        className={`text-md border rounded-sm p-2 w-full mx-auto flex items-center justify-center gap-2 ${disabledClass}`}
        onClick={action}
        disabled={disabled}
      >
        Next <IoIosArrowDown />
      </button>
    </li>
  )
}
