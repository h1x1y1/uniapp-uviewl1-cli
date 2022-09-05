<template>
	<view>
		<u-navbar back-icon-color="#FFFFFF" :back-text-style="{ color: '#FFFFFF' }" back-text="返回"
			:background="{ backgroundColor: '#0066cb' }">
			<view class="navbar-right" slot="right">
				<view class="message-box right-item" style="padding-right: 30rpx;" @click="scan">
					<u-icon 
					 name="scan"
					 color="#FFFFFF"
					 size="40"></u-icon>
				</view>
			</view>
		</u-navbar>
		<view>
			<u-cell-group title="">
				<u-cell-item size="large" style='padding: 1px 17px;' title="固定资产号" :arrow="false"
					:border-bottom="false">
					<u-input slot="right-icon" v-model="AssetsID" placeholder="请输入" :clearable="true"
						input-align="right"></u-input>

				</u-cell-item>
				<u-icon slot="right" name="scan" color="red" size="40"></u-icon>
				<u-cell-item size="large" style='padding: 1px 17px;' title="设备名称" :arrow="false" :border-bottom="false">
					<u-input slot="right-icon" v-model="MachineSpec" placeholder="请输入" :clearable="true"
						input-align="right"></u-input>
				</u-cell-item>
			</u-cell-group>


			<u-row gutter="16" justify="center">
				<u-col span="9">
					<view class="btn-fill df-ac-jc" style="margin: 88rpx 0;" @click="clickFind">
						<u-icon name="play-right-fill" color="#fff" label="查询" label-color="#fff"></u-icon>
					</view>
				</u-col>
			</u-row>
			<scroll-view class="spot-check-scroll" scroll-y="true">
				<u-card :border="false" padding="30" margin="30rpx" v-for="(item,index) in list" :key="index"
					@click="selectItem(item)">

					<view slot="body">
						<u-row gutter="16">
							<u-col span="12">
								<view class="apply-text"><span>资产号：</span>{{item.AssetsID}}</view>
							</u-col>
							<u-col span="12">
								<view class="apply-text"><span>设备名称：</span>{{item.MachineName}}</view>
							</u-col>
							<u-col span="12">
								<view class="apply-text"><span>设备描述：</span>{{item.MachineSpec}}</view>
							</u-col>
						</u-row>
					</view>
				</u-card>
				<u-divider bgColor="#F8F8F8">已经到底了</u-divider>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		GetMachineList //设备查询 
	} from '@/plugin/api'
	import store from '@/store/index.js'; //需要引入store
	export default {

		data() {
			return {
				AssetsID: '', //固定资产号
				MachineSpec: '', //设备名称	
				list: [], //查询结果
			};
		},
		onLoad(res) {},
		methods: {
			//扫描
			scan(){
				 this.QYWX.QYWXonScan().then(res=>{
				let qr_code = res.result.replace(/[\r\n]/g, "\\n") 
					 let str = res.result.split("\n"); 
					 this.MachineSpec=str[1]		//获取二维码描述		
						this.clickFind()  
				 })
			},
			// 选择行
			selectItem(item) {
				store.state.item = item;
				// console.log(item);
				let pages = getCurrentPages()
				let prevPage = pages[pages.length - 2]
				prevPage.$vm.getInfo(item)  
				uni.navigateBack({
					delta: 1
				})
			},
			//查询设备
			clickFind() {
				uni.showLoading({
					title: '正在加载...'
				})
				GetMachineList({
					AssetsID: this.AssetsID, //固定资产号
					QueryNote: this.MachineSpec, //QueryNote可以是设备编号，设备名称，规格型号，模糊查
					UserGuid: uni.getStorageSync('userInfo').UserGuid,
					ComPanyGuid: '',
					CostCenterGuid: '',
					MCGuid: '',
					LabelType: ''
				}).then(({
					data: {
						code,
						data,
						msg
					}
				}) => {
					uni.hideLoading()
					if (code == 1) {
						this.list = []
						this.list = data
					}
				})
			},
		}
	};
</script>

<style lang="scss" scoped>
::v-deep .uni-input-input{
	width: 63vw;
}
	page {
		background-color: #f8f8f8;
	}

	.btn-fill {
		background-color: #0066cb;
		height: 88rpx;
		border-radius: 12rpx;
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
