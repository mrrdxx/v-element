import Alert from '@/components/Alert/Alert.vue'

Alert.install = (app: any) => {
  app.component(Alert.name, Alert)
}

export default Alert

export * from './types'
