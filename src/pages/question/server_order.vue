<template>
	<view>
		<u-cell-item class="detail-head" bg-color="#fff" :title="q_list.title" :label="q_list.qNo" :border-bottom="false" :arrow="false">
			<u-tag slot="right-icon" :text="q_list.sta==0?'待处理':''"></u-tag>
		</u-cell-item>
		
		<u-cell-item class="task-tag" bg-color="#fff" title="问题提报" :arrow="false">
			<u-tag slot="icon" text="问" border-color="#FEB13D" bg-color="#FEB13D" color="#fff" shape="circle"></u-tag>
		</u-cell-item>

		<view>
			<u-cell-group title="已选择的工作对象" class="selected">
				<u-cell-item size="large" v-model="level" isLink :border-bottom="false" @click="LevelShow = true">
					<view slot="title">优先级<span class="color_red">*</span></view>
				</u-cell-item>
				<u-cell-item size="large" style='padding: 1px 17px;' :value="q_list.area" isLink :border-bottom="false">
					<view slot="title">服务区域 <span class="color_red">*</span></view>
				</u-cell-item>
				<u-cell-item title="位置" :arrow="true" :value="q_list.area2" :border-bottom="false"></u-cell-item>
				<u-cell-item title="设备 / 资产" :arrow="true" :value="q_list.assets" :border-bottom="false"></u-cell-item>
			</u-cell-group>
			<view class="reason_bg">
				<view class="title">
					<view>工单概述（必填）</view>
					<view :class="[q_list.inputBasicInfo.length == maxlength?'font_nums2':'font_nums']">({{q_list.inputBasicInfo.length + '/' + maxlength}})</view>
				</view>
				<view class="text_area">
					<textarea 
					 class="text_bg" 
					 placeholder-style="font-size: 24rpx;font-weight: 400;color: #D9D9D9;padding: 10rpx;"
					 :maxlength="maxlength"
					 placeholder="请填写异常问题"
					 rows="4"
					 cols="30"
					 v-model="q_list.inputBasicInfo"
					 :disabled="true">
					</textarea>
				</view>
				<view class="title" style="margin-top: 20rpx;">
					<view>详细描述（选填）</view>
					<view :class="[q_list.inputRemark.length == maxlength?'font_nums2':'font_nums']">({{q_list.inputRemark.length + '/' + maxlength}})</view>
				</view>
				<view class="text_area">
					<textarea 
					 class="text_bg" 
					 placeholder-style="font-size: 24rpx;font-weight: 400;color: #D9D9D9;padding: 10rpx;padding: 10rpx;"
					 :maxlength="maxlength"
					 placeholder="请描述问题或需求"
					 rows="4"
					 cols="30"
					 v-model="q_list.inputRemark">
					</textarea>
				</view>
				<view class="title" style="margin-top: 20rpx;border: none;margin-bottom: 0;">
					<view>添加照片(选填)</view>
				</view>
				<u-upload
					:fileList="q_list.inputList"
					@afterRead="afterRead"
					@delete="deletePic"
					name="1"
					multiple
					:maxCount="10"
				></u-upload>
				<u-cell-group title="" style="border: none;" class="iten_right">
					<u-cell-item title="申请人" :arrow="false" :value="q_list.requestName" :border-bottom="false"></u-cell-item>
					<u-cell-item title="申请时间" :arrow="false" :value="q_list.requestDate"></u-cell-item>
				</u-cell-group>
			</view>
			<view class="reason_bg">
				<view class="title" style="border: none;margin: 0;">
					<view>工作安排</view>
				</view>
				<u-cell-group title="" style="border: none;" class="iten_right">
					<u-cell-item title="负责人" :arrow="true" :value="q_list.principal" :border-bottom="false"></u-cell-item>
					<u-cell-item title="时间安排" :arrow="true" :value="q_list.requestDate"></u-cell-item>
					<u-cell-item size="large" style='padding: 2px 0;' title="需要工作负责人做最后确认" :arrow="false" :border-bottom="false">
						<u-switch slot="right-icon" v-model="q_list.checked" size="40"></u-switch>
					</u-cell-item>
				</u-cell-group>
			</view>
			<view class="zhanWei_h"></view>
			
		</view>
		<!-- 页脚 -->
		<view class="footerBtns">
			<u-row gutter="16" justify="center" style="padding: 20rpx 0;">
				<u-col span="1">
					<view class="demo-layout bg-purple"></view>
				</u-col>
				<u-col span="10">
					<view class="demo-layout bg-purple-light">
						<u-button type="primary" ripple @click="toConfirm">创建工单</u-button>
					</view>
				</u-col>
				<u-col span="1">
					<view class="demo-layout bg-purple-light"></view>
				</u-col>
			</u-row>
		</view>
		<!-- 提交成功的弹窗 -->
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
					创建成功
				</view>
				<view class="text_default margin-t-60">
					问题提报单已创建
				</view>
				<view class="text_default margin-t-10">
					可在首页【问题提报】中查看
				</view>
				<view class="btns_bg margin-t-60">
					<u-button size="medium" type="primary" :ripple="true" @click="toLook">返回首页</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			q_list: {
				title: '指示灯运行前观察闪烁不定',
				sta: 0,
				qNo: 'WT-00627-10',
				assets: '灯头组装机',
				area: '安徽金寨综合工厂',
				area2: '安徽金寨一号工厂一楼G5区',
				inputName: '',
				inputNum: '',
				checked: false,// 是否来源于物联网监测
				inputBasicInfo: '指示灯运行前观察闪烁不定',//工单概述（必填）
				inputRemark: '指示灯常开、常闭、闪烁及闪烁周期、不同颜色变化、多个 指示灯组合显示多样的状态信息',// 详细描述（选填）
				inputList: [],// 图片列表
				level: '紧急',
				reportingTime: '',// ti报时间
				reportingName: '',// 提报人
				principal: '李振兴',//负责人
				Overview: '',// 申请概述
				requestName: '李振兴',// 申请人
				requestDate: '2022-07-24  10：55：57',//申请时间
			},
			show1: false,//提交成功的弹窗
			maxlength: 80,
			checked: false,// 是否来源于物联网监测
			level: '正常', //级别
			LevelShow: false, //级别显示
			levelList: [
				{
					//级别组
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
			quesionDate: '2022-07-22', //提报时间
			dateMode: 'date', //提报时间
			detailList: {}, //设备详细信息
			checkItem: {}, //点检项目
			persion: '张三', //负责人
			persionShow: false, //负责人
			persionList: [
				//负责人
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
			persion_t: '张三', //负责人
			persionShow_t: false, //负责人
			persionList_t: [
				//负责人
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
			tabList: [
				{
					name: '基本'
				},
				{
					name: '检查项'
				}
			]
		};
	},
	onLoad(op) {
		// 拿到上个界面传过来的 id
		if (op.id) {
			console.log(`上个界面传过来的id为：${op.id}`);
		}
		// 设置顶部导航栏标题
		uni.setNavigationBarTitle({
		    //这是修改后的导航栏文字
		    title: "问题单（指示灯运行前观察)",
		    fontSize: '20rpx'
		})
	},
	methods: {
		toChange(){
			
		},
		toConfirm(){
			this.show1 = true
		},
		// 返回首页
		toLook(){
			uni.navigateBack({
				delta: 1
			})
		},
		change(status) {
			console.log(status);
		},
		// 查询设备
		findEqu(){
			uni.navigateTo({
				url:"/pages/question/findEquipment"
			})
			},
		//提交 提报单
		clickSubmit() {
			// uni.navigateBack(); //返回上一页
			this.show1 = true
		},
		//提报实际
		getDate(e) {
			this.quesionDate = e.result;
		},
		//级别选择
		clickLevel(index) {
			this.level = this.levelList[index].text;
		},
		//提报人
		persionclick_t(index) {
			this.persion_t = this.persionList_t[index].text;
		},
		//负责人
		persionclick(index) {
			this.persion = this.persionList[index].text;
		},
		tabChange(index) {
			this.current = index;
		},
		//------附件上传
		// 删除图片
					deletePic(event) {
						this[`fileList${event.name}`].splice(event.index, 1)
					},
					// 新增图片
					async afterRead(event) {
						// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
						let lists = [].concat(event.file)
						let fileListLen = this[`fileList${event.name}`].length
						lists.map((item) => {
							this[`fileList${event.name}`].push({
								...item,
								status: 'uploading',
								message: '上传中'
							})
						})
						for (let i = 0; i < lists.length; i++) {
							const result = await this.uploadFilePromise(lists[i].url)
							let item = this[`fileList${event.name}`][fileListLen]
							this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
								status: 'success',
								message: '',
								url: result
							}))
							fileListLen++
						}
					},
					//上传附件
					uploadFilePromise(url) {
						return new Promise((resolve, reject) => {
							let a = uni.uploadFile({
								url: 'http://192.168.2.21:7001/upload', // 仅为示例，非真实的接口地址
								filePath: url,
								name: 'file',
								formData: {
									user: 'test'
								},
								success: (res) => {
									setTimeout(() => {
										resolve(res.data.data)
									}, 1000)
								}
							});
						})
					},
				 //------附件上传
		
	}
};
</script>

<style lang="scss" scoped>
.selected{
	.u-cell{
		padding: 5rpx 40rpx;
	}
}
.iten_right{
	.u-cell{
		padding-left: 0;
		padding-right: 0;
	}
}
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
.pop_bg2{
	background-color: #FFFFFF;
	// height: 100%;
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
.color_red{
	color: red;
}
.zhanWei_h{
	height: 150rpx;
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
.reason_bg{
	width: 750rpx;
	height: vh;
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
			font-size: 24rpx;
			width: 100%;
			padding: 10rpx;
			color: #797979;
		}
	}
}
::v-deep .u-cell{
	border-bottom: 1rpx solid #f8f8f8;
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
	.u-tag{
		height: 50rpx;
		border: none;
		background-color: #F6FFED;
		color: #52C41A;
	}

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
