<template>
	<view>
	
		<view class="login-bg" :style="{height: screenHeight + 'px'}">
			<!-- <view class="status_bar">
				顶部状态栏
			</view> -->
			<view class="logo-png">
				<image src="/static/logo.png" mode="widthFix"></image>
			</view>
			<!-- 你好 -->
			<view class="text-you">
				你好，
			</view>
			<view class="text-wenHou">
				欢迎来到春兴集团设备管理系统
			</view>
			<!-- 输入进行登录 -->
			<view class="inputBg">
				<!-- 工号 -->
				<view class="input-bg1">
					<input type="text" v-model="userTel" placeholder="请输入用户编号"
						placeholder-style="color: #FFFFFF;opacity:0.35;" />
				</view>
				<!-- 下划线 -->
				<view class="line-xiahua1" :style="{opacity: opacity1}"></view>
				<!-- 密码 -->
				<view class="input-bg2">
					<input type="type" v-model="userPwd" placeholder="请输入用户密码" password
						placeholder-style="color: #FFFFFF;opacity:0.35;" />
				</view>
				<!-- 下划线 -->
				<view class="line-xiahua2" :style="{opacity: opacity2}"></view>
			</view>
			<!-- 登录 -->
			<view class="btn-login" @click="login">
				登录
			</view>
			<!-- <view class="btn-register" @click="register">
				注册
			</view> -->
		</view>
	</view>
</template>

<script>
	import {
		Login
	} from '@/plugin/api'
	export default {
		data() {
			return {
				opacity1: 0.35,
				opacity2: 0.35,
				screenHeight: 500,
				userTel: '', // 账号
				userPwd: '', // 密码
			}
		},
		onShow() {
			let that = this
			return;
		},
		onLoad() {
			
			uni.getSystemInfo({
				success: (res) => {
					// console.log(res);
					this.screenHeight = res.windowHeight;
				}
			})
		},
		methods: {
			// 注册
			register() {
				uni.navigateTo({
					url: '/pages/login/register'
				})
			},
			// 忘记密码
			resetPwd() {
				uni.navigateTo({
					url: '/pages/login/resetPwd'
				})
			},
			//普通登录
			login() {
				let _this = this;
				uni.hideKeyboard()

				//模板示例部分验证规则
				// if (!(this.$u.test.mobile(this.userTel))) {
				// 	uni.showToast({
				// 		title: '请填写正确邮箱地址',
				// 		icon: "none"
				// 	});
				// 	return false;
				// }
				// if (!(/^\d{6}$/.test(this.userPwd))) {
				// 	uni.showToast({
				// 		title: '请填写正确密码',
				// 		icon: "none"
				// 	});
				// 	return false;
				// }
				uni.showLoading({
					title: '正在登录中...'
				})
				this.doLogin(this.userTel, this.userPwd)
			},

			//登录
			doLogin(userTel, userPwd) {
				// let locaInfo = uni.getStorageSync('locaInfo');
				Login({
					CompanyNo: '0010',
					username: userTel,
					Pwd: userPwd
				}).then(({
					data: {
						code,
						data,
						msg
					}
				}) => {
					console.log(data);
					uni.hideLoading()
					if (code === 1) {
						//保存token到本地缓存
						uni.setStorage({
							key: 'token',
							data: data[0].token
						})
						uni.setStorage({
							key: 'userInfo',
							data: data[0]
						})

						uni.switchTab({
							url: '/pages/home/home'
						})
						return;

						this.$vuex('token', data.token, true).then(() => {
							this.$vuex('USER', data)
							if (
								!this.vuex_returnUrl ||
								this.vuex_returnUrl.url === 'pages/login/index' ||
								this.vuex_returnUrl.url === 'pages/login/register'
							) {
								uni.switchTab({
									url: '/pages/tab-bar/my'
								})
							} else if (
								['pages/tab-bar/index', 'pages/tab-bar/list',
									'pages/tab-bar/news', 'pages/tab-bar/my'
								].indexOf(
									this.vuex_returnUrl.url
								) > -1
							) {
								uni.reLaunch({
									url: `/${this.vuex_returnUrl.urlWithArgs}`
								})
							} else {
								uni.redirectTo({
									url: `/${this.vuex_returnUrl.urlWithArgs}`
								})
							}
						})
					} else {
						// this.$refs.toast.clear()
						// this.$refs.uToast.show({
						// 	title: msg,
						// 	position: 'top',
						// 	type: 'error'
						// })
					}
				}).catch(function(e) {
					console.log(e);
					uni.hideLoading()
				})
			}
		}
	}
</script>



<style lang="scss" scoped>
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
		background: #466FFE;
	}
	
	.login-bg {
		padding-top: 30rpx;
		width: 750rpx;
		height: 1334rpx;
		background: linear-gradient(0deg, #014099 0%, #466FFE 100%);
	}
	
	.logo-png image {
		width: 254rpx;
		height: 84rpx;
		margin: 183rpx 0rpx 0rpx 72rpx;
	}
	
	.text-you {
		font-size: 66rpx;
		font-family: PingFang SC;
		font-weight: 800;
		color: #FFFFFF;
		margin: 76rpx 0rpx 0rpx 74rpx;
	}
	
	.text-wenHou {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		margin: 18rpx 0rpx 0rpx 74rpx;
	}
	
	.inputBg {
		width: 602rpx;
		height: vh;
	}
	
	.input-bg1 {
		width: 602rpx;
		height: 114rpx;
		margin-left: 74rpx;
		margin-top: 119rpx;
		position: relative;
		top: 0rpx;
	}
	
	.input-bg1 input {
		position: absolute;
		top: 69rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		width: inherit;
	}
	
	.input-bg2 {
		width: 602rpx;
		height: 114rpx;
		margin-left: 74rpx;
		position: relative;
		top: 0rpx;
	}
	
	.input-bg2 input {
		position: absolute;
		top: 69rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		width: inherit;
	}
	
	.line-xiahua1 {
		width: 602rpx;
		height: 2rpx;
		background-color: #FFFFFF;
		margin: 0 74rpx;
	}
	
	.line-xiahua2 {
		width: 602rpx;
		height: 2rpx;
		background-color: #FFFFFF;
		opacity: 0.35;
		margin: 0 74rpx;
	}
	
	.btn-login {
		width: 602rpx;
		height: 102rpx;
		margin-left: 74rpx;
		margin-top: 152rpx;
		background: #FFFFFF;
		border-radius: 12rpx;
		text-align: center;
		font-size: 36rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #099AFF;
		line-height: 102rpx;
	}
	
	.btn-register {
		width: 602rpx;
		height: 102rpx;
		margin-left: 74rpx;
		border-radius: 12rpx;
		text-align: center;
		font-size: 36rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FFFFFF;
		line-height: 102rpx;
	}
</style>
