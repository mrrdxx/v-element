import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ICon from '../Icon/Icon.vue'

describe('Button.vue', () => {
  test('basic button', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'primary'
      },
      slots: {
        default: 'button'
      }
    })
    console.log(wrapper.html())
    expect(wrapper.classes()).toContain('vk-button--primary')
    //检查按钮组件是否包含CSS类名vk-button--primary
    //验证组件正确地根据传入的type: 'primary'属性应用了对应的样式类
    //确保组件的CSS类名生成逻辑工作正常
    //测试了组件的样式处理能力，特别是它如何处理type属性并将其转换为适当的CSS类
    expect(wrapper.get('button').text()).toBe('button')
    //使用wrapper.get('button')选择按钮元素
    //检查按钮元素的文本内容是否为'button'
    //验证通过默认插槽（slots: { default: 'button' }）传入的内容是否正确渲染
    //测试了组件的插槽内容渲染能力，确保用户提供的内容正确显示在按钮中
    wrapper.get('button').trigger('click')
    console.log(wrapper.emitted())
    //点击以后输出现在被触发的所有事件的名称
    expect(wrapper.emitted()).toHaveProperty('click')
  })
  //wrapper.emitted() 返回组件实例已触发的所有事件的记录，是一个对象，其中每个属性名对应一个事件名
  //.toHaveProperty('click') 断言这个对象中包含名为 'click' 的属性，即检查是否触发了点击事件
  test('disabled', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true
      },
      slots: {
        default: 'disabled'
      }
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
    // 验证按钮元素有disabled属性(检查HTML标签中是否存在disabled属性)

    expect(wrapper.find('button').element.disabled).toBeDefined()
    // 验证按钮元素的disabled属性在DOM元素上真实存在(检查DOM元素的disabled属性)

    wrapper.get('button').trigger('click')
    // 模拟用户点击禁用状态的按钮

    expect(wrapper.emitted()).not.toHaveProperty('click')
    // 验证禁用状态的按钮被点击时没有触发click事件(确认disable功能正常)
  })
  test('icon', () => {
    const wrapper = mount(Button, {
      props: {
        icon: 'arrow-up'
      },
      slots: {
        default: 'icon'
      },
      global: {
        stubs: ['FontAwesomeIcon']
      }
    })
    const iconElement = wrapper.findComponent(FontAwesomeIcon)
    // 查找Button组件内部的FontAwesomeIcon子组件并将其赋值给iconElement变量

    expect(iconElement.exists()).toBeTruthy()
    // 验证FontAwesomeIcon组件确实存在于按钮中，即按钮正确渲染了图标组件

    expect(iconElement.attributes('icon')).toBe('arrow-up')
    // 验证FontAwesomeIcon组件的icon属性值为'arrow-up'，确保显示了正确的图标
  })
  test('loading', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      },
      slots: {
        default: 'loading'
      },
      global: {
        stubs: ['ICon']
      }
    })
    console.log(wrapper.html())

    const iconElement = wrapper.findComponent(ICon)
    // 查找并获取按钮内部的Icon组件实例

    expect(iconElement.exists()).toBeTruthy()
    // 验证Icon组件确实存在于按钮中

    expect(iconElement.attributes('icon')).toBe('spinner')
    // 验证Icon组件的icon属性值为'spinner'，确保显示的是加载中的图标

    expect(wrapper.attributes('disabled')).toBeDefined()
    // 验证按钮在加载状态下自动被禁用(有disabled属性)
  })
})
