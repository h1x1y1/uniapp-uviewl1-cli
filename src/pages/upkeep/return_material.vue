<template>
	<view class="return_bg">
		<!-- 单号 -->
		<view class="orderNumber_bg">
			<view class="l">
				<view class="l_t">单号：BY202207011613</view>
				<view class="l_b">待领用</view>
			</view>
			<view class="r">
				<u-image width="90rpx" height="90rpx" :src="src_QR_code"></u-image>
			</view>
		</view>
	<!-- 退料原因 -->
		<view class="reason_bg">
			<view class="title">
				<view>退料原因</view>
				<view :class="[reason.length == maxlength?'font_nums2':'font_nums']">({{reason.length + '/' + maxlength}})</view>
			</view>
			<view class="text_area">
				<textarea 
				 class="text_bg" 
				 placeholder-style="font-size: 24rpx;font-weight: 400;color: #D9D9D9;"
				 :maxlength="maxlength"
				 placeholder="请添加退料原因"
				 rows="4"
				 cols="30"
				 v-model="reason">
				</textarea>
			</view>
		</view>
		<!-- 列表 -->
		<view class="list_bg">
			<!-- 列表标题 -->
			<view class="list_title">
				<view class="title_text">
					选择需要退还的物料和数量
				</view>
			</view>
			<!-- 循环列表 -->
			<view class="list_item_bg" 
			 v-for="(item,index) in list_pop" :key="index">
			<!-- 左侧勾选按钮 -->
				<view class="item_checkedbox">
					<u-checkbox-group @change="checkboxGroupChange">
						<u-checkbox 
							style="padding-left: 30rpx;padding-top: 30rpx;"
							@change="checkboxChange" 
							v-model="item.checked" 
							:name="item.MCName">
						</u-checkbox>
					</u-checkbox-group>
				</view>
			<!-- 右侧内容 -->
				<view class="content">
					<view class="pop_shop_content">
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
								<view class="text3">单位：{{item.mcguid}}</view>
							</view>
						</view>
						<!-- 右侧 -->
						<view class="shop_r">
							<!-- left -->
							<view class="shop_r_l">
								<view class="item" @click="reduceqty(index)">-</view>
								<view class="l2">{{item.qty}}</view>
								<view class="item" @click="addqty(index)">+</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-divider bgColor="#f5f5f5">已经到底了</u-divider>
		<view class="zhanWei_height"></view>
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
		<!-- 未选择要退的物料时的提示 -->
		<u-toast ref="uToast2" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src_QR_code: '../../static/add/erWeiMa.png',//二维码图片
				reason: '',//退料原因
				maxlength: 80,
				list_pop: [
					{
					MCName: '机器零件1',
					MCID: '1000560870',
					mcguid: 'PC',
					qty: 10,
					checked: false
					},{
					MCName: '机器零件2',
					MCID: '1000560870',
					mcguid: 'PC',
					qty: 1000,
					checked: false
					},{
					MCName: '机器零件3',
					MCID: '1000560870',
					mcguid: 'PC',
					qty: 1000,
					checked: false
				},{
					MCName: '机器零件4',
					MCID: '1000560870',
					mcguid: 'PC',
					qty: 1000,
					checked: false
				},{
					MCName: '机器零件5',
					MCID: '1000560870',
					mcguid: 'PC',
					qty: 1000,
					checked: false
				},{
					MCName: '机器零件6',
					MCID: '1000560870',
					mcguid: 'PC',
					qty: 1000,
					checked: false
				},{
					MCName: '机器零件7',
					MCID: '1000560870',
					mcguid: 'PC',
					qty: 1000,
					checked: false
				},{
					MCName: '机器零件8',
					MCID: '1000560870',
					mcguid: 'PC',
					qty: 1000,
					checked: false
				},{
					MCName: '机器零件9',
					MCID: '1000560870',
					mcguid: 'PC',
					qty: 1000,
					checked: false
				},{
					MCName: '机器零件10',
					MCID: '1000560870',
					mcguid: 'PC',
					qty: 1000,
					checked: false
				}]
			}
		},
		onLoad() {
			
		},
		methods: {
			// 提交修改
			submit(){
				console.log(`${JSON.stringify(this.list_pop)}`);
				this.$refs.uToast.show({
					title: '修改成功',
					type: 'success',
					position: 'top',
					back: true
				})
			},
			// 选中某个复选框时，由checkbox时触发
			checkboxChange(e) {
				//console.log(e);
			},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
				// console.log(e);
			},
			// 列表里面的减少
			reduceqty(idx){
				if (this.list_pop[idx].checked) {
					let num = this.list_pop[idx].qty
					if (num>0) {
						this.list_pop[idx].qty = this.list_pop[idx].qty - 1
					}
				}else{
					this.$refs.uToast.show({
						title: '请先选择要退的物料才能增加或者减少',
						type: 'success'
					})
				}
			},
			// 列表里面的增加
			addqty(idx){
				if (this.list_pop[idx].checked) {
					this.list_pop[idx].qty = this.list_pop[idx].qty + 1
					console.log(`删除第${idx+1}行数据`);
					return
				}
				this.$refs.uToast.show({
					title: '请先选择要退的物料才能增加或者减少',
					type: 'success'
				})
			},
		},
	}
