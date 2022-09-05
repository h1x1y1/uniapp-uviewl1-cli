<template>
	<view>
		<!-- <u-navbar back-icon-color="#fff" title="点检任务" title-color="#fff" :background="background" :border-bottom="false">
			<u-icon slot="right" name="scan" color="#fff" size="40" style="margin-right: 37rpx;" @tap="QYWXScan"></u-icon>
		</u-navbar>
		<u-row gutter="16" justify="center" style="background: #3a74c5;">
			<u-col span="11">
				<u-search shape="square" bg-color="#fff" placeholder="输入设备名称/设备点检名称搜索" :action-style="actionStyle" v-model="keyword" style="margin: 48rpx 0 30rpx 0;" @search="search" @custom="search"></u-search>
			</u-col>
		</u-row> -->
			<u-card :border="false" padding="30" margin="30rpx" v-for="(item, index) in list" :key="index">
				<view slot="head" class="df-ac-js">
					<view class="df-ac">
						<u-tag text="点" size="mini" border-color="#00C396" bg-color="#00C396" color="#fff" shape="circle"></u-tag>
						<view class="head-title">{{ item.InspectionItemsID }}</view>
					</view>
					<u-tag text="待处理" mode="dark" bg-color="#F6FFED" color="#52C41A"></u-tag>
				</view>
				<view slot="body">
					<u-row gutter="16">
						<u-col span="12">
							<view class="apply-text">
								<span>点检单号：</span>
								{{ item.orderNo }}
							</view>
						</u-col>
						<u-col span="12">
							<view class="apply-text">
								<span>任务描述：</span>
								{{ item.InspectionHeadName }}
							</view>
						</u-col>
						<u-col span="12">
							<view class="apply-text">
								<span>设备名称：</span>
								{{ item.MachineName }}
							</view>
						</u-col>
						<u-col span="12">
							<view class="apply-text">
								<span>任务日期：</span>
								{{ item.nextday }}
							</view>
						</u-col>
						<u-col span="12">
							<view class="apply-text">
								<span>任务地址：</span>
								{{ item.costcenterid }}{{ item.areaid }}
							</view>
						</u-col>
					</u-row>
				</view>
				<view slot="foot">
					<u-row gutter="16">
						<u-col span="9">
							<view v-if="dayNum(item.nextday) == 0" style="color: #F724F1;">今天的任务，请处理</view>
							<view v-if="dayNum(item.nextday) > 0" style="color: #FF4D4F;">任务超时 {{ dayNum(item.nextday) }} 天，请尽快处理</view>
							<view v-if="dayNum(item.nextday) < 0" style="color: #3a74c5;">距离任务开始还有 {{ -dayNum(item.nextday) }} 天</view>
						</u-col>
						<u-col span="3" text-align="right">
							<u-button type="primary" size="mini" :plain="true" @click="utils.to_url('/pages/home/spotCheck/detail?info=' + JSON.stringify(item))">
								查看详细
							</u-button>
						</u-col>
					</u-row>
				</view>
			</u-card>
			<template v-if="list.length !== 0">
				<u-divider bgColor="#F8F8F8">已经到底了</u-divider>
			</template>
	</view>
</template>

<script>
import { GetMachineInspection } from '@/plugin/api';
export default {
	data() {
		return {
			userInfo: {}, //用户信息
			background: {
				backgroundColor: '#3a74c5'
			},
			actionStyle: {
				color: '#fff'
			},
			keyword: '',
			list: [], //点检任务表
		};
	},
	onLoad() {
		this.userInfo = uni.getStorageSync('userInfo');
		// this.userInfo = {
		// 	UserGuid: '1'
		// }
		uni.showLoading({
			title: '加载中...'
		})
		this.getMachineInspection();
	},
	onNavigationBarButtonTap(e) {
		switch (e.index) {
			case 0:
				console.log(`返回`);
				uni.navigateBack({
					delta: 1
				})
				break;
			case 1: 
				console.log(`扫描`);
				this.QYWXScan();

				break;
			case 2: 
				console.log(`搜索`);
				this.search();
				break;
			default:
				console.log(`搜索`);
				this.search();
				break;
		}
	},
	onNavigationBarSearchInputChanged(e) {
		console.log(`${e.text}`);
	},
	methods: {
		//企业微信扫描

		QYWXScan() {
			var uri = escape('/pages/home/spotCheck/start?item=');
			uni.navigateTo({
				//跳转扫描 设备页面
				url: '/pages/home/spotCheck/QYWXScan?MC=CX12BZC001&url=' + uri
			});
		},
		dayNum(time) {
			var days = new Date().getTime() - new Date(time).getTime();
			return parseInt(days / (1000 * 60 * 60 * 24));
		},
		//获取点检项目
		getMachineInspection() {
			GetMachineInspection({
				UserGuid: this.userInfo.UserGuid,
				McGuid: '',
				MachineGuid: '',
				QueryNote: ''
			}).then(({ data: { code, data, msg } }) => {
				setTimeout(()=>{
					uni.hideLoading()
				},500)
				if (code == 1) {
					this.list = data.slice(0, 20);
				}
			});
		},
		search() {
			GetMachineInspection({
				UserGuid: this.userInfo.UserGuid,
				McGuid: '',
				MachineGuid: '',
				QueryNote: this.keyword
			}).then(({ data: { code, data, msg } }) => {
				setTimeout(()=>{
					uni.hideLoading()
				},500)
				if (code == 1) {
					this.list = data;
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.spot-check-scroll {
	height: calc(100vh - var(--window-top) - var(--window-bottom) - 242rpx);
	width: 100%;

	.head-title {
		margin-left: 20rpx;
		color: #000;
		font-size: 18px;
		font-weight: bold;
		//对于一行文本多余部分用省略号代替，常用下面的方法：
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
}

.apply-text {
	font-size: 28rpx;
	color: #333333;
	margin: 5rpx;

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
