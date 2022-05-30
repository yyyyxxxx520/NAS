(function () {
    let btn_pri = $('.form-select');
    let btn_info = $('.form-update');
    let in_file = $('.form-input');
    let img = $('.form-preview img');
    let file = null;
// #打开文件选择窗口
    btn_pri[0].addEventListener('click', function () {
        in_file.click();
    })

// 移除选中的文件
    $('.upload-info')[0].addEventListener('click', function (ev) {
        ev = ev || window.event;
        console.log(ev.target, ev.target.nodeName)
        if (ev.target.nodeName.toUpperCase() === 'EM') {
            clearFile();
        }
    })
// #判断是否符合文件格式
    in_file[0].addEventListener('change', function () {
        let f = in_file[0].files[0];
        if (f != null) {
            file = f;
            if (file.size > 10 * 1024 * 1024) {
                alert('文件过大，请上传10MB内的文件')
                // in_file.val('');
                clearFile();
                file = null
                return
            }

            // if (!image_type(file)) {
            //     alert('不符合文件格式要求')
            //     in_file.val(null);
            //     return;
            // }
            $('.upload-tip')[0].style.display = 'none';
            $('.upload-info')[0].style.display = 'block';
            let filename = file.name;
            if (filename.length > 20){
                filename = filename.slice(0,10) + '...' + filename.slice(filename.length - 10)

            }
            $('.upload-info li span').text('文件：' + filename)
            $('.upload-info').attr('title', file.name)
        }
    })

// 添加按钮的禁用样式class
    function disabled() {
        btn_pri.addClass('btn-disabled');
        btn_info.addClass('btn-loading');
        btn_info.text('上传中...');
        btn_info.after();
    }

// 移除按钮的禁用样式class
    const enable = () => {
        btn_pri.removeClass('btn-disabled');
        btn_info.removeClass('btn-loading');
        btn_info.text('上传文件');
    }

// 将提示信息显示，将文件信息清空并隐藏
    const clearFile = () => {
        in_file.val(null);
        file = null;
        $('.upload-tip')[0].style.display = 'block';
        $('.upload-info')[0].style.display = 'none';
        $('.upload-info li span').text('');
    }

// 上传文件
    btn_info[0].addEventListener('click', function () {
        let form_data = new FormData();
        form_data.append('file', file)
        form_data.append('csrfmiddlewaretoken', $('[name=csrfmiddlewaretoken]').val())
        if (file == null) {
            clearFile();
            alert('请先选择文件');
            return
        }
        disabled();
        $.ajax({
            url: 'index/',
            type: 'post',
            data: form_data,
            processData: false,
            contentType: false,
            success: function (result) {
                enable();
                in_file.val('');
                file = null;
                if (result['code'] === 1) {
                    img.attr('src', result['path']);
                    clearFile();
                } else {
                    alert('上传失败，错误代码：' + result['msg']);
                }
            }
        })
    })
})();


