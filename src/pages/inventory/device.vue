<!-- 详情 -->
<template>
	<view class="container">
		<!-- 盘点单号 -->
		<view class="uni-list mb10">
			<view class="uni-list-cell flex bg-white" style="height: 100rpx;">
				<view class="uni-list-cell-left flex flex-center align-items-center" style="width: 30vw;">
					盘点单号
				</view>
				<view class="uni-list-cell-db flex-1 flex flex-center align-items-center">
					<picker class="flex align-items-center" style="width: 70vw; height: 100rpx;"
						@change="bindPickerChange" range-key="IONO" :range="array">
						<view class="uni-input flex align-items-center" style="width: 70vw; height: 100rpx;">
							{{IONO || '请选择'}}
						</view>
					</picker>
				</view>
			</view>
		</view>
		<view v-if="listData.length > 0" class="flex pl20 pr20">
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
			<scroll-view style="height: calc(100vh - 204upx);" scroll-y="true">
				<!-- v-if="qr_code == '' || (qr_code != '' && item.AssetsID == qr_code)" -->
				<view v-for="item in listData" :key="item.IPGuid"
					class="flex flex-col m10 p10 u-border-bottom bg-white">
					<view class="flex">
						<view class="flex flex-1 flex-col lh15">
							<text class="fs14 color-waming">资产编号：{{item.AssetsID}}</text>
							<text class="fs14 color-waming">设备名称：{{item.MachineName}}</text>
							<text class="fs14 color-waming">规格型号：{{item.MachineSpec || ''}}</text>
							<text class="fs14 color-waming">计划开始时间：{{item.StartTime || ''}}</text>
							<text class="fs14 color-waming">计划结束时间：{{item.EndTime || ''}}</text>
						</view>
						<view class="flex align-items-center">
							<!-- <text class="fs14 color-success" style="color: #01D157;">盘点</text> -->
						</view>
					</view>
				</view>
				<cu-empty :pn="current" :ps="size" :total="total" tips="暂无数据" />
			</scroll-view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		GetInventoryOrderList,
		GetInventoryPlanList,
		CheckQRCodeInventoryPlan
	} from '@/plugin/api'
	export default {
		data() {
			return {
				array: [],
				IONO: '',
				index: 0,
				code: '',
				listData: [],
				qr_code: '',
				current: 1, // 页数
				size: 20, // 页条目数
				total: 0, // 总条数
				userInfo: {}
			}
		},
		onShow() {
			if (this.IONO) {
				this.getInventoryPlanList(this.IONO)
			}
		},
		onLoad(options) {
			console.log('onLoad');
			this.token = uni.getStorageSync('token')
			this.userInfo = uni.getStorageSync('userInfo')
			this.init();
	 
			this.QYWX.getCofig();
		},
		methods: {
			// 页面初始化
			init() {
				this.getInventoryOrderList();
			},
			// 获取盘点单号列表
			getInventoryOrderList() {
				let that = this;
				uni.showLoading({
					title: 'loading...'
				})
				GetInventoryOrderList({
					IONO: '',
					UserGuid: that.userInfo.UserGuid
				}).then(({
					data: {
						code,
						data,
						msg
					}
				}) => {
					console.log(code);
					console.log(data);
					if (code === 1) {
						//...
						that.array = data;
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
			// 选择盘点单号
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index = e.target.value
				this.IONO = this.array[e.target.value].IONO
				this.getInventoryPlanList(this.IONO)
			},
			// 盘点列表
			getInventoryPlanList(IONO) {
				let that = this;
				uni.showLoading({
					title: 'loading...'
				})
				GetInventoryPlanList({
					UserGuid: that.userInfo.UserGuid,
					AssetsID: '',
					IONO: IONO
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
			// 扫码
			scanCode() {
				let that = this 
				// 只允许通过相机扫码
				this.QYWX.QYWXonScan().then(res=>{
					 ;
						console.log(res)
						uni.showLoading({
							title: 'loading...'
						}) 
						console.log('条码内容：' + res.result);
						 this.$u.toast(res.result)
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
						
						CheckQRCodeInventoryPlan({
							QRCode: newCode,
							IONO: that.IONO
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
								that.navTo('/pages/inventory/details', data[0])
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
