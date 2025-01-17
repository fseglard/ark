import { mergeProps } from '@zag-js/solid'
import { ark, type ArkComponent, type HTMLArkProps } from '../factory'
import { useTreeViewBranchContext } from './tree-view-branch-context'
import { useTreeViewContext } from './tree-view-context'

export interface TreeViewBranchTextProps extends HTMLArkProps<'span'> {}

export const TreeViewBranchText: ArkComponent<'span'> = (props: TreeViewBranchTextProps) => {
  const api = useTreeViewContext()
  const branchProps = useTreeViewBranchContext()
  const mergedProps = mergeProps(() => api().getBranchTextProps(branchProps), props)

  return <ark.span {...mergedProps} />
}
