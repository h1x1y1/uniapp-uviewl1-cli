<template>
	<view class="contenter">
		<u-navbar
			 back-icon-color="#FFFFFF" 
			 :back-text-style="{ color: '#FFFFFF' }" 
			 back-text="返回" 
			 title-size="50"
			 title-color="#FFFFFF"
			 :background="{ backgroundColor: '#0066cb' }">
			 <view style="padding-left: 20rpx;height: 30px;width: 470rpx;">
				 <u-input height="40" focus v-model="value" border style="margin-top: 10rpx;"/>
			 </view>
				<view class="navbar-right" slot="right">
					<view class="message-box right-item" @click="search" style="padding-right: 40rpx;color: #FFFFFF;">
						搜 索
					</view>
				</view>
		</u-navbar>
		<view>
			<scroll-view class="scroll-list " scroll-y="true">
				<view style="padding: 40rpx 30rpx 150rpx 30rpx;background-color: #FFFFFF;">
					<view 
					 v-for="(item,index) in listData" :key="index"
					 class="pop_shop_content"
					 @click="clickMaterial(item)">
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
							<view class="shop_l-r" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
								<view class="text1">{{item.MCName}}</view>
								<view class="text2">{{item.MCID}}</view>
								<view class="text3">物料描述：{{item.mcguid}}</view>
							</view>
						</view>
						<!-- 右侧 -->
						<view class="shop_r">
							<!-- left -->
							<view class="shop_r_l_home">
								<view class="">库存总量：{{item.INQTY}}</view>
								<view class="">可使用量：{{item.keyongQty}}</view>
							</view>
							<!-- right -->
							<view class="shop_r_r_home">
								<image 
								src="../../static/add/detail_icon_chevron_more.png" 
								mode="widthFix"
								class="img"></image>
							</view>
						</view>
					</view>
				</view>
				<u-divider bgColor="#f5f5f5">已经到底了</u-divider>
			</scroll-view>
		</view>
		
		
		<!-- 页脚 -->
		<view class="footer">
			<u-row justify="center">
				<u-col span="6" style="padding-left: 30rpx;padding-top: 6rpx;" >
					<view class="avatar" v-show="!isSelect">
						<image class="img" :src="srcDefault" mode="widthFix"></image>
					</view>
					<view class="avatar" v-show="isSelect" @tap="lookSelected">
						<image class="img" :src="src" mode="widthFix"></image>
						<!-- 选中的人员数量 -->
						<view class="circle">{{nums}}</view>
					</view>
				</u-col>
				<u-col span="6">
					<u-button type="primary" size="medium" style="height: 35px;margin: 10px;font-size: 16px;" 
					@tap="confirmAdd">
							保存
						</u-button>
				</u-col>
			</u-row>
		</view>
		<!-- 添加物料成功的弹窗 -->
		<u-popup
		 v-model="show1"
		 mode="center"
		 :border-radius="14"
		 width="85%"
		 height="65%"
		 :closeable="true">
			<view class="pop_bg2">
				<view class="img_success">
					<img src="../../static/pop/Popup_success.png" alt="成功的图片提示">
				</view>
				<view class="text_success">
					添加成功
				</view>
				<view class="text_default margin-t-60">
					你已完成物料添加
				</view>
				<view class="text_default margin-t-10">
					可在【任务详情-物品】
				</view>
				<view class="text_default margin-t-10">
					或【库存】中查看需领取的物料
				</view>
				<view class="btns_bg margin-t-60">
					<u-button type="primary" :plain="true" :ripple="true" @click="toBack">返回任务详情</u-button>
					<view class="zhanWei_w"></view>
					<u-button type="primary" :ripple="true" @click="toLook">去库存查看</u-button>
				</view>
			</view>
		</u-popup>
		<!-- 未选择物料时模态弹框提示 -->
		<u-modal v-model="show2" :content="content"></u-modal>
		<!-- 选择物料的弹框=========================== -->
		<u-popup v-model="showpopup" mode="center" border-radius="14" width="80%" :closeable="true" duration="300">
			<view style="height: 100%;padding-top: 20rpx;">
				<view style="margin-left: 20rpx;font-weight: 800;letter-spacing: 3rpx;">添加物料需求</view>
				<view style="background-color: #FFFFFF;padding: 0 20rpx;">
					<view class="pop_shop_content" style="border: none;">
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
							<view class="shop_l-r" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
								<view class="text1">{{currentRecord.MCName}}</view>
								<view class="text2">{{currentRecord.MCID}}</view>
								<view class="text3">规格型号：{{currentRecord.mcguid}}</view>
							</view>
						</view>
					</view>
				</view>
				<u-cell-group>
					<view  class="xuqiu">
						<u-cell-item size="large" :arrow="false" :border-bottom="false">
							<template slot="label">
								<span style="color: black;">{{"需求数量(kg)"}}</span><span style="color:red">*</span>
							</template>
							<u-input type="number" slot="right-icon" focus placeholder="请输入数量" input-align="right" v-model.number="currentRecord.qty"></u-input>
						</u-cell-item>
					</view>
					<view class="xuqiu">
						<u-cell-item size="large" :value="currentRecord.WHName" isLink :border-bottom="false">
							<template slot="label">
								<span style="color: black;">{{"来源位置"}}</span><span style="color:red">*</span>
							</template>
						</u-cell-item>
					</view>
					<view class="xuqiu">
						<u-cell-item size="large" :value="currentRecord.StorageName" isLink :border-bottom="false">
							<template slot="label">
								<span style="color: black;">{{"来源货位"}}</span><span style="color:red">*</span>
							</template>
						</u-cell-item>
					</view>
					
					<u-input style="margin-top: 10rpx;" v-model="remark" :type="type" :border="border" :height="height" :auto-height="autoHeight" />
					<u-button type="primary" ripple style="margin: 10px;" @tap="saveMaterialOrder">提交需求，申请预留</u-button>
				</u-cell-group>
			</view>
		</u-popup>
		<!--购物车 弹框=========================== -->
		<u-popup v-model="showShopping" z-index="10" closeable mode="bottom" height="80%" border-radius="14" close-icon-pos="top-right" duration="300">
			<view style="padding: 40rpx 30rpx 150rpx 30rpx;">
				<view class="pop_title">已选择物料</view>
				<view class="pop_deleteAll" @click="toDeleteAll">清空</view>
				<view 
				 v-for="(item,index) in listShopping" :key="index"
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
							<view class="text3">规格型号：{{item.mcguid}}</view>
						</view>
					</view>
					<!-- 右侧 -->
					<view class="shop_r">
						<!-- left -->
						<view class="shop_r_l">
							<view class="item" @click="reduceNumber(index)">-</view>
							<view class="l2">{{item.qty}}</view>
							<view class="item" @click="addNumber(index)">+</view>
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
			</view>
		</u-popup>
		<!-- 重复选择的弹窗 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
