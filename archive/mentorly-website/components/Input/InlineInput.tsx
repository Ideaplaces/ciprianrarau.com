import { HTMLProps, useState, VFC } from 'react'
import { Check, X as Cancel } from 'react-feather'

const Input = (props: any) => {
  return <input className="border border-darkGray border-r p-2 " {...props} />
}

type InlineInputProps = HTMLProps<HTMLButtonElement> & {
  testId: string
}
const InlineInput: VFC<InlineInputProps> = ({ name, testId, value }) => {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <div className="flex items-center">
        <Input value={value} name={name} data-testid={testId || name} />
        <button onClick={() => setEditing(false)}>
          <Check />
        </button>
        <button onClick={() => setEditing(false)}>
          <Cancel />
        </button>
      </div>
    )
  }

  return (
    <button
      className="py-2 border-transparent border"
      onClick={() => setEditing(true)}
    >
      {value}
    </button>
  )
}

export default InlineInput
