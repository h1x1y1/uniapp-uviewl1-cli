import http from "@/plugin/request.js";
// get方式
export const xxx = data => http.get('/xxx/xxx', data)

//post方式
export const xxxx = data => http.post('/xxxx/xxxx', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})


//查询问题单 
export const GetOrderReport = data => http.post('/MachineUseSer.asmx/GetOrderReport', data, {
	headers: {
		"content-type": "application/x-www-form-urlencoded",
	}
})
