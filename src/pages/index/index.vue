<template>
	<view>
		<text class="title">{{title}}</text>
		<u-row gutter="16">
			<u-col span="3">
				<view class="demo-layout bg-purple"></view>
			</u-col>
			<u-col span="4">
				<view class="demo-layout bg-purple-light"></view>
			</u-col>
			<u-col span="5">
				<view class="demo-layout bg-purple-dark"></view>
			</u-col>
		</u-row>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
		  console.log(this.$u.config.v);
		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin: 200rpx auto 50rpx auto;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	.wrap {
		padding: 24rpx;
	}

	.u-row {
		margin: 40rpx 0;
	}

	.demo-layout {
		height: 80rpx;
		border-radius: 8rpx;
	}

	.bg-purple {
		background: #d3dce6;
	}

	.bg-purple-light {
		background: #e5e9f2;
	}

	.bg-purple-dark {
		background: #99a9bf;
	}
</style>
