<template>
  <button
    ref="_ref"
    class="vk-button"
    :class="{
      [`vk-button--${type}`]: type,
      [`vk-button--${size}`]: size,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle,
      'is-disabled': disabled,
      'is-loading': loading
    }"
    :disabled="disabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
  >
    <ICon v-if="loading" icon="spinner" spin></ICon>
    <ICon v-else-if="icon" :icon="icon"></ICon>
    <span>
      <slot></slot>
    </span>
  </button>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { ButtonProps } from './types'
import ICon from '../Icon/Icon.vue'
//导入ButtonProps类型接口，用于定义组件的props类型。
defineOptions({
  name: 'VkButton'
})
//设置组件的名称为"VkButton"
withDefaults(defineProps<ButtonProps>(), {
  nativeType: 'button'
})
const _ref = ref<HTMLButtonElement>()

defineExpose({
  ref: _ref
})
//将内部命名为_ref的引用作为ref属性暴露给父组件
//这使得父组件可以通过模板引用访问按钮元素
</script>

<style scoped></style>
