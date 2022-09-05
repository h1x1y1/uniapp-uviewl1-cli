<template>
	<view>
		<u-tabs :list="tabList" :is-scroll="false" bgColor="#3a74c5" activeColor="#fff" inactiveColor="#8AC3EA" :current="current"
			@change="tabChange"></u-tabs>
		<view v-if="current === 0">
			<scroll-view class="scroll-list msg-list-item" scroll-y="true">
				<u-card :border="false" padding="30" margin="30rpx" v-for="(item,index) in listData" :key="index">
					<view slot="head" class="df-ac-js">
						<view class="df-ac">
							<u-tag text="点" border-color="#00C396" bg-color="#00C396" color="#fff" shape="circle"></u-tag>
							<view class="head-title">客梯日常保养</view>
						</view>
						<u-tag text="待处理" mode="dark" bg-color="#F6FFED" color="#52C41A"></u-tag>
					</view>
					<view slot="body">
						<u-row gutter="16">
							<u-col span="12">
								<view class="apply-text"><span>点检单号：</span>{{item.orderNo}}</view>
							</u-col>
							<u-col span="12">
								<view class="apply-text"><span>任务描述：</span>{{item.InspectionHeadName}}</view>
							</u-col>
							<u-col span="12">
								<view class="apply-text"><span>任务日期：</span>2021年10月27日14:30</view>
							</u-col>
							<u-col span="12">
								<view class="apply-text"><span>任务地址：</span>{{item.areaid}}</view>
							</u-col>
						</u-row>
					</view>
					<view slot="foot">
						<u-row gutter="16">
							<u-col span="9">
								<view style="color: #FF4D4F;">任务超时 1 天，请尽快处理</view>
							</u-col>
							<u-col span="3" text-align="right">
								<u-button type="primary" size="mini" :plain="true" @tap="toDetail(item)">查看详细</u-button>
							</u-col>
						</u-row>
					</view>
				</u-card>
				
				<u-divider bgColor="#f5f5f5">已经到底了</u-divider>
			</scroll-view>
		</view>
		<view class="mid-btn" @tap="utils.to_switch_tab('/pages/new/new')"></view>
	</view>
</template>

<script>
import { GetMachineInspection } from './api';
	export default {
		data() {
			return {
				current: 0,
				tabList: [{
					name: '所有任务'
				}, {
					name: '我的任务',
				}],
				listData: [],// 列表数据
			}
		},
		onLoad() {
			this.getList()
		},
		methods: {
			// 获取点检列表
			getList(){
				GetMachineInspection({
					UserGuid: uni.getStorageSync('userInfo').UserGuid,// 登录人
					McGuid: '',// 设备类型
					MachineGuid: '',// 设备
					QueryNote: '',// 模糊搜索内容
				}).then((res) => {
					this.listData = res.data.data
				})
			},
			//详情页
			toDetail(item) {
				uni.navigateTo({
					url:`./detail?op=${encodeURIComponent(JSON.stringify(item))}`
				})
			},
			tabChange(index) {
				this.current = index;
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F8F8F8;
	}
	
	.scroll-list {
		height: calc(100vh - var(--window-top) - var(--window-bottom) - 105rpx); // 105rpx 为 .search 的高度
		width: 100%;

		.loadmore {
			padding: 30rpx;
		}
	}

	.apply-text {
		font-size: 28rpx;
		color: #333333;

		span {
			color: #999999;
		}
	}

	.user-images {
		width: 28px;
		height: 28px;
		margin-right: 8px;
	}
</style>
