import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
//引入Font Awesome的核心库，负责管理图标集合
import { fas } from '@fortawesome/free-solid-svg-icons'
//导入所有Solid风格的图标集合，包含了全部免费实心图标

//导入Vue专用的FontAwesomeIcon组件，用于在模板中渲染图标
import App from './App.vue'

library.add(fas)
//将整个fas图标集添加到Font Awesome库中，使所有实心图标可在应用中使用
import './styles/index.css'
import testPlugin from './test.plugin'
const app = createApp(App)
app.use(testPlugin)
app.mount('#app')
//将FontAwesomeIcon组件全局注册为font-awesome-icon，在整个应用中可用
