<!-- xxx -->
<template>
	<view class="container">
		<u-cell-group>
			<u-cell-item title="设备状态切换" @click="navTo('/pages/index/scan')"></u-cell-item>
			<u-cell-item title="设备点检" @click="navTo('/pages/index/inspection')"></u-cell-item>
			<u-cell-item title="设备保养" @click="navTo('/pages/index/maintain')"></u-cell-item>
			<u-cell-item title="设备维修接单" @click="navTo('/pages/index/repair')"></u-cell-item>
			<u-cell-item title="设备维修" @click="navTo('/pages/index/service')"></u-cell-item>
			<u-cell-item title="维修接收" @click="navTo('/pages/index/RepairFinsh')"></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	import {
		GetMachineStatus,
		SetMachineStatus
	} from '@/plugin/api'
	export default {
		data() {
			return {
				token: '',
				userInfo: {},
				qr_code: '',
				dataList: {},
				status: ''
			}
		},
		onLoad() {
			this.token = uni.getStorageSync('token')
			this.userInfo = uni.getStorageSync('userInfo')
		},
		onShow() {

		},
		methods: {
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
</style>
