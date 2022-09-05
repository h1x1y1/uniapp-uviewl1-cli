import wx from 'weixin-js-sdk'

//企业微信
function getCofig() {
	const that = this
	let url = ''
	let ua = navigator.userAgent.toLowerCase()
	url = window.location.href.split('#')[0] //获取到的url是当前页面的域名
	//  后端提供配置信息
	uni.request({
		url: '/sso/qyWeixinAuth/getConfig', // 此处找后端要接口 微信不能使用端口访问端口改为 wx
		method: 'GET',
		data: {
			signUrl: url // 当前页面的域名
		},
		success: (response) => {
			const res = response.data
			console.log(res, 'resres')
			if (res) {
				that.QYWXConfig(
					res.appId,
					res.timestamp,
					res.noncestr,
					res.signature
				)
			} else {
				alert('获取配置信息返回为空')
			}
		},
		fail: error => {
			console.log(error, '请求获取微信配置失败 请求方法：http://xx.haileer.top:8901/wx_jsapi_ticket')
		}
	})
}
//wx.config的配置
function QYWXConfig(appId, timestamp, nonceStr, signature) {
	wx.config({
		beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
		debug: false, // 开启调试模式,
		appId: appId, // 必填，企业号的唯一标识
		timestamp: timestamp, // 必填，生成签名的时间戳
		nonceStr: nonceStr, // 必填，生成签名的随机串
		signature: signature, // 必填，签名
		jsApiList: ['scanQRCode', 'checkJsApi'], // 必填，需要使用的JS接口列表
	})
	wx.ready(() => {
		console.log('配置完成，扫码前准备完成')
	})
	wx.error(function(res) {
		alert('出错了：' + res.errMsg) //wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
	})
}

function QYWXonScan() {
	return new Promise(function(resolve, reject) {
		const that = this

		wx.scanQRCode({
			needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
			scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
			success: function(res) {
				var resultStr = res.resultStr // 当 needResult 为 1 时，扫码返回的结果
				var resultArr = resultStr.split(',') // 扫描结果以逗号分割数组
				var result = resultArr[resultArr.length - 1] // 获取数组最后一个元素，也就是最终的内容 
				resolve({
					"result": result,
					"scanType": "barcode"
				});

			},
			fail: function(response) {

				console.log("调用扫码失败")
				that.$toast(response)
				reject('调用扫码失败');
			},
		})
	});
}
//发送企业微信
function sendQYWX(item) {
	uni.request({
		url: '/sso/qyWeixinAuth/sendQYWX',
		method: 'GET',
		data: {
			state: "1000031", //应用编号
			// toUsers: item.toUsers, //工号 逗号分开121473
			toUsers: '121473',
			title: item.title, //主题
			des: item.des, //描述
			img: item.img, ////0维修1保养2点检3问题
			url: "http://mics.chunxing-group.com:8099/sso/qyWeixinAuth/getUserId?state=1000031&orderNo=" + item
				.url //单号
		},
		success: (response) => {},
		fail: error => {}
	});
}
export const QYWX = {
	getCofig,
	QYWXConfig,
	sendQYWX,
	QYWXonScan
}
