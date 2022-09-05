<!--  -->
<template>
	<view class="container">
		<u-search class="li-search" :placeholder="placeholder" v-model="searchValue" height="70" :clearabled="false"
			:search-icon-color="searchIconColor" :action-style="actionStyle" @search="getSearch()"
			@custom="getSearch()"></u-search>
		<scroll-view class="li-list" scroll-y enable-back-to-top="true" @scrolltolower="scrolltolower">
			<u-cell-group v-if="dataList.length > 0" v-for="(item, index) in dataList" :key="index">
				<u-cell-item :title="item.name" :label-style="labelStyle" :arrow="false" @click="cellClick(item)">
				</u-cell-item>
			</u-cell-group>
			<cu-empty :pn="current" :ps="size" :total="total" tips="暂无数据，敬请期待" />
		</scroll-view>
	</view>
</template>

<script>
	import {
		getProjecList // 
	} from '@/plugin/api'
	export default {
		data() {
			return {
				searchType: '', // 
				// search样式
				placeholder: '请选择项目', // 
				searchValue: '',
				searchIconColor: '#328FFF',
				actionStyle: {
					color: '#328FFF'
				},
				labelStyle: {},

				current: 1,
				size: 15,
				total: -1,
				dataList: [],
				isPullUp: false
			}
		},
		onLoad() {
			this.resetFuelList()
		},
		methods: {
			// 持续加载
			scrolltolower() {
				if (this.isPullUp) {
					this.isPullUp = false
					this.current += 1
					this.getSiteList()
				}
			},
			// 重置搜索结果
			resetFuelList() {
				this.current = 1
				this.total = -1
				this.dataList = []
				this.isPullUp = false
				this.getSiteList()
			},
			// 获取
			getSiteList() {
				let that = this;

				getProjecList()
					.then(({
						data: {
							code,
							data,
							msg
						}
					}) => {
						console.log(data);
						if (code === 1) {
							that.dataList = data.list
							that.size = data.page_num
							that.total = data.list.length
						} else if (msg) {
							that.$refs.uToast.show({
								title: msg,
								position: 'top',
								type: 'error'
							})
						}
						uni.hideNavigationBarLoading()
						uni.stopPullDownRefresh()
					})
			},
			// 搜索
			getSearch() {
				this.resetFuelList();
			},
			// 选择
			cellClick(e) {
				let that = this;
				console.log(e);

				let pages = getCurrentPages();
				console.log(pages);
				let prevPage = pages[pages.length - 2]
				console.log(prevPage);

				prevPage.$vm.project = e

				uni.navigateBack({
					delta: 1
				})
			},
		}
	}
</script>

<style lang='scss'>
	.container {
		background: #fff;
	}

	/* search */
	.li-search {
		display: flex;
		height: 100upx;
	}

	/* list */
	.li-list {
		height: calc(100vh - 140upx);
	}
</style>
