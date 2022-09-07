import http from "./request.js";
// get方式
export const xxx = data => http.get('/xxx/xxx', data)

//post方式
export const xxxx = data => http.post('/xxxx/xxxx', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

// 登录
export const Login = data => http.post('/UserInfoSer.asmx/Login', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
 
// 企业微信登录 默认密码CXenterpriseLogin
export const LoginWX = data => http.post('/UserInfoSer.asmx/EnterPriseLogin', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
// 查询方法
export const GetMachineStatus = data => http.post('/MachineUseSer.asmx/GetMachineStatus', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

// 查询方法
export const GetUserTasks = data => http.post('/UserInfoSer.asmx/GetUserTasks', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

// 更改状态方法
export const SetMachineStatus = data => http.post('/MachineUseSer.asmx/SetMachineStatus', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
// 判断code
export const CheckQRCodeApp = data => http.post('/AssetSer.asmx/CheckQRCodeApp', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
// 判断盘点
export const CheckQRCodeAppInventory = data => http.post('/AssetSer.asmx/CheckQRCodeAppInventory', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
// 保养
export const GetMachineMaintainItemsAPP = data => http.post('/MachineUseSer.asmx/GetMachineMaintainItemsAPP', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
// 点检
export const GetMachineInspectionItemsAPP = data => http.post('/MachineUseSer.asmx/GetMachineInspectionItemsAPP',
	data, {
		headers: {
			"content-type": "application/x-www-form-urlencoded",
		}
	})
// 提交保养
export const SubmitMaintainResult = data => http.post('/MachineUseSer.asmx/SubmitMaintainResult', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
// 提交点检
export const SubmitInspectionResult = data => http.post('/MachineUseSer.asmx/SubmitInspectionResult', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

// 盘点单号
export const GetInventoryOrderList = data => http.post('/AssetSer.asmx/GetInventoryOrderList', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

// 点接单维修
export const GetRepairList = data => http.post('/MachineUseSer.asmx/GetRepairList', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

// 获取待接单设备列表
export const GetRepairWorkList = data => http.post('/MachineUseSer.asmx/GetRepairWorkList', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

// 点使用零件+
export const GetRepairFittings = data => http.post('/MachineUseSer.asmx/GetRepairFittings', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
// 清空零件+
export const DelMachineRepairFitting = data => http.post('/MachineUseSer.asmx/DelMachineRepairFitting', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

// 修改零件+
export const SetMachineRepairFitting = data => http.post('/MachineUseSer.asmx/SetMachineRepairFitting', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})


// 维修完成+
export const SetMachineRepairWork = data => http.post('/MachineUseSer.asmx/SetMachineRepairWork', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
// 维修接受-1.获取待接单设备列表
export const GetRepairFinshList = data => http.post('/MachineUseSer.asmx/GetRepairFinshList', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
// 维修接受-3.点【维修完成】
export const SetMachineRepairFinsh = data => http.post('/MachineUseSer.asmx/SetMachineRepairFinsh', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

// 盘点单号
export const SetMachineRepair = data => http.post('/MachineUseSer.asmx/SetMachineRepair', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

// 盘点列表
export const GetInventoryPlanList = data => http.post('/AssetSer.asmx/GetInventoryPlanList', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
// 盘点列表
export const CheckQRCode = data => http.post('/AssetSer.asmx/CheckQRCode', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

// 盘点列表
export const FinshInventoryPlanList = data => http.post('/AssetSer.asmx/FinshInventoryPlanList', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

// 信息查询
export const GetQRCodeInfoApp = data => http.post('/AssetSer.asmx/GetQRCodeInfoApp', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
// 判断存在
export const CheckQRCodeInventoryPlan = data => http.post('/AssetSer.asmx/CheckQRCodeInventoryPlan', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

// 上传方法
export const OnPushImage = data => http.post('/PushFile.asmx/OnPushImage', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

// // 下载方法
// export const OnGetImage = data => http.post('/PushFile.asmx/OnGetImage', data, {
// 	headers: {
// 		"content-type": "application/x-www-form-urlencoded",
// 	}
// })

// 下载方法
export const GetqiniuToken = data => http.post('/PushFile.asmx/GetqiniuToken', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

// 点检任务列表
export const GetMachineInspection = data => http.post('/MachineUseSer.asmx/GetMachineInspection', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

// 点检任务开始，扫码前调用
export const SubmitInspectionStart = data => http.post('/MachineUseSer.asmx/SubmitInspectionStart', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

// 保养任务列表
export const getUpKeepList = data => http.post('/MachineUseSer.asmx/GetMachineMaintain', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
// 设备查询接口
export const GetMachineList = data => http.post('/AssetSer.asmx/ShowMachineListApp', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
// 保存问题单
export const SubmitInspectionProblemReport = data => http.post('/MachineUseSer.asmx/SubmitInspectionProblemReport', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
// 关闭问题单
export const CloseOrderReport = data => http.post('/MachineUseSer.asmx/CloseOrderReport', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
// 获取详情页的图片
export const OnGetImage = data => http.post('PushFile.asmx/OnGetImage', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
//创建维修单 
export const SubmitRepairReport = data => http.post('/MachineUseSer.asmx/SubmitRepairReport', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
//查询单据
export const GetOrderReport = data => http.post('/MachineUseSer.asmx/GetOrderReport', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

//查询单据
export const UpdateMachineRepairWorkCX = data => http.post('/MachineUseSer.asmx/UpdateMachineRepairWorkCX', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
//删图片 DelImage(string OrderGuid, string FileName)
export const DelImage = data => http.post('/PushFile.asmx/DelImage', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

// 点检任务开始，扫码后调用
// export const CheckQRCodeApp = data => http.post('/AssetSer.asmx/CheckQRCodeApp', data, {
// 	headers: {
// 		"content-type": "application/x-www-form-urlencoded",
// 	}
// })

// 完成点检后，提交点检单完成时间（调用一次）
export const SubmitInspectionEnd = data => http.post('/MachineUseSer.asmx/SubmitInspectionEnd', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
// 查询维修人员
export const GetRepairWorkUser = data => http.post('/MachineUseSer.asmx/GetRepairWorkUser', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})