import type { Placement, Options } from '@popperjs/core'
export interface TooltipProps {
  content?: string
  trigger?: 'hover' | 'click'
  placement?: Placement
  manual?: boolean
  //manual是否启用手动控制
  popperOptions?: Partial<Options>
  //Partial可以把Options的类型变成可选的
  //placement其实是popperOptions中的一项，popperOptions优先级高
  transition?: string
  openDelay?: number
  closeDelay?: number
}

export interface TooltipEmits {
  (e: 'visible-change', value: boolean): void
  (e: 'click-outside', value: boolean): void
}

export interface TooltipInstance {
  show: () => void
  hide: () => void
}
