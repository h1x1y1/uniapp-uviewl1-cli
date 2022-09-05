<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import 'styles/base.scss';
	/*每个页面公共css */
	
	.container {
		min-height: 100vh;
		background: #f5f5f5;
	}
	
	.pages-task-task {
		.uni-page-head {
			padding: 7px 9px;
			.uni-page-head-search {
				margin: 0 9px;
			}
		}
	}
	
</style>
