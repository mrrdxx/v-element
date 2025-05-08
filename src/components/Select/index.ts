import Select from '@/components/Select/Select.vue'

Select.install = (app: any) => {
  app.component(Select.name, Select)
}

export default Select

export * from './types'
