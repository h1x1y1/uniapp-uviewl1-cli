<template>
	<view class="container">
		<!-- logo -->
		<view class="li-login-logo flex">
			<image class="img" src="../../static/login/login.png" mode=""></image>
			<!-- <text class="fs40 fw700">山西退役军人服务平台</text> -->
		</view>
		<!-- 登录 -->
		<view class="li-login-form">
			<u-form class="li-input" :model="form" ref="uForm" :error-type="errorType">
				<!-- 手机号码 -->
				<u-form-item :leftIconStyle="{color: '#888', fontSize: '34rpx', width:'34rpx', height:'34rpx'}"
					left-icon="/static/login/email.png" prop="email">
					<u-input placeholder="请输入邮箱地址" placeholderStyle="placeclass" v-model="form.email"></u-input>
				</u-form-item>
				<!-- 验证码 -->
				<u-form-item :leftIconStyle="{color: '#888', fontSize: '34rpx', width:'34rpx', height:'34rpx'}"
					left-icon="/static/login/yzm.png" prop="code" label-width="150">
					<u-input placeholder="请输入验证码" placeholderStyle="placeclass" maxlength="6" v-model="form.code"
						type="text"></u-input>
					<u-button class="li-form-code" slot="right" type="primary" size="mini" @click="getCode">{{codeTips}}
					</u-button>
				</u-form-item>
				<!-- 交易密码 -->
				<u-form-item :leftIconStyle="{color: '#888', fontSize: '34rpx', width:'34rpx', height:'34rpx'}"
					left-icon="/static/login/password.png" prop="password">
					<u-input placeholder="请输入登录密码" placeholderStyle="placeclass" maxlength="6" v-model="form.password"
						type="password"></u-input>
				</u-form-item>
	
				<u-form-item :leftIconStyle="{color: '#888', fontSize: '34rpx', width:'34rpx', height:'34rpx'}"
					left-icon="/static/login/password.png" prop="repeat_password">
					<u-input placeholder="请再次输入登录密码" placeholderStyle="placeclass" maxlength="6"
						v-model="form.repeat_password" type="password"></u-input>
				</u-form-item>	
			</u-form>
			<!-- 服务条款 -->
			<view class="agreement">
				<!-- <u-checkbox v-model="check" @change="checkboxChange"></u-checkbox> -->
				<view class="agreement-text">
					注册表示同意<navigator style="color: #328FFF;" url="/pages/login/serve">软件许可及服务协议</navigator>
				</view>
			</view>
			<!-- 注册 -->
			<view class="li-form-btns">
				<button class="cu-btn login-btn"
					style="color: #fff; display: flex; align-items: center; justify-content: center;" @tap="submit">确定</button>
			</view>
		</view>
		<!-- 验证码组件 -->
		<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
		<!-- toast组件 -->
		<u-toast ref="uToast" />
	</view>
</template>


