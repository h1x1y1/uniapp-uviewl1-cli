import Vue from 'vue'
import Vuex from 'vuex'
import service from '../service.js'

Vue.use(Vuex)
//父子页面的数据交换可以使用 getParentPage 函数得到pPage对象实现，对于复杂页面
//的大量数据交换，依然是 vuex 这里来实现，只是不需要持久化，因此
//在 state 对象下固定最后一个成员为 appLifeData 对象，该对象不存储，
//仅仅在app的生命周期存在，在使用上，则只需要在每个需要的页面暴露
//这个对象即可读写所有数据了。而一些固定数据比如app版本等，就绑定
//在 Vue 全局对象 $appData 这个轻量成员对象上即可所有页面直接使用。

//2019-04-01 发现在app下pPage对象无效，只有一个route属性，但是h5页面下是完美运行的。
//因此app下无法使用次方法，只能使用 appLifeData 对象中转了。但是使用中发现，
//在页面中将这个对象赋值给页面对象后，修改页面对象的值，会同步修改appLifeData对象的值
//这貌似和状态管理vuex描述的有出入了，不是说vuex对象对外部是只读的吗？
//后面测试发现，赋值过的确实可以直接修改state数据，但是直接map的对象确实是只读的。
const saveStateData = function(key,dat){
	if(key=='appLifeData'){return false;}
	uni.setStorageSync('state_' + key,dat);
}
const removeStateData = function(key){
	uni.removeStorageSync('state_' + key);
}
const store = new Vuex.Store({
    state: {
		item:{},//页面检行信息传递
		userData:{
			name: '用户数据',
			hasLogin: false,
			initData: {},
			userInfo: {},	
			pickerIndex: {
				departmentID:0,
				teamsID:0,
				scalesID:0,
				FFManagerID:0
			}
		},
		prodData:{
			name: '生产数据',
			qtyList: {}
		},
		navData:{
			name: '导航数据',
			navIndex: {
				leftIcon: 0
			}
		},
		voiceData:{
			name: '心声数据',
			voiceIndex: {
				layer: 1 // 1未解决，2已解决，3未打分，4已打分，5未审批，6已审批，7发布，11详情，12去解决，21详情
			},
			upData:{}
		},
		appLifeData:{}
    },
    mutations: {	//只接受1一个参数，，悲剧的，坑了好久
		//以下可以编写任意接口作为简化的数据更新方法。
        login(state, userData) {
			state.userData.userInfo = userData || {};
            state.userData.hasLogin = true;
			//所有修改的最后一句都应该更新持久化数据
			saveStateData('userData',state.userData);				
        },
        logout(state) {
            state.userData.hasLogin = false;
			//所有修改的最后一句都应该更新持久化数据
			saveStateData('userData',state.userData);
			removeStateData('navData');
			removeStateData('userData');
			removeStateData('voiceData');
        },	
		setLeftIcon(state, navData) {
		    state.navData.navIndex.leftIcon = navData || 0;
			//所有修改的最后一句都应该更新持久化数据
			saveStateData('navData',state.navData);				
		},
		setLayer(state, voiceData) {
		    state.voiceData.voiceIndex.layer = voiceData || 0;
			saveStateData('voiceData',state.voiceData);				
		},
		setUpData(state, voiceData) {
		    state.voiceData.upData = voiceData || {};
			saveStateData('voiceData',state.voiceData);				
		},
		//以下为固定函数，不需要改动，主要提供了持久化的状态数据（初始化和更新）统一接口。
		setStateData(state,newUserData){	//更新状态数据并保存到存储。
			if(Array.isArray(newUserData)){
				var keyname = newUserData[0];
				var dat = newUserData[1];
			}else{
				var stateKeys = Object.keys(state);
				var keyname = stateKeys[0];
				var dat = newUserData;
			}
			// console.log(dat);
			state[keyname] = service.extend(true, state[keyname],dat);
			//所有修改的最后一句都应该更新持久化数据
			saveStateData(keyname,state[keyname]);				
		},
		initStateData(state){	//从存储读取并初始化状态数据
			//在 App.vue 文件的 onLaunch 里面调用这个函数，即可在启动app 的时候初始化数据。
			for(var keyname in state){
				var stateData = uni.getStorageSync('state_'+keyname);
				console.log('初始化状态数据：' + keyname, JSON.stringify(stateData));
				//初始化state的数据
				state[keyname] = service.extend(true, state[keyname], stateData);
				//所有修改的最后一句都应该更新持久化数据
				saveStateData(keyname,state[keyname]);
			}
		}
    }
})

export default store
