<template>
	<view>
		<u-navbar 
		 back-icon-color="#FFFFFF" 
		 :back-text-style="{ color: '#FFFFFF' }" 
		 back-text="返回" 
		 :background="{ backgroundColor: '#0066cb' }"></u-navbar>
		<u-cell-item class="detail-head" bg-color="#fff" :title="item.MTName" :label="item.MTGuid" :border-bottom="false" :arrow="false">
		
			<u-tag style="padding: 5rpx 5rpx;" slot="right-icon" text="待处理"></u-tag>
		</u-cell-item>
		
		<u-cell-item class="task-tag" bg-color="#fff" title="保养" :arrow="false">
			<u-tag slot="icon" text="保" border-color="#ffaa00" bg-color="#ffaa00" color="#fff" shape="circle"></u-tag>
		</u-cell-item>
		<u-tabs :list="tabList" :is-scroll="false" :current="current" @change="tabChange"></u-tabs>
		<view v-if="current === 0">
			<u-cell-group title="工作对象">
				<u-cell-item icon="setting" :title="item.MCName" :border-bottom="false"></u-cell-item>
				<u-cell-item icon="map" :title="item.areaid"></u-cell-item>
			</u-cell-group>
			<u-cell-group title="任务描述">
				<u-cell-item  :border-bottom="false" :arrow="false">
					<u-read-more :toggle="true"  :shadow-style="shadowStyle" :show-height="200">
					<rich-text :nodes="item.mark"></rich-text>
					</u-read-more>
				</u-cell-item>
			</u-cell-group>
			<u-cell-group title="工作计划(暂定)">
				<u-cell-item :title="item.UpdateTime"   :border-bottom="false" :arrow="false">
					 
				</u-cell-item>
			</u-cell-group>
			<u-row gutter="5" justify="center">
				<u-col span="9">
					<view class="btn-fill df-ac-jc" style="margin: 88rpx 0;" @click="clickScan">
						<u-icon name="play-right-fill" color="#fff" label="开始当前任务" label-color="#fff"></u-icon>
					</view>
				</u-col>
			</u-row>
			<u-row  justify="center">
				<u-col span="9">
					<view   @click="utils.to_url('/pages/task/start')">
						<u-button type="primary" :plain="true"  >改派工单</u-button>
					</view>
				</u-col>
			</u-row>
		</view>
		
		<view v-if="current === 1">
			<u-cell-group title="预留单">
				<!-- 无订单号时的界面 -->
				<template v-if="orderNums == 0">
					<u-row gutter="16" justify="center">
						<u-col span="12" text-align="center" style="margin-top: 25rpx;background-color: antiquewhite;">
						 暂无物料需求
						</u-col>
					</u-row>
					<u-row gutter="16" justify="center">
						<u-col span="8.5">
							<u-button :custom-style="customStyle" plain @tap="toAddMaterial">添加物料需求</u-button>
						</u-col>
					</u-row>
				</template> 
				<!-- 有订单号时的界面 -->
				<template v-else>
				<!-- 单号列表 -->
					<view class="order_list1">
						<view class="list_item" 
						 v-for="(item,index) in order_list1"
						 :key="index"
						 @click="toManage(item.status,item.orderNo)">
							<view class="list_item_l">
								<view class="img">
									<image 
									src="../../static/add/icon_component.png" 
									mode="widthFix"></image>
								</view>
								<view class="title">单号：</view>
								<view class="bh">{{item.orderNo}}</view>
							</view>
							<view class="list_item_r">
								<view class="status">{{ item.status }}</view>
								<view class="img">
									<image 
									src="../../static/add/detail_icon_chevron_more.png" 
									mode="widthFix"></image>
								</view>
							</view>
						</view>
					</view>
				</template>
			</u-cell-group>
	<!-- 退料单 -->
			<template v-if="orderNums>0">
				<u-cell-group title="">
						<!-- 单号列表 -->
						<!-- <view class="order_list1">
							<view class="list_item" v-for="(item,index) in order_list2">
								<view class="list_item_l">
									<view class="img">
										<image 
										src="../../static/add/icon_component.png" 
										mode="widthFix"></image>
									</view>
									<view class="title">单号：</view>
									<view class="bh">{{item.orderNum}}</view>
								</view>
								<view class="list_item_r">
									<view class="status">{{item.status==0?'已退料':'待退料'}}</view>
									<view class="img">
										<image 
										src="../../static/add/detail_icon_chevron_more.png" 
										mode="widthFix"></image>
									</view>
								</view>
							</view>
						</view> -->
						<!-- 已经到底了 -->
						<u-divider bgColor="#f5f5f5">已经到底了</u-divider>
						<!-- 占位 -->
						<view class="zhanWei_height"></view>
					<!-- 底部按钮 -->
						<view class="footerBtns">
							<u-row gutter="16" justify="center" style="padding: 20rpx 0;">
								<u-col span="0.5">
									<view class="demo-layout bg-purple"></view>
								</u-col>
								<u-col span="5.5">
									<view class="demo-layout bg-purple-light">
										<u-button plain ripple type="primary" class="btn_l" @click="toAdd">
											<view class="btn_l_jia">+</view>
											<view class="">添加物料</view>
										</u-button>
									</view>
								</u-col>
								<!-- <u-col span="5.5">
									<view class="demo-layout bg-purple-light">
										<u-button type="error" ripple @click="toReturn">退料</u-button>
									</view>
								</u-col> -->
								<u-col span="0.5">
									<view class="demo-layout bg-purple-light"></view>
								</u-col>
							</u-row>
						</view>
				</u-cell-group>
			</template>
		</view>
	<!-- 人员 -->
		<view v-if="current === 2">
			<u-cell-group title="参与人员">
				<template v-if="list_persons.length==0">
					<u-row gutter="16">
						<u-col span="12" text-align="center">
							<view>暂无相关内容</view>
						</u-col>
					</u-row>
				</template>
				<template else>
					<u-row gutter="16" justify="start">
						<u-col span="4" v-for="(item,index) in list_persons" style="margin-top: 20rpx;">
							<view style="display: flex;flex-direction: row;padding-left: 50rpx;">
								<view class="img_icon">
									<u-image width="38rpx" height="38rpx" src="../../static/add/icon_people.png"></u-image>
								</view>
								<view class="username">{{item.UserName}}</view>
							</view>
						</u-col>
					</u-row>
				</template>
				<u-row gutter="16" justify="center">
					<u-col span="8.5">
						<u-button :custom-style="customStyle" plain @tap="toAddPersons">添加参与人员</u-button>
					</u-col>
				</u-row>
			</u-cell-group>
			 
		</view>
	</view>
