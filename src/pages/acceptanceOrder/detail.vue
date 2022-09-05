<template>
	<view>
		<!-- 顶部导航栏 -->
		<u-navbar
			back-icon-color="#FFFFFF"
			:back-text-style="{ color: '#FFFFFF' }"
			back-text="返回"
			title-size="50"
			:custom-back="toBack3"
			title-color="#FFFFFF"
			:background="{ backgroundColor: '#0066cb' }"
		>
			<view class="navbar-right" slot="right">
				<!-- 扫码 -->
				<view class="message-box right-item" style="padding-right: 30rpx;"><u-icon name="scan" color="#FFFFFF" size="40"></u-icon></view>
			</view>
		</u-navbar>
		<!-- 顶部导航栏 -->
		<u-cell-item class="detail-head" bg-color="#fff" :title="itm.MachineName" :label="itm.MachineGuid" :border-bottom="false" :arrow="false">
			<u-tag slot="right-icon" text="待处理"></u-tag>
		</u-cell-item>

		<u-cell-item class="task-tag" bg-color="#fff" title="验收" :arrow="false">
			<u-tag slot="icon" text="验" border-color="" bg-color="#0076FF" color="#fff" shape="circle"></u-tag>
		</u-cell-item>
		<u-tabs :list="tabList" :is-scroll="false" :current="current" @change="tabChange"></u-tabs>
		<view v-if="current === 0">
			<u-cell-group title="工作对象">
				<u-cell-item icon="setting" :title="itm.Machineid" :label="item.MachineName" :border-bottom="false"></u-cell-item>
				<u-cell-item icon="map" :title="itm.CostCenterID"></u-cell-item>
			</u-cell-group>
			<u-cell-group title="问题描述">
				<u-cell-item :border-bottom="false" :arrow="false">
					<u-read-more :toggle="true" :shadow-style="shadowStyle" :show-height="200" style="padding-bottom: 60rpx;">
						<rich-text :nodes="itm.CreateNote"></rich-text>
						<!-- 图片 -->
						<template v-if="fileList1.length > 0">
							<view class="list_question_bg" v-for="(item, index) in fileList1"><image class="img_bg" :src="item.url" mode="widthFix"></image></view>
						</template>
					</u-read-more>
				</u-cell-item>
			</u-cell-group>
			<!-- <u-cell-group title="申请概述">
				<u-cell-item  :border-bottom="false" :arrow="false">
					<u-read-more :toggle="true"  :shadow-style="shadowStyle" :show-height="200">
					<rich-text :nodes="item.mark"></rich-text>
					</u-read-more>
				</u-cell-item>
			</u-cell-group> -->
			<u-cell-group title="工作计划(暂定)">
				<u-row gutter="16" justify="center">
					<u-col span="4.7" style="color:grey;padding: 10rpx;">
						<u-row justify="center">{{ itm.PlanStartTime }}</u-row>
						<!-- <u-row justify="center" style="font-size: 35rpx;font-weight: 500;padding: 10rpx;">20：20</u-row> -->
					</u-col>
					<u-col span="1"></u-col>
					<u-col span="4.7" style="color:grey;">
						<u-row justify="center">{{ itm.PlanEndTime }}</u-row>
						<!-- <u-row justify="center" style="font-size: 35rpx;font-weight: 500;padding: 10rpx;">20：20</u-row> -->
					</u-col>
				</u-row>
				<u-row justify="center" style="margin-top: 10rpx;">
					<u-col
						span="11"
						style="border-top:1rpx solid #eeeeee;
					text-align: center;
					font-size: 24rpx;
					font-weight: 700;
					color: #000000;
					padding: 20rpx;"
					>
						实际开始时间：{{ itm.CreateTime }}
					</u-col>
				</u-row>
			</u-cell-group>
			<!-- 责任负责人 -->
			<u-cell-group title="责任负责人">
				<u-row gutter="16" justify="start">
					<u-col span="4" v-for="(item, index) in list_persons" style="margin-top: 20rpx;padding: 10rpx;">
						<view style="display: flex;flex-direction: row;padding-left: 22rpx;">
							<view class="img_icon"><u-image width="38rpx" height="38rpx" src="../../static/add/icon_people.png"></u-image></view>
							<view class="username">{{ item.UserName }}</view>
						</view>
					</u-col>
				</u-row>
			</u-cell-group>
			<!-- 实际工作时间 -->
			<u-cell-group title="实际工作时间">
				<u-row gutter="16" justify="start">
					<u-col
						span="6"
						style="margin-top: 20rpx;
					padding: 10rpx;
					padding-left: 35rpx;
					font-size: 24rpx;
					font-weight: 400;
					color: #a7a7a7;"
					>
						开始时间
					</u-col>
					<u-col
						span="6"
						style="margin-top: 20rpx;
					padding: 10rpx;
					padding-left: 35rpx;
					font-size: 24rpx;
					font-weight: 400;
					color: #a7a7a7;"
					>
						{{ itm.CreateTime }}
					</u-col>
				</u-row>
				<u-row gutter="16" justify="start">
					<u-col
						span="6"
						style="margin-top: 20rpx;
					padding: 10rpx;
					padding-left: 35rpx;
					font-size: 24rpx;
					font-weight: 400;
					color: #a7a7a7;"
					>
						结束时间
					</u-col>
					<u-col
						span="6"
						style="margin-top: 20rpx;
					padding: 10rpx;
					padding-left: 35rpx;
					font-size: 24rpx;
					font-weight: 400;
					color: #a7a7a7;"
					>
						{{ itm.RepairEndTime }}
					</u-col>
				</u-row>
			</u-cell-group>
			<!-- 添加故障原因 -->
			<view class="add_reason">
				<view class="title">请添加故障原因</view>
				<view class="btn"><image class="img" src="../../static/add/detail_icon_add.png" mode="widthFix"></image></view>
			</view>
			<!-- 原因解决的图片 -->
			<view class="reason_bg2">
				<view class="title"><view>维修图片</view></view>
				<!-- 图片 -->
				<template v-if="fileList1.length > 0">
					<view class="list_question_bg" v-for="(item, index) in fileList2"><image class="img_bg" :src="item.url" mode="widthFix"></image></view>
				</template>
			</view>
			<!-- 故障原因 -->
			<view class="reason_bg">
				<view class="title">
					<view>故障原因</view>
					<view :class="[RepairReason.length == maxlength ? 'font_nums2' : 'font_nums']">({{ RepairReason.length + '/' + maxlength }})</view>
				</view>
				<view class="text_area">
					<textarea
						class="text_bg"
						placeholder-style="font-size: 24rpx;font-weight: 400;color: #D9D9D9;"
						:maxlength="maxlength"
						placeholder="请填写故障原因"
						rows="4"
						cols="30"
						:disabled="true"
						v-model="itm.RepairReason"
					></textarea>
				</view>
			</view>
			<!-- 维修记录 -->
			<view class="reason_bg">
				<view class="title">
					<view>维修记录(必填)</view>
					<view :class="[RepairMark.length == maxlength ? 'font_nums2' : 'font_nums']">({{ RepairMark.length + '/' + maxlength }})</view>
				</view>
				<view class="text_area">
					<textarea
						class="text_bg"
						placeholder-style="font-size: 24rpx;font-weight: 400;color: #D9D9D9;"
						:maxlength="maxlength"
						placeholder="请填写维修记录"
						rows="4"
						cols="30"
						:disabled="true"
						v-model="itm.RepairMark"
					></textarea>
				</view>
			</view>
			<!-- 五星好评 -->
			<view class="reason_bg_rate">
				<view class="title">
					<view>打分(1-5星对应1-5分)</view>
				</view>
				<view class="text_area">
					<u-rate :count="countRate" v-model="inputRate" gutter="50"></u-rate>
				</view>
			</view>
			<!-- 已经到底了 -->
			<u-divider bgColor="#f5f5f5">已经到底了</u-divider>
			<view class="zhanWei_height"></view>
			<!-- 页脚-基本 -->
			<!-- 页脚-基本 -->
			<view class="footerBtns">
				<u-row gutter="16" justify="center" style="padding: 20rpx 0;">
					<u-col span="0.5"><view class="demo-layout bg-purple"></view></u-col>
					<!-- <u-col span="5.5">
		 						<view class="demo-layout bg-purple-light">
		 							<u-button plain ripple type="primary" class="btn_l" @click="toChange">
		 								<view class="">改派工单</view>
		 							</u-button>
		 						</view>
		 					</u-col> -->
					<u-col span="12" v-if="b_agree">
						<view class="footerBtns">
							<u-row gutter="16" justify="center" style="padding: 20rpx 0;">
								<u-col span="0.5"><view class="demo-layout bg-purple"></view></u-col>
								<u-col span="5.5">
									<view class="demo-layout bg-purple-light">
										<u-button plain ripple type="primary" class="btn_l" @click="toAdd">
											<!-- <view class="btn_l_jia">+</view> -->
											<view class="">同意</view>
										</u-button>
									</view>
								</u-col>
								<u-col span="5.5">
									<view class="demo-layout bg-purple-light"><u-button type="error" ripple @click="toReturn">不同意</u-button></view>
								</u-col>
								<u-col span="0.5"><view class="demo-layout bg-purple-light"></view></u-col>
							</u-row>
						</view>
					</u-col>
					<!-- 弹窗关闭-确认完工 -->
					<u-popup v-model="isComfire" mode="bottom" border-radius="24">
						<view class="pop_close_bg">
							<view class="text1">确认完工？</view>
							<view class="text2">
								任务完成了，
								<span style="color: red;">有无需要退还的物料？</span>
							</view>
							<view class="text3">执行【确认完工】后，任务将会关闭，无法进行退料操作</view>
							<view class="btns_bg">
								<u-tag class="btn" @click="toCancel" text="取消" mode="plain" />
								<u-tag class="btn" @click="toComfire" text="确认完工" mode="plain" />
							</view>
						</view>
					</u-popup>
					<u-col span="0.5"><view class="demo-layout bg-purple-light"></view></u-col>
				</u-row>
			</view>
		</view>

		<view v-if="current === 1">
			<u-cell-group title="预留单">
				<!-- 无订单号时的界面 -->
				<template v-if="orderNos == 0">
					<u-row gutter="16" justify="center"><u-col span="12" text-align="center" style="margin-top: 25rpx;background-color: antiquewhite;">暂无物料需求</u-col></u-row>
					<u-row gutter="16" justify="center">
						<u-col span="8.5"><u-button :custom-style="customStyle" plain @tap="toAddMaterial">添加物料需求</u-button></u-col>
					</u-row>
				</template>
				<!-- 有订单号时的界面 -->
				<template v-else>
					<!-- 单号列表 -->
					<view class="order_list1">
						<view class="list_item" v-for="(item, index) in order_list1" :key="index" @click="toManage(item.status, item.orderNo)">
							<view class="list_item_l">
								<view class="img"><image src="../../static/add/icon_component.png" mode="widthFix"></image></view>
								<view class="title">单号：</view>
								<view class="bh">{{ item.orderNo }}</view>
							</view>
							<view class="list_item_r">
								<view class="status">{{ item.status }}</view>
								<view class="img"><image src="../../static/add/detail_icon_chevron_more.png" mode="widthFix"></image></view>
							</view>
						</view>
					</view>
				</template>
			</u-cell-group>
			<!-- 退料单 -->
			<template v-if="orderNos > 0">
				<u-cell-group title="退料单">
					<!-- 单号列表 -->
					<view class="order_list1">
						<view class="list_item" v-for="(item, index) in order_list2">
							<view class="list_item_l">
								<view class="img"><image src="../../static/add/icon_component.png" mode="widthFix"></image></view>
								<view class="title">单号：</view>
								<view class="bh">{{ item.orderNo }}</view>
							</view>
							<view class="list_item_r">
								<view class="status">{{ item.status }}</view>
								<view class="img"><image src="../../static/add/detail_icon_chevron_more.png" mode="widthFix"></image></view>
							</view>
						</view>
					</view>
					<!-- 已经到底了 -->
					<u-divider bgColor="#f5f5f5">已经到底了</u-divider>
					<!-- 占位 -->
					<view class="zhanWei_height"></view>
					<!-- 底部按钮 -->
					<view class="footerBtns">
						<u-row gutter="16" justify="center" style="padding: 20rpx 0;">
							<u-col span="0.5"><view class="demo-layout bg-purple"></view></u-col>
							<u-col span="5.5"><view class="demo-layout bg-purple-light"></view></u-col>
							<u-col span="0.5"><view class="demo-layout bg-purple-light"></view></u-col>
						</u-row>
					</view>
				</u-cell-group>
			</template>
		</view>
		<!-- 人员 -->
		<view v-if="current === 2">
			<u-cell-group title="人工">
				<template v-if="list_persons.length == 0">
					<u-row gutter="16">
						<u-col span="12" text-align="center"><view>暂无相关内容</view></u-col>
					</u-row>
				</template>
				<template else>
					<u-row gutter="16" justify="start">
						<u-col span="4" v-for="(item, index) in list_persons" style="margin-top: 20rpx;">
							<view style="display: flex;flex-direction: row;padding-left: 22rpx;">
								<view class="img_icon"><u-image width="38rpx" height="38rpx" src="../../static/add/icon_people.png"></u-image></view>
								<view class="username">{{ item.UserName }}</view>
							</view>
						</u-col>
					</u-row>
				</template>
				<u-row gutter="16" justify="center"></u-row>
			</u-cell-group>
		</view>
		<view v-if="current === 3">
			<u-cell-group title="关联单号">
				<template v-if="list_persons.length == 0">
					<u-row gutter="16">
						<u-col span="12" text-align="center"><view>暂无相关内容</view></u-col>
					</u-row>
				</template>
				<template else>
					<view class="order_list1">
						<view class="list_item" v-for="(item, index) in association_list">
							<view class="list_item_l">
								<view :class="[item.sta == 0 ? 'circle' : 'circle1']" class="img">{{ item.sta == 0 ? '问' : '申' }}</view>
								<view class="title">单号：</view>
								<view class="bh">{{ item.orderNo }}</view>
							</view>
							<view class="list_item_r">
								<!-- <view class="status">{{item.status==0?'已退料':'待退料'}}</view> -->
								<view class="img"><image src="../../static/add/detail_icon_chevron_more.png" mode="widthFix"></image></view>
							</view>
						</view>
					</view>
				</template>
			</u-cell-group>
		</view>
		<u-toast ref="uToast" />
		<u-popup v-model="show" mode="center" border-radius="14" width="500rpx">
				<view class="reason_bg">
					<view class="title">
						<view>
							拒绝原因(
							<span style="color: red;">必填</span>
							)
						</view>
						<view :class="[RepairMark.length == maxlength ? 'font_nums2' : 'font_nums']">({{ RepairMark.length + '/' + maxlength }})</view>
					</view>
					<view class="text_area">
						<textarea
							class="text_bg2"
							placeholder-style="font-size: 24rpx;font-weight: 400;color: #D9D9D9;width: 500rpx;"
							:maxlength="maxlength"
							placeholder="请填写不同意的原因"
							rows="4"
							cols="30"
							v-model="rejectReason"
						></textarea>
					</view>
					<u-button style="margin-top: 40rpx;" type="primary" @click="submit">提交</u-button>
				</view>
		</u-popup>
	</view>