</script>

<style scoped lang="scss">
.return_bg{
	.zhanWei_height{
		height: 200rpx;
		background-color: #F0F0F0;
	}
	// background-color: red;
	font-family: PingFang SC;
	.orderNumber_bg{
		width: 100vw;
		height: 160rpx;
		background-color: #FFFFFF;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		padding: 0 40rpx;
		box-shadow: 0px 3px 18px 0px rgba(233,241,249,0.6000);
		.l{
			.l_t{
				font-size: 32rpx;
				font-weight: bold;
				color: #000000;
			}
			.l_b{
				font-size: 24rpx;
				font-weight: 400;
				color: #8C8C8C;
				margin-top: 10rpx;
			}
		}
		.r{
			width: 90rpx;
			height: 90rpx;
			// background-color: #e1e1e1;
		}
	}
	.reason_bg{
		width: 750rpx;
		height: 305rpx;
		background: #FFFFFF;
		box-shadow: 0px 3px 18px 0px rgba(233,241,249,0.6000);
		margin: 24rpx 0rpx;
		padding: 30rpx 31.5rpx;
		.title{
			margin-bottom: 10rpx;
			border-bottom: 1rpx solid #F0F0F0;
			font-size: 30rpx;
			font-weight: bold;
			color: #000000;
			line-height: 50rpx;
			display: flex;
			justify-content: space-between;
			.font_nums{
				color: #8C8C8C;
				font-weight: 500;
				margin-right: 10rpx;
			}
			.font_nums2{
				color: red;
				font-weight: 500;
				margin-right: 10rpx;
			}
		}
		.text_area{
			.text_bg{
				width: 672rpx;
				height: 148rpx;
				border: 1rpx solid #F0F0F0;
				padding: 10rpx;
				font-size: 24rpx;
			}
		}
	}
	.list_bg{
		background-color: #ffffff;
		box-shadow: 0px 3px 18px 0px rgba(233,241,249,0.6000);
		width: 100vw;
		padding: 30rpx 0rpx;
		.list_title{
			width: 100vw;
			box-sizing: border-box;
			padding: 0 25rpx;
			.title_text{
				height: inherit;
				line-height: 45rpx;
				border-bottom: 1rpx solid #F0F0F0;
				font-size: 30rx;
				font-weight: bold;
				color: #000000;
			}
		}
		.list_item_bg{
			display: flex;
			justify-content: flex-start;
			.item_checkedbox{
				
			}
			.content{
				width: 84%;
				.pop_shop_content{
					height: 170rpx;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					padding: 20rpx 0rpx 20rpx 0rpx;
					border-top: 1rpx solid #F0F0F0;
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
								margin-top: 9rpx;
							}
						}
						.shop_l-r{
							width: 350rpx;
							font-size: 24rpx;
							color: #000000;
							.text1{
								font-size: 24rpx;
								font-family: PingFang SC;
								font-weight: bold;
								color: #000000;
							}
							.text2{
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
		}
		
	}
	.footer{
		position: fixed;
		bottom: 0;
		width: 100vw;
		background-color: #FFFFFF;
		border-top: 1rpx solid #cccccc;
		z-index: 11;
		.btn_bg{
			margin-top: 25rpx;
			margin-bottom: 20rpx;
		}
	}
}
</style>