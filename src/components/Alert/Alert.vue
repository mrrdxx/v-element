<template>
  <transition name="vk-alert-fade">
    <div
      class="vk-alert"
      v-if="visible"
      :class="{
        [`vk-alert__${type}`]: type,
        [`vk-alert__${effect}`]: effect,
        'is-closeable': closable
      }"
    >
      <slot></slot>
      <span class="vk-alert__close" v-if="closable" @click.stop="handleClose">
        <ICon icon="close"></ICon>
      </span>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import type { AlertProps, AlertEmits, AlertInstance } from './types'
import ICon from '../Icon/Icon.vue'
import './style.css'

defineOptions({
  name: 'VkAlert'
})
const visible = ref(true)
withDefaults(defineProps<AlertProps>(), {
  type: 'info',
  effect: 'light',
  closable: true
})

const emit = defineEmits<AlertEmits>()

const handleClose = () => {
  visible.value = false
  emit('close')
}

// 实现AlertInstance接口
const hide = () => {
  visible.value = false
  emit('close')
}

const show = () => {
  visible.value = true
}

// 向父组件暴露方法
const instance = {
  hide,
  show
}
defineExpose(instance)

// 获取父组件提供的注册函数
const registerAlert = inject<(instance: AlertInstance) => void>(
  'registerAlert',
  () => {}
)

// 在组件挂载时注册实例
onMounted(() => {
  // 注册当前Alert实例
  registerAlert(instance)
  console.log('Alert实例已注册')
})
</script>
