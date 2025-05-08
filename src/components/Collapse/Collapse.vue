<template>
  <div class="vk-collapse">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { ref, provide, watch } from 'vue'
import type { NameType, CollapseProps, CollapseEmits } from './types'
import { collapseContextKey } from './types'
defineOptions({
  name: 'VKCollapse'
})
const props = defineProps<CollapseProps>()
const emit = defineEmits<CollapseEmits>()
const activeNames = ref<NameType[]>(props.modelValue)
watch(
  () => props.modelValue,
  () => {
    activeNames.value = props.modelValue
  }
)
//props传递给本地的ref要注意更新
if (props.accordion && activeNames.value.length > 1) {
  console.warn('accordion mode must only have one active item')
}
const handleItemClick = (item: NameType) => {
  let _activeNames = [...activeNames.value]
  if (props.accordion) {
    _activeNames = [activeNames.value[0] === item ? '' : item]
    activeNames.value = _activeNames
  } else {
    const index = _activeNames.indexOf(item)
    if (index > -1) {
      _activeNames.splice(index, 1)
    } else {
      _activeNames.push(item)
    }
    activeNames.value = _activeNames
  }

  emit('update:modelValue', activeNames.value)
  emit('change', activeNames.value)
}
provide(collapseContextKey, {
  activeNames,
  handleItemClick
})
//父组件已经提供了activeNames和handleItemClick
//可以使用inject传递给子组件
</script>
