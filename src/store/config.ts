import Store from 'electron-store'
import { JSONSchemaType } from 'json-schema-typed'
import { getUIConfig } from '../config'

const uiConfig = getUIConfig()

const schema = {
  useMacOSWindowActionButtons: {
    type: JSONSchemaType.Boolean,
    default: false
  },
  windowBounds: {
    type: JSONSchemaType.Object,
    default: {
      width: uiConfig.window.defaultWidth,
      minWidth: uiConfig.window.minWidth,
      minHeight: uiConfig.window.minHeight,
      height: uiConfig.window.defaultHeight
    }
  }
}

const config = new Store({
  schema,
  watch: true
})

export { schema, config }
