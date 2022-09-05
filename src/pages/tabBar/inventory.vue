<!-- xxx -->
<template>
	<view class="container">
		<u-cell-group>
			<u-cell-item title="设备盘点" @click="navTo('/pages/inventory/device')"></u-cell-item>
			<u-cell-item title="铭牌检索" @click="navTo('/pages/inventory/QRIndex')"></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad() { 
		},
		onShow(){

		},
		methods: {
			// 跳转
			navTo(url, data, type) {
				 
				console.log('【index】【navTo】Url：' + url);
				if (url) {
					// this.route.navTo(url, data, type);
					uni.navigateTo({
						url:url
					})
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
