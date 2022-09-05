<template>
	<view class="container pl15 pr15 pb20">
		<u-gap height="20" bg-color="#f5f5f5"></u-gap>
		<view class="flex flex-center align-items-center br10 color-white"
			style="height: 70upx;background-color: #0CE283;" @click="scanCode()">
			<u-icon size="36" name="scan" color="#fff"></u-icon>
			<text class="fs15 fw600">扫码查询</text>
		</view>
		<u-gap height="20" bg-color="#f5f5f5"></u-gap>
		<!-- 信息 -->
		<view class="" style="width: 690upx;">
			<view v-if="listData.length == 0" class="fs15 fw600 p15 bg-white br8">
				暂无可接单信息
			</view>
			<view v-if="listData.length > 0" v-for="(item, index) in listData" :key="index"
				class="relative info pt10 pl15 pr15 pb10 bg-white fs12 color-9 br8 mb10">
				<view class="fs15 fw600 color-3 lh18">
					{{item.MachineName}}
				</view>
				<view class="item flex align-items-center" style="height: 40upx;">
					<!-- <u-icon size="11" name="/static/item2/icon01.png"></u-icon> -->
					<text class="pl3">设备资产编号：</text>
					<text>{{item.AssetsID}}</text>
				</view>
				<view class="item flex align-items-center" style="height: 40upx;">
					<!-- <u-icon size="11" name="/static/item2/icon03.png"></u-icon> -->
					<text class="pl3">成本中心：</text>
					<text class="flex-1">{{item.CostCenterID}}</text>
				</view>
				<view class="item flex align-items-center" style="height: 40upx;">
					<!-- <u-icon size="11" name="/static/item2/icon03.png"></u-icon> -->
					<text class="pl3">报修时间：</text>
					<text class="flex-1">{{item.ngtime}}</text>
				</view>
				<view class="item flex align-items-center" style="height: 40upx;">
					<!-- <u-icon size="11" name="/static/item2/icon03.png"></u-icon> -->
					<text class="pl3">报修备注：</text>
					<text class="flex-1">{{item.Mark}}</text>
				</view>
				<view class="item flex align-items-center" style="height: 40upx;">
					<!-- <u-icon size="11" name="/static/item2/icon03.png"></u-icon> -->
					<text class="pl3">派单时间：</text>
					<text class="flex-1">{{item.Distribution_Time}}</text>
				</view>
				<view v-if="btnStatus" class="absolute flex" style="bottom: 14upx; right: 17upx;">
					<view class="br20 fs12 color-white flex align-items-center flex-center"
						style="background-color: #9771FF;height: 55upx; width: 126upx;"
						@click="navTo('/pages/index/serviceInfo', item)">
						查看详情
					</view>
				</view>
				<view v-if="false" class="item flex align-items-center flex-center fs15"
					style="color: #0CE283;height: 70upx;">
					<!-- <u-icon size="15" name="/static/item2/order.png"></u-icon> -->
					<text class="pl3">保修时间：</text>
					<text class="flex-1">xx</text>
				</view>
			</view>

		</view>

		<!-- <view class="bottom-safe" style="width: 690upx;">
			<u-button color="#0CE283" text="" @click="onAdd">接单维修</u-button>
		</view> -->
	</view>
</template>

<script>
	import {
		CheckQRCodeApp,
		GetRepairWorkList,
		SetMachineRepair
	} from '@/plugin/api'
	export default {
		data() {
			return {
				listData: [],
				btnStatus: false
			}
		},
		onShow() {
			console.log(this.$u.timeFormat(new Date().getTime(), 'yyyy/mm/dd MM:ss') + ':00')
		},
		onLoad(options) {
			console.log('onLoad');
			this.token = uni.getStorageSync('token')
			this.userInfo = uni.getStorageSync('userInfo')
			this.init();
		},
		methods: {
			// 页面初始化
			init() {
				this.GetRepairWorkLists();
			},
			// 盘点列表
			GetRepairWorkLists(QRCode) {
				let that = this;
				uni.showLoading({
					title: 'loading...'
				})
				GetRepairWorkList({
					UserGuid: that.userInfo.UserGuid,
					McGuid: '',
					MachineName: '',
					AssetsID: '',
					CostCenterGuid: '',
					QRCode: QRCode || ''
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
						that.total = data.length // 总设备数
						that.listData = data;
						if(QRCode){
							that.btnStatus = true
						} else {
							that.btnStatus = false
						}
						uni.hideLoading()
					} else {
						that.total = 0 // 总设备数
						that.listData = [];
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

						that.GetRepairWorkLists(newCode)
					// }
				});
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

<style lang="scss">
	.container {
		min-height: 100vh;
		background-color: #f5f5f5;
	}
</style>
