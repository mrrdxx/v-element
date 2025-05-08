<template>
  <div
    class="vk-select"
    :class="{
      'is-disabled': props.disabled
    }"
    @click="toggleDropdown"
    @mouseenter="states.mouseHover = true"
    @mouseleave="states.mouseHover = false"
  >
    <Tooltip
      manual
      placement="bottom-start"
      ref="tooltipRef"
      :popperOptions="popperOptions"
      @click-outside="controlDropdown(false)"
    >
      <Input
        v-model="states.inputValue"
        :disabled="disabled"
        :placeholder="filteredPlaceholder"
        :readonly="!filterable || !isDropdownShow"
        ref="inputRef"
        @input="debouncedFilter"
        @keydown="handleKeydown"
      >
        <template #suffix>
          <Icon
            icon="circle-xmark"
            v-if="showClearIcon"
            class="vk-input__clear"
            @mousedown.prevent="NOOP"
            @click.stop="onClear"
          ></Icon>

          <Icon
            v-else
            icon="angle-down"
            class="header-angle"
            :class="{ 'is-active': isDropdownShow }"
          ></Icon>
        </template>
      </Input>
      <template #content>
        <div class="vk-select__loading" v-if="states.loading">
          <Icon icon="spinner"></Icon>
        </div>
        <div
          class="vk-select__nodata"
          v-else-if="filterable && filteredOptions.length === 0"
        >
          no matching data
        </div>
        <ul class="vk-select__menu" v-else>
          <template v-for="(item, index) in filteredOptions" :key="index">
            <li
              class="vk-select__menu-item"
              :class="{
                'is-disabled': item.disabled,
                'is-selected': states.selectedOption?.value === item.value,
                'is-highlight': states.highlightIndex === index
              }"
              :id="`select-item-${item.value}`"
              @click.stop="itemSelect(item)"
            >
              <!-- 要阻止冒泡，否则会触发toggleDropdown -->
              <RenderVnode
                :vNode="renderLabel ? renderLabel(item) : item.label"
              />
            </li>
          </template>
        </ul>
      </template>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import type { SelectProps, SelectEmits, SelectOption } from './types'