import { setPersoin, getMaterial ,CreateFittingsOrder,SetFittingUseOrderDetail} from './api';

export default {
	components: {},
	data() {
		return {
			value: '',
			obj:{},//上一个页面传递过来的参数
			show1: false,//物料提交成功的弹窗
			show2: false,//提示未选择的弹窗
			content: '请先选择您要添加的物料哦！',
			srcDefault: '../../static/add/addPersons_default.png',
			src: '../../static/add/addPersons.png',
			nums: 0, //选中的人数
			srcDefault: '../../static/add/add_Material_default.png',//页脚弹窗-图标
			remark: '',
			type: 'textarea',
			border: true,
			height: 100,
			autoHeight: true,

			currentRecord: { 
				qty: ''
			}, //显示物料信息
			recordCount: 0, //当前购物数
			showShopping: false, //显示购物车控制
			showpopup: false, //显示物料信息控制
 
			userInfo: {}, //用户信息
			radio: '', //单选
			listData: [], //任务清单
			listShopping: [] ,//购物车
			list_pop:  [],
			QueryNote:'',//物料编码和物料名称
			McGuid: ''
		};
	},

	onLoad(e) {
		// console.log(JSON.parse(decodeURIComponent(e.item)))
		this.obj = JSON.parse(decodeURIComponent(e.item))
		this.McGuid = JSON.parse(e.item).McGuid
		this.findMaterial();
		
	},
	computed: {
		isSelect() {
			return this.nums>0?true:false 
		}
	},
	methods: {
		search(){
			uni.showLoading({
				title: '正在加载...'
			})
			getMaterial({
				McGuid: this.McGuid,// 'F4E19220-41DE-4F50-A91B-1BF6BA89AA18',
				UserGuid: uni.getStorageSync('userInfo').UserGuid,
				QueryNote:this.value,
			}).then(res => {
				uni.hideLoading()
				console.log(res.data);
				this.listData = res.data.data;
			})
		},
		// 确认添加
		confirmAdd(){
			if (this.nums==0) {
			// 未选择物料时的弹窗
			this.show2 = true
				return
			}
			
				// 关闭购物车
				this.showShopping = false
				// 提交数据成功的弹窗
				// this.show1 = true
				uni.showLoading({
					title: '正在保存...'
				})
			CreateFittingsOrder({
				OrderType:"维修领料单",
				FatherOrderNo:this.obj.orderNo,
				CreateMark:"",
				UpdateUserGuid:uni.getStorageSync('userInfo').UserGuid,
				MachineGuid:this.obj.MachineGuid,
				OrderNo: ''
			}).then(res=>{
				uni.hideLoading()
				uni.navigateBack({
					delta: 1
				})
				this.listShopping.map(item=>{
					SetFittingUseOrderDetail({
					OrderNo:res.data.data[0].orderNo,
					MCGuid:item.mcguid,
					Qty:item.qty,
					Unit:item.Unit,
					})
				})
			})
			
		},
		// 删除全部物料
		toDeleteAll(){
			this.listShopping.length = 0
			this.nums = 0
			this.showShopping = false
		},
		// 删除单个物料
		toDeleteMaterial(idx){
			this.listShopping.splice(idx,1)
			this.nums--
			if (this.listShopping.length == 0) {
				this.showShopping = false
			}
		},
		// 弹窗里面的减少
		reduceNumber(idx){
			let num = this.listShopping[idx].qty
			if (num>0) {
				this.listShopping[idx].qty = this.listShopping[idx].qty - 1
			}
		},
		// 弹窗里面的增加
		addNumber(idx){
			this.listShopping[idx].qty = this.listShopping[idx].qty + 1
			console.log(`删除第${idx+1}行数据`);
		},
		// 打开购物车
		lookSelected(){
			this.showShopping = !this.showShopping
		},
		// 保存购物车
		saveMaterialOrder() {
			if (this.currentRecord.qty>0) {
				if (this.currentRecord.qty > this.currentRecord.keyongQty) {
					this.$refs.uToast.show({
						title: '需求数量超出可使用量',
						type: 'error',
						icon: false,
					})
					return
				}
				for (let i = 0; i < this.listShopping.length; i++) {
					if (this.currentRecord.MCName ==this.listShopping[i].MCName ) {
						this.$refs.uToast.show({
							title: '选择重复，购物车已添加过！',
							type: 'warning'
						})
						return
					}
				}
				console.log(this.currentRecord.keyongQty);
				this.listShopping.push(this.currentRecord);
				this.nums = this.listShopping.length;
				this.currentRecord = {};
				this.showpopup = false;
				return
			}
			this.$refs.uToast.show({
				title: '需求数量不能为0',
				type: 'error',
				icon: false,
			})
		},
		// 点击物料
		clickMaterial(itm) {
			// 获取当前点击物料,然后显示
			console.log(`当前点击物料${JSON.stringify(itm)}`);
			this.currentRecord = itm
			this.showpopup = true;
		},
		// 查询物料
		findMaterial() {
			getMaterial({
				McGuid: this.McGuid,// 'F4E19220-41DE-4F50-A91B-1BF6BA89AA18',
				UserGuid: uni.getStorageSync('userInfo').UserGuid,
				QueryNote:this.QueryNote,
			}).then(res => {
				console.log(res.data);
				this.listData = res.data.data;
				// this.listData.map(item => {
				// 	item.number = '库存：' + item.INQTY + '&&&' + '可用量：' + item.keyongQty
				// 	item.MCName1 = item.MCName.length > 20 ? item.MCName.substring(0, 20) + '...' : item.MCName;
				// });
			});
		},
		/** 点击顶部按钮的方法 */
		onNavigationBarButtonTap(e) {
			console.log('你点击了按钮' + e.index);
			// 允许从相机和相册扫码
		},
		// 返回首页
		toBack(){
			uni.navigateBack({
				delta:1,
			})
		},
		// 查看参与人员
		toLook(){
			console.log('待定');
		}
	}
};
</script>

