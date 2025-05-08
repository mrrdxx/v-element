<template>
  <div
    class="vk-tooltip"
    v-on="outerEvents"
    ref="popperContainerNode"
    style="width: 200px"
  >
    <div
      class="vk-tooltip__trigger"
      ref="triggerNode"
      v-on="events"
      style="width: 200px"
    >
      <slot></slot>
    </div>
    <transition :name="transition">
      <div v-if="isOpen" class="vk-tooltip__popper" ref="popperNode">
        <slot name="content">{{ content }}</slot>
        <div id="arrow" data-popper-arrow></div>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import type { TooltipProps, TooltipEmits, TooltipInstance } from './types'
import { createPopper } from '@popperjs/core'
import type { Instance } from '@popperjs/core'
import { reactive, ref, watch, onUnmounted, computed } from 'vue'
import useClickOutside from '../../hooks/useClickOutside'
import { debounce } from 'lodash-es'
const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'bottom',
  trigger: 'hover',
  transition: 'fade',
  openDelay: 0,
  closeDelay: 0
})
const emits = defineEmits<TooltipEmits>()
const isOpen = ref(false) //控制vk-tooltip__popper的显示和隐藏
const popperNode = ref<HTMLElement>()
const triggerNode = ref<HTMLElement>()
const popperContainerNode = ref<HTMLElement>()
let popperInstance: null | Instance = null
let openTimes = 0
let closeTimes = 0
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let events: Record<string, any> = reactive({})

//Record<K, T> 是 TypeScript 中的一个工具类型（utility type），用于表示一个对象类型，其中：
//K 表示对象的键（key）的类型，通常是 string 或 number 或字符串字面量联合类型
//T 表示对象的值（value）的类型

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let outerEvents: Record<string, any> = reactive({})
//这两个东西要设置成响应式对象，这样修改的时候才会使得对应的事件绑定一起修改
const popperOptions = computed(() => {
  return {
    placement: props.placement,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 9]
        }
      }
    ],
    ...props.popperOptions
    //popperOptions包含了placement，后面会覆盖前面
  }
})

const open = () => {
  openTimes++
  isOpen.value = true
  emits('visible-change', true)
}
const close = () => {
  closeTimes++

  isOpen.value = false
  emits('visible-change', false)
}
const openDebounce = debounce(open, props.openDelay)
const closeDebounce = debounce(close, props.closeDelay)
const openFinal = () => {
  closeDebounce.cancel()
  openDebounce()
}
const closeFinal = () => {
  openDebounce.cancel()
  closeDebounce()
}
const togglePopper = () => {
  if (isOpen.value) {
    closeFinal()
  } else {
    openFinal()
  }
}
useClickOutside(popperContainerNode, () => {
  if (props.trigger === 'click' && isOpen.value && !props.manual) {
    closeDebounce()
  }
  if (isOpen.value) {
    emits('click-outside', true)
    //这个传递的true没有实际意义
  }
})
const attachEvents = () => {
  if (props.trigger === 'hover') {
    events['mouseenter'] = openDebounce
    outerEvents['mouseleave'] = closeDebounce
  } else if (props.trigger === 'click') {
    events['click'] = togglePopper
  }
}
//看是不是手动模式
if (!props.manual) {
  attachEvents()
}
watch(
  () => props.manual,
  isManual => {
    if (isManual) {
      events = {}
      outerEvents = {}
    } else {
      attachEvents()
    }
  }
)
watch(
  () => props.trigger,
  (newTrigger, oldTrigger) => {
    if (newTrigger !== oldTrigger) {
      // clear the events
      events = {}
      outerEvents = {}
      attachEvents()
    }
  }
)
watch(
  isOpen,
  newValue => {
    if (newValue) {
      if (triggerNode.value && popperNode.value) {
        popperInstance = createPopper(
          triggerNode.value,
          popperNode.value,
          popperOptions.value
        )
      } else {
        popperInstance?.destroy()
      }
    }
  },
  { flush: 'post' } //设置watch触发时间，DOM节点生成后才会调用
)
onUnmounted(() => {
  popperInstance?.destroy()
})
defineExpose<TooltipInstance>({
  show: openFinal,
  hide: closeFinal
})
</script>
