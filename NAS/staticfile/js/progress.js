(function () {
    let upload_btn = $('.progress-update'),
        preview_img = $('.form-progress img'),
        file_input = $('.progress-input'),
        progress_bar = $('.progress_bar'),
        progress_container = $('.progress_container'),
        progress_value = $('.progress_value'),
        progress_span = $('.progress_bar span');

    upload_btn[0].addEventListener('click', function () {
        file_input.click();
    });
    file_input[0].addEventListener('change', async function () {
        let val = file_input.val();
        if (val) {
            let file = file_input[0].files[0];
            upload_btn.addClass('btn-loading');
            progress_bar[0].style.display = 'flex';
            try {
                let fileData = new FormData();
                fileData.append('csrfmiddlewaretoken', $('[name=csrfmiddlewaretoken]').val());
                fileData.append('file', file);
                let result = await axios.post(
                    '/index/',
                    fileData,
                    {
                        onUploadProgress(ev) {
                            let pro = Math.floor(ev.loaded / ev.total * 100) + '%'
                            progress_value[0].style.width = pro;
                            progress_span.text(pro);
                        }
                    }
                );
                if (result.data['code'] === 1){
                    progress_span.text('上传成功');
                    return
                }
                throw result.data['mes'];
            }catch (e) {
                alert('上传失败，错误原因：' + e)
            }finally {
                upload_btn.removeClass('btn-loading');
                file = null;
                file_input.val(null);
            }

        }
    })
})();