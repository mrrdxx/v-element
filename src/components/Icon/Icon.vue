<template>
  <i
    class="vk-icon"
    :class="{ [`vk-icon--${type}`]: type }"
    :style="customStyles"
    v-bind="$attrs"
  >
    <font-awesome-icon v-bind="filteredProps"></font-awesome-icon>
    <!-- 相当于将当前组件接收到的所有props整体传递给子组件 -->
  </i>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { omit } from 'lodash-es'
import type { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
defineOptions({
  name: 'VKIcon',
  inheritAttrs: false
  //在Vue中，默认情况下（即inheritAttrs: true），
  //组件接收的但未被声明为props的属性（如class、style、id、data-等）
  //会自动添加到组件的根元素上
  //设置为false后，这些"非prop属性"将不会自动应用到根元素
  //如果没有设置inheritAttrs: false，当使用组件时：
  //<ICon icon="home" class="special-icon" style="color: red"></ICon>
  //class和style会应用到<i>元素上，可能与vk-icon类产生冲突或覆盖
})
const props = defineProps<FontAwesomeIconProps>()
/*类型继承方式：
通过泛型参数<FontAwesomeIconProps>定义了props的类型
FontAwesomeIconProps是从@fortawesome/vue-fontawesome导入的类型定义
这种写法是TypeScript与Vue 3结合的类型声明方式
完整继承原始组件的所有属性：
这相当于说："我的组件接受FontAwesomeIcon组件的所有属性"
所有font-awesome-icon支持的属性（如icon、size、spin等）都被自动继承
无需手动一一列出每个属性及其类型*/
const filteredProps = computed(() => omit(props, ['type', 'color']))
//要加computed，否则props变化时，filteredProps不会变化
//用lodash的omit函数,防止将type和color属性传递给内部的font-awesome-icon组件
//这些属性可能是ICon组件特有的，而不是FontAwesomeIcon支持的属性
//意思是type和color被传给了ICon组件，但不会传给font-awesome-icon组件
const customStyles = computed(() => {
  return props.color ? { color: props.color } : {}
})
//添加自定义颜色属性，用于设置图标颜色
</script>
