import { defineComponent } from 'vue'
const RenderVnode = defineComponent({
  props: {
    vNode: {
      type: [String, Object],
      required: true
    }
  },
  setup(props) {
    return () => props.vNode
  }
})

export default RenderVnode
/*h('b', 'this is bold') 与 label: '选项2' 进入 RenderVnode 的区别

这两种数据在进入 RenderVnode 组件后有本质的区别，它们以不同的形式被处理，最终导致不同的渲染结果。

1. 数据类型的区别

   `h('b', 'this is bold')`：
   - 是通过 h() 函数创建的 VNode 对象
   - 具有复杂的内部结构，包含标签名、属性、子节点等信息
   - 大致结构如下：
     {
       type: 'b',                 // HTML标签名
       props: null,               // 没有属性
       children: 'this is bold',  // 子内容是文本
       // ...其他内部属性
     }

   '选项2'：
   - 是一个简单的 字符串
   - 没有内部结构，就是纯文本值 '选项2'

2. 进入 RenderVnode 后的处理流程

当这两种不同类型的数据作为 vNode 属性进入 RenderVnode 组件：

setup(props) {
  return () => props.vNode
}

对于每种情况：

案例1：props.vNode 是 VNode 对象
// 当 label: h('b', 'this is bold') 时
props.vNode = {type: 'b', children: 'this is bold', ...}

// 渲染函数返回这个对象
return () => props.vNode

Vue 的渲染系统收到这个 VNode 对象，会按照以下步骤处理：
1. 识别到这是一个 VNode 描述对象
2. 解析其中的 type: 'b'，知道要创建一个 <b> 标签
3. 解析 children: 'this is bold'，将文本放入标签中
4. 最终在 DOM 中创建 <b>this is bold</b> 元素

案例2：props.vNode 是字符串
// 当 label: '选项2' 时
props.vNode = '选项2'

// 渲染函数返回这个字符串
return () => props.vNode

Vue 的渲染系统收到这个字符串，会按照以下步骤处理：
1. 识别到这是一个字符串值
2. 直接创建一个文本节点
3. 最终在 DOM 中创建纯文本内容 选项2（没有任何HTML标签包裹）

3. 最终渲染结果对比

h('b', 'this is bold') 的结果：
<li class="vk-dropdown__item">
  <b>this is bold</b>  <!-- 带有HTML标签的富文本 -->
</li>

'选项2' 的结果：
<li class="vk-dropdown__item is-disabled">
  选项2  <!-- 纯文本节点，没有额外标签 -->
</li>

4. 关键区别总结

1. 数据复杂度：
   - VNode 对象包含完整的 DOM 结构描述
   - 字符串是最简单的内容形式

2. 渲染产物：
   - VNode 渲染为带标签的结构化内容
   - 字符串渲染为纯文本节点

3. 功能灵活性：
   - 使用 h() 可以创建任意复杂的 DOM 结构
   - 字符串只能表达纯文本内容

4. 处理机制：
   - 对 VNode，Vue 递归处理其内部结构
   - 对字符串，Vue 直接创建文本节点

这种设计使 Dropdown 组件既能接受简单的文本选项，又能支持复杂的富文本或组件作为选项标签，提供了极大的灵活性。*/

/*   "Vue 发现返回值是函数，将其视为渲染函数"      让我用更直观、更简单的方式来解释这个概念：

## Vue 组件渲染的两种方式

### 方式一：使用模板（大多数人的用法）

```vue
<template>
  <div>Hello, {{ name }}</div>
</template>

<script setup>
import { ref } from 'vue'
const name = ref('World')
</script>
```

这里 Vue 会：
1. 读取 `<template>` 部分
2. 将模板编译成一个函数
3. 用这个函数来渲染组件

### 方式二：直接提供渲染函数（高级用法）

```javascript
import { ref } from 'vue'

export default {
  setup() {
    const name = ref('World')
    
    // 直接返回一个函数，告诉Vue如何渲染
    return () => h('div', null, `Hello, ${name.value}`)
  }
}
```

## 简单类比

想象 Vue 组件就像一个厨师：

1. **使用模板**就像按照食谱烹饪：
   - 食谱（模板）规定了具体步骤
   - Vue 会将食谱转换为实际操作（编译为渲染函数）
   - 然后执行这些操作（调用渲染函数）

2. **直接返回函数**就像你自己告诉厨师每一步该做什么：
   - 跳过了食谱（模板）
   - 直接给出了操作指南（渲染函数）

## 通俗解释

当 Vue 看到 `setup` 返回了一个函数时，它会想：

> "哦，这个组件没有使用普通的模板，而是直接告诉我怎么渲染。我应该调用这个函数来获取渲染内容，而不是去寻找模板。"

所以在 `RenderVnode` 组件中：

```javascript
setup(props) {
  return () => props.vNode
}
```

Vue 看到 `setup` 返回了一个函数 `() => props.vNode`，就会调用这个函数来获取应该渲染的内容。函数返回了 `props.vNode`，所以 Vue 就会渲染这个 vNode。

这就像你告诉 Vue："不要找什么模板了，我要渲染的就是传给我的 vNode，照着它渲染就行了。"

这种方式很直接，也很强大，因为它允许你完全控制渲染过程，但大多数情况下普通的模板方式更简单易用。*/

