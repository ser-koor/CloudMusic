// pages/home/home.js
import homeApi from '../../api/homeApi'
import playApi from '../../api/palyApi'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgs: [
            'http://p1.music.126.net/AF05UXU-hZh_NTOAD4dpLQ==/109951167994680442.jpg?imageView&quality=89',
            'http://p1.music.126.net/yrabyD2i6kU9Thf2Z9ZWdg==/109951167994689890.jpg?imageView&quality=89',
            'http://p1.music.126.net/GDZ4cxHoL-aJ8vTn5vENSQ==/109951167994803636.jpg?imageView&quality=89',
            'http://p1.music.126.net/Mm5NVNlDETNBEw7lInbadw==/109951167994708146.jpg?imageView&quality=89',
            'http://p1.music.126.net/jCdDMJrANePEUXtYrg116A==/109951167994726946.jpg?imageView&quality=89'
        ],
        musicList: [
            {
                id: '',
                image: '',
                musicName: '',
                musicInfo: ''
            }
        ],
        kw: '',
        limit: 10,
        placeholder: '后来',
        popMusic: [
            {
                id: '167827',
                image: 'https://p2.music.126.net/LMyITvYRS7NsgA9lYUKpqg==/109951164179134667.jpg',
                musicName: '素颜',
                musicInfo: '许嵩'
            },
            {
                id: '121543550',
                image: 'https://p1.music.126.net/xdegZlt9xmez_MxuH_PzXA==/109951165623999837.jpg',
                musicName: '千千万万',
                musicInfo: '深海鱼子酱'
            },
            {
                id: '1988564487',
                image: 'https://p1.music.126.net/WP8O0ixZNwpm0fG6zymivQ==/109951167957001651.jpg',
                musicName: '会魔法的老人',
                musicInfo: '法老'
            }
        ]
    },
    // 搜索关键词
    getKeyWord(e) {
        console.log(e.placeholder);
        let value = e.detail.value 
        this.setData({
            kw: value
        })
    },
    //点击搜索
    async doSearch() {
        if (!this.data.kw) {
            this.setData({
                kw: this.data.placeholder
            })
        }
        await homeApi.getSearchMusic(this.data.kw, this.data.limit).then(res => {
            // console.log(res);
            let resultSongs = res.data.result.songs;
            this.handleApiFoe(resultSongs)
            // console.log(this.data.musicList);
        })
            this.onReady()
            // console.log(this.data.musicList);
    },
    async handleApiFoe (resultSongs) {
        let songs = [];
        for (let index = 0; index < resultSongs.length; index++) {
            let songsItem = {
                id: '',
                image: '',
                musicName: '',
                musicInfo: ''
            }
            await playApi.getMusicInfoById(resultSongs[index].id).then(ress => {
                let picUrl = ress.data.songs[0].album.picUrl;
                    songsItem.id = resultSongs[index].id,
                    songsItem.image = picUrl,
                    songsItem.musicName = resultSongs[index].name,
                    songsItem.musicInfo = resultSongs[index].artists[0].name
                    songs.push(songsItem)
                    this.setData({
                        musicList: songs
                    })
            })
        // console.log(songsItem);
        }
    },
    // 跳转到播放页面
    toPlay(e) {
        // console.log(e);
        const musicId = e.currentTarget.dataset.item.id
        // console.log(musicId);
        wx.navigateTo({
          url: '/pages/play/play?musicId='+musicId,
        //   events: ,
          success: (result) => {},
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
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
        // let kw = this.data.kw;
        // this.setData({
        //     limit:this.data.limit+6
        // })
        // this.doSearch()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})