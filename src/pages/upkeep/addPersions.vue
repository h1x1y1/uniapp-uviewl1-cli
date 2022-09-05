<template>
	<view class="container">
		<u-navbar
			 back-icon-color="#FFFFFF" 
			 :back-text-style="{ color: '#FFFFFF' }" 
			 back-text="返回" 
			 title-size="50"
			 title-color="#FFFFFF"
			 :background="{ backgroundColor: '#0066cb' }">
			 <view style="padding-left: 20rpx;height: 30px;width: 470rpx;">
				 <u-input focus height="40" v-model="value" border style="margin-top: 10rpx;"/>
			 </view>
				<view class="navbar-right" slot="right">
					<view class="message-box right-item" @click="getPersons" style="padding-right: 40rpx;color: #FFFFFF;">
						搜 索
					</view>
				</view>
		</u-navbar>
		<u-row :gutter="300" justify="start">
			<u-col span="12" class="bg-white">
				<u-checkbox-group
				 @change="checkboxGroupChange"
				 :wrap="true">
					<u-checkbox 
						v-model="item.checked" 
						v-for="(item, index) in list" :key="index" 
						:name="item.UserName"
						shape="circle"
					>{{item.UserName}}</u-checkbox>
				</u-checkbox-group>
			</u-col>
		</u-row>
		<!-- 页脚 -->
		<view class="footer">
			<u-row justify="center">
				<u-col span="6" style="padding-left: 20rpx;padding-top: 6rpx;" >
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
		<!-- 查看选中人的弹窗 -->
		<u-popup 
		 v-model="show" 
		 mode="bottom"
		 :safe-area-inset-bottom="true"
		 :border-radius="20"
		 :closeable="true"
		 z-index="22">
			<view class="pop_content">
				<view class="qinKong" @tap="deleteAllClose">清空</view>
				<view class="title">
					<view class="selected_title">已选择人员</view>
				</view>
				<view 
				v-for="(item,index) in list2"
				class="list-bg" 
				style="display: flex;justify-content: space-between;margin-top: 10rpx;">
					<u-checkbox 
					v-model="item.checked" 
					:disabled = "true"
					shape="circle">
						{{item.UserName}}
					</u-checkbox>
					<view class="">
						<image 
						class="img_delete" src="../../static/add/delete.png" 
						mode="widthFix"
						@tap="deleteItem(index,item)"></image>
					</view>
				</view>
			</view>
		</u-popup>
		<!-- 添加人员成功的弹窗 -->
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
					你已完成人员添加
				</view>
				<view class="text_default margin-t-10">
					可在当前任务详情中查看参与人员
				</view>
				<view class="btns_bg margin-t-60">
					<u-button type="primary" :plain="true" :ripple="true" @click="toBack">返回首页</u-button>
					<!-- <view class="zhanWei_w"></view> -->
					<!-- <u-button type="primary" :ripple="true" @click="toLook">查看参与人员</u-button> -->
				</view>
			</view>
		</u-popup>
		<!-- 模态弹框提示 -->
		<u-modal v-model="show2" :content="content"></u-modal>
	</view>
</template>

