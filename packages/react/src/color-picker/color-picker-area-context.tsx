import type { AreaProps } from '@zag-js/color-picker/dist/color-picker.types'
import { createContext } from '../create-context'

export const [ColorPickerAreaProvider, useColorPickerAreaContext] = createContext<AreaProps>({
  name: 'ColorPickerAreaContext',
  hookName: 'useColorPickerAreaContext',
  providerName: '<ColorPickerAreaProvider />',
})