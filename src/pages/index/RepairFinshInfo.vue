<template>
	<view class="container">
		<view class="bg-white">
			<view class="fs15 fw600 color-3 lh18 pt20 pl15">
				{{dataInfo.MachineName}}
			</view>
			<!-- <view class="item flex align-items-center pl15 pr15" style="height: 40upx;">
				<text class="pl3">设备资产编号：</text>
				<text>{{dataInfo.AssetsID}}</text>
			</view> -->
			<u-field v-model="dataInfo.AssetsID" label="设备资产编号" placeholder="设备资产编号" label-width="200" disabled>
			</u-field>
			<u-field @click="showAction" v-model="sex" label="接收后状态" placeholder="请选择状态" label-width="200"
				right-icon="arrow-down-fill" :disabled="true" :required="true">
			</u-field>
			<u-field v-model="ReceiveMark" label="备注" placeholder="请填写备注" type="textarea">
			</u-field>
			<u-action-sheet @click="clickItem" :list="sexList" v-model="show"></u-action-sheet>
		</view>
		<view class="bottom-safe pl15 pr15 pb10" style="width: 750upx;">
			<u-button type="success" @click="onSubmit">维修完成</u-button>
		</view>
	</view>
</template>

<script>
	import {
		SetMachineRepairFinsh
	} from '@/plugin/api'

	export default {
		data() {
			return {
				token: '',
				userInfo: {},
				dataInfo: {},
				ReceiveMark: '',
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
				show: false
			}
		},
		onLoad(options) {
			console.log('onLoad');
			console.log(options)
			this.token = uni.getStorageSync('token')
			this.userInfo = uni.getStorageSync('userInfo')
			if (options.data) {
				let dataInfo = JSON.parse(options.data)
				this.dataInfo = dataInfo;
				// uni.setStorage({
				// 	key: 'RepairGuid',
				// 	data: dataInfo.RepairGuid
				// })
				this.init();
			}
		},
		methods: {
			// 页面初始化
			init() {
				// this.ShowFittingsAccounts();
			},

			showAction() {
				this.show = true;
			},
			clickItem(index) {
				this.sex = this.sexList[index].text;
				this.Status = this.sexList[index].value;
			},
			// 提交-维修完成
			onSubmit() {
				let that = this;
				uni.showLoading({
					title: 'loading...'
				})
				SetMachineRepairFinsh({
					MachineGuid: this.dataInfo.MachineGuid,
					RepairGuid: this.dataInfo.RepairGuid,
					Status: this.Status,
					UpdateUserGuid: this.userInfo.UserGuid,
					ComPanyGuid: this.userInfo.ComPanyGuid,
					GroupGuid: this.userInfo.GroupGuid,
					ReceiveMark: this.ReceiveMark
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
						setTimeout(() => {
							uni.navigateBack()
						}, 1000)
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
			}
		}
	}
</script>

<style>

</style>
