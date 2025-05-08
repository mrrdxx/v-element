<template>
  <div
    class="vk-form-item"
    :class="{
      'is-error': validateStatus.state === 'error',
      'is-success': validateStatus.state === 'success',
      'is-loading': validateStatus.loading
    }"
  >
    <label class="vk-form-item__label">
      <slot name="label" :label="label"> {{ label }}</slot>
    </label>
    <div class="vk-form-item__content">
      <slot :validate="validate" />
      <div
        class="vk-form-item__error-msg"
        v-if="validateStatus.state === 'error'"
      >
        {{ validateStatus.errorMsg }}
      </div>
    </div>
    {{ innerValue }}-{{ itemRules }}
  </div>
</template>
<script setup lang="ts">
import {
  inject,
  computed,
  reactive,
  provide,
  onMounted,
  onUnmounted
} from 'vue'
import Schema from 'async-validator'
import { isNil } from 'lodash-es'
import { formContextKey, formContextItemKey } from './types'
import type {
  FormItemProps,
  FormValidateFailure,
  FormItemContext
} from './types'

defineOptions({
  name: 'VkFormItem'
})
const props = defineProps<FormItemProps>()
const formContext = inject(formContextKey)
/*使用 inject 来获取父组件提供的数据
通过相同的 formContextKey 来匹配要获取的数据
这样，FormItem 组件就可以访问到 Form 组件中的 model 和 rules*/
const validateStatus = reactive({
  state: 'init',
  errorMsg: '',
  loading: false
})
const innerValue = computed(() => {
  const model = formContext?.model
  if (model && props.prop && !isNil(model[props.prop])) {
    return model[props.prop]
  } else {
    return null
  }
})
const itemRules = computed(() => {
  const rules = formContext?.rules
  if (rules && props.prop && !isNil(rules[props.prop])) {
    return rules[props.prop]
  } else {
    return []
  }
})
const getTriggeredRules = (trigger?: string) => {
  const rules = itemRules.value
  if (rules) {
    return rules.filter(rule => {
      if (!rule.trigger || !trigger) return true
      return rule.trigger && rule.trigger === trigger
    })
    /*filter 会遍历数组中的每个元素
      对每个元素执行回调函数
      根据回调函数的返回值决定是否保留该元素
      返回一个新数组，包含所有通过测试的元素*/
  } else {
    return []
  }
}
//根据触发方式筛选验证规则
const validate = (trigger?: string) => {
  console.log(trigger)
  const modelName = props.prop
  const triggeredRules = getTriggeredRules(trigger)

  if (triggeredRules.length === 0) {
    return true
    //如果没有验证规则，就不需要验证
    //直接返回 true 表示验证通过
  }

  if (modelName) {
    const validator = new Schema({
      [modelName]: triggeredRules
    })
    validateStatus.loading = true
    return validator
      .validate({ [modelName]: innerValue.value })
      .then(() => {
        validateStatus.state = 'success'
      })
      .catch((e: FormValidateFailure) => {
        const { errors } = e
        validateStatus.state = 'error'
        validateStatus.errorMsg =
          errors && errors.length > 0 ? errors[0].message || '' : ''
        console.log(e.errors)
        return Promise.reject(e)
      })
      .finally(() => {
        validateStatus.loading = false
      })
  }
}
const context: FormItemContext = {
  validate,
  prop: props.prop || ''
}
provide(formContextItemKey, context)
onMounted(() => {
  if (props.prop) {
    formContext?.addField(context)
  }
})
onUnmounted(() => {
  formContext?.removeField(context)
})
</script>
