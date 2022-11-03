import request from './request'
//根据id获取歌曲信息
function getMusicInfoById(id) {
	console.log(id);
	return request({
		url: '/song/detail/?id=' + id + '&ids=[' + id + ']'
	})
}
// 根据id获取歌词
function getLyricById(id) {
	return request({
		url: '/song/lyric?os=pc&id='+id+'&lv=-1&kv=-1&tv=-1'
	})
}
export default {
	getMusicInfoById,
	getLyricById
}