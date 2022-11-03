import request from './request'

function getSearchMusic(kw,limit){
	return request({
	  url: '/search/get?s='+kw+'&type=1&limit='+limit,
	})
}

export default {
	getSearchMusic
}