<script setup>
import { reactive, ref } from 'vue'
import Form from '@/components/Form/Form.vue'
import FormItem from '@/components/Form/FormItem.vue'
import Input from '@/components/Input/Input.vue'
import Button from '@/components/Button/Button.vue'
const formRef = ref()
const model = reactive({
  email: '',
  password: '',
  test: ''
})
const rules = {
  //type:'email'等等是async-validator内置的规则
  email: [
    { type: 'email', required: true, trigger: 'blur' },
    { type: 'string', required: true, trigger: 'input' }
  ],
  password: [
    { type: 'string', required: true, trigger: 'blur', min: 3, max: 5 }
  ],
  test: [{ type: 'string', required: true, trigger: 'blur' }]
}
const submit = async () => {
  try {
    await formRef.value.validate()
    console.log('pass')
  } catch (e) {
    console.log(e)
  }
}
</script>
<template>
  <div>
    <Form :model="model" :rules="rules" ref="formRef">
      <FormItem label="the email" prop="email">
        <Input v-model="model.email" />
      </FormItem>
      <FormItem label="the password" prop="password">
        <template #label="{ label }">
          <Button>{{ label }}</Button>
        </template>
        <Input type="password" v-model="model.password" />
      </FormItem>
      <FormItem label="test value" prop="test">
        <template #default="{ validate }">
          <input type="text" v-model="model.test" @blur="() => validate" />
        </template>
      </FormItem>
      <div>
        <Button type="primary" @click.prevent="submit">Submit</Button>
        <Button>Reset</Button>
      </div>
    </Form>
  </div>
</template>

<style></style>
