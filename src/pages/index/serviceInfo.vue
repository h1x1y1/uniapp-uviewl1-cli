<template>
	<view class="container bg-white">
		<!-- 信息 -->
		<view class=" width-full">
			<view class="relative info bg-white lh18 color-9 mb10">
				<view class="fs15 fw600 color-3 lh18 pt20 pl15">
					{{dataInfo.MachineName}}
				</view>
				<u-field v-model="dataInfo.AssetsID" label="设备资产编号" placeholder="设备资产编号" label-width="200" disabled>
				</u-field>
				<u-field v-model="RepairMark" label="维修内容" placeholder="请填写维修内容" type="textarea" :required="true">
				</u-field>
				<u-field v-model="RepairReason" label="异常原因" placeholder="请填写异常原因" type="textarea" :required="true">
				</u-field>
				<view class="item flex align-items-center p15">
					<text class="pr12">使用零件</text>
					<view v-if="listData.length > 0" class="" @click="navTo('/pages/index/component', listData)">
						<text class="flex-1 flex align-items-center flex-center fs18"
							style="border: 2upx solid #0CE283; width: 100upx;height: 50upx;color: #0CE283;">+</text>
					</view>
					<text v-if="listData.length == 0" class="flex-1">没有可用零件</text>
				</view>

				<view v-if="tag_list.length > 0" class="item flex flex-col align-items-baseline flex-center fs15">
					<view class="flex-1 head flex" style="width: 100%;">
						<view class="flex-1 flex flex-center">
							零件名称
						</view>
						<view class="flex-1 flex flex-center">
							零件批次
						</view>
						<view class="flex-1 flex flex-center">
							使用数量
						</view>
					</view>
					<view class="body flex flex-col" style="width: 100%;">
						<view v-for="(item, index) in tag_list" :key="index" class="item flex">
							<view class="flex-1 flex flex-center">
								{{item.MCName}}
							</view>
							<view class="flex-1 flex flex-center">
								{{item.LotCODE}}
							</view>
							<view class="flex-1 flex flex-center">
								{{item.Qty}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="bottom-safe pl15 pr15 pb10" style="width: 750upx;">
			<u-button type="success" @click="onSubmit">维修完成</u-button>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		GetRepairFittings,
		SetMachineRepairWork
	} from '@/plugin/api'
	export default {
		data() {
			return {
				token: '',
				userInfo: {},
				dataInfo: {},
				RepairMark: '',
				RepairReason: '',
				listData: [],
				tag_list: []
			}
		},
		onShow() {
			console.log(this.$u.timeFormat(new Date().getTime(), 'yyyy/mm/dd MM:ss') + ':00')
		},
		onLoad(options) {
			console.log('onLoad');
			console.log(options)
			this.token = uni.getStorageSync('token')
			this.userInfo = uni.getStorageSync('userInfo')
			if (options.data) {
				let dataInfo = JSON.parse(options.data)
				this.dataInfo = dataInfo;
				uni.setStorage({
					key: 'RepairGuid',
					data: dataInfo.RepairGuid
				})
				this.init();
			}
		},
		methods: {
			// 页面初始化
			init() {
				this.ShowFittingsAccounts();
			},
			// 盘点列表
			ShowFittingsAccounts() {
				let that = this;
				uni.showLoading({
					title: 'loading...'
				})
				GetRepairFittings({
					UserGuid: that.userInfo.UserGuid,
					MCGuid: that.dataInfo.McGuid,
					FittingsName: ''
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
			// 提交-维修完成
			onSubmit() {
				let that = this;
				if (this.RepairMark == '' || this.RepairReason == '') {
					let msg = ''
					if (this.RepairMark == '') {
						msg = '请填写维修内容'
					} else {
						msg = '请填写异常原因'
					}
					that.$refs.uToast.show({
						title: msg,
						position: 'top',
						type: 'error'
					})
					return false
				}
				uni.showLoading({
					title: 'loading...'
				})
				SetMachineRepairWork({
					MachineGuid: this.dataInfo.MachineGuid,
					RepairGuid: this.dataInfo.RepairGuid,
					Status: 2,
					UpdateUserGuid: this.userInfo.UserGuid,
					ComPanyGuid: this.userInfo.ComPanyGuid,
					GroupGuid: this.userInfo.GroupGuid,
					RepairMark: this.RepairMark,
					RepairReason: this.RepairReason
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
			},
			// 零件列表
			onSaveTags(e) {
				let that = this;
				that.tag_list = e.dataList
				uni.$off('save')
			},
			// 跳转
			navTo(url, data, type) {
				let that = this;
				console.log('【index】【navTo】Url：' + url);
				if (url) {
					uni.$on('save', res => { //开启监听保存事件
						console.log(res);
						that.onSaveTags(res);
					})
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
