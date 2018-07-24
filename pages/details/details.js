// pages/details/details.js
const moment = require('../../libs/moment.min.js');
Page({
 data: {
   article: {},
   content: [],
  },
  onLoad: function (options) {
    console.log(options.id);
    this.getNewsDetail(options.id);
  },

  getNewsDetail(newsId) {
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data: {
        id: newsId,
      },
      success: res => {
        const article = res.data.result;
        const articleWithData = {
          time: moment(article.date).format('YYYY-MM-DD HH:mm'),
          ...article,
        }
        this.setData({ article: articleWithData });
        this.parseContentToNodes(articleWithData.content);
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  },

  // 把content转换为rich-text组件所需数据结构
  // https://developers.weixin.qq.com/miniprogram/dev/component/rich-text.html
  parseContentToNodes(content) {
    const nodes = content.map(node => {
      if (node.type === 'image') 
        return {
          name: 'img',
          attrs: {
            src: node.src,
            class: 'news-img',
          },
        };
      else  
        return {
          name: node.type,
          attrs: {
            class: 'news-p',
          },
          children: [{
            type: 'text',
            text: node.text,
          }]
        };
    });
    this.setData({ content: nodes });
  }
})