<script>
	import { getPersoin, SaveWorkUser,DelWorkUser,GetWorkUser } from './api'
	export default {
		data() {
			return {
				value: '',// 顶部搜索框里面的内容
				item:{},//维修单信息
				checked: true,
				show: false,
				show1: false,
				srcDefault: '../../static/add/addPersons_default.png',
				src: '../../static/add/addPersons.png',
				nums: null, //选中的人数
				list: [], //人员列表
				list2: [], //选中的人员列表 
				show2: false,
				content: '请先选择要添加的人员！'
			}
		},
		onLoad(e) {
			
			this.item = JSON.parse(decodeURIComponent(e.item))
			console.log(JSON.parse(decodeURIComponent(e.item)))
			 
			this.getWorkUser();//已经添加的人员
		},
		computed: {
			isSelect() {
				return this.nums>0?true:false 
			}
		},
		methods: {
			// // 人员查询
			// search(){
			// 	uni.showLoading({
			// 		title: '加载中...'
			// 	})
			// 	setTimeout(()=>{
			// 		uni.hideLoading()
			// 	},1500)
			// },
			// 获取已经添加的人员
			getWorkUser(){
				GetWorkUser({
					orderNo	:this.item.orderNo,			
					Type:"维修单"
				}).then(res=>{
					this.list.map(item=>{
						res.data.data.map(ite=>{							
							if(item.UserGuid==ite.UserGuid){
								item.checked=true
								return;
							}
						})
					})
					 this.selectPersons();
				})
			},
						// 获取人员列表
			getPersons(){
				uni.showLoading({
					title: '正在加载...'
				})
				getPersoin({
					UserGuid: uni.getStorageSync('userInfo').UserGuid,
					QueryNote:this.value
				}).then((res) => {	
					uni.hideLoading()
					console.log(res.data.data);
					if (res.data.code==1) {		
						this.list = []
						this.list = res.data.data
						// let arr = res.data.data
						// let arr2 = this.list
						// arr.map(((item, index)=> {
						// 	arr2.push(Object.assign({},item,{checked: false}))
						// }))
					}
					
				})
			},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
				this.nums = e.length;
				this.list2 = []
				this.selectPersons();
			},
			lookSelected(){
				console.log('查看选中的人');
				// 打开弹窗
				this.show = true
			},
			// 选中的人有
			selectPersons(){
				for (let i = 0; i < this.list.length; i++) {
					if (this.list[i].checked == true) {
						this.list2.push(this.list[i])
					}
				}
				this.nums=this.list2.length;
			},
			// 删除弹窗的元素-单个
			deleteItem(idx,itm){
				
				// 删除后端人员
				DelWorkUser({
					orderNo:this.item.orderNo,
					UserGuid:itm.UserGuid,
					Type:'维修单'

				})
				for (let i = 0; i < this.list2.length; i++) {
					if (idx == i) {
						this.list2.splice(idx,1);
					}
				}
				console.log(itm.UserName);
				// 弹窗单个删除去除之前的勾选
				this.list.map((item,index,arr) => {
					if (item.UserName == itm.UserName) {
						item.checked = false
					}
					return item;
				})
				
				let len = this.list2.length
				this.nums = len
				if (len == 0) {
					this.show = false
					return
				}
				// console.log(`this.list2:${this.list2}`);
			},
			// 删除弹窗的元素-全部
			deleteAllClose(){
				for (let i = 0; i < this.list.length; i++) {
					this.list[i].checked = false
				}
				this.nums = 0
				this.show = false
				this.list2 = []
				// 后端删除
				// console.log(`牛啊牛啊${JSON.stringify(this.list2)}`);
			},
			// 确认添加
			confirmAdd(){
				console.log(`要添加的数据条数为：${JSON.stringify(this.list2.length)}`);
				console.log(`要添加的数据为：${JSON.stringify(this.list2)}`);
				if (this.list2.length > 0) {
					this.show1 = true
					this.show = false
					for (let i = 0; i < this.list2.length; i++) {
						SaveWorkUser({
							"orderNo": this.item.orderNo,
							"UserGuid": this.list2[i].UserGuid,
							"Type": '维修单'
						}).then(()=> {
							console.log("保存成功！");
						})
					}
					
					return
				} 
				this.show2 = true
			},
			// 返回首页
			toBack(){
				uni.navigateBack({
					delta:1,//返回层数，2则上上页
				})
			},
			// 查看参与人员
			toLook(){
				this.show1 = false
				this.show = true
			}
		},
	}
</script>

<style scoped lang="scss">
::v-deep .uni-input-input{
	color: #FFFFFF;
}
	.container{
		padding-top: 50rpx;
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
				}
			}
		}
	}
	.bg-white{
		background-color: #FFFFFF;
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
	.pop_content{
		// background-color: aquamarine;
		margin: 30rpx;
		margin-bottom: 200rpx;
		.qinKong{
			position: fixed;
			top: 25rpx;
			right: 90rpx;
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #8C8C8C;
			z-index: 10;
		}
		.title{
			height: 90rpx;
			border-bottom: 1rpx solid #b0b0b0;
			position: relative;
			top: 0;
			.selected_title{
				position: absolute;
				bottom: 5rpx;
				left: 1rpx;
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #000000;
			}
		}
		.img_delete{
			width: 38rpx;
		}
	}
	
</style>