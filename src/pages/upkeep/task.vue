<template>
	<view>
		<view>
				<u-row justify="center" v-for="(item, index) in list" :key="index" >
					<u-col span="1">
						<view style = "margin-left: 10px;">
							<u-checkbox
							 @change="checkboxChange" 
							v-model="item.checked"  
							:name="item.orderno"></u-checkbox
							> 
						</view>
					</u-col>
					<u-col span="11">
						<u-card :border="false" padding="20" margin="30rpx">
							<view slot="head" class="df-ac-js">
								<view class="df-ac">
									<u-tag text="保" border-color="#ffaa00" bg-color="#ffaa00" color="#fff"
										shape="circle"></u-tag>
									<view class="head-title " > {{item.MTName}}</view>
								</view>
								<u-tag text="待处理" mode="dark" bg-color="#F6FFED" color="#52C41A"></u-tag>
							</view>
							<view slot="body">
								<u-row gutter="16">
									<u-col span="12">
										<view class="apply-text"><span>保养项目名称：</span>{{item.MTName}}</view>
									</u-col>
									<u-col span="12">
										<view class="apply-text"><span>保养说明：</span>{{item.mark}} </view>
									</u-col>
									<u-col span="12">
										<view class="apply-text"><span>保养计划时间：</span>{{item.nextday}} </view>
									</u-col>
									<u-col span="12">
										<view class="apply-text"><span>任务地址：</span>{{item.areaid}} </view>
									</u-col>
									<u-col span="12">
										<view class="apply-text"><span>成本中心编号：</span>{{item.costcenterid}} </view>
									</u-col>
								</u-row>
							</view>
							<view slot="foot">
								<u-row gutter="16">
									<u-col span="9">
										<view style="color: #FF4D4F;">{{item.uuserName}}</view>
									</u-col>
									<u-col span="3" text-align="right">
										<u-button type="primary" size="mini" :plain="true" @tap="toDetail(item)">查看详细
										</u-button>
									</u-col>
								</u-row>
							</view>
						</u-card>
					</u-col>

				</u-row>
				
				<u-divider v-if="list.length > 0" bgColor="#F8F8F8">{{loadingText}}</u-divider>
				<view class="zhanWei_h"></view>


		</view>
		<!-- 底部多选 -->
		<view style="position: fixed;bottom: 0;width: 100vw;z-index: 1000;">
			<u-row style="background-color: white;">
				<u-col span="9">
					<u-checkbox  v-model="allCheck"  style="margin: 5px;margin-left: 10px;" @change="checkboxChangeAll">全选</u-checkbox>
				</u-col>
				<u-col span="3" text-align="right">
					<u-button type="primary" size="mini" style="margin: 14px;margin-right: 20px;font-size: 16px;" @tap="clickChangePersion">改派
					</u-button>
				</u-col>
			</u-row>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		GetMachineMaintain
	} from './api/index.js'
	export default {
		data() {
			return {
				allCheck:false,//全选
				listData:[] ,//任务清单
				list: [],
				loadingText: '上拉加载更多'
			}
		},
		onNavigationBarButtonTap(e) {
		    if (e.index == 0) {
		        uni.navigateBack({
		            delta: 1
		        })
		    }
		},
		onReachBottom() {
			if (this.listData.length>5) {
				let temp = this.listData.splice(0,4)
				for (let i = 0; i < temp.length; i++) {
					this.list.push(temp[i])
				}
			}else if(this.listData.length>0){
				let temp = this.listData.splice(0,this.list.length-1)
				for (let i = 0; i < temp.length; i++) {
					this.list.push(temp[i])
				}
				this.loadingText = '没有更多内容了'
			}
			console.log('触底加载')
		},
		onLoad() {
			this.loadingText = ''
			uni.showLoading({
				title: '正在加载...'
			})
			this.httpUpKeepList()
			
		},
		methods: {
			//改派
			clickChangePersion(){
				console.log(this.list);
				// debugger
				let McGuid=""
				let MTASSMCGuid = ''
				let MachineGuid = ''
				if (this.allCheck) {
					this.list.map(item=>{
						if(item.checked){
							McGuid=item.McGuid
							MTASSMCGuid = item.MTASSMachineGuid,
							MachineGuid = item.MachineGuid
						}
					})
					
					uni.navigateTo({
						url:"./searchPersion?McGuid="+McGuid + '&MTASSMCGuid=' + MTASSMCGuid + '&MachineGuid=' + MachineGuid
					})
					return
				}
				uni.showToast({
					title:"请选择保养项目",
					duration:500
				})
				
			},
			//全选
			checkboxChangeAll(e){
				console.log(`牛啊牛啊${JSON.stringify(e)}`);
				this.list.map((item) => {
					item.checked = e.value
				}) 
			},
			// 单选
			checkboxChange(e){
				if(e.value){
					// 保存数据
					
				}				
			},
			//获取保养任务
			httpUpKeepList() {
				GetMachineMaintain({ 
					McGuid:"", 
					MachineGuid:"", 
					QueryNote: '',
					UserGuid:uni.getStorageSync('userInfo').UserGuid,
				}).then((res) => {
					uni.hideLoading()
					res.data.data.map((item) => {
						item.checked = false
					})
					const LEN = res.data.data.length
					if (LEN<=4) {
						this.list = res.data.data
						return
					}
					this.listData = res.data.data
					this.list = this.listData.splice(0,4)
					this.$refs.uToast.show({
						title: '加载成功',
						duration: 1000,
						type: 'success',
						icon: false,
					})
				})
			},
			toDetail(e) {
				uni.navigateTo({
					url: './detail?item='+encodeURIComponent(JSON.stringify(e))
				})
			},
			tabChange(index) {
				this.current = index;
			},
		}
	}
</script>

<style lang="scss">
.zhanWei_h{
	height: 350rpx;
}

	page {
		background-color: #F8F8F8;
	}

	.scroll-list {
		height: calc(100vh - var(--window-top) - var(--window-bottom) - 105rpx); // 105rpx 为 .search 的高度
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
