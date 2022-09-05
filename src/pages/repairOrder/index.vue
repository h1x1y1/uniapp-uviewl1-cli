<template>
	<view>
		<view 
		v-show="showLoading" 
		style="display: flex;margin-top: 10rpx;flex-direction: column;justify-content: center;align-items: center;">
		    <u-loading mode="circle" size="50" color="#55aaff" ></u-loading>
			<view>加载中....</view>
		</view>
		<view v-if="listData.length>0">
				<u-row justify="center" v-for="(item, index) in list" :key="index" >
					<u-col span="11">
						<u-card :border="false" padding="20" margin="30rpx">
							<view slot="head" class="df-ac-js">
								<view class="df-ac">
									<u-tag text="修" border-color="#0379FF" bg-color="#0379FF" color="#fff"
										shape="circle"></u-tag>
									<view class="head-title " > {{item.CreateTime}}</view>
								</view>
								<u-tag text="待处理" mode="dark" bg-color="#F6FFED" color="#52C41A"></u-tag>
							</view>
							<view slot="body">
								<u-row gutter="16">
									<u-col span="12">
										<view class="apply-text"><span>描述：</span>{{item.CreateNote}}</view>
									</u-col>
									<u-col span="12">
										<view class="apply-text"><span>设备名称：</span>{{item.MachineName}} </view>
									</u-col>
							 
								</u-row>
							</view>
							<view slot="foot">
								<u-row gutter="16">
									<u-col span="9">
										<view style="color: #0066CB;font-weight: bold;">维修人：{{item.UserName}}</view>
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
				<u-divider v-if="listData.length > 0" bgColor="#F8F8F8">{{loadingText}}</u-divider>
				<view class="zhanWei_h"></view>
		</view>
		<view v-else>
			<text>暂无数据</text>
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
				QueryNote:'',
				loadingText: '上拉加载更多',
				showLoading: false,
				allCheck:false,//全选
				listData:[] ,//任务清单
				list: [],
				scrollTop: 0,
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onReachBottom() {
		    if (this.listData.length>=5) {
		        let temp = this.listData.splice(0,4)
		        for (let i = 0; i < temp.length; i++) {
		            this.list.push(temp[i])
		        }
		    }else if(this.listData.length>0){
		        let temp = this.listData.splice(0,this.listData.length-1)
		        for (let i = 0; i < temp.length; i++) {
		            this.list.push(temp[i])
		        }
		        this.loadingText = '没有更多内容了'
		    }
		    console.log(this.listData.length);
		    console.log('触底加载')
		},
		   onNavigationBarSearchInputChanged (val) {
		            this.searchText=val
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
				this.showLoading = true
				GetOrderReport({
					UserGuid:uni.getStorageSync('userInfo').UserGuid,	
					QueryNote:this.QueryNote,
					Type:"维修单",
					UserType:'2',
					Astatus: '0'
				}).then(res=>{ 
				this.showLoading = false
				this.listData = res.data.data
				if (res.data.data.length<5) {
					this.list = this.listData
					return
				}
				this.list = this.listData.splice(0,4)
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
.zhanWei_h{
	height: 250rpx;
}

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
