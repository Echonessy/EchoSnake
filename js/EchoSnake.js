/**
 * Created by Echonessy on 2017/11/17.
 */




window.EchoSnake = (function () {
    var InitSnake = function () {};
    InitSnake.prototype={
        Config:function (params) {
            this.Ele = document.querySelector(params.Ele); // 绑定元素
            this.Start = document.querySelector(params.Start); // 开始按钮
            this.Matrix = params.Matrix; // 矩阵大小
            this.NowDirection = 2; // 当前方向
            this.NextDirection = ''; // 下一个方向
            this.Time = [400,300,250,200,150,100]; // 贪食蛇速度集合
            this.Difficulty = 1; // 难度
            this.DifTime = this.Time[this.Difficulty-1]; // 初始计时器时间间隔
            this.Score = 0; // 分数
            this.ScoreId = 'EchoScore'; // 分数绑定元素
            this.Result = 'EchoResult'; // 结果数绑定元素
            this.AnimateArr = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]]; // 默认蛇形
            this.Timer = null; // 计时器
            this.Food = []; // 记录食物坐标
            this.Init() // 初始化

        },
        // 初始化
        Init:function () {
            // 设置动态大小
            this.Ele.style.width = 20*this.Matrix+4 + 'px'; // 动态改变矩阵宽度
            this.CreateElement(); // 创建贪食蛇矩阵
            this.KeyEvent(); // 键盘事件
            this.CreatFood() // 创建默认食物
        },
        //创建坐标
        CreateElement:function () {
            var Html = '';
            Html+= '<ul  class="Element">'
            for (var i = 0;i< this.Matrix;i++) {
                for(var j = 0;j< this.Matrix;j++) {
                    var DataX = j;
                    var DataY = i;
                    Html+='<li id="'+DataX+'-'+DataY+'" data-X="'+DataX+'" data-Y="'+DataY+'"></li>';
                }
            }
            Html+='</ul>'
            Html+='<div class="Core" id="'+this.ScoreId+'">分数：0  难度：1</div>'
            Html+='<div class="Core" id="'+this.Result+'"></div>'
            this.Ele.innerHTML = Html;
            this.EleLi = this.Ele.getElementsByTagName('li');
            this.SercherHtml();
            this.StartGame();
        },
        // 开始游戏
        StartGame:function () {
            var that = this;
            this.Start.onclick = function () {
                that.Gaming();
                that.Start.style.visibility = 'hidden';
            }
        },
        // 重置游戏
        ReStartGame:function () {
            this.Start.style.visibility = 'visible';
            this.Start.innerHTML = '重新开始';
            var that = this;
            this.Start.onclick = function () {
                window.location.reload();
            }
        },
        //开始动画
        Gaming:function () {
            var that= this;
            if(this.Timer) {window.clearInterval(this.Timer)}
            this.Timer = setInterval(function () {
                // 为了避免用户点击键盘的时间间隔小于计时器的间隔时间，我在这里采用了第二个值来记录下一步
                if (that.NextDirection === '') {
                    that.NextDirection = that.NowDirection
                }
                that.NowDirection = that.NextDirection
                if(that.NextDirection === 0) {
                    that.CreatArr(0,-1);
                } else if(that.NowDirection === 1) {
                    that.CreatArr(-1,0)
                }else if(that.NowDirection === 2) {
                    that.CreatArr(0,1)
                }else {
                    that.CreatArr(1,0)
                }
            },that.DifTime);
        },
        //创建食物
        CreatFood:function () {
            this.Food = [];
            this.Food[0] = Math.floor(Math.random()*19);
            this.Food[1] = Math.floor(Math.random()*19);
            for(var i = 0; i<this.AnimateArr.length;i++) {
                var Compare = this.AnimateArr[i];
                if(Compare[0]===this.Food[0] && Compare[1]===this.Food[1]) {
                    this.CreatFood();
                } else {
                    this.CreatFoodHtml();
                }
            }
        },
        // 创建食物的位置
        CreatFoodHtml:function () {
            for(var i = 0;i<this.EleLi.length;i++) {
                this.EleLi[i].classList.remove('Food')
            }
            var Id = this.Food[0].toString()+'-'+this.Food[1].toString();
            this.EleLiId = document.getElementById(Id);
            this.EleLiId.className = 'Food'
        },
        // 边界碰撞检测
        Boundary:function (updown,leftright) {
            //上减下加，左减右加
            // 左：0,-1 // 上：-1,0
            // 右：0,1 // 下：1,0
            var NewHeader = this.AnimateArr[this.AnimateArr.length-1];
            if(updown === 0 && leftright=== -1) {
                if(NewHeader[0] <= 0) {
                    return true
                } else {
                    return false
                }
            } else if(updown === -1 && leftright=== 0) {
                if(NewHeader[1] <= 0) {
                    return true
                } else {
                    return false
                }
            } else if(updown === 0 && leftright=== 1) {
                if(NewHeader[0] >= this.Matrix - 1) {
                    return true
                } else {
                    return false
                }
            } else {
                if(NewHeader[1] >= this.Matrix - 1) {
                    return true
                } else {
                    return false
                }
            }
        },
        // 自身碰撞检测
        SelfCollide:function (updown,leftright) {
            var Center = [];
            Center[0] = this.AnimateArr[this.AnimateArr.length-1][0]+leftright;
            Center[1] = this.AnimateArr[this.AnimateArr.length-1][1]+updown;
            for(var i=0;i< this.AnimateArr.length;i++) {
                var ComPare =  this.AnimateArr[i]
                if(Center[0] === ComPare[0] && Center[1] === ComPare[1]) {
                    return true;
                } else {
//                       return false
                }
            }
        },
        // 核心方法：
        // 变换数组，增加下一个元素，删除第一个元素
        CreatArr:function (updown,leftright) {
            //边界碰撞检测
            if(this.Boundary(updown,leftright)) {
                window.clearInterval(this.Timer);
                console.log('边界碰撞');
                this.ReStartGame()
                document.getElementById(this.Result).innerHTML = 'Sorry,边界碰撞 '
            } else if(this.SelfCollide(updown,leftright)) {
                window.clearInterval(this.Timer);
                console.log('自身碰撞');
                this.ReStartGame()
                document.getElementById(this.Result).innerHTML = 'Sorry,自身碰撞 '
            }
            else {
                // 蛇的位移思路：每次移动一格，最后一个变化一次，
                // 接着数组其他元素依次变成下一个
                // [[0,0],[1,0],[2,0]] 往右移动一格 ： [[1,0],[2,0],[3,0]]
                // 其实[1,0],[2,0] 这部分是不变的，也就是说需要一个数组来记录上次原始数组用来保存[1,0],[2,0]
                // 然后再插入新的头部[3,0]
                // 接着再删除第一个 就会得到移动一次后的数组
                //  [[1,0],[2,0],[3,0]]
                // 如果移动一格后头部的坐标和食物的坐标相等，那么数组加一个坐标，重新生成食物

                var Center = [];
                var NewArr = [];
                Center[0] = this.AnimateArr[this.AnimateArr.length-1][0]+leftright;
                Center[1] = this.AnimateArr[this.AnimateArr.length-1][1]+updown;
                // 这里获取的是头部之后的元素
                // [[0,0],[1,0],[2,0]]   ： [[0,0],[1,0],[2,0],[3,0]]
                this.AnimateArr.push(Center)
                if(this.Food[0] ===Center[0] && this.Food[1] ===Center[1]) {
                    this.AnimateArr.push(this.Food);
                    this.UpdataScore();
                    this.CreatFood()
                }
                // 这里获取的是移动之后的元素
                // [[0,0],[1,0],[2,0]]   ： [[1,0],[2,0],[3,0]]
                for(var i=1;i< this.AnimateArr.length;i++) {
                    NewArr.push(this.AnimateArr[i])
                }
                this.AnimateArr = NewArr;
                this.SercherHtml()
            }
        },
        // 动态变化Html坐标
        SercherHtml:function () {
            for(var i = 0;i<this.EleLi.length;i++) {
                this.EleLi[i].classList.remove('Choice')
                this.EleLi[i].classList.remove('Header')
            }
            for(var i=0;i<this.AnimateArr.length;i++) {
                var x = this.AnimateArr[i][0];
                var y = this.AnimateArr[i][1];
                var Id = x.toString()+'-'+y.toString();
                this.EleLiId = document.getElementById(Id);
                if(i==this.AnimateArr.length-1) {
                    this.EleLiId.className = 'Choice Header'
                } else {
                    this.EleLiId.className = 'Choice'
                }
            }
        },
        //键盘事件
        KeyEvent:function () {
            var that = this;
            window.onkeydown = function () {
                switch (event.keyCode) {
//左键
                    case 37:
                        if(that.NowDirection !=2) {
                            that.NextDirection = 0
                        }
                        break;
//上键
                    case 38:
                        if(that.NowDirection !=3) {
                            that.NextDirection = 1
                        }
                        break;
//右键
                    case 39:
                        if(that.NowDirection != 0) {
                            that.NextDirection = 2
                        }
                        break;
//下键
                    case 40:
                        if(that.NowDirection != 1) {
                            that.NextDirection = 3
                        }
                        break;
                }
                return false;
            }
        },
        // 更新分数
        UpdataScore:function () {
            this.Score += 10;
            if(this.Difficulty >= this.Time.length) {
                this.Difficulty = this.Time.length;
            } else {
                if(this.Score >= 100) {
                    this.Difficulty = Math.floor(this.Score / 100) + 1 ; // 难度
                }
            }
            var Html = '分数：'+ this.Score +'  难度：'+this.Difficulty
            document.getElementById(this.ScoreId).innerHTML = Html;
            this.DifTime = this.Time[this.Difficulty-1];
            window.clearInterval(this.Timer)
            this.Gaming()
        }
    };
    return InitSnake;
})();