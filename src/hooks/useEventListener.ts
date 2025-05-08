import { onMounted, onBeforeUnmount, isRef, watch, unref } from 'vue'
import type { Ref } from 'vue'
export default function useEventListener(
  target: Ref<EventTarget | null> | EventTarget,
  //前者：DOM 元素、window 和 document 都是 EventTarget 的实例
  //后者：Ref 是 Vue 提供的一个响应式引用类型，用于存储响应式数据。
  //Ref<EventTarget | null> 表示 target 可以是一个包含 EventTarget 或 null 值的响应式引用。
  event: string,
  handler: (e: Event) => any
) {
  if (isRef(target)) {
    //isRef可以判断传入的值是不是响应式对象
    watch(target, (value, oldValue) => {
      oldValue?.removeEventListener(event, handler)
      value?.addEventListener(event, handler)
    })
    /*响应式对象和普通对象需要不同的处理方式：
1. 如果 `target` 是响应式对象（Ref），那么它的值可能会随时变化，所以需要使用 `watch` 来监听它的变化，当值变化时需要：
   - 移除旧目标上的事件监听器
   - 在新目标上添加事件监听器
2. 如果 `target` 是普通的 EventTarget（如 DOM 元素、window 或 document），则只需要在组件挂载时添加事件监听器即可。
*/
  } else {
    onMounted(() => {
      target.addEventListener(event, handler)
    })
  }

  onBeforeUnmount(() => {
    unref(target)?.removeEventListener(event, handler)
  })
  /*`unref` 是 Vue 3 中的一个工具函数，它的用法和作用是：

1. 如果传入的参数是一个 ref 对象（响应式引用），它会返回该 ref 对象的内部值（`.value`）
2. 如果传入的参数不是 ref 对象，它会原样返回这个参数

简单来说，`unref(val)` 相当于：`isRef(val) ? val.value : val`

在这个代码例子中，`unref(target)` 的作用是：
- 如果 `target` 是响应式引用，获取其实际值（DOM 元素）
- 如果 `target` 已经是普通 DOM 元素，则直接使用

这样无论 `target` 是什么类型，都能正确地从目标元素上移除事件监听器，避免了内存泄漏，也让代码更简洁，不需要手动判断和处理两种不同的情况。
*/
}
