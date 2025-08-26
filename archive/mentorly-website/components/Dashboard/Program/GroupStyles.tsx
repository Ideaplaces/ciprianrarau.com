import { gql } from '@apollo/client'
import ColorPicker from 'components/controls/ColorPicker'
import Field from 'components/controls/Field'
import FontSelect from 'components/controls/FontSelect'

gql`
  fragment GroupStylesFields on GroupStyles {
    accentColor
    accentTextColor
    backgroundColor
    backgroundTextColor
    highlightColor
    fontName
    titleFontName
  }
`

const GroupStylesSelector = () => (
  <>
    <div className="flex flex-col lg:flex-row xl:flex-col">
      <fieldset className="flex flex-col sm:flex-row w-full space-x-0 sm:space-x-4">
        <div className="flex w-1/2 flex-col h-full">
          <Field
            name="backgroundColor"
            className="w-full"
            control={ColorPicker}
          />
        </div>
        <div className="flex w-1/2 flex-col h-full">
          <Field name="accentColor" className="w-full" control={ColorPicker} />
        </div>
      </fieldset>
      <fieldset className="flex flex-col sm:flex-row w-full space-x-0 sm:space-x-4">
        <div className="flex w-1/2 flex-col">
          <Field
            name="backgroundTextColor"
            control={ColorPicker}
            className="w-full"
          />
        </div>
        <div className="flex w-1/2 flex-col">
          <Field
            name="accentTextColor"
            control={ColorPicker}
            className="w-full"
          />
        </div>
      </fieldset>
      <fieldset className="flex flex-col sm:flex-row w-full space-x-0 sm:space-x-4">
        <div className="flex w-1/2 flex-col">
          <Field
            name="highlightColor"
            control={ColorPicker}
            className="w-full"
          />
        </div>
      </fieldset>
    </div>
    <fieldset className="flex flex-col sm:flex-row w-full space-x-0 sm:space-x-4">
      <div className="flex w-1/2 flex-col">
        <Field name="fontName" className="w-full" control={FontSelect} />
      </div>
      <div className="flex w-1/2 flex-col">
        <Field name="titleFontName" className="w-full" control={FontSelect} />
      </div>
    </fieldset>
  </>
)

export default GroupStylesSelector
