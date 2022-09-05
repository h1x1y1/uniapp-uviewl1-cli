<template>
	<view>
		<u-navbar 
		 back-icon-color="#FFFFFF" 
		 :back-text-style="{ color: '#FFFFFF' }" 
		 back-text="返回" 
		 :background="{ backgroundColor: '#0066cb' }">
			<view class="navbar-right" slot="right">
		        <view class="message-box right-item" style="padding-right: 30rpx;">
					<u-icon 
					 name="scan"
					 color="#FFFFFF"
					 size="40"></u-icon>
				</view>
			</view>
		</u-navbar>
		<u-cell-item class="detail-head" bg-color="#fff" :title="info.InspectionHeadName" :label="info.orderno" :border-bottom="false" :arrow="false">
			<u-tag slot="right-icon" text="待处理" mode="dark" bg-color="#F6FFED" color="#52C41A"></u-tag>
		</u-cell-item>
		<u-cell-item class="task-tag" bg-color="#fff" :title="info.MachineName" :arrow="false">
			<u-tag slot="icon" text="点" size="mini" border-color="#00C296" bg-color="#00C296" color="#fff" shape="circle"></u-tag>
		</u-cell-item>
		<u-tabs :list="tabList" :is-scroll="false" :current="current" @change="tabChange"></u-tabs>
		<view v-if="current === 0">
			<u-cell-group title="工作对象">
				<u-cell-item icon="setting" :title="info.MachineName" :border-bottom="false" :arrow="false" hover-class="none"></u-cell-item>
				<u-cell-item icon="map" :title="info.costcenterid+info.areaid" :arrow="false" hover-class="none"></u-cell-item>
			</u-cell-group>
			<u-cell-group title="任务描述">
				<u-cell-item :title="info.InspectionItemsName" :border-bottom="false" :arrow="false" hover-class="none"></u-cell-item>
			</u-cell-group>
			<u-cell-group title="工作计划(暂定)">
			<!-- 	<u-cell-item :title="info.nextday.slice(0,10)" :label="info.nextday.slice(-8)" :border-bottom="false" :arrow="false" hover-class="none">
					<!-- <view>
						2022-07-18（5天后）
					</view> -->
				</u-cell-item> -->
			</u-cell-group>
			<u-row gutter="16" justify="center">
				<u-col span="9">
					<view class="btn-fill df-ac-jc" style="margin: 88rpx 0;" @click="toStart">
						<u-icon name="play-right-fill" color="#fff" label="开始当前任务" label-color="#fff"></u-icon>
					</view>
				</u-col>
			</u-row>
		</view>
		<view v-if="current === 1">
			<u-cell-group title="共12项内容需要确认，已确认3项">
				<u-row gutter="16" justify="center">
					<u-col span="11.5">
						<u-line-progress style="margin-top: 64rpx;" :percent="30" activeColor="#52C41A" inactive-color="#429DFF" :show-percent="false" height="12"></u-line-progress>
					</u-col>
				</u-row>
				<u-row gutter="16" justify="center">
					<u-col span="11.5">
						<u-button :custom-style="customStyle" plain>查看录入结果</u-button>
					</u-col>
				</u-row>
			</u-cell-group>
			<u-cell-group title="查看任务项">
				<template v-for="(item,index) in listDianJian">
					<u-cell-item class="cx-cell-item" :title="item.InspectionItemsDesc" :arrow="false" hover-class="none">
						<view slot="icon" class="num-tag">{{index + 1}}</view>
					</u-cell-item>
				</template>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	import {
		SubmitInspectionStart,
		GetMachineInspectionItemsAPP
	} from '@/plugin/api'
	export default {
		data() {
			return {
				background: {
					backgroundColor: '#3a74c5'
				},
				customStyle: {
					color: '#3a74c5',
					margin: '44rpx 0'
				},
				current: 0,
				tabList: [{
					name: '基本'
				}, {
					name: '检查项',
				}],
				info: { },
				listDianJian: []
			}
		},
		onLoad(o) {
			this.info = JSON.parse(o.info)
			console.log(this.info);
			// console.log(this.info.MachineName)
			this.getData()
		},
		methods: {
			// 点检项列表
			getData() {
				// debugger
				GetMachineInspectionItemsAPP({ 
					MachineGuid: this.info.MachineGuid, 
					InspectionItemsID:'',
					OrderNo: this.info.orderNo
				}).then((res) => {
					this.listDianJian=res.data.data
				})
			},
			tabChange(index) {
				this.current = index;
			},
			toStart() {
				//开始任务 记录开始时间
				SubmitInspectionStart({
					OrderNo: this.info.orderNo //点检单号
				}).then(({
					data: {
						code,
						data,
						msg
					}
				}) => {
					if (code == 1) { //1成功
						// uni.navigateTo({
						// 	url:'/pages/home/spotCheck/start'
						// })
						// uni.navigateTo({ //跳转扫描 设备页面
						// 	url:'/pages/home/spotCheck/scan?MachineGuid='+this.info.MachineGuid
						// })
						// 没有扫描
						// 跳转到点检项目页面 
						uni.navigateTo({ //跳转扫描 设备页面
							url:'/pages/home/spotCheck/start?item='+encodeURIComponent(JSON.stringify(this.info))
						})
						// uni.navigateTo({ //跳转扫描 设备页面
						// 	url:'/pages/home/spotCheck/QYWXScan?url='++'&MC=''
						// })
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.btn-fill {
		background-color: #3a74c5;
		height: 88rpx;
		border-radius: 12rpx;
	}
	
	.detail-head {
		padding-bottom: 0;
		::v-deep .u-cell_title {
			font-size: 40rpx;
			font-weight: bold;
			color: #000000;
			.u-cell__label {
				font-weight: 500;
			}
		}
	}
	
	.task-tag {
		::v-deep .u-cell_title {
			margin-left: 17rpx;
		}
	}
	
	.u-cell-box {
		background-color: #fff;
		margin-top: 24rpx;
		::v-deep .u-cell-title {
			font-size: 30rpx;
			font-weight: bold;
			color: #000000;
		}
	}
	
	.cx-cell-item {
		::v-deep .u-cell_title {
			margin-left: 20rpx;
		}
	}
	
	.num-tag {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 45rpx;
		height: 45rpx;
		border-radius: 100%;
		border: 1rpx solid #DCDCDC;
	}
</style>
