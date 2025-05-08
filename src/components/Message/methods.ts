import { render, h, shallowReactive } from 'vue'
import type { CreateMessageProps, MessageContext } from './types'
import MessageConstructor from './Message.vue'
import useZIndex from '@/hooks/useZIndex'
let seed = 1
const instances: MessageContext[] = shallowReactive([])
//将所有创建的实例存在instances数组中
export const createMessage = (props: CreateMessageProps) => {
  const { nextZIndex } = useZIndex()
  const id = `message_${seed++}`

  const container = document.createElement('div')
  const destory = () => {
    const idx = instances.findIndex(instance => instance.id === id)
    if (idx === -1) return
    instances.splice(idx, 1)
    render(null, container) //卸载
  }
  const manualDestroy = () => {
    const instance = instances.find(instance => instance.id === id)
    if (instance) {
      instance.vm.exposed!.visible.value = false
      //exposed属性是组件实例(vm)的一个特殊属性，
      //它包含了通过defineExpose暴露出来的所有内容
      //instance.vnode1.component!.exposed!.visible.value = false也行
    }
  }
  const newProps = {
    ...props,
    id,
    onDestory: destory,
    zIndex: nextZIndex()
  }
  const vnode1 = h(MessageConstructor, newProps)
  //创建的vnode的类型和Message.vue是一样的
  render(vnode1, container)

  //非空断言操作符，因为container.firstElementChild
  //是一个可能为null的联合类型，所以需要断言它一定不是空的
  document.body.appendChild(container.firstElementChild!)
  const vm = vnode1.component!
  const instance = {
    id,
    vnode1,
    // 这是把vnode1装进来了，不是vnode1的副本
    vm,
    props: newProps,
    destory: manualDestroy
  }
  instances.push(instance)
  return instance
}
export const getLastInstance = () => {
  return instances.at(-1)
}
export const getLastBottomOffset = (id: string) => {
  const idx = instances.findIndex(instance => instance.id === id)
  if (idx <= 0) {
    return 0
  } else {
    const prev = instances[idx - 1]
    return prev.vm.exposed!.bottomOffset.value
  }
}
