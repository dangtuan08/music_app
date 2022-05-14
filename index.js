// Một số bài hát có thể bị lỗi do liên kết bị hỏng. Vui lòng thay thế liên kết khác để có thể phát
// Some songs may be faulty due to broken links. Please replace another link so that it can be played

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: {},
    // (1/2) Uncomment the line below to use localStorage
    // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Đi Trong Mùa Hè",
            singer: "Đen x Trần Tiến",
            path: "https://data.chiasenhac.com/down2/2244/6/2243850-34687502/128/Di%20Trong%20Mua%20He%20-%20Den_%20Tran%20Tien.mp3",
            image: "https://data.chiasenhac.com/data/cover/163/162329.jpg"
        },
        {
            name: "Bài Này Chill Phết",
            singer: "Đen; Min",
            path: "https://data.chiasenhac.com/down2/2179/6/2178590-1df95ef6/128/Bai%20Nay%20Chill%20Phet%20-%20Den_%20Min.mp3",
            image:
                "https://data.chiasenhac.com/data/cover/143/142394.jpg"
        },
        {
            name: "Mang Tiền Về Cho Mẹ",
            singer: "Đen; Nguyên Thảo",
            path:
                "https://data.chiasenhac.com/down2/2215/6/2214701-52396a51/128/Mang%20Tien%20Ve%20Cho%20Me%20-%20Den_%20Nguyen%20Thao.mp3",
            image: "https://data.chiasenhac.com/data/cover/153/152045.jpg"
        },
        {
            name: "Lối Nhỏ",
            singer: "Đen; Phương Anh Đào",
            path: "https://data.chiasenhac.com/down2/2211/6/2210420-cad860c9/128/Loi%20Nho%20-%20Den_%20Phuong%20Anh%20Dao.mp3",
            image:
                "https://data.chiasenhac.com/data/cover/152/151033.jpg"
        },
        {
            name: "Đi Về Nhà",
            singer: "Đen; JustaTee",
            path: "https://data.chiasenhac.com/down2/2179/6/2178291-6e126457/128/Di%20Ve%20Nha%20-%20Den_%20JustaTee.mp3",
            image:
                "https://data.chiasenhac.com/data/cover/133/132896.jpg"
        },
        {
            name: "Cảm Ơn",
            singer: "Đen; Biên",
            path:
                "https://data.chiasenhac.com/down2/2211/6/2210422-3e31b147/128/Cam%20On%20-%20Den_%20Bien.mp3",
            image:
                "https://data.chiasenhac.com/data/cover/152/151035.jpg"
        },
    ],
    render: function () {
        playlist.innerHTML = this.songs.map((song, index) => {
            const html =
                `
            <div class="song">
                <div class="thumb" style="background-image: url(${song.image})">
                </div>
                <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `

            return html
        })

        // playlist.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    }
    ,
    handleEvents: function () {
        // document.addEventListener('scroll',()=>{
        //     console.log(window.scrollY);
        // })
        const _this = this;
        const cdWidth = cd.offsetWidth

        // Xử lý animation cho cdThumb
        const animateThumb = cdThumb.animate({ transform: 'rotate(0deg)', transform: 'rotate(360deg)' }, {
            duration: 8000,
            iterations: Infinity
        })
        animateThumb.pause()


        // Xử lý scroll để phóng to thu nhỏ hình thumb
        document.onscroll = function () {
            let scroll = window.scrollY || document.documentElement.scrollTop;
            let newCdWidth = cdWidth - scroll;

            cd.style.width = newCdWidth > 0 ? newCdWidth : 0;
            cd.style.opacity = newCdWidth / cdWidth
            //  console.log(window.scrollY);
            //  console.log(document.documentElement.scrollTop); // không hoạt động với edge
        }

        // Xử lý khi click nút play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()

            } else {
                audio.play()
            }
        }

        // Xử lý nếu thực sự đang play thì add class
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing')
            animateThumb.play()
        }

        // Xử lý nếu thực sự đang pause thì add class
        audio.onpause = function () {
            player.classList.remove('playing')
            _this.isPlaying = false
            animateThumb.pause()
        }

        audio.ontimeupdate = function () {
            // console.log();
            progress.value = Math.floor(audio.currentTime * 100 / audio.duration)
            // progress.value = audio.currentTime * 100 / audio.duration
        }

        progress.oninput = function () {
            let progressTime = progress.value * audio.duration / 100;
            audio.currentTime = Math.floor(progressTime);
        }

        progress.addEventListener('mousedown', () => {
            audio.pause()
            animateThumb.pause()
        })

        progress.addEventListener('mouseup', () => {
            audio.play()
            animateThumb.play()
        })

        nextBtn.onclick = function () {
            _this.nextSong()
            animateThumb.cancel()
            audio.play()
        }

        prevBtn.onclick = function () {
            _this.prevSong()
            animateThumb.cancel()
            audio.play()
        }

        // Xử lý nút random
        randomBtn.onclick = function () {
            console.log(_this.isRandom);
            if(_this.isRandom){
                _this.isRandom= false
                randomBtn.classList.remove('active')
            } else {
                console.log('1');
                _this.isRandom= true
                randomBtn.classList.add('active')
                
            }
        }

    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path

    },

    nextSong: function () {
        // console.log(this.songs.length);
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length)
            this.currentIndex = 0

        this.loadCurrentSong()
    },

    prevSong: function () {
        // console.log(this.songs.length);
        this.currentIndex--;
        if (this.currentIndex < 0 )
            this.currentIndex = this.songs.length

        this.loadCurrentSong()
    },

    start: function () {
        // Định nghĩa các thuộc tính cho obj
        this.defineProperties()
        // Lắng nghe các sự kiện dom event
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên khi chạy ứng dụng
        this.loadCurrentSong()
        //render danh sách các bài nhạc vào playlist
        this.render()
    }
};

app.start();
