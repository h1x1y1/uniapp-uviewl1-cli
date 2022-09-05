<template>
	<view>
		<u-navbar back-icon-color="#FFFFFF" :back-text-style="{ color: '#FFFFFF' }" back-text="返回" :custom-back="toBack"
			:background="{ backgroundColor: '#0066cb' }"></u-navbar>

		<view>
			<u-cell-item size="large" style="padding: 1px 17px;background-color: #FFFFFF;" :value="formData.orderNo" :border-bottom="false">
				<view slot="title">
					单号
				</view>
			</u-cell-item>
			<u-cell-item size="large" style="padding: 1px 17px;background-color: #FFFFFF;" :value="formData.Astatus" isLink
				:border-bottom="false">
				<view slot="title">
					状态
				</view>
			</u-cell-item>


			<u-cell-group title="来源明细" style="margin-top: 0;" lable="11">
				<u-cell-item size="large" style="padding: 1px 17px;"
					:value="formData.Machineid + '---' + formData.MachineName" isLink :border-bottom="false"
					@tap="findEqu">
					<view slot="title">
						设备资产
						<span class="color_red">*</span>
					</view>
				</u-cell-item>
				<u-cell-item size="large" style="padding: 1px 17px;" :value="formData.CostCenterID" isLink
					:border-bottom="false" @tap="findEqu">
					<view slot="title">
						服务区域
						<span class="color_red">*</span>
					</view>
				</u-cell-item>
				<!-- <u-cell-item size="large" style="padding: 1px 17px;" title="对应仪表" :arrow="false" :border-bottom="false">
					<u-input slot="right-icon" placeholder="请输入" :clearable="true" input-align="right"></u-input>
				</u-cell-item>
				<u-cell-item size="large" style="padding: 1px 17px;" title="对应仪表读数" :arrow="false" :border-bottom="false">
					<u-input slot="right-icon" placeholder="请输入" :clearable="true" input-align="right"></u-input>
				</u-cell-item> 
			 	<u-cell-item size="large" style="padding: 2px 17px;" title="是否来源于物联网监测" :arrow="false" :border-bottom="false">
					<u-switch slot="right-icon" v-model="checked" size="40"></u-switch>
				</u-cell-item> -->
			</u-cell-group>
			<view class="reason_bg">
				<view class="title">
					<view>基础信息</view>
					<view :class="[formData.BasicInfo.length == maxlength ? 'font_nums2' : 'font_nums']">
						({{ formData.BasicInfo.length + '/' + maxlength }})</view>
				</view>
				<view class="text_area">
					<textarea class="text_bg" placeholder-style="font-size: 24rpx;font-weight: 400;color: #D9D9D9;"
						:maxlength="maxlength" placeholder="请填写异常问题" rows="4" cols="30"
						v-model="formData.BasicInfo"></textarea>
				</view>
				<view class="title" style="margin-top: 20rpx;">
					<view>描述</view>
					<view :class="[formData.CreateNote.length == maxlength ? 'font_nums2' : 'font_nums']">
						({{ formData.CreateNote.length + '/' + maxlength }})</view>
				</view>
				<view class="text_area">
					<textarea class="text_bg" placeholder-style="font-size: 24rpx;font-weight: 400;color: #D9D9D9;"
						:maxlength="maxlength" placeholder="请描述问题或需求" rows="4" cols="30"
						v-model="formData.CreateNote"></textarea>
				</view>
				<u-row style="padding-top: 20rpx;">
					<u-col span="10">是否停机(默认不停机)</u-col>
					<u-col span="2">
						<u-switch v-model="level"></u-switch>
					</u-col>
				</u-row>
				<view class="title" style="margin-top: 20rpx;border: none;margin-bottom: 0;">
					<view>添加照片(选填)</view>
				</view>
				<u-upload @on-remove="onRemove" :max-size="10  * 1024 * 1024" max-count="6" name="uploadFile"
					ref="uUpload" :fileList="fileList1" :action="action" :auto-upload="true" @on-change="beforeUpload">
				</u-upload>
				<!-- <u-cell-group title="" style="border: none;" class="iten_right">
					<u-action-sheet :list="levelList" v-model="LevelShow" @click="clickLevel"></u-action-sheet>
					<u-cell-item size="large" title="优先级" v-model="level" isLink :border-bottom="false" @click="LevelShow = true"></u-cell-item>
					<u-calendar v-model="Dateshow" :mode="dateMode" @change="getDate"></u-calendar>
					<u-cell-item size="large" title="提报时间" v-model="quesionDate" isLink :border-bottom="false" @click="Dateshow = true"></u-cell-item>
					<u-action-sheet :list="persionList_t" v-model="persionShow_t" @click="persionclick_t"></u-action-sheet>
					<u-cell-item size="large" title="提报人" v-model="persion_t" isLink :border-bottom="false" @click="persionShow_t = true"></u-cell-item>
					<u-action-sheet :list="persionList" v-model="persionShow" @click="persionclick"></u-action-sheet>
					<u-cell-item size="large" title="负责人" v-model="persion" isLink :border-bottom="false" @click="persionShow = true"></u-cell-item>
				</u-cell-group> -->
			</view>
			<view class="zhanWei_h"></view>
		</view>
		<!-- 页脚 -->
		<view class="footerBtns">
			<u-row gutter="16" justify="center" style="padding: 20rpx 0;">
				<u-col span="0.5">
					<view class="demo-layout bg-purple"></view>
				</u-col>
				<u-col span="3.5" v-if="b_close">
					<view class="demo-layout bg-purple-light">
						<u-button ripple type="error" class="btn_l" @click="toClose">
							<view class="">关闭问题单</view>
						</u-button>
					</view>
				</u-col>
				<u-col span="3.5" v-if="b_save">
					<view class="demo-layout bg-purple-light">
						<u-button type="primary" ripple @click="save">修改保存</u-button>
					</view>
				</u-col>
				<u-col span="3.5" v-if="b_agree">
					<view class="demo-layout bg-purple-light">
						<u-button type="primary" ripple @click="agree">同意维修</u-button>
					</view>
				</u-col>
				<u-col span="3.5" v-if="b_create">
					<view class="demo-layout bg-purple-light">
						<u-button type="primary" ripple @click="toConfirm">创建维修单</u-button>
					</view>
				</u-col>
				<u-col span="0.5">
					<view class="demo-layout bg-purple-light"></view>
				</u-col>
			</u-row>
		</view>
		<!-- 提交成功的弹窗 -->
		<u-popup v-model="show1" mode="center" :border-radius="14" width="85%" height="65%" :closeable="true">
			<view class="pop_bg2">
				<view class="img_success"><img src="../../static/pop/Popup_success.png" alt="成功的图片提示" /></view>
				<view class="text_success">创建成功</view>
				<view class="text_default margin-t-60">问题提报单已创建</view>
				<view class="text_default margin-t-10">可在首页【问题提报】中查看</view>
				<view class="btns_bg margin-t-60">
					<u-button size="medium" type="primary" :ripple="true" @click="toLook">返回首页</u-button>
				</view>
			</view>
		</u-popup>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		SubmitRepairReport,
		CloseOrderReport,
		OnGetImage,
		GetOrderReport,
		SubmitInspectionProblemReport,
		DelImage,
		GetRepairWorkUser
	} from '@/plugin/api';
	import store from '@/store/index.js'; //需要引入store
	export default {
		data() {
			return {
				action: '/img/esp-api/pic/upload', //上传地址
				toBack: function() {
					uni.reLaunch({
						url: '/pages/question/index'
					});
				},
				b_close: true, //关闭按钮
				b_save: true, //保存修改按钮
				b_create: false, //创建维修单按钮
				b_agree: false, //同意按钮
				show1: false, //提交成功的弹窗
				reason: '', //退料原因
				maxlength: 200,
				checked: false, // 是否来源于物联网监测
				formData: {
					MachineGuid: '', //设备guid
					CreateNote: '', //创建单据时的说明
					UpdateUserGuid: '', //提交的用户
					Level: false, //紧急程度
					FileURL: '', //图片url
					FileName: '', //图片名称
					BasicInfo: '', //基础信息
					FatherOrder: '', //上层单据
					Machineid: '', //设备资产
					MachineName: '', // 设备名称
					CostCenterID: '', // 区域
					InspectionItemsName: '', // 基本信息
					quesionDate: '', // 提报时间
					persion: '', //负责人
					userGuid: '', //提报人
					file: '', //相片
					orderNo: ''
				},
				fileList1: [], //文件列表
				level: false, //级别
				LevelShow: false, //级别显示
				levelList: [{
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
				persion: '张三', //负责人
				persionShow: false, //负责人
				persionList: [],
				persion_t: '张三', //负责人
				persionShow_t: false, //负责人
				persionList_t: [],
				customStyle: {
					color: '#0066CB',
					margin: '44rpx 0'
				},
				current: 0,
				tabList: [{
						name: '基本'
					},
					{
						name: '检查项'
					}
				]
			};
		},
		onLoad(res) {
			// debugger 
			if (res.orderNo == undefined) {
				let itm = JSON.parse(res.item);
				this.loadPro(itm);

				// switch (itm.Level){
				// 	case 'true':
				// 		this.level = true
				// 		console.log(this.formData.Level)
				// 		break;
				// 	case 'false':
				// 		this.level = false
				// 		break;
				// 	default:
				// 		break;
				// }

				this.setRole();
			} else {
				let order = res.orderNo.split("-")
				let Astatus = 3
				if (order[1] == "question") {
					Astatus = 0;
				}
				GetOrderReport({
					UserGuid: uni.getStorageSync('userInfo').UserGuid,
					QueryNote: order[0],
					Type: '问题提报单',
					UserType: 2,
					Astatus: Astatus
				}).then(res => {
					this.loadPro(res.data.data[0]);
					this.setRole();
				});
			}
		},
		onBackPress() {},
		mounted() {},
		onShow() {
			let obj = store.state.item;
			// 判断对象是否为空
			if (Object.keys(obj).length) {
				this.formData = Object.assign(this.formData, store.state.item);
				store.state.item = {};
			}
		},
		methods: {
			//设置 停机
			setLevel(e) {
				this.level = e == "true" ? true : false;
			},
			beforeUpload(data, index, lists, name) {
				// debugger
				if (this.formData.FileURL == undefined) {
					this.formData.FileURL = ''
				}
				if (this.formData.FileName == undefined) {
					this.formData.FileName = ''
				}
				this.formData.FileURL = this.formData.FileURL + ';' + lists[index].response.url;
				this.formData.FileName = this.formData.FileName + ';' + lists[index].file.name;
			},
			//设置权限
			setRole() {
				this.b_close = false;
				this.b_save = false;
				this.b_create = false;
				this.b_agree = false;
				//操作是自己 可以修改 关闭
				if (this.formData.CreateUserNumber.trim() == uni.getStorageSync('userInfo').UserNumber.trim() && this
					.formData.Astatus == '创建') {
					this.b_close = true;
					this.b_save = true;
					this.b_create = false;
					this.b_agree = false;
				}
				// 操作员是主管 可以审批
				if (uni.getStorageSync('userInfo').leader.includes(uni.getStorageSync('userInfo').UserNumber.trim()) &&
					this.formData.Astatus == '创建') {
					this.b_agree = true;
					this.b_close = true;
				}
				// 操作员维修 可以维修
				if (uni.getStorageSync('userInfo').UserClass == '1' && this.formData.Astatus == '进行中') {
					this.b_create = true;
				}
			},
			getInfo(item) {
				if (item) {
					this.formData.BasicInfo =
						`资产时间：${item.SCdate};资产ID：${item.AssetsID};公司：${item.ComPanyName};设备编号：${item.MachineNO};设备描述：${item.MachineSpec}；`;
				}
			},
			//返回指定界面
			//加载页面时处理
			loadPro(itm) {
				this.setLevel(itm.Level)
				this.formData = itm;
				// 获取详情页的图片
				OnGetImage({
					OrderGuid: itm.orderNo,
					Type: itm.Type
				}).then(res => {
					console.log(res.data.data);
					// fileList1[{url: ''}]
					for (let i = 0; i < res.data.data.length; i++) {
						// res.data.data[i]
						this.fileList1.push({
							FileName: res.data.data[i].FileName,
							url: res.data.data[i].FileURL,
							OrderGuid: res.data.data[i].OrderGuid
						});
					}
				});
				// 判断对象是否为空
				// if (Object.keys(obj).length) {
				// 	this.formData = Object.assign(this.formData, JSON.parse(res.item));
				// 	if (Object.keys(res.checkItem).length) {
				// 	this.formData =  Object.assign(this.formData, JSON.parse(res.checkItem));
				// 	}
				// }
			},
			// 保存按钮
			save() {

				SubmitInspectionProblemReport({

					MachineGuid: this.formData.MachineGuid, //设备Guid
					CreateNote: this.formData.CreateNote, //创建单据时的说明
					UpdateUserGuid: uni.getStorageSync('userInfo').UserGuid, //	提交用户
					Level: this.formData.Level, //	问题等级
					FileURL: this.formData.FileURL == undefined ? '' : this.formData.FileURL, //	如果有照片，照片的七牛云链接
					FileName: this.formData.FileName == undefined ? '' : this.formData.FileName, //	文件名称
					BasicInfo: this.formData.BasicInfo, //	基础信息\
					FatherOrder: '',
					OrderNo: this.formData.orderNo
				}).then(res => {
					// 跳转维修单
					this.$refs.uToast.show({
						title: '保存成功！',
						type: 'success',
						duration: 200,
						url: '/pages/question/index'
					});
				});
			},
			//同意维修
			agree() {
				CloseOrderReport({
					MachineGuid: this.formData.MachineGuid,
					UpdateUserGuid: uni.getStorageSync('userInfo').UserGuid, //	提交用户
					orderNo: this.formData.orderNo,
					Status: '3' // 0创建 1关闭 3同意维修 审核 2 退单
				}).then(res => {
					// 发送企业微信
					// 获取维修人员信息
					// debugger
					let repairWork = "122675|";
					GetRepairWorkUser({
						McGuid: 'F4E19220-41DE-4F50-A91B-1BF6BA89AA18', //this.formData.McGuid,
						UserGuid: uni.getStorageSync('userInfo').UserGuid
					}).then(res => {
						if (res.data.data == undefined) {
							return;
						}
						res.data.data.map(item => {
							repairWork = repairWork + item.UserNumber.trim() + "|"
						})
					})
					// debugger
					repairWork = repairWork.substring(0, repairWork.length - 1)
					this.QYWX.sendQYWX({
						toUsers: repairWork, //'122675',
						title: this.formData.MachineName,
						des: this.formData.CreateNote,
						img: 'service',
						url: this.formData.orderNo + "-" + "service"
					});
					this.$refs.uToast.show({
						title: '保存成功！',
						type: 'success',
						duration: 200,
						url: '/pages/question/index'
					});
				});
			},
			//关闭问题单
			toClose() {
				CloseOrderReport({
					MachineGuid: this.formData.MachineGuid,
					UpdateUserGuid: uni.getStorageSync('userInfo').UserGuid, //	提交用户
					orderNo: this.formData.orderNo,
					Status: '2' // 0创建 1关闭 3进行中 2 退单
				}).then(res => {
					this.$refs.uToast.show({
						title: '关闭完成！',
						type: 'success',
						url: '/pages/question/index'
					});
				});
			},
			// 查询设备
			findEqu() {
				uni.navigateTo({
					url: '/pages/question/findEquipment'
				});
			},
			//提交 维修单
			toConfirm() {
				// debugger
				//
				SubmitRepairReport({
					MachineGuid: this.formData.MachineGuid, //设备Guid
					CreateNote: this.formData.CreateNote, //创建单据时的说明
					UpdateUserGuid: uni.getStorageSync('userInfo').UserGuid, //	提交用户
					Level: this.formData.Level, //	是否停机
					FileURL: '', //this.formData.FileURL,//	如果有照片，照片的七牛云链接
					FileName: '', //this.formData.FileName,//	文件名称
					BasicInfo: this.formData.BasicInfo, //	基础信息\
					FatherOrder: this.formData.orderNo,
					PlanStartTime: '',
					PlanEndTime: '',
					OrderNo: ''
				}).then(res => {
					// debugger
					// 跳转维修单
					this.$refs.uToast.show({
						title: '创建成功！',
						type: 'success',
						callback: () => {
							uni.reLaunch({
								url: '/pages/repairOrder/detail?orderNo=' + res.data.data[0]
									.orderNo
							});
						}
					});
				});
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
				console.log(event);
				// debugger;
				this[`fileList${event.name}`].splice(event.index, 1);
				// DelImage({
				// 	 OrderGuid:,
				// 	 FileName:
				// })
			},
			onRemove(index, lists) {
				// console.log('图片已被移除' + index)
				DelImage({
					OrderGuid: this.fileList1[index].OrderGuid,
					FileName: this.fileList1[index].FileName
				}).then(() => {
					// console.log('牛啊牛啊');
				})
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file);
				let fileListLen = this[`fileList${event.name}`].length;
				lists.map(item => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					});
				});
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url);
					let item = this[`fileList${event.name}`][fileListLen];
					this[`fileList${event.name}`].splice(
						fileListLen,
						1,
						Object.assign(item, {
							status: 'success',
							message: '',
							url: result
						})
					);
					fileListLen++;
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
						success: res => {
							setTimeout(() => {
								resolve(res.data.data);
							}, 1000);
						}
					});
				});
			}
			//------附件上传
		}
	};
</script>

<style lang="scss" scoped>
	.iten_right {
		.u-cell {
			padding-left: 0;
			padding-right: 0;
		}
	}

	.pop_bg2 {
		background-color: #ffffff;
		// height: 100%;
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

	.color_red {
		color: red;
	}

	.zhanWei_h {
		height: 150rpx;
	}

	.footer {
		position: fixed;
		bottom: 0;
		width: 100vw;
		background-color: #ffffff;
		border-top: 1rpx solid #cccccc;
		z-index: 11;
	
	.btn_bg {
			margin-top: 25rpx;
			margin-bottom: 20rpx;
		}
	}

	.reason_bg {
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
				font-size: 24rpx;
				width: 100%;
			}
		}
	}

	::v-deep .u-cell {
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
