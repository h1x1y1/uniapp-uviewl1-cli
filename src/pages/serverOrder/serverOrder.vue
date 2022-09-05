<template>
	<view>
		<u-cell-item class="detail-head" bg-color="#fff" title="异常" :border-bottom="false" :arrow="false">

		</u-cell-item>
		<u-cell-item class="task-tag" bg-color="#fff" title="导丝折弯刀内孔无异物,导槽内物脏污,导丝折弯..." :arrow="false">
			<u-tag slot="icon" text="1" border-color="#00C296" bg-color="#FAAC14" color="#fff" shape="circle"></u-tag>
		</u-cell-item>

		<view>
			<u-cell-group title="来源明细">
				<u-cell-item size="large" title="设备资产" value="灯头组装机" isLink :border-bottom="false"></u-cell-item>
				<u-cell-item size="large" title="服务区域" value="安徽" isLink :border-bottom="false"></u-cell-item>
				<u-cell-item size="large" title="对应仪表" :arrow="false" :border-bottom="false">
					<u-input slot="right-icon" placeholder="请输入" clearable="true" input-align="right"></u-input>
				</u-cell-item>
				<u-cell-item size="large" title="对应仪表读书" :arrow="false" :border-bottom="false">
					<u-input slot="right-icon" placeholder="请输入" clearable="true" input-align="right"></u-input>
				</u-cell-item>


			</u-cell-group>

			<u-cell-group title="基本信息">
				<u-cell-item title="日常点检，组装异常红灯常闪，机械的滑动部位与油压系统、电气控制系统设备磨损、阻塞、泄漏、动作失灵、通电不良。" :border-bottom="false"
					:arrow="false"></u-cell-item>
			</u-cell-group>
			<u-cell-group title="申请描述">
				<u-cell-item size="large" title="申请描述,申请描述,申请描述,申请描述,申请描述,申请描述,申请描述,申请描述,申请描述,申请描述,申请描述," :arrow="false"
					:border-bottom="false">

				</u-cell-item>

				<u-action-sheet :list="levelList" v-model="LevelShow" @click="clickLevel"></u-action-sheet>
				<u-cell-item size="large" title="优先级" v-model="level" isLink :border-bottom="false"
					@click="LevelShow = true"></u-cell-item>

				<u-calendar v-model="Dateshow" :mode="dateMode" @change="getDate"></u-calendar>
				<u-cell-item size="large" title="提报时间" v-model="quesionDate" isLink :border-bottom="false"
					@click="Dateshow = true"></u-cell-item>

				<u-action-sheet :list="persionList" v-model="persionShow" @click="persionclick"></u-action-sheet>
				<u-cell-item size="large" title="提报人" v-model="persion" isLink :border-bottom="false"
					@click="persionShow = true"></u-cell-item>
			</u-cell-group>
			<u-cell-group title="详细描述(选填)">
				<u-cell-item size="large" title="" :arrow="false" :border-bottom="false">
					<u-input type="textarea"></u-input>
				</u-cell-item>
				<u-action-sheet :list="persionList" v-model="persionShow" @click="persionclick"></u-action-sheet>
				<u-cell-item size="large" title="维修人" v-model="persion" isLink :border-bottom="false"
					@click="persionShow = true"></u-cell-item>
			</u-cell-group>
			<u-cell-group  >
				<u-cell-item size="large" title="" :arrow="false" :border-bottom="false">
					<u-upload :action="action" :file-list="fileList" ></u-upload>
				</u-cell-item>
			 
			</u-cell-group>
		
			<u-row gutter="16" justify="center">
				<u-col span="9">
					<view class="btn-fill df-ac-jc" style="margin: 88rpx 0;">
						<u-icon name="play-right-fill" color="#fff" label="提交" label-color="#fff"></u-icon>
					</view>
				</u-col>
			</u-row>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				level: "正常", //级别
				LevelShow: false, //级别显示
				levelList: [{ //级别组
						text: '正常',
						color: 'blue',
						fontSize: 28
					},

					{
						text: '紧急',
						color: 'yellow',
						fontSize: 28
					},
					{
						text: '加急',
						color: 'red',
						fontSize: 28
					}
				],
				Dateshow: false, //提报时间
				quesionDate: "2022-07-22", //提报时间
				dateMode: "date", //提报时间

				persion: "张三", //负责人
				persionShow: false, //负责人
				persionList: [ //负责人
					{
						text: '张三'
					},
					{
						text: '张si'
					},
					{
						text: '张wu'
					}
				],

				customStyle: {
					color: '#0066CB',
					margin: '44rpx 0'
				},
				current: 0,
				tabList: [{
					name: '基本'
				}, {
					name: '检查项',
				}]
			}
		},
		methods: {
			//提报实际
			getDate(e) {
				this.quesionDate = e.result
			},
			//级别选择 
			clickLevel(index) {
				this.level = this.levelList[index].text
			},
			//负责人
			persionclick(index) {
				this.persion = this.persionList[index].text
			},
			tabChange(index) {
				this.current = index;
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #F8F8F8;
	}

	.btn-fill {
		background-color: #0066CB;
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