/*
# Vue 如何将 h('b', 'this is bold') 渲染成 `<b>this is bold</b>`

这是一个很好的问题！让我解释 Vue 内部是如何处理这个过程的：

## h 函数的本质

`h` 函数（也叫 `createElement`）是 Vue 提供的一个工具函数，它的作用是创建虚拟 DOM 节点（VNode）。

当你调用 `h('b', 'this is bold')` 时：
- 第一个参数 `'b'` 指定了HTML标签名
- 第二个参数 `'this is bold'` 是内容

## Vue 渲染系统的工作原理

Vue 的渲染系统非常智能，它能理解不同类型的返回值：

1. **识别 VNode 对象**：
   Vue 渲染系统有特定的机制来识别 VNode 对象。VNode 对象有特定的内部结构和属性，Vue 能够识别这种格式。

2. **解析 VNode 结构**：
   当 Vue 识别到一个对象是 VNode 时，它会提取其中的信息：
   - `type` 属性告诉 Vue 要创建什么样的 DOM 元素（例如 `'b'` 表示创建 `<b>` 标签）
   - `children` 属性告诉 Vue 这个元素的内容是什么

3. **递归渲染**：
   - 如果 `children` 是字符串，Vue 会创建文本节点
   - 如果 `children` 是另一个 VNode 或 VNode 数组，Vue 会递归处理

## 具体到 h('b', 'this is bold') 的例子

1. **VNode 创建阶段**：
   ```javascript
   const boldVNode = h('b', 'this is bold')
   ```
   这创建了一个 VNode 对象，大致结构为：
   ```javascript
   {
     type: 'b',
     children: 'this is bold',
     // ...其他Vue内部使用的属性
   }
   ```

2. **渲染函数返回阶段**：
   ```javascript
   return () => props.vNode  // 返回这个VNode对象
   ```

3. **Vue 渲染处理阶段**：
   - Vue 看到返回值是一个对象
   - 检查这个对象的属性和结构，确认它是一个 VNode
   - 读取 `type: 'b'`，决定创建一个 `<b>` 标签
   - 读取 `children: 'this is bold'`，决定这个标签的内容是文本 "this is bold"
   - 生成实际的 DOM 元素：`<b>this is bold</b>`

## Vue 是如何"聪明地"知道这是 VNode？

Vue 的渲染系统对 VNode 对象有内部标记和验证机制：

1. **内部标识**：VNode 对象通常带有特殊的内部属性或符号，Vue 可以用它来识别 VNode

2. **结构验证**：Vue 检查对象是否具有特定的属性结构（如 `type`、`children` 等）

3. **工厂创建**：`h` 函数不仅创建对象，还给对象添加了一些特殊标记，使 Vue 能够识别它

这些机制让 Vue 能够区分普通对象和 VNode 对象，从而正确地将 VNode 转换为实际的 DOM 元素。

## 为什么需要 RenderVnode 组件？

即使 Vue 能识别 VNode，它也需要知道何时应该将一个值视为 VNode 处理。通过 `setup` 返回渲染函数，我们明确地告诉 Vue："这个返回值是要用于渲染的，不是普通数据"。

这就是 `return () => props.vNode` 的魔力所在 - 它把传入的 VNode 对象放在了 Vue 期望找到渲染描述的位置上，从而触发正确的渲染流程。

*/
