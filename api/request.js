const baseUrl = 'https://music.163.com/api'
export default function request(options) {
	return new Promise((resolve, reject) => {
		wx.request({
			url: baseUrl + options.url,
			method: options.method || 'get',
			data: options.data || {},
			success: resolve,
			fail: reject
		 })
	})
}