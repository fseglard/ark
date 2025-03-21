import { Popover } from '@ark-ui/solid/popover'
import { ChevronRightIcon } from 'lucide-solid'
import { Portal } from 'solid-js/web'

export const Portalled = () => (
  <Popover.Root portalled>
    <Popover.Trigger>
      Click Me
      <Popover.Indicator>
        <ChevronRightIcon />
      </Popover.Indicator>
    </Popover.Trigger>
    <Portal>
      <Popover.Positioner>
        <Popover.Content>
          <Popover.Title>Title</Popover.Title>
          <Popover.Description>Description</Popover.Description>
        </Popover.Content>
      </Popover.Positioner>
    </Portal>
  </Popover.Root>
)
