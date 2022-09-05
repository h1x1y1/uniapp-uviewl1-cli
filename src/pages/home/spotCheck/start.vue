<template>
	<view>
		<u-navbar back-icon-color="#fff" title="点检执行" title-width="450" title-color="#fff"
			:background="background" :border-bottom="false"></u-navbar>
		<u-row gutter="16" justify="center" style="background: #3a74c5;">
			<u-col span="11">
				<u-search shape="square" bg-color="#fff" placeholder="输入关键字搜索" :action-style="actionStyle"
					v-model="keyword" style="margin: 48rpx 0 30rpx 0;" @search="search" @custom="search"></u-search>
			</u-col>
		</u-row>
		<u-cell-item v-if="new Date(item.NEXTDAY).getTime()<=new Date().getTime()" class="cx-cell-item" :title="item.InspectionItemsDesc" :arrow="false" hover-class="none" v-for="(item,index) in listData" :key="index">
			<view slot="icon" class="num-tag">{{index+1}}</view>
			<view slot="right-icon" class="df">
				<u-input v-model="item.Result" v-if="item.type=='数值' || item.type=='数值范围' || item.type=='记录'"   :type ="setType(item)" class="record-input" :placeholder="item.type" :customStyle="customStyle(item)" @blur="blur(item,$event)"/>
				<template v-if="item.type=='结果'">
					<u-icon name="checkmark-circle" :color="item.Result=='Pass'?'green':'#8C8C8C'" size="40" @click="pass(item)"></u-icon>
					<u-icon name="close-circle" :color="item.Result=='False'?'red':'#8C8C8C'" size="40" @click="NG(item)"></u-icon>
				</template>
				<u-icon name="more-circle" color="#000" size="40"></u-icon>
			</view>
		</u-cell-item>
		<u-action-sheet :list="sheetList" border-radius="24" v-model="show" @click="dealWith"  @close="sheetClose"  ></u-action-sheet>
		
		<!-- <u-cell-item class="cx-cell-item" title="指示灯准备运行前观察指示灯所亮颜色1. 红色为故障停机， 2. 黄色为测试中，3. 绿色为自主运行" :arrow="false">
			<u-tag slot="icon" text="1" mode="plain" border-color="#DCDCDC" color="#000" shape="circle"></u-tag>
			<view slot="right-icon" class="df">
				<u-icon v-show="!isGou" size="50" name="checkmark-circle" @click="toGou"></u-icon>
				<u-icon v-show="isGou" size="50" name="checkmark-circle" color="lightgreen" @click="toGou"></u-icon>
				<u-icon size="50" name="close-circle" color="red"></u-icon>
				<u-icon size="50" name="more-circle"></u-icon>
			</view>
		</u-cell-item> -->
	<!-- 底部多选 -->
	<view>
		<u-row style="background-color: white;margin-top: 20rpx;">
			<u-col span="12" text-align="right">
				<u-button type="primary" :loading="isLoading" :ripple="true" @tap="finishSpotcheck">完 成 点 检
				</u-button>
			</u-col>
		</u-row>
	</view>
	</view>
</template>

