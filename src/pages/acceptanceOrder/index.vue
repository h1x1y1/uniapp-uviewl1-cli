<template>
	<view>
		<view 
		v-show="showLoading" 
		style="display: flex;margin-top: 10rpx;flex-direction: column;justify-content: center;align-items: center;">
		    <u-loading mode="circle" size="50" color="#55aaff" ></u-loading>
			<view>加载中....</view>
		</view>
		<view>
			<scroll-view class="scroll-list " scroll-y="true" >
				<u-row justify="center" v-for="(item, index) in listData" :key="index" >
					<u-col span="11">
						<u-card :border="false" padding="20" margin="30rpx">
							<view slot="head" class="df-ac-js">
								<view class="df-ac">
									<u-tag text="验" border-color="#0379FF" bg-color="#0379FF" color="#fff"
										shape="circle"></u-tag>
									<view class="head-title " > {{item.MTName}}</view>
								</view>
								<u-tag text="待处理" mode="dark" bg-color="#F6FFED" color="#52C41A"></u-tag>
							</view>
							<view slot="body" @click="toDetail(item)">
								<u-row gutter="16">
									<u-col span="12">
										<view class="apply-text"><span>描述：</span>{{item.MachineName}}</view>
									</u-col>
									<u-col span="12">
										<view class="apply-text"><span>区域：</span>{{item.CostCenterID}} </view>
									</u-col>
							 
								</u-row>
							</view>
							<view slot="foot">
								<u-row gutter="16">
									<u-col span="9">
										<view style="color: #0066CB;font-weight: bold;">{{item.CreateTime}}</view>
									</u-col>
									<u-col span="3" text-align="right">
										<u-button type="primary" size="mini" :plain="true" @click="toDetail(item)">查看详细
										</u-button>
									</u-col>
								</u-row>
							</view>
						</u-card>
					</u-col>
				</u-row>
				<u-divider bgColor="#f5f5f5">已经到底了</u-divider>
			</scroll-view>
		</view>
		<u-back-top :scroll-top="scrollTop"></u-back-top>
	</view>
</template>

<script>
	import {
		GetOrderReport
	} from '@/plugin/api'
	export default {
		data() {
			return {
				showLoading: false,
				allCheck:false,//全选
				listData:[] ,//任务清单
				scrollTop: 0,
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
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
			this.showLoading = true
			this.GetOrderReport()
		},
		methods: {
			//改派
			clickChangePersion(){
				let checked=false				
				let MachineGuid = ""
				let MTASSMCGuid=""
				this.listData.map(item=>{
				if(item.checked){checked=true
				MTASSMCGuid=item.MTASSMCGuid
				MachineGuid=item.MachineGuid
				}
				})
				if(!checked){
					uni.showToast({
						title:"请选择保养项目",
						duration:1000
					})
					return
				}
				uni.navigateTo({
					url:"./searchPersion?MachineGuid="+MachineGuid+"&MTASSMCGuid="+MTASSMCGuid
				})
			},
			//获取保养任务
			GetOrderReport() {
				GetOrderReport({
					UserGuid:uni.getStorageSync('userInfo').UserGuid,	
					QueryNote:"",
					Type:"维修验收单",
					UserType:'2',
					Astatus: '0'
				}).then(res=>{ 
					this.showLoading = false
				 this.listData = res.data.data
				 console.log(this.listData);
				})
			},
			toDetail(item) {
				uni.navigateTo({
					url: './detail?item='+encodeURIComponent(JSON.stringify(item))
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

	.scroll-list {
		height: calc(100vh - 80rpx); // 105rpx 为 .search 的高度
		width:  100%;

		.loadmore {
			padding: 30rpx;
		}
		.head-title {
			margin-left: 20rpx;
			color: #000;
			font-size: 16px;
			font-weight: bold;
			//对于一行文本多余部分用省略号代替，常用下面的方法：
			display: inline-block;
			  white-space: nowrap; 
			  width: 150px;
			  overflow: hidden;
			  text-overflow:ellipsis;

		}
	}

	.apply-text {
		font-size: 28rpx;
		color: #333333;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
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
