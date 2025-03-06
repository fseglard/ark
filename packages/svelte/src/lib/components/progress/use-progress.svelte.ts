import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import type { Accessor } from '$lib/types'
import * as progress from '@zag-js/progress'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/svelte'

export interface UseProgressProps extends Omit<progress.Props, 'dir' | 'getRootNode'> {}
export interface UseProgressReturn extends Accessor<progress.Api<PropTypes>> {}

export const useProgress = (props: UseProgressProps) => {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const machineProps = $derived({
    dir: locale.dir,
    getRootNode: env.getRootNode,
    ...props,
  })

  const service = useMachine(progress.machine, () => machineProps)
  const api = $derived(() => progress.connect(service, normalizeProps))
  return api
}
