import Vue from 'vue'
import App from './App'
import Utils from "./utils/util"

Vue.config.productionTip = false

App.mpType = 'app'
 
//加载工具
Vue.prototype.utils = Utils;
//全局变量
import store from './store'
Vue.prototype.$store1 = store
// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView);
// 引入自定义路由
import route from './plugin/route.js'
Vue.prototype.route = route
// 引入自定义企业微信工具
import {QYWX} from './utils/QYWX'
Vue.prototype.QYWX=QYWX;
// 引入自定义插件
import cuEmpty from '@/component/empty/index.vue'
Vue.component('cu-empty', cuEmpty)

Vue.prototype.x_confirm = (title, buttons) => new Promise((resolve, reject) => {
	if (!buttons) {
		buttons = ["确定", "取消"]
	}
	//#ifndef APP-PLUS
	uni.showModal({
		title,
		confirmText: buttons[0],
		cancelText: buttons[1],
		success: ({
			confirm
		}) => {
			if (confirm) {
				resolve()
			}
		}
	})
	//#endif
	//#ifdef APP-PLUS
	plus.nativeUI.confirm(title, e => {
		if (e.index === 0) {
			resolve()
		}
	}, {
		buttons
	})
	//#endif
})

const app = new Vue({
	store,
    ...App
})
app.$mount()
