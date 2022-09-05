<template>
	<view> 
	</view>
</template>

<script>
	import {
		LoginWX
	} from '@/plugin/api'
	export default {
		data() {
			return { 
				orderNo:""//微信短信调过来的单号
			}
		},
		onShow() { 
		},
		onLoad(res) {
			this.login(res)  
		},
		methods: { 
			// 企业微信登录
			login(res) {//后端跳转到这个页面，并带用户信息参数   
			let that = this;
			 
			console.log(res);	
			this.orderNo=res.orderNo; 
				LoginWX({ 
					UserName:res.userid,
					Pwd: res.pass
				}).then(({
					data: {
						code,
						data,
						msg
					}
				}) => { 
					if (code === 1) {
						this.QYWX.getCofig(); //企业微信
						//保存token到本地缓存
						uni.setStorage({
							key: 'token',
							data: data[0].token
						})
						uni.setStorage({
							key: 'userInfo',
							data: data[0]
						})

		
			if(that.orderNo=="null"){
						uni.switchTab({
							url: '/pages/home/home'
						})
						return;
			}else{
				let url="";
				if(that.orderNo.substring(0,4)=="WTTB"){//维修单
					url= '/pages/question/detial?orderNo='+that.orderNo
				}
				uni.navigateTo({ 
					url:url
				})
				return;	
			}
				
 
					} else { 
						uni.navigateTo({
							url: '/pages/login/login'
						})
					}
				}).catch(function(e) { 
					uni.navigateTo({
						url: '/pages/login/login'
					})
				})
			}
		}
	}
</script>
