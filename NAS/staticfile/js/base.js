(function () {
    let upload = $('.base_btn');
    let in_file = $('.base_input');
    let img = $('.base_preview img');
    upload[0].addEventListener('click', function () {
        in_file.click();
    })
    in_file[0].addEventListener('change', function () {
        let val = in_file.val();
        if (val) {
            let file = in_file[0].files[0]
            if (file.size > 2 * 1024 * 1024 || !image_type(file)) {
                alert('仅支持2MB以内的图片文件！')
                console.log(file.size / 1024 / 1024 + 'MB')
                return
            }
            disabled();
            (async function () {
                const base = await image_base64(file);
                $.ajax({
                    url: 'base/',
                    type: 'post',
                    data: {
                        'fileName': file.name,
                        'fileData': base,
                        'csrfmiddlewaretoken': $('[name=csrfmiddlewaretoken]').val()
                    },
                    success: function (result) {
                        enable();
                        if (result['code'] === 1) {
                            img.attr('src', base)
                            // img.attr('src', result['path'])
                        } else {
                            alert(result['msg'])
                        }
                    }
                })
            })();
        }


    })


    // 添加按钮的禁用样式class
    const disabled = () => {
        upload.addClass('btn-loading');
        upload.text('上传中...');
        upload.after();
    }

// 移除按钮的禁用样式class
    const enable = () => {
        upload.removeClass('btn-loading');
        upload.text('上传文件');
        in_file.val('');
    }
})();

