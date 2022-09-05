<template>
	<view>
	<view class="u-m-t-20">
		<u-cell-group>
			<u-cell-item title="关于我们"></u-cell-item>
			<u-cell-item title="修改密码" @click="midfypsw"></u-cell-item>
		</u-cell-group>
	</view>	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			midfypsw() {
				uni.navigateTo({
					url: '/pages/my/midfyPsw'
				})
			},
		}
	}
</script>

<style>

</style>
