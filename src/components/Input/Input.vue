<template>
  <div
    class="vk-input"
    :class="{
      [`vk-input--${type}`]: type,
      [`vk-input--${size}`]: size,
      'is-disabled': disabled,
      'is-prepend': $slots.prepend,
      'is-append': $slots.append,
      'is-prefix': $slots.prefix,
      'is-suffix': $slots.suffix,
      'is-focus': isFocus
    }"
  >
    <!-- input -->
    <template v-if="type !== 'textarea'">
      <!-- prepand slot -->
      <div v-if="$slots.prepend" class="vk-input__prepend">
        <slot name="prepend"></slot>
      </div>

      <div class="vk-input__wrapper">
        <!-- prefix slot -->
        <span v-if="$slots.prefix" class="vk-input__prefix">
          <slot name="prefix"></slot>
        </span>
        <input
          ref="inputRef"
          class="vk-input__inner"
          :disabled="disabled"
          :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
          v-model="innerValue"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
          :autofocus="autofocus"
          :autocomplete="autocomplete"
          :readonly="readonly"
          :placeholder="placeholder"
          :form="form"
          @keydown="e => emits('keydown', e)"
        />

        <!-- suffix slot -->
        <span
          v-if="$slots.suffix || showClear || showPasswordArea"
          class="vk-input__suffix"
          @click="keepFocus"
        >
          <slot name="suffix"></slot>
          <ICon
            icon="circle-xmark"
            v-if="showClear"
            class="vk-input__clear"
            @click="clear"
            @mousedown.prevent="NOOP"
          ></ICon>
          <!-- mousedown 事件发生在 click 事件之前
          默认情况下，mousedown 会导致元素获得焦点，输入框失去焦点
          阻止 mousedown 的默认行为
          确保输入框不会因点击清除按钮而失去焦点 -->
          <ICon
            icon="eye"
            v-if="showPasswordArea && passwordVisible"
            class="vk-input__password"
            @click="togglePasswordVisible"
          ></ICon>
          <ICon
            icon="eye-slash"
            v-if="showPasswordArea && !passwordVisible"
            class="vk-input__password"
            @click="togglePasswordVisible"
          ></ICon>
        </span>
      </div>

      <!-- append slot -->
      <div v-if="$slots.append" class="vk-input__append">
        <slot name="append"></slot>
      </div>
    </template>

    <!-- textarea -->
    <template v-else>
      <textarea
        ref="textareaRef"
        v-bind="attrs"
        class="vk-input__textarea"
        :disabled="disabled"
        v-model="innerValue"
        :autofocus="autofocus"
        :autocomplete="autocomplete"
        :readonly="readonly"
        :placeholder="placeholder"
        :form="form"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        @keydown="e => emits('keydown', e)"
      ></textarea>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed, useAttrs, nextTick, inject } from 'vue'
import type { Ref } from 'vue'
import type { InputProps, InputEmits } from './types'
import ICon from '../Icon/Icon.vue'
import { formContextItemKey } from '../Form/types'
defineOptions({
  name: 'VkInput',
  inheritAttrs: false
})
const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  autocomplete: 'off'
})
const attrs = useAttrs()
const emits = defineEmits<InputEmits>()
// 组件内部维护一个响应式状态，用于控制输入框的值
const innerValue = ref(props.modelValue)
const isFocus = ref(false)
const passwordVisible = ref(false)
const inputRef = ref() as Ref<HTMLInputElement>
const formItemContext = inject(formContextItemKey)
const runValidation = (trigger?: string) => {
  formItemContext?.validate(trigger)
}
const showClear = computed(
  () =>
    props.clearable && !props.disabled && !!innerValue.value && isFocus.value
)
const showPasswordArea = computed(
  () => props.showPassword && !props.disabled && !!innerValue.value
)
const togglePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value
}
const keepFocus = async () => {
  await nextTick()
  inputRef.value.focus()
}
const handleInput = () => {
  emits('update:modelValue', innerValue.value)
  emits('input', innerValue.value)
  runValidation('input')
}
function handleChange() {
  emits('change', innerValue.value)
  runValidation('change')
}
const handleFocus = (event: FocusEvent) => {
  isFocus.value = true
  emits('focus', event)
}
const handleBlur = (event: FocusEvent) => {
  isFocus.value = false
  emits('blur', event)
  runValidation('blur')
}
/*
为什么有的有参数有的没有
对于focus和blur事件，组件需要传递完整的事件对象，因为父组件可能需要知道事件的详细信息（如目标元素、时间戳等）
而对于input和change事件，通常只关心输入值本身，不需要其他事件信息*/

const clear = () => {
  innerValue.value = ''
  emits('update:modelValue', '')
  emits('clear')
  emits('input', '')
  emits('change', '')
}
const NOOP = () => {}
watch(
  () => props.modelValue,
  newValue => {
    innerValue.value = newValue
  }
)
defineExpose({
  ref: inputRef //通过这个ref可以拿到dom节点
})
</script>
<!-- 是的，`@click="clear"` 触发的 `emits('update:modelValue', '')` 可以正确传递给父组件。这是Vue组件通信机制的重要特性。

让我解释为什么这样可以正常工作：

## 组件事件传递机制

1. **事件冒泡的方向与组件层级无关**：
   - Vue的自定义事件系统是基于组件树结构的，而不是DOM事件冒泡
   - 子组件发出的事件总是直接传递给它的父组件，不管内部层级多深

2. **组件内部结构对外部透明**：
   - 父组件不需要知道 Input 组件内部结构
   - 不管是由哪个内部元素(ICon、input等)触发的 clear 函数，最终效果相同

## 具体流程分析

当用户点击清除图标时：

1. ICon组件上的 `@click` 事件触发
2. 调用 Input 组件中定义的 `clear` 函数
3. `clear` 函数执行并调用 `emits('update:modelValue', '')`
4. 这个 emit 是在 Input 组件的上下文中执行的，无论它是由哪个子元素的事件触发的
5. 事件从 Input 组件发出，直接传递给使用 `<Input v-model="searchText">` 的父组件
6. 父组件接收到事件，更新 `searchText` 为空字符串

## 工作原理解释

这工作正常的关键在于：
- `clear` 函数和 `emits` 函数都属于 Input 组件的作用域
- ICon 只是触发了 Input 组件中的方法，实际发出事件的仍然是 Input 组件本身
- Vue 组件的事件系统是基于组件实例的，不依赖于DOM事件的冒泡机制
- 当调用 `emits('update:modelValue', '')` 时，Vue知道这个事件应该从哪个组件发出

所以不管 `clear` 函数是被 Input 内部的哪个元素触发的，只要它是在 Input 组件的作用域内定义和调用的，它发出的事件就会正确地从 Input 组件传递给父组件。

总结：组件内部结构的复杂性不影响组件与父组件之间的通信，只要使用了正确的 emits 机制。
 -->
