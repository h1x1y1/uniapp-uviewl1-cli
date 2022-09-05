<!-- 零件 -->
<template>
	<view class="container pl15 pr15">
		<view v-if="listData.length > 0" v-for="(item, index) in listData" :key="index"
			class="bg-white pl15 pr15 pt10 pb10 br8 mb10">
			<view class="fs15 fw600">
				{{item.MCName}}
			</view>
			<view class="">
				批次号：{{item.LotCODE}}
			</view>
			<view class="flex align-items-center flex-between">
				库存数量
				<view class="flex align-items-center flex-center" style="width: 212upx;height: 50upx;">
					{{item.INQTY}}
				</view>
			</view>
			<view class="flex align-items-center flex-between">
				使用数量
				<view class="">
					<u-number-box v-model="item.Qty" :max="item.INQTY"></u-number-box>
				</view>
			</view>
		</view>

		<view class="bottom-safe pb10" style="width: 690upx;">
			<u-button type="success" @click="onSubmit">确认</u-button>
		</view>
	</view>
</template>

<script>
	import {
		DelMachineRepairFitting,
		SetMachineRepairFitting
	} from '@/plugin/api'
	export default {
		data() {
			return {
				RepairGuid: '',
				listData: []
			}
		},
		onLoad(options) {
			console.log('onLoad');
			console.log(options)
			if (options.data) {
				let listData = JSON.parse(options.data)
				this.listData = listData;
				let RepairGuid = uni.getStorageSync('RepairGuid')
				this.RepairGuid = RepairGuid;
				// this.init(code);
			}
			this.token = uni.getStorageSync('token')
			this.userInfo = uni.getStorageSync('userInfo')
		},
		methods: {
			// 提交
			onSubmit() {
				let that = this;
				uni.showLoading({
					title: 'loading...'
				})
				// 删除旧记录
				DelMachineRepairFitting({
					RepairGuid: that.RepairGuid
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
						//新增
						this.setItem();
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

			SetMachineRepairFittings(item) {
				let that = this;
				console.log(item);
				SetMachineRepairFitting({
					RepairGuid: this.RepairGuid,
					McGuid: item.mcguid,
					LotNo: item.LotCODE,
					Qty: item.Qty
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
						setTimeout(() => {
						}, 100)
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

			// 新增零件
			async setItem(event) {
				console.log(event)
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				for (let i = 0; i < this.listData.length; i++) {
					const result = await this.SetMachineRepairFittings(this.listData[i])
				}
				setTimeout(() => {
					uni.$emit('save', {
						dataList: this.listData
					})
					uni.hideLoading()
					uni.navigateBack()
				}, 2000)
			}
		}
	}
</script>

<style>

</style>
