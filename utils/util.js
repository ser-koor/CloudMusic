// 解析歌词和时间
const resultLyric = lyric => {
  // console.log(lyric);
  const lyricArray = lyric.split("\n");
  //去掉最后的空
  if (lyricArray[lyricArray.length-1]==""){
    lyricArray.pop;
  }
  // 歌词匹配规则
  let re = /\[\d{2}:\d{2}\.\d{2,3}\]/;
  // 存储时间和对应歌词的数组
  var result = [];
  lyricArray.forEach(function(v,i,a){
      var lyricOne = "";
      var time = "";
      time =lyricOne.match(re);
    lyricOne = v.replace(re, "");
      if(lyricOne.match(re)!=null){
        // 提取时间
        time = lyricOne.match(re);
        // 重新获取时间歌词
          lyricOne = lyricOne.replace(re,"");
      }else{
          time = v.match(re);
      }
      
    // var time = v.match(re);
    if(time!=null){
      // 字符串的截取方法 slice（a,b）
      var timeStr = time[0].slice(1,-1);
      var timeArray = timeStr.split(":");
      //将字符串转换成小数：parseFloat（）
      var timeResult = parseFloat(timeArray[0])*60 + parseFloat(timeArray[1]);
      // 将歌词和时间添加到数组中
      result.push([timeResult,lyricOne]);
    }
  })
  return result
  
}
// 去掉空字符串的歌词
const sliceNull = resultLyric => {
  let result = [];
    for (var i = 0; i < resultLyric.length;i++){
      if (resultLyric[i][1]!=""){
        result.push(resultLyric[i]);
    }
  }
  return result;
}

export default {
  resultLyric,
  sliceNull
}
