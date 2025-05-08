<script setup lang="ts">
// 导入组件
import Alert from './components/Alert/Alert.vue'
import Button from './components/Button/Button.vue'
import Collapse from './components/Collapse/Collapse.vue'
import Item from './components/Collapse/CollapseItem.vue'
import ICon from './components/Icon/Icon.vue'
import Tooltip from './components/Tooltip/Tooltip.vue'
import Dropdown from './components/Dropdown/Dropdown.vue'
import Message from './components/Message/Message.vue'
import { createMessage } from './components/Message/methods'

// 导入Vue API和类型
import { ref, onMounted, provide, h } from 'vue'
import type { MenuOption } from './components/Dropdown/types'
import type { ButtonInstance } from './components/Button/types'
import type { AlertInstance } from './components/Alert/types'
import type { TooltipInstance } from './components/Tooltip/types'
import type { Options } from '@popperjs/core'

// ================ Alert 组件相关 ================
// 单个Alert的引用
const alertRef = ref<AlertInstance | null>(null)
// Alert显示状态
const isAlertVisible = ref(true)
// 使用provide/inject方式存储的Alert引用
const alertRefs = ref<AlertInstance[]>([])
// 使用模板引用数组方式存储的Alert引用
const allAlertRefs = ref<AlertInstance[]>([])

// 提供注册方法，让Alert组件可以注册自己（provide/inject方式）
provide('registerAlert', (instance: AlertInstance) => {
  alertRefs.value.push(instance)
})
// 处理Alert关闭事件
const handleAlertClose = () => {
  console.log('Alert已关闭')
}
// 控制所有Alert组件的显示/隐藏
const toggleAlert = () => {
  if (isAlertVisible.value) {
    // 隐藏所有Alert
    if (allAlertRefs.value.length > 0) {
      allAlertRefs.value.forEach(alert => {
        if (alert && alert.hide) {
          alert.hide()
        }
      })
    } else {
      alertRefs.value.forEach(alert => {
        alert.hide()
      })
    }
    isAlertVisible.value = false
  } else {
    // 显示所有Alert
    if (allAlertRefs.value.length > 0) {
      allAlertRefs.value.forEach(alert => {
        if (alert && alert.show) {
          alert.show()
        }
      })
    } else {
      alertRefs.value.forEach(alert => {
        alert.show()
      })
    }
    isAlertVisible.value = true
  }
}

// ================ Button 组件相关 ================
const buttonRef = ref<ButtonInstance | null>(null)
// ================ Collapse 组件相关 ================
const openedValue = ref(['a']) // 当前展开的折叠面板
// ================ 生命周期钩子 ================
onMounted(() => {
  createMessage({ message: 'hello world', duration: 0, showClose: true })
  createMessage({
    message: h('b', 'this is bold'),
    duration: 0,
    type: 'success',
    showClose: true
  })
  createMessage({
    message: 'hello world three',
    duration: 0,
    type: 'danger',
    showClose: true
  })
  if (buttonRef.value) {
    console.log('buttonRef', buttonRef.value.ref)
  }
  // setTimeout(() => {
  //   instance.destory()
  //   //注意，这里调用的是instance的destory方法，而非点击关闭图标的那个关闭
  // }, 2000)
})

// ================ Tooltip 相关 ================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const trigger = ref<any>('click')
const tooltipRef = ref<TooltipInstance | null>(null)
const options: MenuOption[] = [
  {
    label: h('b', 'this is bold'),
    key: '1'
  },
  {
    label: '选项2',
    key: '2',
    disabled: true
  },
  {
    label: '选项3',
    key: '3',
    divided: true
  },
  {
    label: '选项4',
    key: '4'
  }
]

const open = () => {
  tooltipRef.value?.show()
}

