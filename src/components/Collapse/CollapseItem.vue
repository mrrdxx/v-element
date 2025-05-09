<template>
  <div
    class="vk-collapse-item"
    :class="{
      'is-disabled': disabled
    }"
  >
    <div
      class="vk-collapse-item__header"
      :class="{
        'is-disabled': disabled,
        'is-active': isActive
      }"
      :id="`item-header-${name}`"
      @click="handleClick"
    >
      <slot name="title">{{ title }}</slot>
      <!-- <ICon v-if="isActive" icon="arrow-up"></ICon>
      <ICon v-else icon="arrow-down"></ICon> -->
      <ICon icon="angle-right" class="header-angle"></ICon>
      <!-- 我个人认为上面被注释掉的写法简单易懂一些
      教程中的写法给ICon添加了一个特别的类，用于控制旋转
       但这样会带来一个问题，ICon组件中设置了禁止透传，所以class这样的属性不会被传递给根元素(ICon.vue中的<i>)
       所以需要使用v-bind="$attrs"来传递属性
       $attrs是Vue3中提供的一个内置属性，用于获取组件的非prop属性
       -->
    </div>

    <Transition name="slide" v-on="transitionEvents">
      <div class="vk-collapse-item__wrapper" v-show="isActive">
        <div class="vk-collapse-item__content" :id="`item-content-${name}`">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { inject, computed } from 'vue'
import type { CollapseItemProps } from './types'
import { collapseContextKey } from './types'
import ICon from '../Icon/Icon.vue'
defineOptions({
  name: 'VkCollapseItem'
})
const props = defineProps<CollapseItemProps>()
const collapseContext = inject(collapseContextKey)
//当父组件包含slot里面的子组件时，使用Context来传递信息
const isActive = computed(() =>
  collapseContext?.activeNames.value.includes(props.name)
)
const handleClick = () => {
  if (props.disabled) {
    return
  }
  collapseContext?.handleItemClick(props.name)
}
const transitionEvents: Record<string, (el: HTMLElement) => void> = {
  beforeEnter(el) {
    el.style.height = '0px'
    el.style.overflow = 'hidden'
  },
  enter(el) {
    el.style.height = `${el.scrollHeight}px`
  },
  afterEnter(el) {
    el.style.height = ''
    el.style.overflow = ''
  },
  beforeLeave(el) {
    el.style.height = `${el.scrollHeight}px`
    el.style.overflow = 'hidden'
  },
  leave(el) {
    el.style.height = '0px'
  },
  afterLeave(el) {
    el.style.height = ''
  }
}
</script>
<style>
.vk-collapse-item__header {
  font-size: 30px;
}
</style>
