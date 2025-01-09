function Swiper(obj) {
    this.imgArr = obj.imgArr || [];
    this.retImgArr = [this.imgArr[this.imgArr.length-1], ...this.imgArr, this.imgArr[0]];
    this.aniTime = obj.aniTime || 1500;
    this.intervalTime = obj.intervalTime + this.aniTime || 2500;
    this.nowIndex = 0;

    this.swiperListDom = document.getElementsByClassName('swiper-list')[0];
    this.mainDom;
    this.swiperSpotDom;
    this.leftBtn;
    this.rightBtn;
    
    this.moveWidth = this.swiperListDom.offsetWidth; //
    this.timer = null;

    this.prev = Date.now();

    this.autoplay = obj.autoplay;
}

Swiper.prototype = {
    init: function() {
        this.initDom();

        // 轮播图片
        let li = '';
        for(let i = 0; i < this.retImgArr.length; i++) {
            // 把class写进style里了...
            li += `<li class="swiper-item" style="left: ${i * this.moveWidth}px; width: ${this.moveWidth}px">  
                    <a href="${this.retImgArr[i].url}">        
                        <img src="${this.retImgArr[i].imgPath}" alt="img">
                    </a>
                </li>`;
        }
        this.mainDom.innerHTML = li;

        // 小圆点
        let dot = '';
        for(let i = 0; i < this.imgArr.length; i++) {
            if(i === 0) {
                dot += `<li class="dot-item" style="background-color:#ff5c1f"; index=${i}></li>`;
            } else {
                dot += `<li class="dot-item" style="background-color:#fff" index=${i}></li>`;
            }
        }
        this.swiperSpotDom.innerHTML = dot;

        this.eventBind();
        this.timer = setInterval(this.nextSlider.bind(this, this.aniTime), this.intervalTime);

    },
    initDom: function() {
        // 轮播主容器
        this.mainDom = document.createElement('ul');
        this.mainDom.className = 'swiper-main';
        this.mainDom.style.width = `${this.moveWidth * (this.imgArr.length + 2)}px`;
        this.mainDom.style.left = `${-this.moveWidth}px`;
        this.swiperListDom.appendChild(this.mainDom);

        // 小圆点
        this.swiperSpotDom = document.createElement('ul');
        this.swiperSpotDom.className = 'swiper-dot';
        this.swiperListDom.appendChild(this.swiperSpotDom)

        // 上一张按钮
        this.leftBtn = document.createElement('img');
        this.leftBtn.className = 'left-btn';
        this.leftBtn.src = '../img/left.png';
        this.swiperListDom.appendChild(this.leftBtn);

        // 下一张按钮
        this.rightBtn = document.createElement('img');
        this.rightBtn.className = 'right-btn';
        this.rightBtn.src = '../img/right.png';
        this.swiperListDom.appendChild(this.rightBtn);

        if(this.imgArr.length === 1 || this.imgArr.length === 0) {
            this.leftBtn.style.display = 'none';
            this.rightBtn.style.display = 'none';
        }
    },
    prevSlider(aniTime) {
        let that = this;
        if (this.imgArr.length===1) return;
        this.mainDom.style.transition = `left ${aniTime / 1000}s`
        this.mainDom.style.left = `${parseInt(this.mainDom.style.left) + this.moveWidth}px`;
        if (this.nowIndex === 0) {
            that.nowIndex = that.imgArr.length - 1;
            that.setActiveDot();
            setTimeout(function() {					
                that.mainDom.style.transition = 'none';
                that.mainDom.style.left = `${-that.imgArr.length * that.moveWidth}px`;
            }, aniTime)
        } else {
            this.nowIndex--;
            this.setActiveDot();
        }
    },
    nextSlider(aniTime) {
        let that = this;
        if (this.imgArr.length===1) return;
        this.nowIndex++;
        this.mainDom.style.transition = `left ${aniTime / 1000}s`
        this.mainDom.style.left = `${parseInt(this.mainDom.style.left) - this.moveWidth}px`;
        if (this.nowIndex === (this.imgArr.length)) {
            that.nowIndex = 0;
            that.setActiveDot();
            setTimeout(function() {
                that.mainDom.style.transition = 'none';
                that.mainDom.style.left = `${-that.moveWidth}px`;
            }, aniTime)
        } else {
            this.setActiveDot();
        }
    },
    setActiveDot: function() {
        console.log(this.swiperSpotDom.childElementCount);
        for(let i = 0; i < this.swiperSpotDom.childElementCount; i++) {
            if(i === this.nowIndex) {
                document.getElementsByClassName('dot-item')[i].style.backgroundColor = '#ff5c1f';
            }else {
                document.getElementsByClassName('dot-item')[i].style.backgroundColor = '#fff';
            }
        }
    },
    eventBind: function(){
        // 上一张事件绑定
        let that = this;
        this.leftBtn.addEventListener('mouseover', function() {
            clearInterval(that.timer);
        })
        this.leftBtn.addEventListener('mouseout', function() {
            that.timer = setInterval(that.nextSlider.bind(that, that.aniTime), that.intervalTime);
        })
        this.leftBtn.addEventListener('click', function() {
            that.throttle(that.prevSlider, 300);
        })


        // 下一张事件绑定
        this.rightBtn.addEventListener('mouseover', function() {
            clearInterval(that.timer);
        })
        this.rightBtn.addEventListener('mouseout', function() {
            that.timer = setInterval(that.nextSlider.bind(that, that.aniTime), that.intervalTime);
        })
        this.rightBtn.addEventListener('click', function() {
            that.throttle(that.nextSlider, 300);
        })

        // 小圆点事件绑定
        this.swiperSpotDom.addEventListener('mouseover', function() {
            clearInterval(that.timer);
        })
        this.swiperSpotDom.addEventListener('mouseout', function() {
            that.timer = setInterval(that.nextSlider.bind(that, that.aniTime), that.intervalTime);
        })
        this.swiperSpotDom.addEventListener('click', function(e) {
            const event = e;
            let target = event.target;
            if (target.tagName.toLowerCase() === "li") {
                var ret = this.querySelectorAll("li"); //　ret是一个NodeList
                let index = Array.prototype.indexOf.call(ret, target); // 通过 call 方法来实现将 NodeList 对象视作数组, 绕过ret不是array这一点. 因为所有的数组方法（例如 indexOf）都可以通过 call 或 apply 这两个方法来调用，并且可以指定任何对象作为 this，即使该对象并不是一个数组。
                that.nowIndex = index;
                that.setActiveDot();
                that.mainDom.style.transition = `left .8s`
                that.mainDom.style.left = `${-(that.nowIndex+1) * that.moveWidth}px`;
            }
        })

    },
    throttle: function(handle, delay) {
        let now = Date.now();
        if(now - this.prev > delay) {
            handle.call(this);
            this.prev = now;
        }
    }

};

