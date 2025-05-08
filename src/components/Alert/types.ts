export type AlertType = 'success' | 'warning' | 'danger' | 'info'

export interface AlertProps {
  content?: string
  type: AlertType
  effect?: 'light' | 'dark'
  closable?: boolean
}

export interface AlertEmits {
  (e: 'close'): void
}

export interface AlertInstance {
  hide: () => void
  show: () => void
}
//AlertInstance是一个接口类型，它定义了Alert组件实例应该具有的方法
