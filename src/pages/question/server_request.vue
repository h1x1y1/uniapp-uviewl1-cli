<template>
	<view class="container">
		<view class="list_item_bg" v-for="(item,index) in list" :key="item.id">
			<view class="q_title ">
				<view class="l border">
					<view class="circle">申</view>
					<view class="title">{{item.qTitle}}</view>
				</view>
				<view class="status">
					<u-tag :text="item.qSta==0?'待处理': ''" type="primary" />
				</view>
			</view>
			<view class="q_content">
				<view class="content1">
					<span>问题单号：</span>{{item.qNo}}
				</view>
				<view class="content2">
					<span>任务描述：：</span>{{item.qMark}}
				</view>
				<view class="content3">
					<span>提报日期：</span>{{item.qDate}}
				</view>
				<view class="content4">
					<span>任务地址：</span>{{item.qAddress}}
				</view>
			</view>
			<view class="q_footer border">
				<view class="l">距离任务开始还有 1 天</view>
				<view class="r">
					<u-tag text="查看详情" type="primary" />
				</view>
			</view>
		</view>
		<u-back-top :scroll-top="scrollTop"></u-back-top>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollTop: 0,
				list:[
					{
						id: '1',
						qTitle: '指示灯运行前观察',
						qSta: 0,
						qNo: 'WT-00627-10',
						qMark: '导丝折弯刀表面无脏污异物导丝槽表面不粘烟导丝折弯刀表面无脏污异物导丝槽表面不粘烟导丝折弯刀表面无脏污异物导丝槽表面不粘烟垢与耐磨不粘垢外套的内表面平齐',
						qDate: '2022-07-12 10:00',
						qAddress: '安徽金寨一号厂房一楼G5区',
						timeAgo: '51分钟前',
					},
					{
						id: '2',
						qTitle: '导丝折弯刀表面异物',
						qSta: 0,
						qNo: 'WT-00627-10',
						qMark: '导丝折弯刀表面无脏污异物导丝槽表面不粘烟 垢与耐磨不粘垢外套的内表面平齐',
						qDate: '2022-07-12 10:00',
						qAddress: '安徽金寨一号厂房一楼G5区',
						timeAgo: '51分钟前',
					},
					{
						id: '3',
						qTitle: '导丝折弯刀表面异物送锡管折弯、变形、内孔...',
						qSta: 0,
						qNo: 'WT-00627-10',
						qMark: '导丝折弯刀表面无脏污异物导丝槽表面不粘烟 垢与耐磨不粘垢外套的内表面平齐',
						qDate: '2022-07-12 10:00',
						qAddress: '安徽金寨一号厂房一楼G5区',
						timeAgo: '51分钟前',
					},
					{
						id: '4',
						qTitle: '导丝折弯刀表面异物',
						qSta: 0,
						qNo: 'WT-00627-10',
						qMark: '导丝折弯刀表面无脏污异物导丝槽表面不粘烟 垢与耐磨不粘垢外套的内表面平齐',
						qDate: '2022-07-12 10:00',
						qAddress: '安徽金寨一号厂房一楼G5区',
						timeAgo: '51分钟前',
					},
					{
						id: '5',
						qTitle: '导丝折弯刀表面异物',
						qSta: 0,
						qNo: 'WT-00627-10',
						qMark: '导丝折弯刀表面无脏污异物导丝槽表面不粘烟 垢与耐磨不粘垢外套的内表面平齐',
						qDate: '2022-07-12 10:00',
						qAddress: '安徽金寨一号厂房一楼G5区',
						timeAgo: '51分钟前',
					}
				]
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad() {
			
		},
		methods: {
			
		},
	}
</script>

<style scoped lang="scss">
.container{
	padding: 30rpx;
	.list_item_bg{
		background-color: white;
		margin-bottom: 24rpx;
		padding: 30rpx 30rpx 0 30rpx;
		line-height: 50rpx;
		border-radius: 12rpx;
		.q_title{
			width: 100%;
			height: 50rpx;
			display: flex;
			justify-content: space-between;
			align-items: baseline;
			margin-bottom: 5rpx;
			.l{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				width: 60%;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				word-break: break-all;
				.circle{
					width: 40rpx;
					height: 40rpx;
					background: linear-gradient(-37deg, #63BBF8 0%, #168BE4 100%);
					border-radius: 50%;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 20rpx;
					color: #FFFFFf;
					margin-right: 17rpx;
				}
				.title{
					font-size: 32rpx;
					font-weight: bold;
					color: #000000;
					letter-spacing: 3rpx;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					word-break: break-all;
				}
			}
			.status{
				.u-tag{
					height: 50rpx;
					border: none;
					background-color: #F6FFED;
					color: #52C41A;
				}
			}
		}
		.q_content{
			border-top: 1rpx solid #F0F0F0;
			border-bottom: 1rpx solid #F0F0F0;
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #000000;
			padding: 20rpx 0 20rpx 0;
			span{
				color: #bfbfbf;
			}
			.content2{
				letter-spacing: 0;
				overflow: hidden;
				display: -webkit-box;
				text-overflow: ellipsis;
				-webkit-line-clamp: 2;  /*要显示的行数*/
				-webkit-box-orient: vertical;
				font-size:12px;
			}
		}
		.q_footer{
			// height: 50rpx;
			display: flex;
			justify-content: space-between;
			align-items: baseline;
			margin-top: 20rpx;
			height: 80rpx;
			.l{
				font-size: 20rpx;
				font-weight: 400;
				color: #000000;
				color: #0066CB;
				letter-spacing: 3rpx;
			}
			.r{
				height: 40rpx;
			}
		}
	}
}

.border{
	// border: 1px solid black;
}
</style>