const close = () => {
  tooltipRef.value?.hide()
}
</script>
<template>
  <main>
    <!-- ================ Message 组件演示 ================ -->
    <section></section>

    <!-- ================ Toolip 组件演示 ================ -->
    <section>
      <Dropdown placement="right" :trigger="trigger" :menu-options="options">
        <img src="./assets/xixi.jpg" width="125px" height="125px" alt="logo" />
      </Dropdown>
    </section>
    <!-- ================ Alert 组件演示 ================ -->
    <section class="alert-demo">
      <h2>Alert 组件演示</h2>
      <!-- 单独控制的Alert -->
      <div class="section-item">
        <Alert ref="alertRef" type="success" @close="handleAlertClose">
          这是一个可以通过ref控制的Alert
        </Alert>
      </div>
      <!-- 控制按钮 -->
      <div class="section-item">
        <Button @click="toggleAlert">切换所有Alert显示/隐藏</Button>
      </div>
      <hr />
      <!-- 各种类型的Alert -->
      <div class="alert-types">
        <h3>不同类型的Alert</h3>
        <!-- Light效果 -->
        <div class="alert-group">
          <Alert ref="allAlertRefs" type="success">Success Alert</Alert>
          <Alert ref="allAlertRefs" type="warning">Warning Alert</Alert>
          <Alert ref="allAlertRefs" type="info">Info Alert</Alert>
          <Alert ref="allAlertRefs" type="danger">Danger Alert</Alert>
        </div>
        <!-- Dark效果 -->
        <div class="alert-group">
          <Alert ref="allAlertRefs" type="success" effect="dark"
            >Dark Success Alert</Alert
          >
          <Alert ref="allAlertRefs" type="warning" effect="dark"
            >Dark Warning Alert</Alert
          >
          <Alert ref="allAlertRefs" type="info" effect="dark"
            >Dark Info Alert</Alert
          >
          <Alert
            ref="allAlertRefs"
            type="danger"
            effect="dark"
            :closable="false"
          >
            Dark Danger Alert (不可关闭)
          </Alert>
        </div>
      </div>
    </section>
    <hr />
    <!-- ================ Icon 组件演示 ================ -->
    <section class="icon-demo">
      <h2>Icon 组件演示</h2>
      <ICon icon="arrow-up" size="xl" type="warning" color="green"></ICon>
    </section>
    <hr />
    <!-- ================ Button 组件演示 ================ -->
    <section class="button-demo">
      <h2>Button 组件演示</h2>
      <div class="button-group">
        <!-- <Button ref="buttonRef">普通按钮</Button> -->
        <Button @click="open">普通按钮</Button>
        <Button @click="close">普通按钮</Button>
        <Button size="large" icon="arrow-up" loading>加载中按钮</Button>
        <Button size="large" icon="arrow-up">带图标按钮</Button>
      </div>
    </section>
    <hr />
    <!-- ================ Collapse 组件演示 ================ -->
    <section class="collapse-demo">
      <h2>Collapse 组件演示</h2>
      <Collapse v-model="openedValue" accordion>
        <Item name="a" title="Title A">
          <h1>headline title</h1>
          <div>this is content a aaa</div>
        </Item>
        <Item name="b" title="Title B">
          <div>this is bbbbb test</div>
        </Item>
        <Item name="c" title="Disabled Title" disabled>
          <div>this is cccc test</div>
        </Item>
      </Collapse>
      <div>当前展开的面板: {{ openedValue }}</div>
    </section>
  </main>
</template>

<style scoped>
/* 基础布局样式 */

html,
body {
  overflow-y: scroll; /* 始终显示垂直滚动条 */
  margin-right: 0 !important; /* 防止margin被自动修改 */
}
main {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

section {
  margin-bottom: 30px;
}

h2 {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

hr {
  margin: 30px 0;
  border: none;
  border-top: 1px dashed #eee;
}

.section-item {
  margin-bottom: 10px;
}

/* Alert组件样式 */
.alert-group {
  margin-bottom: 20px;
}

/* Button组件样式 */
.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

/* Collapse组件样式 */
.collapse-demo {
  margin-bottom: 30px;
}
</style>
