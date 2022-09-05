const route = {
	// 跳转
	navTo(url, data, type) {
		console.log('【index】【navTo】Url：' + url);
		return new Promise(resolve => {
			if (url) {
				if (data) {
					uni.navigateTo({
						url: url + `?data=${JSON.stringify(data)}`
					})
				} else {
					if (type == 'tab') {
						uni.switchTab({
							url
						})
					} else {
						// 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面
						uni.navigateTo({
							url
						})
					}
				}
			} else {
				this.$refs.uToast.show({
					title: '暂无内容',
					type: 'warning'
				})
			}
		})
	}
}
export default route;