<style lang="scss" scoped>
::v-deep .uni-input-input{
	color: #FFFFFF;
}
.xuqiu{
	::v-deep .uni-input-input{
		color: black;
	}
}
uni-page-head .uni-page-head {
	position: relative;
	z-index: 8 !important;
}
.pop_bg2{
	background-color: #FFFFFF;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items:center;
	justify-content: flex-start;
	.img_success{
		margin-top: 60rpx;
		img{
			width: 350rpx;
			height: 350rpx;
		}
	}
	.text_success{
		font-size: 40rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
	}
	.text_default{
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #8C8C8C;
		line-height: 40rpx;
	}
	.margin-t-60{
		margin-top: 60rpx;
	}
	.margin-t-10{
		margin-top: 10rpx;
	}
	.btns_bg{
		display: flex;
		flex-direction: row;
		justify-content: center;
		padding: 20rpx;
		.zhanWei_w{
			width: 20rpx;
		}
	}
}
.xuqiu{
	border-bottom: 1rpx solid #f0f0f0;
	.u-cell{
		padding: 10rpx 30rpx;
	}
}

.pop_shop_content:hover{
	background-color: #F0F0F0;
}
.pop_shop_content{
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
.pop_title{
	font-size: 35rpx;
	font-family: PingFang SC;
	font-weight: 800;
	color: #000000;
	border-bottom: 1rpx solid #F0F0F0;
}
.pop_deleteAll{
	position: absolute;
	top: 28rpx;
	right: 90rpx;
	font-size: 24rpx;
	font-family: PingFang SC;
	font-weight: 400;
	color: #8C8C8C;
}
.footer{
	z-index: 23;
	position: fixed;
	bottom: 0;
	width: 100%;
	background-color: #FFFFFF;
	border-top: 1rpx solid #b0b0b0;
	.avatar{
		position: relative;
		top: 0;
		background-color: #FFFFFF;
		width: 100rpx;
		.img{
			width: 92rpx;
			height: 92rpx;
		}
		.circle{
			position: absolute;
			top: 0;
			right: 0;
			background-color: red;
			color: #FFFFFF;
			width: 40rpx;
			border-radius: 50%;
			text-align: center;
			align-items: center;
			font-size: 10rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #FFFFFF;
			line-height: 40rpx;
		}
	}
}
.contenter{
	padding-bottom: 10rpx;
}

page {
	background-color: #f8f8f8;
}
.u-row {
	// margin: 25px;
	font-size: 20px;
}

.scroll-list {
	height: calc(100vh - var(--window-top) - var(--window-bottom) - 150rpx); // 105rpx 为 .search 的高度
	width: 100%;

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
		text-overflow: ellipsis;
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
