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
    this.timer = null;
    this.prev = Date.now();

    this.swiperListDom = document.getElementsByClassName('swiper-list')[0];

    this.moveWidth = this.swiperListDom.offsetWidth;
}

Swiper.prototype = {
    init: function() {
        this.initDom();

        // 轮播图片
        let li = '';
        for(let i = 0; i < this.retImgArr.length; i++) {
            li += `<li style="left: ${i * this.moveWidth}px; width: ${this.moveWidth}px; class="swiper-item">
                    <a href="${this.retImgArr[i].url}">        
                        <img src="${this.retImgArr[i].imgPath}" alt="img">
                    </a>
                </li>`;
        }
        this.mainDom.innerHTML = li;

        // 小圆点
        let dot = '';
        for(let i = 0; i < this.retImgArr.length; i++) {
            if(i === 0) {
                dot += `<li class="dot-item" style="background-color:#ff5c1f"; index=${i}></li>`;
            } else {
                dot += `<li class="dot-item" style="background-color:#fff" index=${i}></li>`;
            }
        }
        this.dotDom.innerHTML = dot;

        this.eventBind();
        this.timer = setInterval(this.nextSlider.bind(this, this.aniTime), this.intervalTime);

    },
    initDom: function() {
        // 轮播主容器
        this.mainDom = document.createElement('ul');
        this.mainDom.className = 'swiper-main';
        this.mainDom.style.width = `${this.moveWidth * this.retImgArr.length}px`;
        this.mainDom.style.left = `${-this.moveWidth}px`;
        this.swiperListDom.appendChild(this.mainDom);

        // 小圆点
        this.dotDom = document.createElement('ul');
        this.dotDom.className = 'swiper-dot';
        this.swiperListDom.appendChild(this.dotDom);

        // 上一张按钮
        this.prevBtn = document.createElement('img');
        this.prevBtn.className = 'left-btn';
        this.prevBtn.src = '../img/left.png';
        this.swiperListDom.appendChild(this.prevBtn);

        // 下一张按钮
        this.nextBtn = document.createElement('img');
        this.nextBtn.className = 'right-btn';
        this.nextBtn.src = '../img/right.png';
        this.swiperListDom.appendChild(this.nextBtn);
    },
    prevSlider: function(aniTime) {
        let that = this;
        if(this.imgArr.length === 1 || this.imgArr.length === 0) return;
        this.mainDom.style.transition = `left ${aniTime}ms ease-in-out`;
        this.mainDom.style.left = `${parseInt(this.mainDom.style.left) + this.moveWidth}px`; // mainDom.style.left 返回的是一个字符串

        if(this.nowIndex === 0) {
            this.nowIndex = that.retImgArr.length - 1;
            this.setActiveDot(this.nowIndex);
            setTimeout(function() {
                that.mainDom.style.transition = 'none';
                that.mainDom.style.left = `-${that.imgArr.length} * ${that.moveWidth}px`;
            }, aniTime)
        } else {
            this.nowIndex--;
            this.setActiveDot(this.nowIndex);
        }
    },
    nextSlider: function(aniTime) {
        let that = this;
        if(this.imgArr.length === 1 || this.imgArr.length === 0) return;
        this.nowIndex++;
        this.mainDom.style.transition = `left ${aniTime}ms ease-in-out`;
        this.mainDom.style.left = `${parseInt(this.mainDom.style.left) - this.moveWidth}px`;
        if(this.nowIndex === this.retImgArr.length - 2) { // ?
            this.nowIndex = 0;
            this.setActiveDot(this.nowIndex);
            setTimeout(function() {
                that.mainDom.style.transition = 'none';
                that.mainDom.style.left = `${that.moveWidth}px`; // ?
            }, aniTime);
        }else {
            this.setActiveDot(that.nowIndex);
        }
        
    },
    setActiveDot: function(nowIndex) {
        console.log('OK:',this.dotDom.children.length);
        for(let i = 0; i < this.dotDom.children.length; i++) {
            // console.log('i:', i, 'nowIndex', nowIndex);
            if(i === nowIndex) {
                document.getElementsByClassName('dot-item')[i].style.backgroundColor = '#ff5c1f';
            }else {
                document.getElementsByClassName('dot-item')[i].style.backgroundColor = '#fff';
            }
        }
    },
    eventBind: function(){
        // 上一张事件绑定
        let that = this;
        this.prevBtn.addEventListener('mouseover', function() {
            clearInterval(that.timer);
        });
        this.prevBtn.addEventListener('mouseout', function() {
            that.timer = setInterval(that.nextSlider.bind(that, that.aniTime), that.intervalTime);
        });
        this.prevBtn.addEventListener('click', function() {
            that.throttle(that.prevSlider, 300, 300);
        });

        // 下一张事件绑定
        this.nextBtn.addEventListener('mouseover', function() {
            clearInterval(that.timer);
        });
        this.nextBtn.addEventListener('mouseout', function() {
            that.timer = setInterval(that.nextSlider.bind(that, that.aniTime), that.intervalTime);
        });
        this.nextBtn.addEventListener('click', function() {
            that.throttle(that.nextSlider, 300, 300);
        });

        // 小圆点事件绑定
        this.dotDom.addEventListener('mouseover', function() {
            clearInterval(that.timer);
        });
        this.dotDom.addEventListener('mouseout', function() {
            that.timer = setInterval(that.nextSlider.bind(that, that.aniTime), that.intervalTime);
        });
        this.dotDom.addEventListener('click', function(e) {
            const event = e;
            let target = event.target;
            if(target.tagName.toLowerCase() === 'li') {
                let res = this.querySelectorAll('li');
                let index = Array.prototype.indexOf.call(res, target);
                that.nowIndex = index;
                that.setActiveDot(that.nowIndex);
                that.mainDom.style.left = `${-that.nowIndex * that.moveWidth}px`;
                that.mainDom.style.transition = `left 0.8s ease-in-out`;
            }
        });
    },
    throttle: function(handle, delay, val) {
        let now = Date.now();
        if(now - this.prev > delay) {
            handle.call(this, val);
            this.prev = now;
        }
    }

};

