import { useRecoilState } from 'recoil'
import { useCallback } from 'react'
import {
  modelSettingsState,
  saveModelSettings,
  ModelSettings
} from '../store/modelSettings'

export const useModelSettings = () => {
  const [modelSettings, setModelSettings] = useRecoilState(modelSettingsState)

  const updateModelSettings = useCallback(
    (newSettings: ModelSettings) => {
      setModelSettings(newSettings)
      saveModelSettings(newSettings)
    },
    [setModelSettings]
  )

  const updateModelSetting = useCallback(
    (key: keyof ModelSettings, value: string | number) => {
      const updatedSettings = {
        ...modelSettings,
        [key]: value
      }
      setModelSettings(updatedSettings)
      saveModelSettings(updatedSettings)
    },
    [modelSettings, setModelSettings]
  )

  return {
    modelSettings,
    updateModelSettings,
    updateModelSetting
  }
}
