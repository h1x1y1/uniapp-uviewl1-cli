<template>
	<view>
		<u-grid class="cx-grid" :col="3" :border="false">
			<u-grid-item v-for="(item, index) in gridList" :key="index" :bg-color="item.color" @click="utils.to_url(item.url)">
				<view>
					<u-badge :count="item.qty" :offset="[25, 95]"></u-badge>
					<u-image class="icon" width="84" height="84" :src="item.src"></u-image>
					<u-cell-item :title="item.title" :label="item.lable" :border-bottom="false" :arrow="false"></u-cell-item>
				</view>
			</u-grid-item>
		</u-grid>
		<view class="mid-btn" @click="openSheet"></view>
		<u-toast ref="uToast" />
		<u-action-sheet :list="sheetList" border-radius="24" v-model="show" @click="clickOrder"></u-action-sheet>
	</view>
</template>

<script>
	import {
		GetUserTasks
	} from '@/plugin/api'
export default {
	data() {
		return {
			sheetList: [
				// 	{
				// 	text: '维修单',
				// },
				{
					text: '问题提报单'
				}
				// , {
				// 	text: '缺陷/服务申请'
				// },
			],
			show: false,
			background: {
				backgroundColor: '#3a74c5'
			},
			actionStyle: {
				color: '#fff'
			},
			keyword: '',
			gridList: [
				{
					title: '新建问题单',
					lable: '异常问题提报',
					url: '/pages/question/quesionNew',
					color: '#FFF3F3',
					src: '/static/home/home_icon_entrance_report.png',
					qty: 0
				},
				{
					title: '问题提报单',
					lable: '问题修改审批',
					url: '/pages/question/index',
					color: '#FFFBEE',
					src: '/static/home/home_icon_entrance_problem.png',
					qty: 0
				},
				{
					title: '服务申请',
					lable: '维修员接单',
					url: '/pages/question/index?Astatus=3', //查看需要审核的单
					color: '#F6FBFE',
					src: '/static/home/home_icon_entrance_Request.png',
					qty: 0
				},
				// {
				// 	title: '报修单',
				// 	lable: '生成报修单',
				// 	url: '',
				// 	color: '#FFF3F3',
				// 	src: '/static/home/home_icon_entrance_report.png'
				// },
				{
					title: '维修单',
					lable: '执行维修任务',
					url: '/pages/repairOrder/index',
					color: '#F9FDFF',
					src: '/static/home/home_icon_entrance_repair.png',
					qty: 0
				},
				{
					title: '验收单',
					lable: '维修任务验收',
					url: '/pages/acceptanceOrder/index',
					color: '#F3FFF9',
					src: '/static/home/home_icon_entrance_receipt.png',
					qty: 0
				},
				{
					title: '点检',
					lable: '执行点检任务',
					url: '/pages/home/spotCheck/spotCheck',
					color: '#EBFFFA',
					src: '/static/home/home_icon_entrance_check.png',
					qty: 0
				},
				{
					title: '保养',
					lable: '执行保养任务',
					url: '/pages/upkeep/task',
					color: '#FFFFF4',
					src: '/static/home/home_icon_entrance_maintain.png',
					qty: 0
				},
				{
					title: '盘点',
					lable: '执行盘点任务',
					url: '/pages/tabBar/inventory',
					color: '#F3FCFF',
					src: '/static/home/home_icon_entrance_inventory.png',
					qty: 0
				}
			]
		};
	},
	onLoad() {
		this.getBardges()
		wx.setNavigationBarTitle({ title: '欢迎您' + uni.getStorageSync('userInfo').UserName + '来到设备管理中心v1.0' });
	},
	onNavigationBarButtonTap(e) {
		 
		switch (e.index) {
			case 0:
				// 返回
				uni.reLaunch({
					url: '/pages/home/home'
				});
				break;
			case 1:
				// 扫码
				this.scan();
				break;
			case 2:
				// 搜索
				uni.showLoading({
					title: '搜索中...'
				});
				setTimeout(() => {
					uni.hideLoading();
				}, 1000);
				break;
			default:
				break;
		}
	},
	methods: {
		getBardges(){
			GetUserTasks({
				UserGuid: uni.getStorageSync('userInfo').UserGuid
			}).then((res) => {
				res.data.data.map((itm) => {
					switch (itm.Class){
						case '点检':
							this.gridList[5].qty = itm.qty
							break;
						case '保养':
							this.gridList[6].qty = itm.qty
							break;
						case '验收单':
							this.gridList[4].qty = itm.qty
							break;
						default:
							break;
					}
				})
				console.log(res.data.data);
			})
		},
		//扫描
		scan(){
			 this.QYWX.QYWXonScan().then(res=>{
			let qr_code = res.result.replace(/[\r\n]/g, "\\n") 
				 let str = res.result.split("\n"); //资产编号、描述，日期
				 this.MachineSpec=str[1]		//获取二维码描述		
					 alert(res.result)
			 })
		},
		// 问题提报
		clickOrder(index) {
			switch (this.sheetList[index].text) {
				case '问题提报单':
					uni.navigateTo({
						url: '/pages/question/quesionNew' //?item='+encodeURIComponent(JSON.stringify(this.detailList))+'&checkItem='+encodeURIComponent(JSON.stringify(this.currenItem))
					});
					break;
				case '服务单':
					uni.navigateTo({
						url: '/pages/serverOrder/serverOrder' //?item='+encodeURIComponent(JSON.stringify(this.detailList))+'&checkItem='+encodeURIComponent(JSON.stringify(this.currenItem))
					});
					break;
				case '维修单':
					this.$refs.uToast.show({
						title: '待开发',
						type: 'primary',
						icon: false
					});
				// uni.navigateTo({
				// 	url: '/pages/maintain/maintainOrder'//?item='+encodeURIComponent(JSON.stringify(this.detailList))+'&checkItem='+encodeURIComponent(JSON.stringify(this.currenItem))
				// })
				// break;
				default:
					break;
			}
		},
		openSheet() {
			this.show = true;
		},
		dealWith(index) {
			console.log(`点击了第${index + 1}项，内容为：${this.sheetList[index].text}`);
		}
	}
};
</script>

<style lang="scss" scoped>
::v-deep .u-action-sheet-item {
	color: #0066cb;
	font-size: 24rpx;
	height: 130rpx;
	font-weight: bold;
	letter-spacing: 3rpx;
}
::v-deep .u-actionsheet-cancel {
	color: #8c8c8c;
	border-top: 1rpx solid #ececec;
	font-size: 24rpx;
	font-weight: bold;
	letter-spacing: 3rpx;
}
::v-deep .u-gab {
	height: 0rpx;
}
::v-deep .u-cell__label {
	font-size: 21rpx !important;
}
.cx-grid {
	::v-deep .u-grid-item {
		.icon {
			margin-left: 32rpx;
		}
		.u-cell_title {
			color: #000;
			font-size: 28rpx;
			font-weight: bold;
			.u-cell__label {
				font-size: 14rpx;
			}
		}
	}
}
</style>
