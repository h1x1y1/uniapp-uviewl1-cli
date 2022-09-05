<template>
	<view class="manage_bg">
		<u-navbar
			 back-icon-color="#FFFFFF" 
			 :back-text-style="{ color: '#FFFFFF' }" 
			 back-text="返回" 
			 title-size="50"
			 title-color="#FFFFFF"
			 :background="{ backgroundColor: '#0066cb' }">
		</u-navbar>
		<view class="main">
			<view
			 v-for="(item,index) in list_pop" :key="index"
			 class="pop_shop_content">
				<!-- 左侧 -->
				<view class="shop_l">
					<!-- left -->
					<view class="shop_l_img">
						<image 
						src="../../static/add/icon_component.png"
						 mode="widthFix"
						 class="img"></image>
					</view>
					<!-- right -->
					<view class="shop_l-r">
						<view class="text1">{{item.MCName}}</view>
						<view class="text2">{{item.MCID}}</view>
						<view class="text3">单位：{{item.Unit}}</view>
					</view>
				</view>
				<!-- 右侧 -->
				<view class="shop_r">
					<!-- left -->
					<view class="shop_r_l">
						<view class="item" @click="reduceqty(index)">-</view>
						<view class="l2">{{item.OrderQty}}</view>
						<view class="item" @click="addqty(index)">+</view>
					</view>
					<!-- right -->
					<view class="shop_r_r">
						<image 
						src="../../static/add/icon_delete.png" 
						mode="widthFix"
						class="img"
						@click="toDeleteMaterial(index)"></image>
					</view>
				</view>
			</view>
			<u-divider bgColor="#f5f5f5">已经到底了</u-divider>
			<view class="zhanWei_height"></view>
		</view>
		<!-- 页脚 -->
		<view class="footer">
			<u-row gutter="16" justify="center">
				<u-col span="8">
					<view class="btn_bg">
						<u-button type="primary" ripple @click="submit">提交修改</u-button>
					</view>
				</u-col>
			</u-row>
		</view>
		<!-- 提交成功后的跳转 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { CreateFittingsOrder, GetFittingUseOrder,ToItem ,SetFittingUseOrderDetail,DelFittingUseOrderDetail} from './api';
	
	export default {
		data() {
			return {
				orderNo:'',//领料单号
				MCGuid: '',
				list_pop: [ ]
			}
		},
		onLoad(e) {
			console.log(e.orderNo);
			this.orderNo= e.orderNo
			this.getMaterial()
		},
		methods: {
			getMaterial(){
				GetFittingUseOrder({
					orderNo:this.orderNo,
					UserGuid:uni.getStorageSync('userInfo').UserGuid,
					UserType:"2",
					OrderType:"维修领料单"
				}).then(res=>{
					this.list_pop=res.data.data
					
					console.log(this.list_pop);
				})
			},
			// 删除单个物料
			toDeleteMaterial(idx){
				// console.log(this.list_pop[idx]);
				this.list_pop.splice(idx,1)
				DelFittingUseOrderDetail({
					orderNo: this.orderNo,
					MCGuid: this.list_pop[idx].MCGuid
				}).then((res) => {
					console.log('删除成功！');
				})
				//do
			},
			// 列表里面的减少
			reduceqty(idx){
				let num = this.list_pop[idx].OrderQty
				if (num>0) {
					this.list_pop[idx].OrderQty = parseInt(this.list_pop[idx].OrderQty) - 1
				}
			},
			// 列表里面的增加
			addqty(idx){
				this.list_pop[idx].OrderQty = parseInt(this.list_pop[idx].OrderQty) + 1
			},
			// 提交修改
			submit(){
				console.log(`${this.list_pop}`);
				let arr = this.list_pop
				for (let i = 0; i < arr.length; i++) {
					
					CreateFittingsOrder({
						OrderType:"维修领料单",
						FatherOrderNo: this.orderNo,
						CreateMark:"",
						UpdateUserGuid:uni.getStorageSync('userInfo').UserGuid,
						MachineGuid: arr[i].MachineGuid,
						OrderNo: arr[i].orderNo
					}).then(res=>{
						this.list_pop.map(item=>{
							SetFittingUseOrderDetail({
								OrderNo: item.orderNo,
								MCGuid:item.MCGuid,
								Qty:item.OrderQty,
								Unit:item.Unit,
							}).then(() => {
								this.$refs.uToast.show({
									title: '提交成功',
									type: 'success',
									position: 'center',
									duration: 500,
									back: true
								})
							})
						})
					})
				}
				
			}
		},
	}
</script>

<style scoped lang="scss">
.manage_bg{
	background-color: #FFFFFF;
	.zhanWei_height{
		height: 200rpx;
		background-color: #F0F0F0;
	}
	.main{
		.pop_shop_content{
			margin: 0 20rpx;
			height: 156rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			border-bottom: 1rpx solid #F0F0F0;
			padding: 20rpx 0rpx 20rpx 0rpx;
			.shop_l{
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				.shop_l_img{
					width: 40rpx;
					height: 40rpx;
					margin-right: 15rpx;
					.img{
						width: 40rpx;
						height: 40rpx;
					}
				}
				.shop_l-r{
					width: 350rpx;
					font-size: 24rpx;
					color: #000000;
					// white-space: nowrap;
					// text-overflow:ellipsis;
					// overflow:hidden;
					.text1{
						font-size: 24rpx;
						font-family: PingFang SC;
						font-weight: bold;
						color: #000000;
					}
					.text2{
						margin-top: 5rpx;
						color:grey;
					}
					.text3{
						color:grey;
					}
				}
			}
			.shop_r{
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				// 主页列表右侧
				.shop_r_l_home{
					margin-right: 10rpx;
				}
				.shop_r_r_home{
					width: 22rpx;
					height: 18rpx;
					.img{
						width: 22rpx;
						height: 18rpx;
					}
				}
				.shop_r_l{
					border: 1rpx solid #BFBFBF;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					font-size: 30rpx;
					.l2{
						border-left: 1rpx solid #BFBFBF;
						border-right: 1rpx solid #BFBFBF;
						text-align: center;
						line-height: 50rpx;
						width: 100rpx;
					}
					.item{
						width: 50rpx;
						height: 50rpx;
						text-align: center;
						line-height: 50rpx;
					}
				}
				.shop_r_r{
					width: 40rpx;
					height: 40rpx;
					margin-left: 15rpx;
					.img{
						width: 40rpx;
						height: 40rpx;
					}
				}
			}
		}
	}
	.footer{
		position: fixed;
		bottom: 0;
		width: 100vw;
		background-color: #FFFFFF;
		border-top: 1rpx solid #cccccc;
		.btn_bg{
			margin-top: 25rpx;
			margin-bottom: 20rpx;
		}
	}
}
// ceshi
.border{
	border: 1rpx solid #cccccc;
}
</style>