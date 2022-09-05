import http from "@/plugin/request.js";
// get方式
export const xxx = data => http.get('/xxx/xxx', data)

//post方式
export const xxxx = data => http.post('/xxxx/xxxx', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

//根据父单查，领料单清单
export const GetFittingUseOrderMain = data => http.post('/MachineUseSer.asmx/GetFittingUseOrderMain',data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

export const GetFittingUseOrder = data => http.post('/MachineUseSer.asmx/GetFittingUseOrder',data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
//查询已经添加的人员
export const GetWorkUser = data => http.post('/MachineUseSer.asmx/GetWorkUser', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

//保存物料 到 领料单号
export const SetFittingUseOrderDetail = data => http.post('/MachineUseSer.asmx/SetFittingUseOrderDetail',data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

//保存保养作业人员（循环保存）
export const SaveWorkUser = data => http.post('/MachineUseSer.asmx/SaveWorkUser', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
//保存物料，创建预留 前获取领料单号
export const CreateFittingsOrder = data => http.post('/MachineUseSer.asmx/CreateFittingsOrder',data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

// 保养任务列表
export const GetMachineMaintain = data => http.post('/MachineUseSer.asmx/GetMachineMaintain', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

// 搜索人员
export const getPersoin = data => http.post('/MachineUseSer.asmx/GetMTUser', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
//改派
export const setPersoin = data => http.post('/MachineUseSer.asmx/SetMTUser',data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
//查询物料
export const getMaterial = data => http.post('/MachineUseSer.asmx/GetWHFittings',data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
//保存物料，创建预留
export const setMaterialOrder = data => http.post('/MachineUseSer.asmx/SetFittingUseOrder',data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
