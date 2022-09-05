import http from "@/plugin/request.js";
// get方式
export const xxx = data => http.get('/xxx/xxx', data)

//post方式
export const xxxx = data => http.post('/xxxx/xxxx', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})

//点检单列表
export const GetMachineInspection = data => http.post('/MachineUseSer.asmx/GetMachineInspection', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
//列表里面的详情页
export const SubmitInspectionStart = data => http.post('/MachineUseSer.asmx/SubmitInspectionStart', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
//列表里面的详情页
export const ShowInspectionHeadAssMachine = data => http.post('/MachineUseSer.asmx/ShowInspectionHeadAssMachine', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
