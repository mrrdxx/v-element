import Input from '@/components/Input/Input.vue'

Input.install = (app: any) => {
  app.component(Input.name, Input)
}

export default Input

export * from './types'