import Tooltip from '../Tooltip/Tooltip.vue'
import Input from '../Input/Input.vue'
import { reactive, ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import type { TooltipInstance } from '../Tooltip/types'
import type { SelectStates } from './types'
import type { InputInstance } from '../Input/types'
import { isFunction, debounce } from 'lodash-es'
import Icon from '../Icon/Icon.vue'
import RenderVnode from '../Common/RenderVnode'
defineOptions({
  name: 'VkSelect'
})
const findOption = (value: string) => {
  const option = props.options.find(option => option.value === value)
  if (option) {
    return option // 返回选中的option,这是数组中的一项哦
  }
  return null
}
const props = withDefaults(defineProps<SelectProps>(), {
  options: () => [] //设置数组默认值用函数形式
})
const timeout = computed(() => (props.remote ? 300 : 0))
const emits = defineEmits<SelectEmits>()
const initialOption = findOption(props.modelValue) //initailOption是数组中的一项
const tooltipRef = ref() as Ref<TooltipInstance>
const inputRef = ref() as Ref<InputInstance>
const states = reactive<SelectStates>({
  inputValue: initialOption ? initialOption.label : '',
  selectedOption: initialOption,
  mouseHover: false,
  loading: false,
  highlightIndex: -1
})
const isDropdownShow = ref(false)
const popperOptions: any = {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 9]
      }
    },
    {
      name: 'sameWidth',
      enabled: true,
      fn: ({ state }: { state: any }) => {
        state.styles.popper.width = `${state.rects.reference.width}px`
      },
      phase: 'beforeWrite',
      requires: ['computeStyles']
    }
  ]
}
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'Enter':
      if (!isDropdownShow.value) {
        controlDropdown(true)
      } else {
        if (
          states.highlightIndex > -1 &&
          filteredOptions.value[states.highlightIndex]
        ) {
          itemSelect(filteredOptions.value[states.highlightIndex])
        } else {
          controlDropdown(false)
        }
      }
      break
    case 'Escape':
      if (isDropdownShow.value) {
        controlDropdown(false)
      }
      break
    case 'ArrowUp':
      e.preventDefault()
      if (filteredOptions.value.length > 0) {
        if (states.highlightIndex === -1 || states.highlightIndex === 0) {
          states.highlightIndex = filteredOptions.value.length - 1
        } else {
          // move up
          states.highlightIndex--
        }
      }
      break
    case 'ArrowDown':
      e.preventDefault()
      if (filteredOptions.value.length > 0) {
        if (
          states.highlightIndex === -1 ||
          states.highlightIndex === filteredOptions.value.length - 1
        ) {
          states.highlightIndex = 0
        } else {
          // move up
          states.highlightIndex++
        }
      }
      break
    default:
      break
  }
}
const showClearIcon = computed(() => {
  return (
    props.clearable &&
    states.mouseHover &&
    states.selectedOption &&
    states.inputValue.trim() !== ''
  )
})
const filteredOptions = ref(props.options) //响应式对象从外部传入时要添加watch
watch(
  () => props.options,
  newOptions => {
    filteredOptions.value = newOptions
  }
)
const generateFilterOptions = async (searchValue: string) => {
  if (!props.filterable) return
  if (props.filterMethod && isFunction(props.filterMethod)) {
    filteredOptions.value = props.filterMethod(searchValue)
  } else if (
    props.remote &&
    props.remoteMethod &&
    isFunction(props.remoteMethod)
  ) {
    states.loading = true
    try {
      filteredOptions.value = await props.remoteMethod(searchValue)
    } catch (error) {
      console.error(error)
    } finally {
      states.loading = false
    }
  } else {
    filteredOptions.value = props.options.filter(option =>
      option.label.includes(searchValue)
    )
  }
  states.highlightIndex = -1
}
const onFilter = () => {
  generateFilterOptions(states.inputValue)
}
const debouncedFilter = debounce(() => {
  onFilter()
}, timeout.value)
const filteredPlaceholder = computed(() => {
  return props.filterable && states.selectedOption && isDropdownShow.value
    ? states.selectedOption.label
    : props.placeholder
})
const controlDropdown = (show: boolean) => {
  if (show) {
    //是filrer模式并且之前选择过对应的值
    if (props.filterable && states.selectedOption) {
      states.inputValue = ''
    }
    //进行一次默认选项的生成
    if (props.filterable) {
      generateFilterOptions(states.inputValue)
    }
    tooltipRef.value.show()
  } else {
    tooltipRef.value.hide()
    //blur的时候将之前选择的值回灌到input中
    if (props.filterable) {
      states.inputValue = states.selectedOption
        ? states.selectedOption.label
        : ''
    }
    states.highlightIndex = -1
  }
  isDropdownShow.value = show
  emits('visible-change', show)
  //如何控制下拉菜单的显示和隐藏
  //单一职责原则：一个函数应该只有一个引起它变化的原因
  //不关心为什么需要改变状态，只关心如何执行状态变更
}
const onClear = () => {
  states.selectedOption = null
  states.inputValue = ''
  emits('clear') //只是一个信号
  emits('change', '') //有没有用取决于父组件有没有监听
  emits('update:modelValue', '')
}
const NOOP = () => {}
const toggleDropdown = () => {
  if (props.disabled) return
  if (isDropdownShow.value) {
    controlDropdown(false)
  } else {
    controlDropdown(true)
  }
  //何时切换下拉菜单的状态
  //它只关心"点击后应该做什么"这一个业务场景
  //它不关心具体如何显示或隐藏菜单，这部分责任委托给了 controlDropdown
}
const itemSelect = (eee: SelectOption) => {
  ///eee是当前点击的数组的一项
  if (eee.disabled) return
  states.inputValue = eee.label
  states.selectedOption = eee
  emits('change', eee.value)
  emits('update:modelValue', eee.value)
  controlDropdown(false)
  inputRef.value.ref.focus()
}
</script>
