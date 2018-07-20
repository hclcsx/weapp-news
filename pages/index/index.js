//index.js
//获取应用实例
const moment = require('../../libs/moment.min.js');
const app = getApp()
const NewsCategories = [{
  key: 'gn',
  value: '国内',
}, {
  key: 'gj',
  value: '国际',
}, {
  key: 'cj',
  value: '财经',
}, {
  key: 'yl',
  value: '娱乐',
}, {
  key: 'js',
  value: '军事',
}, {
  key: 'ty',
  value: '体育',
}, {
  key: 'other',
  value: '其他',
}];

Page({
  data: {
    list: [],
    hotList: [],
    selectedCategory: 'gn',
    newsCategories: NewsCategories,
  },

  onLoad() {
    this.getNews();
  },

  onPullDownRefresh() {
    this.getNews(() => {
      wx.stopPullDownRefresh();
    });
  },

  getNews(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: this.data.selectedCategory,
      },
      success: res => {
        console.log(res.data);
        const news = res.data.result;
        const newsWithDate = news.map(item => {
          return {
            time: moment(item.date).format('HH:mm'),
            ...item,
          };
        });
        this.setData({ list: newsWithDate, hotList: newsWithDate.slice(0, 3) });
      },
      complete: () => {
        callback && callback();
      }
    })
  },

  onTapChangeCategory(event) {
    const key = event.target.id;
    this.setData({ selectedCategory: key });
    this.getNews();
  },

  onTapInspectNews(event) {
    const newsId = event.currentTarget.id;
    wx.navigateTo({
      url: `/pages/details/details?id=${newsId}`,
    });
  }
})
