import Switch from '@/components/Switch/Switch.vue'

Switch.install = (app: any) => {
  app.component(Switch.name, Switch)
}

export default Switch

export * from './types'
