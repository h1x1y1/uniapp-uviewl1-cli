<!-- 详情 -->
<template>
	<view class="container">
		<!-- 扫码 -->
		<view class="flex p20">
			<u-button class="flex-1" size="default" shape="circle" type="primary" @click="scanCode()">
				<u-icon name="scan" style="margin-right: 10rpx;"></u-icon>
				扫码查询
			</u-button>
			<u-button v-if="false" class="" style="width: 200upx; margin-left: 10upx;" size="default" shape="circle"
				type="warning" @click="reset()">
				<u-icon name="close-circle" style="margin-right: 10rpx;"></u-icon>
				重置
			</u-button>
		</view>
		<!-- 设备列表 -->
		<view class="li-cards">
			<scroll-view style="height: calc(100vh - 160upx);" scroll-y="true">
				<view v-for="(item, index) in listData" :key="index" class="flex flex-col p10 u-border-bottom bg-white">
					<view class="flex">
						<view class="flex flex-1 flex-col lh15">
							<text class="fs14 color-waming">公<text style="color: #ffffff;">占位</text>
								司：{{item.CompanyID}}</text>
							<text class="fs14 color-waming">资产编号：{{item.AssetsID}}</text>
							<text class="fs14 color-waming">转固日期：{{item.AssetsDate || ''}}</text>
							<text class="fs14 color-waming">设备名称：{{item.MachineName || ''}}</text>
							<text class="fs14 color-waming">规格型号：{{item.MachineSpec || ''}}</text>
							<text class="fs14 color-waming">成本中心：{{item.CostCenterID || ''}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		GetQRCodeInfoApp,
		CheckQRCodeInventoryPlan
	} from '@/plugin/api'
	export default {
		data() {
			return {
				listData: [],
				qr_code: '',
				userInfo: {}
			}
		},
		onShow() {},
		onLoad(options) {
			console.log('onLoad');
			this.token = uni.getStorageSync('token')
			this.userInfo = uni.getStorageSync('userInfo')
		},
		methods: {
			// 扫码
			scanCode() {
				let that = this
				// 只允许通过相机扫码
				// uni.scanCode({
				// 	onlyFromCamera: true,
				// 	success: function(res) {
								this.QYWX.QYWXonScan().then(res=>{
						uni.showLoading({
							title: 'loading...'
						})
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						let newCode = res.result.replace(/[\r\n]/g, "\\n")
						uni.setStorage({
							key: 'qr_code',
							data: newCode
						})
						that.qr_code = res.result.replace(/[\r\n]/g, "\\n")
						let index = res.result.indexOf("\n");
						that.qr_code = res.result.substring(0, index)
						console.log(res.result.substring(0, index + 1))
						let one = res.result.indexOf("-1")
						console.log(one)

						GetQRCodeInfoApp({
							QRCode: newCode
						}).then(({
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
								that.listData = data
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
					// }
				});
			},
			// 重置筛选
			reset() {
				this.qr_code = '';
			},
			// 跳转
			navTo(url, data, type) {
				console.log('【index】【navTo】Url：' + url);
				if (url) {
					this.route.navTo(url, data, type);
				} else {
					this.$refs.uToast.show({
						title: '',
						type: 'warning'
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