</template>

<script>
	import {GetFittingUseOrderMain,GetWorkUser} from "./api"
	export default {
		data() {
			return {
				shadowStyle: { },
				list_persons:[{
					name: '诸葛小小'
				},{
					name: '诸葛小小'
				},{
					name: '诸葛小小'
				},{
					name: '诸葛小小'
				},{
					name: '诸葛小小'
				}],
				order_list1: [
					{
						orderNum: 'BY202207011613',
						status: 1
					},
					{
						orderNum: 'BY202207181145',
						status: 2
					},
					{
						orderNum: 'BY202207011613',
						status: 3
					}
				],//领用单
				order_list2: [
					{
						orderNum: 'T202207011613',
						status: 0
					},
					{
						orderNum: 'T202207181145',
						status: 1
					},
				],//退料单
				orderNums: 1,//预留单数量
				item:{
					nextday: '2022-07-18'
				},//保养基本信息
				customStyle: {
					color: '#0066CB',
					margin: '44rpx 0'
				},
				current: 0,
				tabList: [{
					name: '基本'
				}, {
					name: '物品',
				},{
					name: '人工',
				}]
			}
		},
		onLoad(e) {
			this.item=JSON.parse(decodeURIComponent(e.item))
			this.getMaterial()
			this.getWorkUser()
			console.log(this.item);	
		},
		onShow() {
			this.getWorkUser()
			this.getMaterial()
		},
		methods: {
			//查询物料清单
			getMaterial(){
				GetFittingUseOrderMain({
					FatherOrderNo:this.item.orderNo, 
				}).then(res=>{
					this.order_list1=res.data.data
				})
			},
			//查询已经添加的人员
			getWorkUser(){
				 
				GetWorkUser({
					orderNo	:this.item.orderNo,			
					Type:"维修单"
				}).then(res=>{
					this.list_persons=res.data.data
					// this.setRole();
				})
			},
			// 添加物料
			toAdd(){
				uni.navigateTo({
					url:"./addMaterial?item="+encodeURIComponent(this.item)
				});
			},
			// 退料
			toReturn(){
				uni.navigateTo({
					url: 'return_material'
				})
			},
			// 管理物料	1-已领用，2-待领用，3-待审批
			toManage(sta,orderNo){
					// console.log(`已领用,单号为：${orderNum}`);
				uni.navigateTo({
					url: './material_manage?orderNo=' + orderNo
				});
			},
			//拍照
			clickScan(){
				
			},
			//添加物料
			toAddMaterial(){
				// uni.navigateTo({
				// 	url:"./addMaterial?op="+23
				// })
				console.log(this.item);
			},
			// 
			toAddPersons(){
				uni.navigateTo({
					url:'./addPersions?item=' + encodeURIComponent(JSON.stringify(this.item))
				})
			},
			tabChange(index) {
				this.current = index;
			},
		}
	}
</script>

<style lang="scss" scoped>
.footerBtns{
	position: fixed;
	bottom: 0;
	background-color: #ffffff;
	width: 100vw;
	height: 120rpx;
	border-top: 1rpx solid #cccccc;
	font-weight: 800;
	letter-spacing: 3rpx;
	.btn_l{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		.btn_l_jia{
			margin-right: 15rpx;
			font-size: 40rpx;
			margin-bottom: 5rpx;
		}
	}
	.btn_l_jia{
		margin-right: 15rpx;
		font-size: 40rpx;
	}
}
.zhanWei_height{
	height: 200rpx;
	background-color: #F8F8F8;
}
.order_list1{
	box-sizing: border-box;
	padding: 30rpx;
	.list_item{
		background-color: #E5EFFA;
		padding: 10rpx;
		// border: 1rpx solid red;
		height: 100rpx;
		margin-bottom: 20rpx;
		border-radius: 10rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #000000;
		.list_item_l{
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			.img{
				margin-right: 15rpx;
				image{
					width: 38rpx;
					height: 38rpx;
				}
			}
		}
		.list_item_r{
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			.img{
				margin-left: 15rpx;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				image{
					width: 20rpx;
					height: 40rpx;
					display: inline-block;
				}
			}
		}
	}
}
	page {
		background-color: #F8F8F8;
	}
	
	.btn-fill {
		background-color: #0066CB;
		height: 88rpx;
		border-radius: 12rpx;
	}
	
	.username{
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #000000;
		line-height: 50rpx;
		margin-left: 20rpx;
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