</template>

<script>
import { CloseOrderReport, GetWorkUser, SetMachineRepairWorkCX, GetFittingUseOrder, GetFittingUseOrderMain, OnGetImage } from './api';
import { SubmitRepairReport, GetOrderReport } from '@/plugin/api';
export default {
	data() {
		return {
			countRate: 5,//有几颗星星可选
			inputRate: 2,//评分1-5分
			rejectReason: '', //不同意的原因
			show: false,
			action: '/img/esp-api/pic/upload', //上传地址
			content: ``,
			fileList1: [], // 图片展示...问题
			fileList2: [], // 图片展示...维修单
			show1: false,
			isComfire: false,
			RepairMark: '', //维修记录
			RepairReason: '', //故障原因
			maxlength: 200,
			shadowStyle: {
				backgroundImage: 'linear-gradient(-1200deg, rgba(255, 255, 255, 0) 0%, #fff 200%)',
				paddingTop: '300rpx',
				marginTop: '-300rpx'
			},
			list_persons: [
				{
					UserName: '诸葛小小'
				}
			],
			order_list1: [], //领用单
			order_list2: [], //退料单
			association_list: [], //关联单号
			orderNos: 1, //预留单数量
			itm: {
				nextday: '2022-07-18',
				MTName: '',
				MTGuid: '',
				PlanStartTime: '', //计划开始时间
				PlanEndTime: '', //计划结束时间
				CreateTime: '', //实际开始时间
				RepairStartTime: '', //实际工作时间
				RepairEndTime: '', //
				CostCenterID: '',
				CreateNote: ''
			}, //保养基本信息
			MTGuid: '',
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
					name: '物品'
				},
				{
					name: '人工'
				},
				{
					name: '关联'
				}
			],
			obj: {}, //上一页传过来的参数
			toBack3: function() {
				uni.reLaunch({
					url: '/pages/acceptanceOrder/index'
				});
			},
			formData: {
				FileURL2: '', //图片url
				FileName2: '' //图片名称
			},
			b_agree: false, //同意
			b_noAgree: false //不同意
		};
	},
	onLoad(e) {
		this.item = JSON.parse(decodeURIComponent(e.item));
		// // 查询已经添加的人员
		console.log(JSON.parse(decodeURIComponent(e.item)));
		const itm = JSON.parse(decodeURIComponent(e.item));
		this.obj = itm;
		// this.itm.MTGuid = itm.MachineGuid;
		// this.itm.MTName = itm.MachineName;
		this.itm.PlanStartTime = itm.PlanStartTime;
		this.itm.PlanEndTime = itm.PlanEndTime;
		this.itm.CreateTime = itm.CreateTime;
		this.itm.RepairStartTime = itm.RepairStartTime;
		this.itm.RepairEndTime = itm.RepairEndTime;
		this.itm.CostCenterID = itm.CostCenterID;
		this.itm.CreateNote = itm.CreateNote;

		console.log(this.itm.MTGuid);
		// 获取维修信息
		GetOrderReport({
			UserGuid: uni.getStorageSync('userInfo').UserGuid,
			QueryNote: this.item.FatherOrder,
			Type: '维修单',
			UserType: '2',
			Astatus: ''
		}).then(res => {
			console.log('牛啊' + res.data.data[0]["Guid"]);
			this.itm = res.data.data[0]
			this.showLoading = false;
			// console.log(this.listData);
			//维修图片
			OnGetImage({
				OrderGuid: this.itm.orderNo,
				Type: '维修单'
			}).then(res => {
				for (let i = 0; i < res.data.data.length; i++) {
					this.fileList2.push({
						FileName: res.data.data[i].FileName,
						url: res.data.data[i].FileURL
					});
				}
			});

			//问题图片
			OnGetImage({
				OrderGuid: this.itm.FatherOrder,
				Type: '问题提报单'
			}).then(res => {
				for (let i = 0; i < res.data.data.length; i++) {
					this.fileList1.push({
						url: res.data.data[i].FileURL
					});
				}
			});
		});
		console.log('666:' + JSON.stringify(this.itm));
	},
	onShow() {
		this.getWorkUser();
		this.getMaterial();
		this.setRole();
	},
	methods: {
		//设置权限
		setRole() {
			this.b_agree = false;
			this.b_noAgree = false;
			//操作是自己 可以使用所有按钮
			// if(this.item.CreateUserNumber==uni.getStorageSync('userInfo').UserNumber&&this.item.Astatus=="创建")
			// {
			// 	this.b_addPersion=true;
			// 	this.b_addMaterial=true;
			// 	this.b_confirm=true;
			// }
			// 操作员是主管 没有权限
			if (uni.getStorageSync('userInfo').leader.includes(uni.getStorageSync('userInfo').UserNumber.trim()) && this.item.Astatus == '创建') {
				this.b_agree = true;
			}
			// // 操作员维修 可以使用所有按钮
			//  if(uni.getStorageSync('userInfo').UserClass=="1"&&this.item.Astatus=="创建")
			//  {
			// 	this.b_addPersion=true;
			// 	this.b_addMaterial=true;
			// 	this.b_confirm=true;
			//  }
			// 操作员 是成员 可以使用所有按钮
			// let had=false;
			// this.list_persons.map(item=>{
			//  if(item.UserName==uni.getStorageSync('userInfo').UserName)
			//  {
			//   had=true
			//  }
			// })
			//  if(had&&this.item.Astatus=="创建")
			//  {
			// 	this.b_addPersion=true;
			// 	this.b_addMaterial=true;
			// 	this.b_confirm=true;
			//  }
		},
		//日期转换
		dateFormat(fmt, date) {
		    let ret;
		    const opt = {
		        "Y+": date.getFullYear().toString(),        // 年
		        "m+": (date.getMonth() + 1).toString(),     // 月
		        "d+": date.getDate().toString(),            // 日
		        "H+": date.getHours().toString(),           // 时
		        "M+": date.getMinutes().toString(),         // 分
		        "S+": date.getSeconds().toString()          // 秒
		        // 有其他格式化字符需求可以继续添加，必须转化成字符串
		    };
		    for (let k in opt) {
		        ret = new RegExp("(" + k + ")").exec(fmt);
		        if (ret) {
		            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
		        };
		    };
		    return fmt;
		},
		// 不同意提交
		submit() {
			
			if (this.rejectReason != '') {
				uni.showLoading({
					title: '提交中...'
				});
				setTimeout(() => {
					uni.hideLoading();
					;
					// 关闭订单
					CloseOrderReport({
						MachineGuid: this.item.MachineGuid,
						UpdateUserGuid: uni.getStorageSync('userInfo').UserGuid,
						orderNo: this.item.orderNo,
						Status: '2'
					}).then(res => {
						console.log(res.data);
						uni.showToast({
							title: '提交成功',
							type: 'success'
						});
						uni.reLaunch({
							url: '/pages/acceptanceOrder/index'
						});
					});
					
					// let imgsName="";
					// let imgsUrl="";
					// this.fileList2.map(item=>{
					// 	imgsUrl=imgsUrl+item.url
					// 	imgsName=imgsName+ item.FileName
					// })
					SubmitRepairReport({
						MachineGuid: this.itm.MachineGuid, //设备Guid
						CreateNote:
							this.itm.CreateNote +
							'\n ' +
							this.dateFormat('YYYY-mm-dd HH:MM', new Date()) +
							'\n ' +
							uni.getStorageSync('userInfo').UserName +
							' 的验收意见:' +
							'\n ' +
							this.rejectReason, //创建单据时的说明
						UpdateUserGuid: this.itm.CreateUserGuid, //	提交用户
						Level: '', //this.formData.Level,//	问题等级
						FileURL: '',
						FileName: '',
						BasicInfo: this.itm.BasicInfo,
						FatherOrder: this.itm.FatherOrder,
						PlanStartTime: '',
						PlanEndTime: '',
						OrderNo: ''
					}).then(res => {
						// console.log(JSON.stringify(res));
						console.log(res.data.data);
						this.orderNo = res.data.data[0].orderNo;
						//发送企业微信信息
						sendQYWX('1000031', '122675', '测试title7', '描述', '2', 'http://localhost:8099/sso/qyWeixinAuth/getUserId?state=1000031&orderNo=' + this.orderNo);
					});
				}, 1500);
				//dosomthing
				this.show = false;
				return;
			}
			this.$refs.uToast.show({
				title: '原因必填！',
				type: 'error'
			});
		},

		//图片上传后返回
		beforeUpload(data, index, lists, name) {
			this.formData.FileURL2 = this.formData.FileURL2 + ';' + lists[index].response.url;
			this.formData.FileName2 = this.formData.FileName2 + ';' + lists[index].file.name;
			console.log(this.formData);
		},
		//查询物料清单
		getMaterial() {
			;
			GetFittingUseOrderMain({
				FatherOrderNo: this.item.FatherOrder
			}).then(res => {
				this.order_list1 = res.data.data;
				// this.order_list1.map(item=>{
				// 	item.orderNo=item.orderNo
				// })
			});
		},
		//查询已经添加的人员
		getWorkUser() {
			GetWorkUser({
				orderNo: this.item.FatherOrder,
				Type: '维修单'
			}).then(res => {
				this.list_persons = res.data.data;
			});
		},
		toBack() {
			uni.redirectTo({
				url: 'index'
			});
			this.show1 = false;
		},
		toLook() {
			this.show1 = false;
		},
		// 是否完工
		toCancel() {
			this.isComfire = false;
		},
		toComfire() {
			uni.showLoading({
				title: ''
			});
			SetMachineRepairWorkCX({
				orderNo: this.item.orderNo,
				MachineGuid: this.item.MachineGuid,
				UpdateUserGuid: uni.getStorageSync('userInfo').UserGuid, //	提交用户
				RepairMark: this.RepairMark,
				RepairReason: this.RepairReason,
				FileURL: this.formData.FileURL2,
				FileName: this.formData.FileName2
			}).then(res => {
				uni.hideLoading();
				this.isComfire = false;
				this.show1 = true;
				//发送企业微信信息
				this.QYWX.sendQYWX({
					toUsers: '122675',
					title: this.item.MachineName,
					des: this.item.CreateNote,
					img:'question',
					url: res.data.data.orderNo
				});
			});
		},
		// 确认工单
		toConfirm() {
			//dosomething
			if (this.RepairMark == '') {
				this.$refs.uToast.show({
					title: '故障原因必填！',
					type: 'error',
					icon: false
				});
				return;
			}
			if (this.RepairReason == '') {
				this.$refs.uToast.show({
					title: '维修记录必填！',
					type: 'error',
					icon: false
				});
				return;
			}
			this.isComfire = true;
		},
		// 改派工单
		toChange() {
			//dosomething
		},
		// 添加物料
		toAdd() {
			uni.navigateTo({
				url: './addMaterial?item=' + encodeURIComponent(JSON.stringify(this.item))
			});
		},
		// 同意
		toAdd() {
			;
			CloseOrderReport({
				MachineGuid: this.item.MachineGuid,
				UpdateUserGuid: uni.getStorageSync('userInfo').UserGuid,
				orderNo: this.item.orderNo,
				Status: '1'
			}).then(res => {
				uni.showToast({
					title: '保存成功',
					duration: 1000
				});
				uni.redirectTo({
					url: '/pages/acceptanceOrder/index'
				});
			});
		},
		// 不同意
		toReturn() {
			// console.log('2424');
			this.show = true;
		},

		// 管理物料	1-已领用，2-待领用，3-待审批
		toManage(sta, orderNo) {
			;
			if (sta == '创建') {
				console.log(`待审批,单号为：${orderNo}`);
				uni.navigateTo({
					url: './material_manage?orderNo=' + orderNo
				});
				return;
			}
			if (sta == '领用' || 2) {
				console.log(`单号为：${orderNo}`);
				uni.navigateTo({
					url: 'return_material'
				});
				return;
			}
		},
		//拍照
		clickScan() {},
		//添加物料
		toAddMaterial() {
			uni.navigateTo({
				url: './addMaterial?item=' + encodeURIComponent(JSON.stringify(this.item))
			});
		},
		//
		toAddPersons() {
			uni.navigateTo({
				url: './addPersions?item=' + encodeURIComponent(JSON.stringify(this.item))
			});
		},
		tabChange(index) {
			this.current = index;
		}
	}
};
</script>