<script>
	import {
		resetPasswordByEmail, // 注册
		sendEmail, // 获取验证码
		doLogin // 登录
	} from '@/plugin/api'
	export default {
		data() {
			return {
				// 文字提示
				errorType: ['toast'],
				// 验证码
				codeTips: '',
				form: {
					email: '',
					code: '',
					password: '',
					repeat_password: '',
				},
				rules: {
					email: [{
						required: true,
						message: '请输入邮箱地址',
						// 可以单个或者同时写两个触发验证方式 
						trigger: 'blur',
					}, {
						// 自定义验证函数，见上说明
						validator: (rule, value, callback) => {
							return this.$u.test.email(value);
						},
						message: '邮箱地址不正确',
						// 触发器可以同时用blur和change
						trigger: 'blur',
					}, ],
					code: [{
						len: 6,
						message: '请输入验证码',
						trigger: 'blur'
					}],
					password: [{
						len: 6,
						message: '请输入登录密码',
						trigger: 'blur'
					}],
					repeat_password: [{
						len: 6,
						message: '请再次输入登录密码',
						trigger: 'blur'
					}]
				}
			}
		},
		onReady() {
			// 设置uForm组件的校验规则
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			// 更改验证码显示文字
			codeChange(text) {
				this.codeTips = text;
			},
			// 获取验证码
			getCode() {
				let that = this;
				if (!that.form.email || !(this.$u.test.email(that.form.email))) {
					// that.$u.toast('倒计时结束后再发送');
					that.$refs.uToast.show({
						title: '请先输入邮箱地址',
						type: 'error'
					})
					return false;
				}
				if (that.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码',
						mask: true
					})
					console.log(that.form.email);
					uni.hideLoading();
					// 这里此提示会被this.start()方法中的提示覆盖
					that.$u.toast('验证码已发送');
					// 通知验证码组件内部开始倒计时
					that.$refs.uCode.start();
					sendEmail({
						type: 'FORGET',
						email: that.form.email
					}).then(res => {
						console.log(res);
						if (res.data.code === 1) {
							uni.hideLoading();
							// 这里此提示会被this.start()方法中的提示覆盖
							that.$u.toast('验证码已发送');
							// 通知验证码组件内部开始倒计时
							that.$refs.uCode.start();
						} else {
							uni.hideLoading();
							console.log(res.data.msg);
							that.$refs.uToast.show({
								title: res.data.msg,
								position: 'top',
								type: 'error'
							})
							if (res.data.msg === '账号已注册，请登录') {
								setTimeout(() => {
									uni.hideLoading();
									uni.redirectTo({
										url: 'login'
									})
								}, 2000);
							}
						}
					})
				} else {
					that.$u.toast('倒计时结束后再发送');
				}
			},
			// 注册
			submit() {
				let that = this;
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过');

						that.goMidfyPws(that.form.email, that.form.code, that.form.password, that.form
							.repeat_password );
						this.$refs.uForm.resetFields();
					} else {
						console.log('验证失败');
					}
				});
			},
			// 注册
			goMidfyPws(email, code, password, repeat_password) {
				let that = this
				let params = {
					email,
					code,
					password,
					repeat_password
				}
				console.log(params)
				resetPasswordByEmail(params).then(res => {
					console.log(res);
					if (res.data.code === 1) {
						that.$refs.uToast.show({
							title: '正在跳转登录',
							type: 'success'
						})
						// 登录
						doLogin({
							username: email,
							password: password
						}).then(res => {
							console.log(res);
							if (res.data.code === 1) {
								uni.hideLoading()
								setTimeout(() => {
									uni.switchTab({
										url: '/pages/tabBar/index'
									})
								}, 1000);
							} else {
								uni.hideLoading()
								console.log(res.data.msg);
								that.$refs.uToast.show({
									title: '登录失败',
									type: 'error'
								})
								setTimeout(() => {
									uni.hideLoading();
									uni.redirectTo({
										url: 'login'
									})
								}, 1000);
							}
						}).catch(error => {});
					} else {
						console.log(res.data.msg);
						that.$refs.uToast.show({
							title: res.data.msg,
							type: 'error'
						})

						if (res.data.msg === '邮箱不能重复注册') {
							setTimeout(() => {
								uni.hideLoading();
								uni.redirectTo({
									url: 'login'
								})
							}, 2000);
						}
					}
				}).catch(error => {});
			}
		}
	}
</script>

<style lang="scss">
	@import '../../styles/login.scss';

	.login-btn {
		margin-top: 70upx;
		height: 96upx;
		width: 100%;
		background: linear-gradient(-90deg, rgba(80, 85, 168, 1), rgba(104, 110, 210, 1));
		border-radius: 47upx;
		font-size: 34upx;
		color: #ffffff;
	}

	// 协议
	.agreement {
		display: flex;
		align-items: center;
		margin: 30rpx 0;

		.agreement-text {
			display: flex;
			padding-left: 8rpx;
			color: $u-tips-color;
		}
	}
</style>
