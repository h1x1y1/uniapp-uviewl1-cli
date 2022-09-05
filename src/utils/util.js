import sha1 from 'js-sha1'

/**
 * 获取当前时间 时间戳 企业微信
 * @returns {number}
 */
export function getTimestamp() {
  return Date.parse(new Date());
}

/**
 * 获取随机字符串 企业微信
 * @param len 可指定长度
 * @returns {string}
 */
export function randomString(len) {
  len = len || 32
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  var maxPos = $chars.length
  var pwd = ''
  for (var i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

/**
 * 拼接签名字符串 企业微信
 * @param ticket 通过access_token获取的jsapi_ticket
 * @param noncestr 自己生成的随机字符串
 * @param timestamp 生成签名时的时间戳
 * @returns {*}
 */
export function getSignature(ticket, noncestr, timestamp) {
  let url = window.location.href.split("#")[0]
  let jsapi_ticket = `jsapi_ticket=${ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`
  return sha1(jsapi_ticket);
}

/**
 * 设置缓存
 * @param storage_key
 * @param data
 */
function setStorage(storage_key,data) {
    let status = null;
    uni.setStorage({
        key: storage_key,
        data: data,
        success:() => {
            status = true;
        },
        fail:() => {
            status = false;
        }
    });

    return status;
}

/**
 * 覆盖缓存
 * @param storage_key
 * @param data
 * @returns {boolean}
 */
function setStorageSync(storage_key,data){
    try {
        uni.setStorageSync(storage_key, data);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * 获取缓存内容
 * @param storage_key
 * @returns {*}
 */
function getStorage(storage_key) {
    try {
        const value = uni.getStorageSync(storage_key);
        if (value) {
            return value;
        }
        return false;
    } catch (e) {
        return false;
    }
}

/**
 * 删除指定缓存
 * @param storage_key
 * @returns {boolean}
 */
function removeStorage(storage_key) {
    try {
        uni.removeStorageSync(storage_key);
    } catch (e) {
        return false;
    }
}

/**
 * 清理所有缓存
 * @returns {boolean}
 */
function clearStorage() {
    try {
        uni.clearStorageSync();
    } catch (e) {
        return false;
    }
}

/**
 * 获取用户登录缓存
 * @returns {any}
 */
function getUsersAuth() {
    let users = getStorage('users');
    if (!users || users == 'null' || users == 'undefined'){
        users = '{}';
    }
    return users;
}

/**
 * 删除用户退出登录
 * @returns {boolean}
 */
function delUsersAuth() {
    return removeStorage('users')
}

/**
 * 确认提示
 * @param msg
 * @param to_url
 */
function confirm_msg(msg,to_url = undefined) {
    uni.showModal({
        title: '确认提示',
        content: msg,
        success:(res) => {

            if (res.cancel){
                return false;
            }

            if (to_url){
                uni.redirectTo({url: to_url});
            }
        }
    });
}

/**
 * 错误提示
 * @param msg
 * @param to_url
 */
function error_msg(msg,to_url = undefined) {
    uni.showModal({
        title: '错误提示',
        content: msg,
        success:(res) => {
            if (to_url){
                uni.redirectTo({url: to_url});
            }else {
                uni.navigateBack({delta: 1});
            }
        }
    });
}

/**
 * 确认不做操作
 * @param title
 * @param msg
 */
function message_modal(title,msg) {
    uni.showModal({
        showCancel:false,
        confirmText:"好的",
        title: title, content: msg
    });
}

/**
 * 确认并返回上层
 * @param title
 * @param msg
 */
function msg_to_back(title,msg) {
    uni.showModal({
        showCancel:false,
        confirmText:"好的",
        title: title, content: msg,
        success:(res) => {
            uni.navigateBack({delta: 1});
        }
    });
}

/**
 * 确认并跳转连接
 * @param title
 * @param msg
 * @param url
 */
function msg_model_to_url(title,msg,url) {
    uni.showModal({
        showCancel:false,
        confirmText:"好的",
        title: title, content: msg,
        success:(res) => {
            uni.navigateTo({url: url});
        }
    });
}

/**
 * 自动消失提示框，无图标
 * @param msg
 * @param time
 */
function toast_msg(msg,time = 3000) {
    uni.showToast({
        title: msg,
        duration: time,
        icon: "none"
    });
}

/**
 * 成功提示框
 * @param msg
 * @param time
 */
function success_msg(msg,time = 3000) {
    uni.showToast({
        title: msg,
        duration: time,
        icon: "success"
    });
}

function timeout_to_url(url,time = 3000) {
    setTimeout(() => {
        uni.redirectTo({url: url});
    },time);
}

function timeout_to_back(delta = 1,time = 3000) {
    setTimeout(() => {
        uni.navigateBack({delta: delta});
    },time);
}

function timeout_to_switch_tab(url,time = 3000) {
    setTimeout(() =>{
        uni.switchTab({url: url});
    },time)
}

/**
 * 验证数据是否合法
 * @param data
 * @returns {boolean}
 */
function verifyData(data){

    if (data == undefined){
        return false;
    }

    if (typeof(data) != "object"){
        return false;
    }

    return true;
}

/**
 * file转base64
 * @param file
 * @param callback
 */
function blobToDataURI(file, callback) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        callback(e.target.result);
    }
}

/**
 * 仿php in_array
 * @param search
 * @param array
 * @returns {boolean}
 */
function in_array(search,array){
    for(var i in array){
        if(array[i]==search){
            return true;
        }
    }
    return false;
}

function to_url(url) {
    return uni.navigateTo({url: url});
}

function to_back(delta=1) {
    uni.navigateBack({delta: delta});
}

function to_switch_tab(url) {
    return uni.switchTab({url: url});
}

function getDistance( lat1,  lng1,  lat2,  lng2){
    var radLat1 = lat1*Math.PI / 180.0;
    var radLat2 = lat2*Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
        Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s *6378.137 ;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
}

export default {
    setStorage,setStorageSync,getStorage,removeStorage,clearStorage,getDistance,
    timeout_to_back, getUsersAuth,delUsersAuth,confirm_msg,error_msg, toast_msg,
    success_msg,timeout_to_url,verifyData,blobToDataURI,in_array,to_url,message_modal,
    msg_to_back,timeout_to_switch_tab,msg_model_to_url,to_switch_tab,to_back
}