import { ChangeEvent, FC, ReactElement, useRef, useState } from 'react'

type FileInputProps = {
  children: (...args: any) => ReactElement
  onChange?: (...args: any) => void
  progress?: any
}
const FileInput: FC<FileInputProps> = ({ children, onChange, progress }) => {
  const [file, setFile] = useState<File>()

  // Create a reference to the hidden file input element
  const hiddenFileInput = useRef<HTMLInputElement>(null)

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const onClick = () => {
    hiddenFileInput?.current?.click()
  }

  const onRemoveClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.value = ''
    }
    setFile(undefined)
    onChange && onChange(null)
  }

  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files ? event.target.files[0] : undefined
    setFile(file)
    onChange && onChange(file)
  }

  return (
    <>
      {children({
        loading: !!progress,
        onClick,
        onRemoveClick,
        value: file,
      })}
      <input
        name="file"
        data-testid="file"
        className="hidden"
        type="file"
        onClick={() => {
          if (hiddenFileInput?.current) {
            hiddenFileInput.current.value = ''
          }
        }}
        ref={hiddenFileInput}
        onChange={handleChange}
      />
    </>
  )
}

export default FileInput