<script>
	import {
		GetMachineInspectionItemsAPP,
		SubmitInspectionResult,
		SubmitInspectionEnd
	} from '@/plugin/api'
	export default {
		data() {
			return {
				isLoading: false,// 提交按钮是否显示加载状态
				isGou: false,
				isCuo: false,
				background: {
					backgroundColor: '#3a74c5'
				},
				actionStyle: {
					color: '#fff'
				},
				keyword: '',
				sheetList: [{
					text: '问题提报单'
				}
				// , {
				// 	text: '服务申请单'
				// },{
				// 	text: '维修单',
				// },
				],
				show: false,
				MachineGuid: '',//设备类型
				McGuid: '',//设备
				orderNo: '',//点检单号
				value: '',
				listData: [],//显示的list
				list: [],//原始
				detailList:{},//设备详细信息
				currenItem:{},//当前操作的行
			}
		},
		onLoad(o) {
			//获取 设备id 设备类型id 用户 id 传递后台获取点检项目
			// debugger
			// console.log(JSON.parse(o.item));
			this.detailList=  JSON.parse(o.item) 
			this.orderNo = this.detailList.orderNo
			this.userInfo = uni.getStorageSync('userInfo')
			this.getData()
		},
		methods: {  
			// 是否打勾
			toGou(){
				this.isGou = !this.isGou
			},
			// 完成点检
			finishSpotcheck(){
				this.isLoading = true
				// 检查是否存在未检项目
				let  temp=	this.list.filter(item=>{
					return	item.Result==""
				})
				debugger
				if (temp.length>0) {
					this.$u.toast('存在未检项目，请检查')
					this.isLoading = false
					return;
				}
				this.isLoading = false
				SubmitInspectionEnd({
					OrderNo: this.detailList.orderNo
				})
				uni.navigateBack()
			},
			//input 颜色
			customStyle(item) {
				if(item.Result!='False'){
					return {color:'#000000'}
				}
				 var res={					 
					 color: 'red' 
				 }
				 return res
			},
			// input类型
			setType(item){
				if (item.type=='数值范围') {
						return 'number';
				}
			},
			// 离开焦点保存数据
			blur(item, e) {
				if (e==="") {
					return;
				}	
			
				this.submitResult(item,e)
			},
			// 超出范围判断
			outScope(item,e){				
				// 值域超出范围 需要提单
				if(item.type=="数值范围"){
					item.Result="";
					var str=e+item.Control1Sign+item.Control1Value;
					var res=eval(str)
					str=e+item.Control2Sign+item.Control2Value;
					var res2=eval(str)
					if(!(res&&res2)){ 
						item.Result='False'
						this.openSheet(item)
					} 
				}else if(item.Result=='False'){ //结果为False的也弹框
					this.openSheet(item)
				}
				this.$forceUpdate()
			},
			// 获取点检项
			getData() {
				// debugger
				GetMachineInspectionItemsAPP({ 
					MachineGuid: this.detailList.MachineGuid, 
					InspectionItemsID:'',
					OrderNo: this.detailList.orderNo
				}).then(({
					data: {
						code,
						data,
						msg
					}
				}) => {
					if (code == 1) {
						 
						 this.listData = data
						 this.listData.map(item=>{
							 item.Result=''//图标颜色
						 })
						 this.list=this.listData
					}
				})
			},
			// 结果 是 点击
			pass(item) { 					
				item.Result='Pass'
				console.log(item.Result);
				this.submitResult(item,'Pass')				 
			},
			// 结果 否
			NG(item){
				item.Result='False'
				this.submitResult(item,'False')	
			},
			// 保存每条点检结果
			submitResult(item,result) {
			 this.currenItem=item
				let Type = item.type === '结果' ? 1 : (item.type === '数值范围' ? 2 : (item.type === '记录' ?
					1 : ''))
				let FREQ = item.Freq === '年' ? 1 : (item.Freq === '半年' ? 2 : (item.Freq === '季度' ? 3 :
					(item.Freq === '月' ? 4 : (item.Freq === '周' ? 5 : (item.Freq === '日' ? 6 : (
						item.Freq === '单次' ? 0 : ''))))))
				SubmitInspectionResult({
					InspectionItemsASSMachineGuid: item.InspectionItemsASSMachineGuid,
					InspectionItemsGuid: item.InspectionItemsGuid,
					MCGuid:	item.McGuid,
					MachineGuid: item.MachineGuid,
					Type: Type,
					Control1Sign: item.Control1Sign,
					Control1Value: item.Control1Value,
					Control2Sign: item.Control2Sign,
					Control2Value: item.Control2Value,
					Mark: '',
					UpdateUserGuid:	this.userInfo.UserGuid,
					FREQ: FREQ,
					NEXTDAY: item.NEXTDAY,
					Result:	result,//结果
					FileURL: '', 
					FileName: '',
					orderNo:this.orderNo,
					InspectionPlanGuid: item.InspectionPlanGuid
				}).then(({
					data: {
						code,
						data,
						msg
					}
				}) => {
					if (code == 1) {
						// this.$u.toast('保存了')
						this.outScope(item,result)//输入范围 超出变色
						
						// this.getData()
					}
				})
			},
			//弹框创建问题
			openSheet(item) { 
				this.show = true
			},
			// 创建单据
			dealWith(index) {
				switch (this.sheetList[index].text){
					case '问题提报单':
						uni.navigateTo({
							url: '/pages/question/quesionNew?item='+encodeURIComponent(JSON.stringify(this.detailList))+'&checkItem='+encodeURIComponent(JSON.stringify(this.currenItem))
						})
						break;
						case '服务申请单':
						uni.navigateTo({
							url: '/pages/serverOrder/serverOrder?item='+encodeURIComponent(JSON.stringify(this.detailList))+'&checkItem='+encodeURIComponent(JSON.stringify(this.currenItem))
						})
							break;
							case '维修单':
							uni.navigateTo({
								url: '/pages/maintain/maintainOrder?item='+encodeURIComponent(JSON.stringify(this.detailList))+'&checkItem='+encodeURIComponent(JSON.stringify(this.currenItem))
							})
								break;
					default:
						break;
				}
				 
			},
			//搜索关键字
			search(){
				if (this.keyword=="") {
					this.listData=this.list
				}
				//查询过滤
			this.listData=	this.list.filter(item=>{
					return item.InspectionItemsDesc.indexOf(this.keyword)>-1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #fff;
	}

	.cx-cell-item {
		::v-deep .u-cell_title {
			margin-left: 20rpx;
		}
	}

	.num-tag {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 42rpx;
		height: 42rpx;
		border-radius: 100%;
		border: 1rpx solid #DCDCDC;
	}

	.u-cell_right {
		.u-icon {
			margin-left: 20rpx;
		}
	}
	
	.record-input {
		width: 120rpx;
		border-bottom: 1rpx solid #8C8C8C;
	}
</style>
