async function thumbnail(src, src_list) {
    //生成放大图外侧的div以及样式
    let shadow = document.createElement('div');
    shadow.classList.add('img_shadow');

    let previous = document.createElement('p');
    previous.classList.add('previous_img');

    let next_img = document.createElement('p');
    next_img.classList.add('next_img');

    //生成放大图
    let i = document.createElement('img');
    //获取打开的图片地址
    i.setAttribute('src', src);
    i.setAttribute('alt', '正在加载中...');
    i.setAttribute('id', 'image_loading');

    //将放大的div添加到页面中
    shadow.appendChild(previous)
    shadow.appendChild(i)
    shadow.appendChild(next_img)
    document.querySelector('body').appendChild(shadow);

    let loading = document.createElement('img');
    loading.classList.add('loading');
    loading.setAttribute('src', '/static/js/layer/theme/default/loading-2.gif')

    shadow.appendChild(loading);
    image_loading.onload = function(){
        loading.style.display = 'none';
    }



    let oldWidth = 0;
    let ratio = 1;
    let st = setInterval(function () {
        oldWidth = parseInt(getComputedStyle(i, 'width').width);
        if (oldWidth > 0) {
            i.style.width = oldWidth + 'px';
            i.style.maxWidth = '';
            clearInterval(st);
        }
    }, 100)

    //监听滚轮事件
    $('.img_shadow').eq(0).bind('mousewheel DOMMouseScroll', function (event) { //on也可以 bind监听

        let wheel = event.originalEvent.wheelDelta;
        let detal = event.originalEvent.detail;
        if (event.originalEvent.wheelDelta) { //判断浏览器IE,谷歌滚轮事件
            if (wheel > 0) { //当滑轮向上滚动时
                magnify();
            }
            if (wheel < 0) { //当滑轮向下滚动时
                lessen();
            }
        } else if (event.originalEvent.detail) {  //Firefox滚轮事件
            if (detal > 0) { //当滑轮向下滚动时
                magnify();
            }
            if (detal < 0) { //当滑轮向上滚动时
                lessen();
            }
        }
    });

    // 放大
    function magnify() {
        // i.style.width = (oldWidth = oldWidth + 80) + 'px';
        ratio += ratio * 0.2
        i.style.transform = `translate(-50%,-50%) scale(${ratio})`;
    }

    // 缩小
    function lessen() {
        // if (parseInt(i.style.width) < 100) {
        //     return
        // }
        // i.style.width = (oldWidth = oldWidth - 80) + 'px';

        ratio -= ratio * 0.1
        i.style.transform = `translate(-50%,-50%) scale(${ratio})`;
    }

    //禁止键盘滚动页面
    unScroll();
    // let a = shadow.offsetWidth;
    let a = parseFloat(window.getComputedStyle(shadow)['width']);
    document.documentElement.style.overflowY = 'hidden';
    let c = parseFloat(window.getComputedStyle(shadow)['width']);
    document.querySelector('body').style.paddingRight = c - a + 'px';
    // document.querySelector('.input-group').style.paddingRight = c - a + 'px';

    //双击取消放大图片
    var closeDate = 0;
    shadow.onclick = function (ev) {
        if (ev.target.className === 'next_img' || ev.target.className === 'previous_img'){
            return
        }
        let newDate = Date.now();
        if (newDate - closeDate < 500 && closeDate !== 0) {
            document.querySelector('body').removeChild(shadow);
            document.documentElement.style.overflowY = 'auto';
            document.querySelector('body').removeAttribute('style');

            // document.querySelector('.input-group').removeAttribute('style');
        }
        closeDate = newDate;

    }

    //取消默认的图片拖动样式
    document.ondragstart = function () {
        return false;
    };
    //元素的鼠标落下事件
    i.onmousedown = function (ev) {

        //event的兼容性
        var ev = ev || event;

        //获取鼠标按下的坐标
        var x1 = ev.clientX;
        var y1 = ev.clientY;

        //获取元素的left，top值
        var l = i.offsetLeft;
        var t = i.offsetTop;

        //给可视区域添加鼠标的移动事件
        document.onmousemove = function (ev) {

            //event的兼容性
            var ev = ev || event;

            //获取鼠标移动时的坐标
            var x2 = ev.clientX;
            var y2 = ev.clientY;

            //计算出鼠标的移动距离
            var x = x2 - x1;
            var y = y2 - y1;

            //移动的数值与元素的left，top相加，得出元素的移动的距离
            var lt = y + t;
            var ls = x + l;

            //更改元素的left，top值
            i.style.top = lt + 'px';
            i.style.left = ls + 'px';

        }

        //清除拖动样式
        document.onmouseup = function (ev) {
            document.onmousemove = null;
        }

    }

    // 往前翻图片
    previous.addEventListener('click', async function () {
        for (let j=0;j<src_list.length;j++){
            let s = i.getAttribute('src').replace('&compress=0', '');
            if (src_list[j].getAttribute('src') === s){
                if (j !== 0){
                    loading.style.display = 'flex';
                    i.setAttribute('src', '');
                    s = src_list[j-1].getAttribute('src') + '&compress=0';
                    i.setAttribute('src', s);
                    image_loading.onload = function(){
                        loading.style.display = 'none';
                    }
                    return
                }
                else{
                    layer.msg('前面没有图片了!');
                }
            }
        }
    })

    // 往后翻图片
    next_img.addEventListener('click', async function () {
        for (let j=0;j<src_list.length;j++){
            let s = i.getAttribute('src').replace('&compress=0', '');
            if (src_list[j].getAttribute('src') === s){
                if (j !== src_list.length-1){
                    loading.style.display = 'flex';
                    i.setAttribute('src', '');
                    s = src_list[j+1].getAttribute('src') + '&compress=0';
                    i.setAttribute('src', s);
                    image_loading.onload = function(){
                        loading.style.display = 'none';
                    }
                    return
                }
                else{
                    layer.msg('最后一张图片了!');
                }
            }
        }
})
}

//禁止滚动页面
function unScroll() {

    document.body.onkeydown = function (e) {
      if (e.keyCode == 38 || e.keyCode == 40) {
         return false;
      }
    }

    //禁止滚动条滚动（包括鼠标滚轮）
    var top = $(document).scrollTop();
    $(document).on('scroll.unable',function (e) {
        $(document).scrollTop(top);
    })
}



