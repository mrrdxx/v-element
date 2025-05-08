export interface InputProps {
  type?: string
  modelValue: string
  size?: 'large' | 'small'
  disabled?: boolean
  clearable?: boolean
  showPassword?: boolean
  placeholder?: string
  readonly?: boolean
  autofocus?: boolean
  autocomplete?: string
  form?: string
}

export interface InputEmits {
  (e: 'update:modelValue', value: string): void
  // input 的 input事件指的是值有变化就算
  (e: 'input', value: string): void
  // input 的 change事件指的是修改了值，并且失去了 focus
  (e: 'change', value: string): void
  (e: 'focus', value: FocusEvent): void
  (e: 'blur', value: FocusEvent): void
  (e: 'clear'): void
  (e: 'keydown', value: KeyboardEvent): void
  //e: 'keydown'：第一个参数名为e，类型是字符串字面量类型'keydown'（这意味着它只能是字符串"keydown"）
  //value: KeyboardEvent：第二个参数名为value，类型是KeyboardEvent（这是DOM API中的键盘事件对象类型）
}
export interface InputInstance {
  ref: HTMLInputElement | HTMLTextAreaElement
}
