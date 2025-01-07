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
    this.retImgArr = [this.imgArr[this.imgArr.length - 1], ...this.imgArr, this.imgArr[0]];

    this.aniTime = obj.aniTime || 2000;
    this.intervalTime = obj.intervalTime || 2500;
    this.autoplay = obj.autoplay || false;
    this.mainDom;
    this.dotDom;
    this.prevBtn;
    this.nextBtn;
    this.nowIndex = 0;

    this.swiperListDom = document.getElementsByClassName('swiper-list');

    this.moveWidth = this.swiperListDom.offsetWidth;
}

Swiper.prototype = {
    init: function() {
        this.initDom();

        // 轮播图片
        let li = '';
        for(let i = 0; i < this.retImgArr.length; i++) {
            li += `<li style="left: ${i * this.moveWidth}px; width: ${this.moveWidth}px; class="swiper-item">
                    <img src="${this.retImgArr[i].imgPath}" alt="img">
                </li>`;
        }
        this.mainDom.innerHtml = li;

        // 小圆点
        let dot = '';
        for(let i = 0; i < this.retImgArr.length; i++) {
            if(i === 0) {
                dot += `<li class="swiper-dot-item" style="background-color:#ff5c1f; index: ${i}"></li>`;
            } else {
                dot += `<li class='swiper-dot-item" style="background-color:#fff" index=${i}></li>`;
            }
        }
        this.mainDom.innerHtml = dot;

    },
    initDom: function() {
        // 轮播主容器
        this.mainDom = document.createElement('ul');
        this.mainDom.className = 'swiper-main';
        this.mainDom.style.width = this.moveWidth + 'px';
        this.mainDom.style.left = -this.moveWidth + 'px';
        this.swiperListDom.appendChild(this.mainDom);

        // 小圆点
        this.dotDom = document.createElement('ul');
        this.dotDom.className = 'swiper-dot';
        this.swiperListDom.appendChild(this.dotDom);

        // 上一张按钮
        this.prevBtn = document.createElement('img');
        this.prevBtn.className = 'left-btn';
        this.prevBtn.src = './img/left.png';
        this.swiperListDom.appendChild(this.prevBtn);

        // 下一张按钮
        this.nextBtn = document.createElement('img');
        this.nextBtn.className = 'right-btn';
        this.nextBtn.src = './img/right.png';
        this.swiperListDom.appendChild(this.nextBtn);
    },
    prevSlider: (aniTime) => {
        if(this.imgArr.length === 1 || this.imgArr.length === 0) return;
        this.mainDom.style.transition = `left ${aniTime}ms ease-in-out`;
        this.mainDom.style.left = `${this.mainDom.style.left + this.moveWidth}px`;

        if(this.nowIndex === 0) {
            this.nowIndex = this.retImgArr.length - 1;
            this.setActiveDot(this.nowIndex);
            setTimeout(function() {
                this.mainDom.style.transition = 'none';
                this.mainDom.style.left = `-${this.imgArr.length} * $(this.moveWidth)px`;
            }, aniTime)
        } else {
            this.nowIndex--;
            this.setActiveDot(this.nowIndex);
        }
    },
    nextSlider: (aniTime) => {
        if(this.imgArr.length === 1 || this.imgArr.length === 0) return;
        this.nowIndex++;
        this.mainDom.style.transition = `right ${aniTime}ms ease-in-out`;
        this.mainDom.left = `${this.mainDom.left - this.moveWidth}px`;

        if(this.nowIndex === this.retImgArr.length - 1) { // ?
            this.nowIndex = 0;
            this.setActiveDot(this.nowIndex);
            setTimeout(function() {
                this.mainDom.style.transition = 'none';
                this,mainDom.left = `${this.moveWidth}px`; // ?
            }, aniTime);
        }else {
            this.setActiveDot(this.nowIndex);
        }
    },
    setActiveDot: function(nowIndex) {
        for(let i = 0; i < this.dotDom.children.length; i++) {
            if(i === nowIndex) {
                document.getElementsByClassName('swiper-dot item')[i].style.backgroundColor = '#ff5c1f';
            }else {
                document.getElementsByClassName('swiper-dot item')[i].style.backgroundColor = '#fff';
            }
        }
    },
    eventBind: () => {
        // 上一张事件绑定
    }

};

new Swiper({
    imgArr: imgArr, // 图片数组
    aniTime: 1500, // 动画时间
    intervalTime: 2500, // 轮播时间
    autoplay: true // 是否自动播放
}).init();