<style lang="scss" scoped>
.u-size-default {
	padding: 10rpx 8rpx;
}
.pop_bg2 {
	background-color: #ffffff;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	.img_success {
		margin-top: 60rpx;
		img {
			width: 350rpx;
			height: 350rpx;
		}
	}
	.text_success {
		font-size: 40rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
	}
	.text_default {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #8c8c8c;
		line-height: 40rpx;
	}
	.margin-t-60 {
		margin-top: 60rpx;
	}
	.margin-t-10 {
		margin-top: 10rpx;
	}
	.btns_bg {
		display: flex;
		flex-direction: row;
		justify-content: center;
		padding: 20rpx;
		.zhanWei_w {
			width: 20rpx;
		}
	}
}
.list_question_bg {
	width: 100%;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	.img_bg {
		width: 560rpx;
		background-color: #bfbfbf;
		border: 1rpx solid #63bbf8;
		display: inline;
		margin-top: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
.pop_close_bg {
	background-color: #bfbfbf;
	width: 100%;
	// height: 395rpx;
	background: #ffffff;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	padding: 39rpx;
	.text1 {
		font-size: 40rpx;
		font-weight: bold;
		color: #000000;
		margin: 40rpx 0;
	}
	.text2 {
		font-size: 24rpx;
		font-weight: 400;
		color: #0066cb;
	}
	.text3 {
		margin: 20rpx 0 60rpx 0;
		font-size: 24rpx;
		font-weight: 400;
		color: #8c8c8c;
		text-align: center;
	}
	.btns_bg {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
		border-top: 1rpx solid #f0f0f0;
		// background-color: #0066CB;
		width: 670rpx;
		height: 100rpx;
		.btn {
			flex: 1;
			border: none;
			border-radius: 0;
			text-align: center;
			font-weight: bold;
		}
		.btn:first-child {
			border-right: 1rpx solid #f0f0f0;
			color: #bfbfbf;
		}
	}
}
.add_reason {
	background-color: #ffffff;
	margin-top: 20rpx;
	display: flex;
	justify-content: space-between;
	padding: 20rpx 30rpx;
	.title {
		font-size: 30rpx;
		font-weight: bold;
		color: #000000;
	}
	.btn {
		width: 88rpx;
		height: 48rpx;
		background: #e5effa;
		border-radius: 24rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		.img {
			width: 20rpx;
			height: 20rpx;
			display: block;
		}
	}
}
.reason_bg_rate{
	// height: 200rpx;
	background: #ffffff;
	box-shadow: 0px 3px 18px 0px rgba(233, 241, 249, 0.6);
	margin: 24rpx 0rpx;
	padding: 30rpx 20rpx;
	.title {
		margin-bottom: 10rpx;
		border-bottom: 1rpx solid #f0f0f0;
		font-size: 30rpx;
		font-weight: bold;
		color: #000000;
		line-height: 50rpx;
		display: flex;
		justify-content: space-between;
	}
}

.reason_bg {
	// width: 750rpx;
	height: 400rpx;
	background: #ffffff;
	box-shadow: 0px 3px 18px 0px rgba(233, 241, 249, 0.6);
	margin: 24rpx 0rpx;
	padding: 30rpx 20rpx;
	.title {
		margin-bottom: 10rpx;
		border-bottom: 1rpx solid #f0f0f0;
		font-size: 30rpx;
		font-weight: bold;
		color: #000000;
		line-height: 50rpx;
		display: flex;
		justify-content: space-between;
		.font_nums {
			color: #8c8c8c;
			font-weight: 500;
			margin-right: 10rpx;
		}
		.font_nums2 {
			color: red;
			font-weight: 500;
			margin-right: 10rpx;
		}
	}
	.text_area {
		.text_bg {
			width: 672rpx;
			height: 148rpx;
			border: 1rpx solid #f0f0f0;
			padding: 10rpx;
			font-size: 24rpx;
		}
		.text_bg2 {
			width: 430rpx;
			height: 148rpx;
			border: 1rpx solid #f0f0f0;
			padding: 10rpx;
			font-size: 24rpx;
		}
	}
}
.reason_bg2 {
	width: 750rpx;
	height: vh;
	background: #ffffff;
	box-shadow: 0px 3px 18px 0px rgba(233, 241, 249, 0.6);
	margin: 24rpx 0rpx;
	padding: 30rpx 31.5rpx;
	.title {
		margin-bottom: 10rpx;
		border-bottom: 1rpx solid #f0f0f0;
		font-size: 30rpx;
		font-weight: bold;
		color: #000000;
		line-height: 50rpx;
		display: flex;
		justify-content: space-between;
		.font_nums {
			color: #8c8c8c;
			font-weight: 500;
			margin-right: 10rpx;
		}
		.font_nums2 {
			color: red;
			font-weight: 500;
			margin-right: 10rpx;
		}
	}
	.text_area {
		.text_bg {
			width: 672rpx;
			height: 148rpx;
			border: 1rpx solid #f0f0f0;
			padding: 10rpx;
			font-size: 24rpx;
		}
	}
}
.u-mode-light-primary {
	color: #52c41a;
	border: none;
	background-color: #f6ffed;
}
.footerBtns {
	position: fixed;
	bottom: 0;
	background-color: #ffffff;
	width: 100vw;
	height: 120rpx;
	border-top: 1rpx solid #cccccc;
	font-weight: 2000;
	letter-spacing: 3rpx;
	.btn_l {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		.btn_l_jia {
			margin-right: 15rpx;
			font-size: 40rpx;
			margin-bottom: 5rpx;
		}
	}
	.btn_l_jia {
		margin-right: 15rpx;
		font-size: 40rpx;
	}
}
.zhanWei_height {
	height: 200rpx;
	background-color: #f8f8f8;
}
.order_list1 {
	box-sizing: border-box;
	padding: 30rpx;
	.list_item {
		background-color: #e5effa;
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
		.list_item_l {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			.img {
				margin-right: 15rpx;
				image {
					width: 38rpx;
					height: 38rpx;
				}
			}
			.circle {
				width: 44rpx;
				height: 44rpx;
				border-radius: 50%;
				background: linear-gradient(-37deg, #feb13d 0%, #f77412 100%);
				font-weight: bold;
				color: #ffffff;
				text-align: center;
				line-height: 44rpx;
			}
			.circle1 {
				width: 44rpx;
				height: 44rpx;
				border-radius: 50%;
				background: linear-gradient(-37deg, #168be4 0%, #63bbf8 100%);
				font-size: 1rpx;
				font-weight: bold;
				color: #ffffff;
				text-align: center;
				line-height: 44rpx;
			}
		}
		.list_item_r {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			.img {
				margin-left: 15rpx;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				image {
					width: 20rpx;
					height: 40rpx;
					display: inline-block;
				}
			}
		}
	}
}
page {
	background-color: #f8f8f8;
}

.btn-fill {
	background-color: #0066cb;
	height: 88rpx;
	border-radius: 12rpx;
}

.username {
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
