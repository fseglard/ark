import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import type { Accessor } from '$lib/types'
import * as avatar from '@zag-js/avatar'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/svelte'

export interface UseAvatarProps extends Omit<avatar.Context, 'dir' | 'getRootNode'> {}
export interface UseAvatarReturn extends Accessor<avatar.Api<PropTypes>> {}

export const useAvatar = (props: UseAvatarProps) => {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const context = $derived({
    dir: locale.dir,
    getRootNode: env.getRootNode,
    ...props,
  })

  const [state, send] = useMachine(avatar.machine(context), { context })
  const api = $derived(() => avatar.connect(state, send, normalizeProps))
  return api
}
