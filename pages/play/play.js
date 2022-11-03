// pages/play/play.js
import Api from '../../api/palyApi'
import Util from '../../utils/util'

const AudioCtx = wx.createInnerAudioContext(); 

Page({

    /**
     * 页面的初始数据
     */
    data: {
        musicId: 0,
        song: {},
        switch: true,
        move: 0,
        max: 0,
        playTime: "00:00",
        endTime: "00:00",
        play: false,
        lyricContent: null,
        marginTop:0,
        currentIndex:0,
        src: '',
        silder: false
    },
    // 拖动滑块控制播放时间
    dragSlider(e) {
        // this.setData({
        //     silder: true
        // })
        // console.log(e.detail.value);
        let sliderValue = e.detail.value;
        AudioCtx.seek(sliderValue);
        //将当前时间转换为分和秒
        let playMinutes = Math.floor(sliderValue / 60);
        //计算秒
        let playSeconds = Math.floor(sliderValue % 60);
        
        if (playMinutes < 10) {
            playMinutes = "0" + playMinutes
        }
        if (playSeconds < 10) {
            playSeconds = "0" + playSeconds
        }
        this.setData({
            move: sliderValue,
            playTime: playMinutes + ':' + playSeconds
            // silder: false
        })
        console.log(this.data.move);
        console.log(this.data.marginTop);
    },
    // // 滑块拖动过程中
    // dragSlidering(e) {
    //     let value = e.detail.value;
    //     console.log(value);
    //     this.setData({
    //         move: value
    //     })
    // },
    // 控制中间区域 是否切换歌词
    isShow() {
        this.setData(
            {
                switch: !this.data.switch
            }
        ) 
    },
    // 控制是否播放
    pauseClick() {
        this.setData({
            play: !this.data.play
        });
        if (this.data.play) {
            AudioCtx.play();
        } else {
            AudioCtx.pause();
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // console.log(options);
        const mID = options.musicId;
        // console.log(mID);
        this.setData({
            musicId: mID,
            src: "http://music.163.com/song/media/outer/url?id=" + mID + ".mp3"
        })
       
        // 获取歌曲信息
        Api.getMusicInfoById(mID).then(res => {
            const resultSong = res.data.songs[0];
            // console.log(resultSong);
            this.setData({
                song:resultSong
            })
        })

        // 获取歌词
        Api.getLyricById(mID).then(res => {
            console.log(res);
            const lyric = res.data.lrc.lyric
            //获取到歌词和时间数组
            let resultLyric = Util.resultLyric(lyric);
            // 去掉空字符串的歌词
            resultLyric = Util.sliceNull(resultLyric);
            this.setData({
                lyricContent: resultLyric
            })
        })
    },
    
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        // 页面初次渲染完成，将音频地址放入播放器
       AudioCtx.src = this.data.src;
       // 监听音频进入可以播放状态的事件。但不保证后面可以流畅播放，
        //必须要这个监听，不然播放时长更新监听不会生效，不能给进度条更新值
        AudioCtx.onCanplay(() => {
            AudioCtx.duration
        })
        // 播放结束后停止播放
        AudioCtx.onEnded(() =>{
            this.setData({
                play: false
            })
        })
        // 播放时长更新监听
        AudioCtx.onTimeUpdate(() => {
            // console.log(AudioCtx.currentTime);
            // console.log(AudioCtx.duration);
            //获取当前时间
            let currentTime = AudioCtx.currentTime;
             //获取歌曲总时长
            let duration = AudioCtx.duration;
            //将当前时间转换为分和秒
            let playMinutes = Math.floor(currentTime / 60);
            //计算秒
            let playSeconds = Math.floor(currentTime % 60);
            // 03:03
            //将结束时间转换为分和秒
            let endMinutes = Math.floor(duration / 60);
            let endSeconds = Math.floor(duration % 60);
            if (playMinutes < 10) {
                playMinutes = "0" + playMinutes
            }
            if (playSeconds < 10) {
                playSeconds = "0" + playSeconds
            }
            if (endMinutes < 10) {
                endMinutes = "0" + endMinutes
            }
            if (endSeconds < 10) {
                endSeconds = "0" + endSeconds
            }
            //给data中的max和move赋值
            this.setData({
                max: duration,
                // move: this.data.silder ? this.data.move : currentTime,
                move: currentTime,
                playTime: playMinutes + ":" + playSeconds,
                endTime: endMinutes + ":" + endSeconds
            })
            //获取data中的lyricContent
            let lyricArray = this.data.lyricContent;
            //判断是否唱完倒数第二句
            if (this.data.currentIndex == lyricArray.length - 2) {
            //当前歌曲进度比最后一句开始的时间大，一定在唱最后一句
            if (currentTime >= lyricArray[lyricArray.length - 1][0]) {
                this.setData({
                currentIndex: lyricArray.length - 1
                })
            }
            } else {
                //遍历歌词数组
                //将currentTime跟每一句歌词的时间都要比较
                // for循环满足第一句到倒数第二句，都没有问题
                for (let i = 0; i < lyricArray.length - 1; i++) {
                    //比当前行的时间大，比下一行的时间小,代表正在播放当前行
                    if (currentTime >= lyricArray[i][0] && currentTime < lyricArray[i + 1][0]) {
                    //给当前的行号赋值
                    this.setData({
                        currentIndex: i
                    })
                    }
                }
            }

            //根据当前播放到的行号去改变marginTop的值，来实现歌词的滚动
            //唱完第九行，才开始滚动
            if (this.data.currentIndex >= 5) {
                //给marginTop赋值
                this.setData({
                // marginTop:30的倍数 
                marginTop: (this.data.currentIndex - 5) * 30
                })
            }
            console.log(this.data.marginTop,this.data.currentIndex);
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})