import classNames from 'classnames'
import { FieldHookConfig, useField, useFormikContext } from 'formik'
import { FC, useMemo } from 'react'
import { ChromePicker } from 'react-color'
import { ToggleLayer } from 'react-laag'
import ResizeObserver from 'resize-observer-polyfill'

const defaultColor = '#ffffff'

type useFieldProps = string | FieldHookConfig<any>

type ColorPickerFieldProps = {
  border: number
  className?: string
  defaultValue: string
}

const ColorPickerField: FC<ColorPickerFieldProps> = ({
  border,
  className,
  defaultValue,
  ...props
}) => {
  const { setFieldValue, setFieldTouched } = useFormikContext()
  const [field] = useField(props as useFieldProps)

  const fallback = defaultValue || defaultColor

  const buttonStyle = useMemo(() => {
    return {
      backgroundColor: field.value || fallback,
    }
  }, [field.value])

  return (
    <ToggleLayer
      closeOnOutsideClick
      renderLayer={({ isOpen, layerProps }) =>
        isOpen && (
          <div ref={layerProps.ref} style={layerProps.style}>
            <ChromePicker
              {...field}
              {...props}
              color={field.value || '#ffffff'}
              onChange={({ hex }: { hex: string }) => {
                setFieldValue(field.name, hex)
                setFieldTouched(field.name, true, true)
              }}
              disableAlpha
            />
          </div>
        )
      }
      placement={{
        anchor: 'BOTTOM_LEFT',
        autoAdjust: true,
      }}
      ResizeObserver={ResizeObserver}
    >
      {({ toggle, triggerRef }) => (
        <button
          ref={triggerRef}
          onClick={toggle}
          className="btn relative rounded"
          type="button"
        >
          <div
            className={classNames(
              className,
              'flex items-center py-2 px-2 rounded text-black uppercase',
              {
                'border border-darkGray': border,
              }
            )}
          >
            <div
              style={buttonStyle}
              className="w-6 h-6 rounded border border-darkGray"
            />
            {field.value && <div className="ml-2">{field.value}</div>}
            {!field.value && (
              <div className="ml-2 text-darkGray">{fallback}</div>
            )}
          </div>
        </button>
      )}
    </ToggleLayer>
  )
}

export default ColorPickerField
