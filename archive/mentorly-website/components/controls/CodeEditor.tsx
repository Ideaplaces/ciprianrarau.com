import { FieldHookConfig, useField, useFormikContext } from 'formik'
import dynamic from 'next/dynamic'
import { VFC } from 'react'

const TextAreaCodeEditor = dynamic<any>(
  () => import('@uiw/react-textarea-code-editor').then((mod) => mod.default),
  { ssr: false }
)

type CodeEditorProps = {
  readOnly: boolean
  email: boolean
}

type useFieldProps = string | FieldHookConfig<any>

const CodeEditor: VFC<CodeEditorProps> = ({ readOnly, email, ...props }) => {
  const { setFieldValue } = useFormikContext()
  const [field] = useField(props as useFieldProps)
  const setValue = (val: any) => {
    setFieldValue(field.name, val)
  }

  return (
    <TextAreaCodeEditor
      value={field.value}
      language="markdown"
      placeholder="Please enter Markdown code."
      onChange={readOnly ? null : setValue}
      padding={0}
      style={{
        fontSize: '1rem',
        pointerEvents: 'none',
        width: '600px',
        margin: '10px 20px',
        padding: 0,
      }}
    />
  )
}

export default CodeEditor
