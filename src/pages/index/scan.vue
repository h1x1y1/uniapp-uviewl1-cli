<!-- xxx -->
<template>
	<view class="container">
		<!-- 搜索框 -->
		<view v-if="!dataList.Status" class="flex flex-col flex-center align-items-center">
			<text class="m20">请扫描设备上的二维码图案</text>
			<u-image width="250rpx" height="250rpx" style="height: 300rpx;" src="/static/index/scan.png"></u-image>
			<u-button size="default" shape="circle" type="primary" @click="scanWX()">
				安全扫一扫
			</u-button>
		</view>
		<view v-if="dataList.Status" class="">
			<u-button class="p20" size="default" shape="circle" type="primary" @click="scanWX()">
				<u-icon name="scan" style="margin-right: 10rpx;"></u-icon>
				扫码查询
			</u-button>
		</view>
		<!-- 搜索结果 -->
		<view v-if="dataList.Status" class="relative flex flex-between mb15 p20 br5 bg-white">
			<view class="flex flex-col flex-between" style="line-height: 2;">
				<!-- 条码内容: {{qr_code}} -->
				<!-- Maintain -->
				<text class="fs14">设备名称：{{dataList.MachineName ? dataList.MachineName : '-'}}</text>
				<text class="fs14">设备类别：{{dataList.MCName ? dataList.MCName : '-'}}</text>
				<text class="fs14">成本中心：{{dataList.CostCenterName ? dataList.CostCenterName : '-'}}</text>
				<text class="fs14">所在区域：{{dataList.AreaName ? dataList.AreaName : '-'}}</text>
				<view class="">
					<text class="fs14">状<text style="color: #FFFFFF;">占位</text>态：</text>
					<u-tag v-if="dataList.Status === '待机'" text="待机"></u-tag>
					<u-tag v-if="dataList.Status === '未设置'" text="未设置" type="warning"></u-tag>
					<u-tag v-if="dataList.Status === '运行'" text="运行" type="success"></u-tag>
					<u-tag v-if="dataList.Status === '其他'" text="其他" type="error"></u-tag>
				</view>
			</view>
		</view>
		<view v-if="statusCard" class="bg-white">
			<u-field @click="showAction" v-model="sex" label="新状态" placeholder="请选择状态" right-icon="arrow-down-fill"
				:disabled="true" :required="true">
			</u-field>
			<u-field v-model="ReceiveMark" label="备注" placeholder="请填写备注" type="textarea">
			</u-field>
		</view>
		<!-- 操作按钮 -->
		<view v-if="statusCard" class="flex flex-around mt20">
			<!-- <button type="primary" @click="confirmCoalType()">确认煤种</button> -->
			<u-button size="medium" shape="circle" type="success" :disabled="dataList.Status === '其他'"
				@click="onSubmit()">确认更改
			</u-button>
			<u-button size="medium" shape="circle" type="warning" @click="statusCard = false">取消</u-button>
		</view>
		<!-- 操作按钮 -->
		<view v-if="dataList.Status && !statusCard" class="flex flex-around mt20">
			<!-- <button type="primary" @click="confirmCoalType()">确认煤种</button> -->
			<u-button size="medium" shape="circle" type="success" :disabled="dataList.Status === '其他'"
				@click="handleChangeStatus()">更改状态
			</u-button>
			<u-button v-if="dataList.Status === '未设置' || dataList.Status === '其他'" disabled size="medium" shape="circle"
				type="default">故障报修</u-button>
			<u-button v-if="dataList.Status === '运行' || dataList.Status === '待机'" size="medium" shape="circle"
				type="warning" @click="handleRepair()">故障报修</u-button>
		</view>
		<u-action-sheet @click="clickItem" :list="sexList" v-model="show"></u-action-sheet>
		<u-toast ref="uToast"></u-toast>

		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog mode="input" title="备注" message="成功消息" :duration="2000" placeholder="请输入描述信息"
				:before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {
		GetMachineStatus,
		SetMachineStatus
	} from '@/plugin/api'
	import {
		getSignature,
		randomString,
		getTimestamp
	} from '@/utils/util.js'
	// 按需引入
	import wx from 'weixin-js-sdk';

	export default {
		data() {
			return {
				appid: "wx14bba42f3abf4098", //企业微信id
				token: '',
				userInfo: {},
				qr_code: '',
				dataList: {},
				status: '',
				ReceiveMark: '',
				statusCard: false,
				sex: '',
				Status: '',
				sexList: [{
						text: '运行',
						value: 1
					},
					{
						text: '待机',
						value: 2
					},
					{
						text: '故障',
						value: 3
					},
					{
						text: '闲置',
						value: 9
					}
				],
				show: false
			}
		},
		onLoad() {
			this.token = uni.getStorageSync('token')
			this.userInfo = uni.getStorageSync('userInfo')
			this.getCofig(); //企业微信
		},
		onShow() {

		},
		methods: {
			// //企业微信 摄像头调用  前端调用，存在跨域问题
			// // 配置信息
			// // 1.获取企业ID与Secret			
			// // 2.获取Access_token					
			// // 3.获取ticket
			// // getQuery(){
			// // 	const url = location.href
			// //     const index = url.indexOf('?')
			// //     const obj = {}
			// //     if (index === -1) return obj
			// //     const queryStr = url.slice(index + 1)
			// //     const arr = queryStr.split('&')
			// //     for (let item of arr) {
			// //       const keyValue = item.split('=')
			// //       obj[keyValue[0]] = keyValue[1]
			// //     }
			// //     return obj
			// //   },
			// getWXtocken(){
			// 	// 时间戳-用于校验oauth2是否过期
			// 	const timestamp = String(new Date() * 1)

			// 	uni.request({
			// 		url: '/wxwx/cgi-bin/gettoken',
			// 		method: 'GET',
			// 		data: {
			// 			"corpid": this.appid,
			// 			"corpsecret": "DGyp97k5frev8WBguTQ0wDU-6BTAaFzRlBhSfaz94Oo"
			// 		},
			// 		success: (response) => {
			// 			this.getWXticket(response)
			// 		}

			// 	});
			// },
			// getWXticket(response) {
			// 	const ACCESS_TOKEN = response.data.access_token
			// 	const that = this
			// 	uni.request({
			// 		url: '/wxwx/cgi-bin/get_jsapi_ticket',
			// 		method: 'GET',
			// 		data: {
			// 			"access_token": ACCESS_TOKEN
			// 		},
			// 		success: (response) => {
			// 			// 生成时间戳
			// 			var timestamp = getTimestamp()

			// 			// 生成的随机字符串
			// 			var nonceStr = randomString(16)

			// 			// 有效期2小时，用localStorage做本地缓存
			// 			localStorage.setItem('timestamp', timestamp)

			// 			const res = response.data;
			// 			console.log(res, 'resres')
			// 			if (res) {

			// 				that.wxConfig(
			// 					that.appId,
			// 					timestamp,
			// 					nonceStr,
			// 					getSignature(res.ticket, nonceStr, timestamp)
			// 				);
			// 			} else {
			// 				alert('获取配置信息返回为空');
			// 			}
			// 		}

			// 	});
			// },
			// getCofig() {
			// 	//  if (getQuery().code) {
			// 	//     // 注意有些页面会有哈希值 如:http:baidu.com?code=123&state=1650005006516#home 此时获取state 为1650005006516#home 需要手动处理只保留1650005006516即可
			// 	//     const state = getQuery().state 

			// 	// code只能被消费一次获取完code后刷新页面需要重新获取 url的state如果等于localStorage的state说明刚获取完code未被消费不需调用授权
			// 	// if (state !== localStorage.getItem('state')) {
			// 		this.getWXtocken()
			// 	// } else {
			// 	// 	// 删除localStorage的state,防止刷新页面不好重新授权
			// 	// 	localStorage.removeItem('state')
			// 	// }
			// 	//   }else{
			// 	//     localStorage.setItem('state',timestamp)
			// 	//   getWXtocken()
			// 	//   } 
			// },
			    getCofig() {

			      const that = this;
			      let url = '';
			      let ua = navigator.userAgent.toLowerCase();
			      url = window.location.href.split('#')[0]; //获取到的url是当前页面的域名
			  alert(url+"===========4");
			      // GetWeixinScan 后端提供配置信息
			      uni.request({
						url: '/sso/qyWeixinAuth/getConfig',
			        // url: 'http://mics.chunxing-group.com:8081/sso/qyWeixinAuth/getConfig', // 此处找后端要接口 微信不能使用端口访问端口改为 wx
			        method: 'GET',
			        data: {
			          signUrl: url // 当前页面的域名
			        },
			        success: (response) => {
			          const res = response.data;
			          console.log(res, 'resres')
			          if (res) {
						   alert( res.appId);
			            that.wxConfig(
			              res.appId,
			              res.timestamp,
			              res.noncestr,
			              res.signature
			            );
			          } else {
			            alert('获取配置信息返回为空');
			          }
			        }
			        , fail: error => {
			          console.log(error, '请求获取微信配置失败 请求方法：http://xx.haileer.top:8901/wx_jsapi_ticket');
			        }
			      });
			    },
			//wx.config的配置
			wxConfig(appId, timestamp, nonceStr, signature) {
				wx.config({
					beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
					debug: true, // 开启调试模式,
					appId: appId, // 必填，企业号的唯一标识
					timestamp: timestamp, // 必填，生成签名的时间戳
					nonceStr: nonceStr, // 必填，生成签名的随机串
					signature: signature, // 必填，签名
					jsApiList: ['scanQRCode', 'checkJsApi'], // 必填，需要使用的JS接口列表
				});
				wx.ready(() => {
					console.log('配置完成，扫码前准备完成')
				})
				wx.error(function(res) {
					alert('出错了：' + res.errMsg); //wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
				});
			},

			// 扫码
			scanCode() {
				let that = this
				// 只允许通过相机扫码
				// uni.scanCode({
				// 	onlyFromCamera: true,
				// 	success: function(res) {
								this.QYWX.QYWXonScan().then(res=>{
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						that.qr_code = res.result

						that.getMachineStatus(res.result)
					// }
				});
			},
			showAction() {
				this.show = true;
			},
			clickItem(index) {
				this.sex = this.sexList[index].text;
				this.Status = this.sexList[index].value;
			},
			// 查询方法
			getMachineStatus(qrCode) {
				let that = this;
				const params = {
					MachineGuid: '',
					CostCenterGuid: '',
					McGuid: '',
					AreaGuid: '',
					Status: '',
					AssetsID: '',
					QRCode: qrCode
				}
				uni.showLoading({
					title: 'loading...'
				})
				GetMachineStatus(params).then(({
					data: {
						code,
						data,
						msg
					}
				}) => {
					console.log(code);
					console.log(data);
					uni.hideLoading()
					if (code === 1) {
						//...
						that.dataList = data[0];
						uni.hideLoading()
					} else {
						uni.hideLoading()
						that.$refs.uToast.show({
							title: msg,
							position: 'top',
							type: 'error'
						})
					}
				}).catch(function(e) {
					console.log(e);
					uni.hideLoading()
				})
			},

			// 故障报修
			handleRepair() {
				let that = this;
				that.status = 3;
				that.$refs.popup.open('center')
			},
			// 更改状态
			handleChangeStatus() {
				console.log('open');
				this.statusCard = true;
				// const repair = record.Status === '运行' ? '1' : (record.Status === '待机' ? '2' : (record.Status === '闲置' ? '9' : '0'))
				// that.status = that.dataList.Status === '运行' ? '2' : '1'
				// that.$refs.popupl.open('center')
			},

			onSubmit() {
				let that = this;
				const params = {
					MachineGuid: that.dataList.MachineGuid,
					Status: that.Status,
					Mark: that.ReceiveMark,
					UpdateUserGuid: that.userInfo.UserGuid,
					ComPanyGuid: that.userInfo.ComPanyGuid,
					GroupGuid: that.userInfo.GroupGuid
				}
				uni.showLoading({
					title: 'loading...'
				})
				SetMachineStatus(params).then(({
					data: {
						code,
						data,
						msg
					}
				}) => {
					console.log(code);
					console.log(data);
					this.statusCard = false
					uni.hideLoading()
					if (code === 1) {
						//...
						that.getMachineStatus(that.qr_code)
						uni.hideLoading()
						that.$refs.popup.close()
					} else {
						uni.hideLoading()
						that.$refs.popup.close()
						that.$refs.uToast.show({
							title: msg,
							position: 'top',
							type: 'error'
						})
					}
				}).catch(function(e) {

					console.log(e);
					uni.hideLoading()
					this.$refs.popup.close()
				})
			},
			/**
			 * 点击取消按钮触发
			 * @param {Object} done
			 */
			close() {
				// TODO 做一些其他的事情，before-close 为true的情况下，手动执行 close 才会关闭对话框
				// ...
				this.$refs.popup.close()
			},
			/**
			 * 点击确认按钮触发
			 * @param {Object} done
			 * @param {Object} value
			 */
			confirm(value) {
				// 输入框的值
				console.log(value)
				// TODO 做一些其他的事情，手动执行 close 才会关闭对话框
				// ...
				let that = this;
				const params = {
					MachineGuid: that.dataList.MachineGuid,
					Status: that.status,
					Mark: value,
					UpdateUserGuid: that.userInfo.UserGuid,
					ComPanyGuid: that.userInfo.ComPanyGuid,
					GroupGuid: that.userInfo.GroupGuid
				}
				uni.showLoading({
					title: 'loading...'
				})
				SetMachineStatus(params).then(({
					data: {
						code,
						data,
						msg
					}
				}) => {
					console.log(code);
					console.log(data);
					uni.hideLoading()
					if (code === 1) {
						//...
						that.getMachineStatus(that.qr_code)
						uni.hideLoading()
						that.$refs.popup.close()
					} else {
						uni.hideLoading()
						that.$refs.popup.close()
						that.$refs.uToast.show({
							title: msg,
							position: 'top',
							type: 'error'
						})
					}
				}).catch(function(e) {

					console.log(e);
					uni.hideLoading()
					this.$refs.popup.close()
				})
			},

			// 点击扫码 区分普通扫码和H5扫码
			scanWX() {
				const that = this
				// #ifndef H5
				uni.scanCode({
					success: function(res) {
						console.log("进来了1")
						console.log('条码res：' + res);
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
					},
					fail: error => {
						console.log("暂不支持1")
					}

				});
				// #endif
				// #ifdef H5
				// this.log("暂不支持H5扫码 走onScanWX这个方法") 
				this.onScanWX()
				// #endif
			},
			// h5扫描二维码并解析  
			onScanWX() {
				const that = this;
				wx.scanQRCode({
					needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
					scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
					success: function(res) {
						var result = res.resultStr; // 当 needResult 为 1 时，扫码返回的结果
						var resultArr = result.split(','); // 扫描结果以逗号分割数组
						var codeContent = resultArr[resultArr.length - 1]; // 获取数组最后一个元素，也就是最终的内容 
					},
					fail: function(response) {
						console.log("调用扫码失败")
						that.$toast(response);
						alert(' wx.scanQRCode失败')
					},
				});

			},


		}
	}
</script>

<style lang='scss'>
	.container {
		min-height: 100vh;
		background: #f5f5f5;
	}
</style>
