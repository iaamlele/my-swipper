/**
 * obj:
 * imgArr: 图片数组
 * aniTime: 动画时间
 * intervalTime: 轮播时间
 * autoplay: 是否自动播放
 */
const imgArr = [
    {
        id: 1,
        imgPath: './img/1.jpg',
    },
    {
        id: 2,
        imgPath: './img/2.jpg',
    },
    {
        id:3,
        imgPath: './img/3.jpg',
    },
    {
        id:4,
        imgPath: './img/4.jpg',
    },
    {
        id:5,
        imgPath: './img/5.jpg',
    }
];

function Swiper(obj) {
    this.imgArr = obj.imgArr || [];
    this.aniTime = obj.aniTime || 2000;
    this.intervalTime = obj.intervalTime || 2500;
    this.autoplay = obj.autoplay || false;
}

Swiper.prototype = {
    init: function() {

    },
    initDom: function() {
        
    }
};

new Swiper({
    imgArr: imgArr,
    aniTime: 1500,
    intervalTime: 2500,
    autoplay: true
}).init();