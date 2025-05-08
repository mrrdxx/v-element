<template>
  <form class="vk-form">
    <slot />
    <!-- <button @click.prevent="validate">验证</button> -->
  </form>
</template>
<script setup lang="ts">
import type {
  FormProps,
  FormItemContext,
  FormContext,
  FormValidateFailure,
  FormInstance
} from './types'
import { formContextKey } from './types'
import { provide } from 'vue'
import type { ValidateFieldsError } from 'async-validator'

const props = defineProps<FormProps>()
defineOptions({
  name: 'VkForm'
})

const fields: FormItemContext[] = []
//用来存储所有表单项（FormItem）的数组
const addField: FormContext['addField'] = field => {
  fields.push(field)
}
const removeField: FormContext['removeField'] = field => {
  if (field.prop) {
    fields.splice(fields.indexOf(field), 1)
  }
}
const validate = async () => {
  let validationErrors: ValidateFieldsError = {}
  for (const field of fields) {
    try {
      await field.validate('')
    } catch (e) {
      const error = e as FormValidateFailure
      validationErrors = {
        ...validationErrors,
        ...error.fields
      }
    }
  }
  if (Object.keys(validationErrors).length === 0) {
    return true
  }
  return Promise.reject(validationErrors)
}
provide(formContextKey, {
  ...props,
  //不展开就是
  //model: props.model,
  //rules: props.rules,
  addField,
  removeField
})
/*这里使用 provide 提供了一个值，这个值就是整个表单的 props（包含 model 和 rules）
formContextKey 是一个 Symbol 类型的唯一标识符，用于标识这个提供的数据
这样，Form 组件就相当于一个"数据提供者"*/
defineExpose<FormInstance>({
  validate
})
</script>
