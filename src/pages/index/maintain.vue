<!-- 保养 -->
<template>
	<view class="container">
		<view class="flex pl20 pr20">
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
				<view v-for="(item, index) in listData" :key="index" v-if="item.show"
					class="flex flex-col m10 p10 u-border-bottom bg-white" :class="item.empty ? 'bg-green' : 'bg-red'">
					<view class="flex">
						<view class="flex flex-1 flex-col" style="line-height: 2;">
							<text class="fs14 color-waming">保养项目说明：{{item.MaintainItemsDesc}}</text>
							<text class="fs14 color-waming">保养周期：{{item.Freq}}</text>
							<text class="fs14 color-waming">是否改变设备状态：{{item.ChangeStatus || ''}}</text>
							<text class="fs14 color-waming">保养计划时间：
								<text
									:class="new Date(item.NEXTDAY).getTime() < new Date().getTime() ? 'color-red' : 'color-green'">{{item.NEXTDAY || ''}}</text>
							</text>
							<!-- <text class="fs14 color-waming"
								@click="onStartDate(item)">*保养开始时间：{{item.StartDateTime || '请选择'}}</text> -->
							<view class="flex align-items-center pt5 pb5" @click="onStartDate(item)">
								<text class="fs14 color-waming">保养开始时间：</text>
								<view v-if="item.StartDateTime" class="">
									{{item.StartDateTime}}
								</view>
								<view v-else class="" style="color: #999;">
									请选择
								</view>
							</view>
							<!-- <text class="fs14 color-waming"
								@click="onEndDate(item)">*保养结束时间：{{item.EndDateTime || '请选择'}}</text> -->
							<view class="flex align-items-center pt5 pb5" @click="onEndDate(item)">
								<text class="fs14 color-waming">保养结束时间：</text>
								<view v-if="item.EndDateTime" class="">
									{{item.EndDateTime}}
								</view>
								<view v-else class="" style="color: #999;">
									请选择
								</view>
							</view>
							<view class="flex align-items-center pt10 pb10" @click="onResult(item)">
								<text class="fs14 color-waming">保养结果：</text>
								<view v-if="item.Result" class="">
									{{item.Result}}
								</view>
								<view v-else class="" style="color: #999;">
									请填写
								</view>
							</view>
							<!-- <view class="" @click="onMark(item)">
								<text class="fs14 color-waming">备注：{{item.Mark || ''}}</text>
							</view> -->
							<view class="flex align-items-center">
								<text class="fs14 color-waming">备注：</text>
								<view class="flex-1">
									<u-input v-model="item.Mark" type="textarea" :border="true" />
								</view>
								<!-- <view v-if="item.Mark" class="">
									{{item.Mark}}
								</view>
								<view v-else class="" style="color: #999;">
									请填写
								</view> -->
							</view>
						</view>
						<view class="flex align-items-center">
							<!-- <text class="fs14 color-success" style="color: #01D157;">盘点</text> -->
						</view>
					</view>
				</view>
				<cu-empty :pn="current" :ps="size" :total="total" tips="暂无数据" />
			</scroll-view>
		</view>
		<view class="p10">
			<!-- <button type="default">完成保养</button> -->
			<u-button :disabled="!subType" type="primary" @click="onSubmit()">完成保养</u-button>
		</view>
		<!-- 输入内容 -->
		<u-modal v-model="showT" :title="textTitle" @confirm="confirm" ref="uModal" :show-cancel-button="true"
			:async-close="true">
			<view class="p10">
				<u-input v-model="defaText" type="textarea" :border="true" />
			</view>
		</u-modal>
		<!-- 选择时间 -->
		<u-picker v-model="show" mode="time" :default-time="defaTime" :params="params" @confirm="setStartDate">
		</u-picker>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		CheckQRCodeApp,
		GetMachineMaintainItemsAPP,
		SubmitMaintainResult
	} from '@/plugin/api'
	export default {
		data() {
			return {
				MachineGuid: '', // 二维码
				itemMTASSMCGuid: '', // 当前信息
				itemMachineGuid: '', // 当前信息
				show: false,
				showT: false,
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false
				},
				dateType: '',
				defaTime: '', // 默认时间
				textType: '',
				defaText: '',
				textTitle: '',
				listData: [],
				subType: false,
				qr_code: '',
				current: 1, // 页数
				size: 20, // 页条目数
				total: 0, // 总条数
				userInfo: {}
			}
		},
		onShow() {
			console.log(this.$u.timeFormat(new Date().getTime(), 'yyyy/mm/dd MM:ss') + ':00')
		},
		onLoad(options) {
			console.log('onLoad');
			this.token = uni.getStorageSync('token')
			this.userInfo = uni.getStorageSync('userInfo')
			this.init();
		},
		methods: {
			// 页面初始化
			init() {
				// this.getInventoryOrderList();
			},
			// 盘点列表
			GetMachineMaintainItems(MachineGuid) {
				let that = this;
				uni.showLoading({
					title: 'loading...'
				})
				GetMachineMaintainItemsAPP({
					UserGuid: that.userInfo.UserGuid,
					MachineGuid: MachineGuid
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
						that.listData = data.map(item => {
							// if(new Date(item.NEXTDAY).getTime() < new Date().getTime()){
							// 	console.log("红");
							// } else {
							// 	console.log("绿");
							// }
							if (item.ChangeStatus == 'Y') {
								item.StartDateTime = this.$u.timeFormat(new Date().getTime(),
									'yyyy/mm/dd MM:ss') + ':00'
								item.EndDateTime = this.$u.timeFormat(new Date().getTime(),
									'yyyy/mm/dd MM:ss') + ':00'
								item.empty = true
							} else {
								item.StartDateTime = ''
								item.EndDateTime = ''
								item.empty = false
							}
							item.Result = ''
							item.Mark = ''
							item.show = true
							return item
						});
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
				uni.scanCode({
					onlyFromCamera: true,
					success: function(res) {
						uni.showLoading({
							title: 'loading...'
						})
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
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

						CheckQRCodeApp({
							QRCode: newCode,
							InventoryOrder: ''
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
								that.MachineGuid = data[0].MachineGuid
								that.GetMachineMaintainItems(data[0].MachineGuid);
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
				});
			},
			// 打开
			onStartDate(e) {
				// console.log(e);
				this.show = true;
				this.dateType = 'start';
				this.itemMTASSMCGuid = e.MTASSMCGuid;
				this.itemMachineGuid = e.MachineGuid;
				this.defaTime = e.StartDateTime;
			},
			onEndDate(e) {
				// console.log(e);
				this.show = true;
				this.dateType = 'end';
				this.itemMTASSMCGuid = e.MTASSMCGuid;
				this.itemMachineGuid = e.MachineGuid;
				this.defaTime = e.EndDateTime;
			},
			setStartDate(e) {
				console.log(e);
				this.listData.forEach(item => {
					if (item.MTASSMCGuid === this.itemMTASSMCGuid && item.MachineGuid === this.itemMachineGuid) {
						if (this.dateType == 'start') {
							item.StartDateTime = e.year + '/' + e.month + '/' + e.day + ' ' + e.hour + ':' + e
								.minute + ':00'
							if (item.StartDateTime != '' && item.EndDateTime != '') {
								item.empty = true
								this.onSearch()
							} else {
								item.empty = false
							}
						} else {
							item.EndDateTime = e.year + '/' + e.month + '/' + e.day + ' ' + e.hour + ':' + e
								.minute +
								':00'
							if (item.StartDateTime != '' && item.EndDateTime != '') {
								item.empty = true
								this.onSearch()
							} else {
								item.empty = false
							}
						}
					}
				})
			},
			onResult(e) {
				console.log(e);
				this.showT = true;
				this.itemMTASSMCGuid = e.MTASSMCGuid;
				this.itemMachineGuid = e.MachineGuid;
				this.textType = 'Result';
				this.defaText = e.Result;
				this.textTitle = '结果';
			},
			onMark(e) {
				console.log(e);
				this.showT = true;
				this.itemMTASSMCGuid = e.MTASSMCGuid;
				this.itemMachineGuid = e.MachineGuid;
				this.textType = 'Mark';
				this.defaText = e.Mark;
				this.textTitle = '备注';
			},
			confirm(e) {
				this.listData.forEach(item => {
					if (item.MTASSMCGuid === this.itemMTASSMCGuid && item.MachineGuid === this.itemMachineGuid) {
						if (this.textType == 'Result') {
							item.Result = this.defaText
						} else {
							item.Mark = this.defaText
						}
					}
				})
				this.showT = false;
			},
			onSearch() {
				let subType = true;
				this.listData.forEach(item => {
					if (!item.empty) {
						subType = false;
					}
				})
				this.subType = subType;
			},
			onSubmit() {
				this.listData.forEach(item => {
					console.log(item)
					console.log(this.userInfo)
					const params = {
						...item
					}
					// params.type = params.type === '结果' ? 1 : (params.type === '数值范围' ? 2 : (params.type === '记录' ? 1 : ''))
					params.Freq = params.Freq === '年' ? 1 : (params.Freq === '半年' ? 2 : (params.Freq === '季度' ? 3 :
						(params.Freq === '月' ? 4 : (params.Freq === '周' ? 5 : (params.Freq === '日' ? 6 : (
							params.Freq === '单次' ? 0 : ''))))))
					params.UpdateUserGuid = this.userInfo.UserGuid
					params.ComPanyGuid = this.userInfo.ComPanyGuid
					params.GroupGuid = this.userInfo.GroupGuid
					// 更改状态
					SubmitMaintainResult(params)
						.then(res => {
							console.log(res.data)
							item.show = false
							item.empty = false
							this.subType = false;
						})
				})
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

	.bg-red {
		border: 1px solid red !important;
	}

	.bg-green {
		border: 1px solid green !important;
	}

	.color-red {
		color: red;
	}

	.color-green {
		color: green;
	}
</style>
