const Fly = require("./wx.js")
const instance = new Fly()

// xxx
 
const host = process.env.NODE_ENV === 'production' ? 'http://localhost:8099/eqms' :
	'http://localhost:8099/eqms';
	// 'http://localhost:8099/eqms'; 

instance.interceptors.request.use((req) => {
	// const token = uni.getStorageSync('token')
	const token = '1213'
	if (token) {
		req.headers.token = token
	}
	return req
})

instance.interceptors.response.use(
	(res, promise) => {
		if (res.status == '401' || res.status === '500') {
			uni.removeStorage({
				key: 'token'
			});
			return
		}

		if (res.data.code == '401' || res.data.msg === '用户未登录') {
			uni.removeStorage({
				key: 'token'
			});
			uni.navigateTo({
				url: '/pages/login/login'
			})
			return
		}

		return promise.resolve(res)
	},
	(err, promise) => {
		if (err.status == '401') {
			uni.removeStorage({
				key: 'token'
			});
			return
		}

		if (err.status != 200) {
			return
		}

		return promise.resolve(err.response)
	}
)

 
 // instance.config.baseURL = "http://mics.chunxing-group.com:8099/eqms"  //生产环境
 // instance.config.baseURL = "http://localhost:8099/eqms" // 开发环境
 instance.config.baseURL = host
export default instance
