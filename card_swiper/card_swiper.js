const Swiper = function(obj) {
    this.imgArr = obj.imgArr;
    this.retImgArr = [this.imgArr[this.imgArr.length - 2], this.imgArr[this.imgArr.length - 1], ...this.imgArr, this.imgArr[0], this.imgArr[1]];
    this.aniTime = obj.aniTime || 500;
    this.intervalTime = obj.intervalTime || 1000;
    this.autoplay = obj.autoplay || true;

    this.container = document.querySelector('.swiper-container');
    this.moveWidth = 640; // 1408
    this.imgWidth = obj.imgWidth || 200;
    this.nowIndex = 3;
    this.leftBtn;
    this.rightBtn;
    this.spotDom;
    this.mainDom;
    this.gap = obj.gap || 0;
    this.scale = obj.scale || 0.8;

    this.timer = null;
    this.prev = Date.now();
}

Swiper.prototype = {
    init: function() {
        this.initDom();

        let li = '';
        for(let i = 0; i < this.retImgArr.length; i++) {
            li += `<li class="swiper-item" style="left: ${(i - 2) * this.moveWidth}px; width: ${this.imgWidth}px">
                    <a href="${this.retImgArr[i].url}">
                        <img src="${this.retImgArr[i].src}">
                    </a>
                </li>`;
            
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
        this.mainDom = document.createElement('ul');
        this.mainDom.className = 'swiper-main';
        this.mainDom.style.width = `${this.moveWidth * this.retImgArr.length}px`;
        this.mainDom.style.left = `-${this.moveWidth * 2}px`;
        this.container.appendChild(this.mainDom);

        this.spotDom = document.createElement('ul');
        this.spotDom.className = 'swiper-spot';
        this.container.appendChild(this.spotDom);

        this.lastBtn = document.createElement('img');
        this.lastBtn.className = 'swiper-last';
        this.lastBtn.src = '../img/left.png';
        this.container.appendChild(this.lastBtn);

        this.nextBtn = document.createElement('img');
        this.nextBtn.className = 'swiper-next';
        this.nextBtn.src = '../img/right.png';
        this.container.appendChild(this.nextBtn);
    },
    nextSlider: function() {
        if(this.imgArr.length === 1) {
            return;
        }else if(this.imgArr.length === 2) {
            this.nowIndex = this.nowIndex ? 0 : 2;
            this.setScale();
        }else {
            let that = this;
            this.nowIndex++;
            this.mainDom.style.transition = `left ${that.aniTime}ms`;
            this.mainDom.style.left = `$-{this.nowIndex * this.moveWidth}px`;

            if(that.nowIndex === that.retImgArr.length - 2) {
                this.setActiveSpot();
                setTimeout(function() {
                    that.nowIndex = 1;
                    that.setScale();
                    that.mainDom.style.transition = 'none';
                    that.mainDom.style.left = `-${that.moveWidth}px`;
                }, that.aniTime);
            }else {
                this.setScale();
                this.setActiveSpot();
            }
        }
        
    },
    prevSlider:function() {
        if(this.imgArr.length === 1) {
            return;
        }else if(this.imgArr.length === 2) {
            this.nowIndex = this.nowIndex ? 0 : 2;
            this.setScale();
        } else {
            let that = this;
            this.nowIndex--;
            this.mainDom.style.transition = `right ${this.aniTime}ms`;
            this.mainDom.style.left = `-${this.nowIndex * this.moveWidth}px`;

            if(this.nowIndex === 1) {
                this.setActiveSpot();
                setTimeout(function() {
                    that.nowIndex = that.retImgArr.length - 2;
                    that.setScale();
                    that.mainDom.style.transition = 'none';
                    that.mainDom.style.left = `-${that.nowIndex * that.moveWidth}px`;
                }, that.aniTime);
            }else {
                this.setScale();
                this.setActiveSpot();
            }
        }
        
    },
    setScale:function() {
        for(let i = 0; i < this.mainDom.children.length; i++) {
            if(this.imgArr.length === 2) {
                this.mainDom.children[i].style.left = `${(this.moveWidth/4) - (this.imgWidth/2)}px`;
                this.mainDom.children[i].style.left = `${(this.moveWidth/4)*3 - (this.imgWidth/2)}px`;
            }else if(this.imgArr.length === 1) {
                this.mainDom.children[i].style.left = `${(this.moveWidth/2) - (this.imgWidth/2)}px`;
            }else {
                this.mainDom.children[i].style.left = `${(i - 1) * this.moveWidth}px`;
            }

            if(i === this.nowIndex) {
                this.mainDom.children[i].style.transform = `scale(1)`;
            }else {
                this.mainDom.children[i].style.transform = `scale(${this.scale})`;
            }
        }
    },
    setActiveSpot: function() {
        for(let i = 0; i < this.spotDom.children.length; i++) {
            if(i === this.nowIndex) {
                this.spotDom.children[i].style.backgroundColor = '#ff5c1f';
            } else {
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