<!-- 列表 -->
<template>
	<view class="container flex flex-col">
		<view class="p10 pl20 u-border-bottom u-border-top bg-white">
			<u-search :placeholder="placeholder" v-model="searchValue" height="70" :clearabled="false"
				:search-icon-color="searchIconColor" :action-style="actionStyle" @search="getSearch()"
				@custom="getSearch()"></u-search>
		</view>
		<view v-for="item in dataList" :key="item.cCoalCode" class="relative flex flex-between mb15 p10 br5 bg-white"
			@click="navTo('/pages/zhuangChe/details', item.id)">
			<view class="flex flex-col flex-between lh15">
				<text class="fs18 color-black fw600 title">{{item.cCphm}}</text>
				<view class="small">
					<text class="">司机信息：{{item.cJsyXm}}</text>
					<text class="ml15">{{item.cPhone}} </text>
				</view>
				<text class="fs12">限<text style="color: #FFFFFF;">占位</text>载：{{item.iXz}} 吨</text>
				<text class="fs12">货物名称：{{item.cHwmc ? item.cHwmc : '-'}}</text>
				<text class="fs12">收货单位：{{item.cShdw ? item.cShdw : '-'}}</text>
				<text class="fs12">承运单位：{{item.ccYdw ? item.ccYdw : '-'}}</text>
			</view>
		</view>
		<view v-if="dataList.length == 0" class="flex flex-1 flex-center height">
			<u-empty mode="list">
			</u-empty>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		AutoWeight_Select_All,
		GetAutoWeightSingle,
		ConfirmCoalType,
		AutoWeight_Select_Plate
	} from '@/plugin/api'
	export default {
		data() {
			return {
				token: '',
				placeholder: '请输入车牌号查询', //
				searchValue: '',
				searchIconColor: '#328FFF',
				actionStyle: {
					color: '#328FFF'
				},
				dataList: []
			}
		},
		onLoad() {
			this.token = uni.getStorageSync('token')
			this.init();
		},
		onShow() {
			this.init();
		},
		// 下拉刷新
		onPullDownRefresh() {
			console.log('【index】【onPullDownRefresh】【loadData】');
			this.init();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {

			init() {
				this.getSelectAll();
			},

			getSelectAll() {
				let that = this;
				uni.showLoading({
					title: 'loading...'
				})
				AutoWeight_Select_All({
					token: that.token
				}).then(({
					data: {
						code,
						data,
						msg
					}
				}) => {
					console.log(code);
					console.log(data);
					uni.hideLoading()
					if (code === 1) {
						//...
						that.dataList = data;
						uni.hideLoading()
					} else {
						uni.hideLoading()
						that.$refs.uToast.show({
							title: msg,
							position: 'top',
							type: 'error'
						})
					}
				}).catch(function(e) {
					console.log(e);
					uni.hideLoading()
				})
			},
			// 模糊查询
			getSearch() {
				let that = this;
				console.log(that.searchValue)
				uni.showLoading({
					title: 'loading...'
				})

				AutoWeight_Select_Plate({
					token: that.token,
					Plate: that.searchValue
				}).then(({
					data: {
						code,
						data,
						msg
					}
				}) => {
					console.log(code);
					console.log(data);
					that.dataList = data ? data : [];
					uni.hideLoading()
					if (code === 1) {
						//...
						uni.hideLoading()
					} else {
						uni.hideLoading()
						that.$refs.uToast.show({
							title: msg,
							position: 'top',
							type: 'error'
						})
					}
				}).catch(function(e) {
					console.log(e);
					uni.hideLoading()
				})
			},
			/**
			 * 跳转
			 */
			navTo(url, data, type) {
				console.log('【index】【navTo】Url：' + url);
				if (url) {
					this.route.navTo(url, data, type);
				} else {
					this.$refs.uToast.show({
						title: '暂无内容',
						type: 'warning'
					})
				}
			}
		}
	}
</script>

<style lang='scss'>
	.container {
		min-height: 100vh;
		background: #f5f5f5;
	}
</style>
