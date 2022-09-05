<!-- 详情 -->
<template>
	<view class="container">
		<!-- 搜索框 -->
		<view v-if="!show" class="flex flex-col flex-center align-items-center">
			<text class="m20">请扫描设备上的二维码图案</text>
			<u-image width="250rpx" height="250rpx" style="height: 300rpx;" src="/static/index/scan.png"></u-image>
			<u-button size="default" shape="circle" type="primary" @click="scanCode()">
				安全扫一扫
			</u-button>
		</view>
		<view v-show="false" class="pl20 pr20">
			<u-button class="p20" size="default" shape="circle" type="primary" @click="back()">
				<u-icon name="scan" style="margin-right: 10rpx;"></u-icon>
				扫码查询
			</u-button>
		</view>
		<view v-show="show" class="">
			<view class="flex flex-col align-items-center bg-white u-p-t-80">
				<text class="fs16 fw600">请拍摄并上传设备照片</text>
				<view class="flex flex-wrap flex-around p10">
					<!-- <u--image width="80" height="80" @click='onImage' :src="serverUrl+userInfo.avatar" shape="circle">
					</u--image> -->
					<view class="flex flex-col align-items-center" style="width: 40vw;">
						<u-upload :width="300" :height="240" :action="action" :formData="formData"
							v-on:on-success="onImageSuccess1" @delete="deletePic1" :maxCount="1"></u-upload>
						<text class="p10">正面</text>
					</view>
					<view class="flex flex-col align-items-center" style="width: 40vw;">
						<u-upload :width="300" :height="240" :action="action" :formData="formData"
							v-on:on-success="onImageSuccess2" @delete="deletePic2" :maxCount="1"></u-upload>
						<text class="p10">背面</text>
					</view>
					<view class="flex flex-col align-items-center" style="width: 40vw;">
						<u-upload :width="300" :height="240" :action="action" :formData="formData"
							v-on:on-success="onImageSuccess3" @delete="deletePic3" :maxCount="1"></u-upload>
						<text class="p10">侧面</text>
					</view>
					<view class="flex flex-col align-items-center" style="width: 40vw;">
						<u-upload :width="300" :height="240" :action="action" :formData="formData"
							v-on:on-success="onImageSuccess4" @delete="deletePic4" :maxCount="1"></u-upload>
						<text class="p10">设备铭牌</text>
					</view>
				</view>
			</view>
			<!-- <view class="">
				<button type="default" @click="onImage()">打开相册</button>
			</view> -->

			<view class="flex flex-around fixed bottom-safe" style="width: 100vw;">
				<button style="width: 100vw; background-color: #00A1B4; color: #fff;" type="default"
					@click="submit">提交</button>
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		CheckQRCode,
		FinshInventoryPlanList,
		OnPushImage,
		GetqiniuToken
	} from '@/plugin/api'
	export default {

		data() {
			return {
				token: '',
				userInfo: {},
				MachineGuid: '',
				IPGuid: '',
				qr_code: '',
				dataList: {},
				status: '',
				show: false,
				NeedPhotos: true,
				action: 'https://up-z1.qiniup.com',
				formData: {
					'key': '',
					'token': ''
				},
				server: 'https://xixiaruan.com/',
				// 图片
				fileUrl1: '',
				fileUrl2: '',
				fileUrl3: '',
				fileUrl4: ''
			}
		},
		onReady() {
			// 获取七牛云token
			let that = this;
			// console.log(qrCode)
			const params = {
				accessKey: 'OJvLvNCEH3vPg3JyLMwkGGgRKpi72sFYZflTv4vn',
				secretKey: 'EvxNFSialE3G4BcFGo9uaIjUSg2FlIjyJwzh4gOT'
			}
			GetqiniuToken(params).then(({
				data: {
					code,
					Token,
					msg
				}
			}) => {
				console.log(code);
				// console.log(data);
				uni.hideLoading()
				if (code === 1 && msg === '新增成功') {
					//...
					this.formData.key = 'device/Tynz' + new Date().getTime()
					this.formData.token = Token
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
		onLoad(options) {
			console.log('onLoad');
			this.token = uni.getStorageSync('token')
			this.userInfo = uni.getStorageSync('userInfo')
			this.qr_code = uni.getStorageSync('qr_code')
			if (options.data) {
				let code = JSON.parse(options.data)
				console.log(code)
				this.MachineGuid = code.MachineGuid;
				this.IPGuid = code.IPGuid;
				this.NeedPhotos = code.NeedPhotos == 'true' ? true : false;
				this.init();
			}
		},
		methods: {

			init() {
				this.checkQRCode(this.qr_code)
			},

			// 扫码
			scanCode() {
				console.log(2)
				let that = this
				// 只允许通过相机扫码
				// uni.scanCode({
				// 	onlyFromCamera: true,
				// 	success: function(res) {
								this.QYWX.QYWXonScan().then(res=>{
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						that.qr_code = res.result.replace(/[\r\n]/g, "\\n")
						// console.log(that.qr_code.replace(/[\r\n]/g,"\\n"))
						that.checkQRCode(res.result)
					// }
				});
			},

			back() {
				this.show = false
			},
			// 查询方法
			checkQRCode(qrCode) {
				let that = this;
				// console.log(qrCode)
				const params = {
					MachineGuid: that.MachineGuid,
					QRCode: qrCode.replace(/[\r\n]/g, "\\n")
				}
				uni.showLoading({
					title: 'loading...'
				})
				CheckQRCode(params).then(({
					data: {
						code,
						data,
						msg
					}
				}) => {
					// console.log(code);
					// console.log(data);
					uni.hideLoading()
					if (code === 1 && msg === '成功') {
						//...
						that.show = true
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

			deletePic1(event) {
				this.fileUrl1 = '';
			},

			deletePic2(event) {
				this.fileUrl2 = '';
			},

			deletePic3(event) {
				this.fileUrl3 = '';
			},

			deletePic4(event) {
				this.fileUrl4 = '';
			},

			onImageSuccess1(e) {
				console.log(e);
				this.fileUrl1 = e.key;
				this.getToken();
			},

			onImageSuccess2(e) {
				console.log(e);
				this.fileUrl2 = e.key;
				this.getToken();
			},

			onImageSuccess3(e) {
				console.log(e);
				this.fileUrl3 = e.key;
				this.getToken();
			},

			onImageSuccess4(e) {
				console.log(e);
				this.fileUrl4 = e.key;
				this.getToken();
			},

			getToken() {
				// 获取七牛云token
				let that = this;
				// console.log(qrCode)
				const params = {
					accessKey: 'OJvLvNCEH3vPg3JyLMwkGGgRKpi72sFYZflTv4vn',
					secretKey: 'EvxNFSialE3G4BcFGo9uaIjUSg2FlIjyJwzh4gOT'
				}
				GetqiniuToken(params).then(({
					data: {
						code,
						Token,
						msg
					}
				}) => {
					console.log(code);
					// console.log(data);
					uni.hideLoading()
					if (code === 1 && msg === '新增成功') {
						//...
						this.formData.key = 'device/Tynz' + new Date().getTime()
						this.formData.token = Token
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

			onImage() {
				let that = this
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						console.log(JSON.stringify(res.tempFilePaths));

						const tempFilePaths = res.tempFilePaths;
						uni.uploadFile({
							url: 'https://up-z1.qiniup.com', //接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							formData: that.formData,
							success: (uploadFileRes) => {
								console.log(uploadFileRes.data);
							}
						});
					}
				});
			},

			onPushImage(type, strFileName, strFileURL) {
				let that = this;
				const params = {
					OrderGuid: that.IPGuid,
					ClassType: that.MachineGuid,
					Type: type,
					strFileName: strFileName,
					strFileURL: that.server + strFileURL,
					UpdateUserGuid: that.userInfo.UserGuid
				}

				OnPushImage(params).then(({
					data: {
						code,
						data,
						msg
					}
				}) => {
					console.log(code);
					console.log(data);
					uni.hideLoading()
					if (code === 1 && msg === '成功') {
						//...
						resolve();
					} else {
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
			// 提交
			async submit() {
				let that = this;
				// console.log(qrCode)
				// 是否需要盘点拍照
				if (that.NeedPhotos) { //
					if (that.fileUrl1 == '' || that.fileUrl2 == '' || that.fileUrl3 == '' || that.fileUrl4 == '') {
						that.$refs.uToast.show({
							title: '请上传完所有图片',
							position: 'top',
							type: 'error'
						})
						return false
					}

					await that.onPushImage('正面', that.fileUrl1, that.fileUrl1)
					await that.onPushImage('背面', that.fileUrl2, that.fileUrl2)
					await that.onPushImage('侧面', that.fileUrl3, that.fileUrl3)
					await that.onPushImage('设备铭牌', that.fileUrl4, that.fileUrl4)

					const params = {
						IPGuid: that.IPGuid,
						UpdateUserGuid: that.userInfo.UserGuid
					}
					uni.showLoading({
						title: 'loading...'
					})
					FinshInventoryPlanList(params).then(({
						data: {
							code,
							data,
							msg
						}
					}) => {
						console.log(code);
						// console.log(data);
						uni.hideLoading()
						if (code === 1 && msg === '成功') {
							//...
							uni.hideLoading()
							that.$refs.uToast.show({
								title: msg,
								position: 'top',
								type: 'success'
							})
							setTimeout(() => {
								uni.navigateBack({})
							}, 1000)
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
				} else {
					if (that.fileUrl1 != '') {
						await that.onPushImage('正面', that.fileUrl1, that.fileUrl1)
					}

					if (that.fileUrl2 != '') {
						await that.onPushImage('背面', that.fileUrl2, that.fileUrl2)
					}
					if (tthat.fileUrl3 != '') {
						await that.onPushImage('侧面', that.fileUrl3, that.fileUrl3)
					}
					if (that.fileUrl4 != '') {
						await that.onPushImage('设备铭牌', that.fileUrl4, that.fileUrl4)
					}
					const params = {
						IPGuid: that.IPGuid,
						UpdateUserGuid: that.userInfo.UserGuid
					}
					uni.showLoading({
						title: 'loading...'
					})
					FinshInventoryPlanList(params).then(({
						data: {
							code,
							data,
							msg
						}
					}) => {
						console.log(code);
						// console.log(data);
						uni.hideLoading()
						if (code === 1 && msg === '成功') {
							//...
							uni.hideLoading()
							that.$refs.uToast.show({
								title: msg,
								position: 'top',
								type: 'success'
							})
							setTimeout(() => {
								uni.navigateBack({})
							}, 1000)
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
				}
			}
		}
	}
</script>

<style lang='scss'>
	.container {
		min-height: 100vh;
		background: #f5f5f5;
	}

	.u-size-medium {
		font-size: 16px !important;
	}
</style>
