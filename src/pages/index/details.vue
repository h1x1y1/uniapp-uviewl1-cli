<!-- 详情 -->
<template>
	<view class="container">
		<view class="relative flex flex-col flex-between mb15 p10 br5 bg-white">
			<view class="flex flex-col flex-between" style="line-height: 2;">
				<text class="fs18 color-black fw600 title">{{listData.cCphm}}</text>
				<!-- <view class="small">
					<text class="">司机信息：{{listData.cJsyXm}}</text>
					<text class="ml15">{{listData.cPhone}} </text>
				</view> -->
				<text class="fs14">司机姓名：{{listData.cJsyXm ? listData.cJsyXm : '-'}}</text>
				<text class="fs14">司机电话：{{listData.cPhone ? listData.cPhone : '-'}}</text>
				<!-- <text class="fs12">合同<text style="color: #FFFFFF;">占</text>ID：{{listData.cHTID ? listData.cHTID : '-'}}</text> -->
				<!-- <text class="fs12">货单<text style="color: #FFFFFF;">占</text>ID：{{listData.cHdID ? listData.cHdID : '-'}}</text> -->
				<!-- <text class="fs12">客户的下单量id：{{listData.cPhone ? listData.cPhone : '-'}}</text> -->
				<text class="fs14">限<text style="color: #FFFFFF;">占位</text>载：{{listData.iXz}} 吨</text>
				<text class="fs14 fw600">货物名称：{{listData.cHwmc ? listData.cHwmc : '-'}}</text>
				<text class="fs14">收货单位：{{listData.cShdw ? listData.cShdw : '-'}}</text>
				<text class="fs14">承运单位：{{listData.ccYdw ? listData.ccYdw : '-'}}</text>
			</view>
		</view>
		<view class="flex flex-around mt20">
			<!-- <button type="primary" @click="confirmCoalType()">确认煤种</button> -->
			<u-button class="li-btn" size="medium" shape="circle" type="success" @click="confirmCoalType()">确认
			</u-button>
			<u-button size="medium" shape="circle" type="warning" @click="voidAutoWeight()">作废</u-button>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		GetAutoWeightSingle,
		ConfirmCoalType,
		VoidAutoWeight
	} from '@/plugin/api'
	export default {
		data() {
			return {
				code: '',
				listData: {}
			}
		},
		onLoad(options) {
			console.log('onLoad');
			this.token = uni.getStorageSync('token')
			if (options.data) {
				let code = JSON.parse(options.data)
				this.code = code;
				console.log(code);
				this.init(code);
			}
		},
		methods: {

			init(code) {
				this.getDataInfo(code);
			},

			getDataInfo(codeID) {
				let that = this;
				uni.showLoading({
					title: 'loading...'
				})

				GetAutoWeightSingle({
					token: that.token,
					strId: codeID
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
						that.listData = data[0];
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
			// 确认
			confirmCoalType() {
				let that = this;
				uni.showLoading({
					title: 'loading...'
				})

				ConfirmCoalType({
					token: that.token,
					strId: that.code
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
						that.listData = data[0];
						uni.hideLoading()
						uni.navigateBack()
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
			// 作废
			voidAutoWeight() {
				let that = this;
				uni.showLoading({
					title: 'loading...'
				})

				VoidAutoWeight({
					token: that.token,
					strId: that.code
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
						that.listData = data[0];
						uni.hideLoading()
						uni.navigateBack()
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
