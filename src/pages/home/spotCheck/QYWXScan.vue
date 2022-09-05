<!-- xxx -->
<template>
	<view class="container">
		<u-navbar 
		 back-icon-color="#FFFFFF" 
		 :back-text-style="{ color: '#FFFFFF' }" 
		 back-text="返回" 
		 :background="{ backgroundColor: '#0066cb' }"></u-navbar>
		<!-- 搜索框 -->
		<view v-if="!dataList.Status" class="flex flex-col flex-center align-items-center">
			<text class="m20">请扫描设备上的二维码图案</text>
			<u-image width="250rpx" height="250rpx" style="height: 300rpx;" src="/static/index/scan.png"></u-image>
			<u-button size="default" shape="circle" type="primary" @click="onScanWX()">
				安全扫一扫
			</u-button>
		</view>
		
	</view>
</template>

<script>
	import {
		getSignature,
		randomString,
		getTimestamp
	} from '@/utils/util.js'
 

	export default {
		data() {
			return { 
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
				show: false,
				url:"",//跳转地址
				MC:""//设备编号
			}
		},
		onLoad(param) {
			 
			this.url=param.url;
			this.MC=param.MC;
			
		}, 
		methods: {			 
		  
			// 点击扫码 区分普通扫码和H5扫码 
			// h5扫描二维码并解析  
			onScanWX() { 
				 this.QYWX.QYWXonScan().then(res=>{alert(res.result)})
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
