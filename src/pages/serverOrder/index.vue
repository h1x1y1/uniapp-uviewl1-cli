<template>
	<view>
			<u-card :border="false" padding="30" margin="30rpx" v-for="(item,index) in list2" :key="index">
				<view slot="head" class="df-ac-js">
					<view class="df-ac">
						<u-tag text="问" size="mini" border-color="#00C396" bg-color="#00C396" color="#fff" shape="circle"></u-tag>
						<view class="head-title">{{item.InspectionItemsID}}</view>
					</view>
					<u-tag :text="item.Astatus" mode="dark" bg-color="#F6FFED" color="#52C41A"></u-tag>
				</view>
				<view slot="body">
					<u-row gutter="16">
						<u-col span="12">
							<view class="apply-text"><span>问题描述：</span>{{item.CreateNote}}</view>
						</u-col>
					 
						<u-col span="12">
							<view class="apply-text"><span>设备名称：</span>{{item.MachineName}}</view>
						</u-col> 
					 
					</u-row>
				</view>
				<view slot="foot">
					<u-row gutter="16">
						<u-col span="9">
							<view v-if="dayNum(item.nextday)==0" style="color: #F724F1;">今天的任务，请处理</view>
							<view v-if="dayNum(item.nextday)>0" style="color: #FF4D4F;">任务超时 {{dayNum(item.nextday)}} 天，请尽快处理</view>
							<view v-if="dayNum(item.nextday)<0" style="color: #3a74c5;">距离任务开始还有 {{-dayNum(item.nextday)}} 天</view>
						</u-col>
						<u-col span="3" text-align="right">
							<u-button type="primary" size="mini" :plain="true" @click="utils.to_url('/pages/question/detial?item='+JSON.stringify(item))">查看详细</u-button>
						</u-col>
					</u-row>
				</view>
			</u-card>
			<u-divider v-if="list.length > 0" bgColor="#F8F8F8">{{loadingText}}</u-divider>
		<view class="zhanWei_h"></view>
		<u-back-top :scroll-top="scrollTop"></u-back-top>
	</view>
</template>

<script> 
	import { GetOrderReport } from './api';
	export default {
		data() {
			return {
				loadingText: '上拉加载更多',
				scrollTop: 0,
				userInfo: {}, //用户信息
				background: {
					backgroundColor: '#3a74c5'
				},
				actionStyle: {
					color: '#fff'
				},
				keyword: '',
				list: [],//任务表
				list2: []
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onReachBottom() {
			if (this.list.length>=5) {
				let temp = this.list.splice(0,4)
				for (let i = 0; i < temp.length; i++) {
					this.list2.push(temp[i])
				}
			}else if(this.list.length>0){
				let temp = this.list.splice(0,this.list.length-1)
				for (let i = 0; i < temp.length; i++) {
					this.list2.push(temp[i])
				}
				this.loadingText = '没有更多内容了'
			}
			console.log(this.list.length);
			console.log('触底加载')
		},
		onNavigationBarButtonTap(e) {
			switch (e.index){
				case 0:
					// 返回
					uni.reLaunch({
						url: '/pages/home/home'
					})
					break;
				case 1:
					// 扫码
					// dosomething
					break;
				case 2:
					// 搜索
					uni.showLoading({
						title: '搜索中...'
					})
					setTimeout(() => {
						uni.hideLoading()
					},1000)
					break;
				default:
					break;
			}
		},
		onLoad() {
			this.userInfo = uni.getStorageSync('userInfo')
			this.getQuetion()
		},
		methods: {
			// 获取问题单清单
			getQuetion(){
				GetOrderReport({
					UserGuid:uni.getStorageSync('userInfo').UserGuid,	
					QueryNote:"",
					Type:"问题提报单",
					UserType:'0',
					Astatus: '0'
				}).then(res=>{
					this.list = res.data.data
					if (res.data.data.length<5) {
						this.list2 = this.list
						return
					}
					this.list2 = this.list.splice(0,4)
					console.log(this.list);
				})
			},
			
			dayNum(time) {
				var days = new Date().getTime() - new Date(time).getTime()
				return parseInt(days / (1000 * 60 * 60 * 24))
			},
			//获取点检项目
			getMachineInspection() {
				GetMachineInspection({
					UserGuid: this.userInfo.UserGuid,
					McGuid: '',
					MachineGuid: '',
					QueryNote: ''
				}).then(({
					data: {
						code,
						data,
						msg
					}
				})=>{
					if(code==1) {
						this.list = data.slice(0,20)
					}
				})
			},
			search() {
			}
		}
	}
</script>

<style lang="scss" scoped>
.zhanWei_h{
	height: 250rpx;
}
	.spot-check-scroll {
		// height: calc(100vh - var(--window-top) - var(--window-bottom) - 242rpx);
		width: 100%;

		.head-title {
			margin-left: 20rpx;
			color: #000;
			font-size: 18px;
			font-weight: bold;
			//对于一行文本多余部分用省略号代替，常用下面的方法：
			text-overflow: ellipsis;
			overflow: hidden;
			white-space:nowrap;
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
