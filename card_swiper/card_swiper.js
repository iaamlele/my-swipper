const Swiper = function() {
    this.imgArr = imgArr;
    this.retImgArr = [this.imgArr[this.imgArr.length - 2], this.imgArr[this.imgArr.length - 1], ...this.imgArr, this.imgArr[0], this.imgArr[1]];
    this.aniTime = aniTime || 500;
    this.intervalTime = intervalTime || 1000;
    this.autoplay = autoplay || true;

    this.container = document.querySelector('.swiper-container');
    this.moveWidth = this.container.offsetWidth;
    this.nowIndex = 3;
    this.leftBtn;
    this.rightBtn;
    this.spotDom;
    this.mainDom;

    this.timer = null;
    this.prev = Date.now();
}

Swiper.prototype = {
    init: function() {
        this.initDom();

        let li = '';
        for(let i = 0; i < this.retImgArr.length; i++) {
            if(i === 2 || i === 4) {
                li += `<li class="swiper-item-small" style="left: ${i * this.moveWidth}px; width: ${this.moveWidth / 2}px; height: ${this.moveWidth / 2}px">
                <a href="${this.retImgArr[i].url}">
                    <img src="${this.retImgArr[i].src}">
                </a>
                </li>`;
            }else if(i === 3) {
                li += `<li class="swiper-item-big" style="left: ${i * this.moveWidth}px; width: ${this.moveWidth * 1.2}px; height: ${this.moveWidth * 1.2}px">
                <a href="${this.retImgArr[i].url}">
                    <img src="${this.retImgArr[i].src}">
                </a>
                </li>`;
            }else {
                li += `<li class="swiper-item" style="left: ${i * this.moveWidth}px; width: ${this.moveWidth}px">
                    <a href="${this.retImgArr[i].url}">
                        <img src="${this.retImgArr[i].src}">
                    </a>
                </li>`;
            }
            
        }
        this.mainDom.innerHTML = li;

        let spotLi = '';
        for(let i = 0; i < this.imgArr.length; i++) {
            if(i === 0) {
                spotLi += `<li class="swiper-spot-item" style="background-color:#ff5c1f" index=${i}></li>`;
            }else {
                spotLi += `<li class="swiper-spot-item" style="background-color:#fff" index=${i}></li>`;
            }
        }
        this.spotDom.innerHTML = spotLi;

        this.eventBind();
    },
    initDom: function() {
        const mainDom = document.createElement('ul');
        mainDom.className = 'swiper-main';
        mainDom.style.width = `${this.moveWidth * this.retImgArr.length}px`;
        mainDom.style.left = `-${this.moveWidth * 2}px`;
        this.container.appendChild(mainDom);

        const spotDom = document.createElement('ul');
        spotDom.className = 'swiper-spot';
        this.container.appendChild(spotDom);

        const lastBtn = document.createElement('img');
        lastBtn.className = 'swiper-last';
        lastBtn.src = '../img/left.png';
        this.container.appendChild(lastBtn);

        const nextBtn = document.createElement('img');
        nextBtn.className = 'swiper-next';
        nextBtn.src = '../img/right.png';
        this.container.appendChild(nextBtn);
    },
    nextSlider: function() {
        let that = this;
        that.nowIndex++;
        that.mainDom.style.transition = `left ${that.aniTime}ms`;
        that.mianDom.style.left = `$-{that.nowIndex * that.moveWidth}px`;

        if(that.nowIndex === that.retImgArr.length - 2) {
            that.nowIndex = 1;
            this.setActiveSpot();
            setTimeout(function() {
                that.mainDom.style.transition = 'none';
                that.mainDom.style.left = `-${that.moveWidth}px`;
            }, that.aniTime);
        }else {
            this.changeImgSize();
            this.setActiveSpot();
        }
    },
    prevSlider:function() {
        let that = this;
        that.nowIndex--;
        that.mainDom.style.transition = `right ${that.aniTime}ms`;
        that.mainDom.style.left = `-${that.nowIndex * that.moveWidth}px`;

        if(that.nowIndex === 1) {
            that.nowIndex = that.retImgArr.length - 2;
            that.setActiveSpot();
            setTimeout(function() {
                that.mainDom.style.transition = 'none';
                that.mainDom.style.left = `-${that.nowIndex * that.moveWidth}px`;
            }, that.aniTime);
        }else {
            that.changeImgSize();
            that.setActiveSpot();
        }
    },
    changeImgSize:function() {
        this.mainDom.children[this.nowIndex].style.width = `${this.moveWidth * 1.2}px`;
        this.mainDom.children[this.nowIndex].style.height = `${this.moveWidth * 1.2}px`;
        
        this.mianDom.children[this.nowIndex - 1].style.width = `${this.moveWidth * 0.5}px`;
        this.mianDom.children[this.nowIndex - 1].style.height = `${this.moveWidth * 0.5}px`;

        this.mainDom.children[this.nowIndex + 1].style.width = `${this.moveWidth * 0.5}px`;
        this.mainDom.children[this.nowIndex + 1].style.height = `${this.moveWidth * 0.5}px`;
    },
    setActiveSpot: function() {
        for(let i = 0; i < this.spotDom.children.length; i++) {
            if(i === this.nowIndex) {
                this.spotDom.children[i].style.backgroundColor = '#ff5c1f';
            }else {
                this.spotDom.children[i].style.backgroundColor = '#fff';
            }
        }
    },
    eventBind: function() {
        let that = this;

        // 上一张绑定
        this.lastBtn.addEventListener('mouseover', function() {
            clearInterval(that.timer);
        });
        this.lastBtn.addEventListener('mouseout', function() {
            that.timer = setInterval(that.nextSlider.bind(that, that.aniTime), that.intervalTime);
        });
        this.lastBtn.addEventListener('click', function() {
            that.throttle(that.prevSlider, 300);
        });

        // 下一张绑定
        this.nextBtn.addEventListener('mouseover', function() {
            clearInterval(that.timer);
        });
        this.nextBtn.addEventListener('mouseout', function() {
            that.timer = setInterval(that.nextSlider.bind(that, that.aniTime), that.intervalTime);
        });
        this.nextBtn.addEventListener('click', function() {
            that.throttle(that.nextSlider, 300);
        });

        // 小圆点绑定
        this.spotDom.addEventListener('mouseover', function() {
            clearInterval(that.timer);
        });
        this.spotDom.addEventListener('mouseout', function() {
            that.timer = setInterval(that.nextSlider.bind(that, that.aniTime), that.intervalTime);
        });
        this.spotDom.addEventListener('click', function(e) {
            let event = e;
            let target = event.target;
            if(target.tagName.toLowerCase() === 'li') {
                let ret = this.querySelectorAll('li');
                let index = Array.prototype.indexOf.call(ret, target);
                that.nowIndex = index;
                that.setActiveSpot();
                that.changeImgSize();
                that.mainDom.style.transition = `left .8s`
                that.mainDom.style.left = `${-that.nowIndex * that.moveWidth}px`;
            }
        })
    },
    throttle: function(fn, delay) {
        let now = Date.now();
        if(now - this.prev > delay) {
            fn.call(this);
            this.prev = Date.now();
        }
    }
}