<template>
	<view>
		<u-cell-item class="detail-head" bg-color="#fff" :title="obj.MCName" :label="obj.costcenterid" :border-bottom="false" :arrow="false">
			<u-tag slot="right-icon" text="待处理"></u-tag>
		</u-cell-item>
		<u-cell-item class="task-tag" bg-color="#fff" :title="obj.InspectionHeadName" :arrow="false">
			<u-tag slot="icon" text="点" border-color="#00C296" bg-color="#00C296" color="#fff" shape="circle"></u-tag>
		</u-cell-item>
		<u-tabs :list="tabList" :is-scroll="false" :current="current" @change="tabChange"></u-tabs>
		<view v-if="current === 0">
			<u-cell-group title="工作对象">
				<u-cell-item icon="setting" :title="obj.MachineName" :border-bottom="false"></u-cell-item>
				<u-cell-item icon="map" :title="obj.areaid"></u-cell-item>
			</u-cell-group>
			<u-cell-group title="任务描述">
				<u-cell-item :title="obj.InspectionHeadName" :border-bottom="false" :arrow="false"></u-cell-item>
			</u-cell-group>
			<u-cell-group title="工作计划(暂定)">
				<u-cell-item title="2022-07-18（5天后）" label="00：00" :border-bottom="false" :arrow="false">
					<view>
						2022-07-18（5天后）
					</view>
				</u-cell-item>
			</u-cell-group>
			<u-row gutter="16" justify="center">
				<u-col span="9">
					<view class="btn-fill df-ac-jc" style="margin: 88rpx 0;" @click="utils.to_url('/pages/task/start')">
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
				<u-cell-item class="cx-cell-item" title="指示灯准备运行前观察指示灯所亮颜色1. 红色为故障停机， 2. 黄色为测试中，3. 绿色为自主运行" :arrow="false">
					<u-tag slot="icon" text="1" mode="plain" border-color="#DCDCDC" color="#000" shape="circle"></u-tag>
					<view slot="right-icon" class="df">
						<u-icon size="50" name="checkmark-circle"></u-icon>
						<u-icon size="50" name="close-circle"></u-icon>
						<u-icon size="50" name="more-circle"></u-icon>
					</view>
				</u-cell-item>
				<u-cell-item class="cx-cell-item" title="工作台面检查工作台面整洁度和器具是否摆放整齐" :arrow="false">
					<u-tag slot="icon" text="2" mode="plain" border-color="#DCDCDC" color="#000" shape="circle"></u-tag>
					<view slot="right-icon" class="df">
						<u-icon size="50" name="checkmark-circle"></u-icon>
						<u-icon size="50" name="close-circle"></u-icon>
						<u-icon size="50" name="more-circle"></u-icon>
					</view>
				</u-cell-item>
				<u-cell-item class="cx-cell-item" style="margin-bottom: 64rpx;" title="导丝折弯刀内孔无异物，导槽内无异物脏污" :arrow="false">
					<u-tag slot="icon" text="3" mode="plain" border-color="#DCDCDC" color="#000" shape="circle"></u-tag>
					<view slot="right-icon" class="df">
						<u-icon size="50" name="checkmark-circle"></u-icon>
						<u-icon size="50" name="close-circle"></u-icon>
						<u-icon size="50" name="more-circle"></u-icon>
					</view>
				</u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
import { SubmitInspectionStart, ShowInspectionHeadAssMachine } from './api';
	export default {
		data() {
			return {
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
				obj: {},// 上个界面传过来的对象
			}
		},
		onLoad(res){
			this.obj = JSON.parse(res.op)
			// this.getDetail()
			ShowInspectionHeadAssMachine({
				InspectionHeadGuid: this.obj.InspectionHeadGuid
			})
		},
		methods: {
			// 
			getDetail(){
				SubmitInspectionStart({
					OrderNo: this.obj.orderNo,
				}).then((res) => {
					console.log(res.data);
				})
			},
			tabChange(index) {
				this.current = index;
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #F8F8F8;
	}
	
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
</style>
