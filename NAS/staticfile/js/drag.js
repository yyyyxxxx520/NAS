(function () {
    let upload_btn = $('.drag-tip em'),
        drag_input = $('.drag-input'),
        drag = $('.drag'),
        files = [];

    upload_btn[0].addEventListener('click', function () {
        drag_input.click();
    });

    drag_input[0].addEventListener('change', function () {
        files = drag_input[0].files;
        if (!files.length) return;
        console.log(files)
        upload_file(files);
    });

    // 将文件拖到元素里面事件
    drag[0].addEventListener('dragover', function (ev) {
        // 阻止默认事件
        ev.preventDefault();
    })
    // 将文件松开事件
    drag[0].addEventListener('drop', function (ev) {
        ev.preventDefault();
        files = ev.dataTransfer.files;
        upload_file(files);
    })

    async function upload_file(files) {
        files = Array.from(files);
        drag.addClass('drag-shade');
        let suc = 0;
        let fail = 0;
        let upload_error = '';
        for (let i = 0; i < files.length; i++) {
            try {
                let form_data = new FormData;
                form_data.append('csrfmiddlewaretoken', $('[name=csrfmiddlewaretoken]').val());
                form_data.append('file', files[i]);
                let result = await axios.post('index/', form_data);
                if (result.data['code'] === 1) {
                    suc += 1;
                    continue
                }
                throw result.data['mes'];
            } catch (e) {
                fail += 1;
                upload_error += (files[i].name + '上传失败，错误原因：' + e + '\n');
            }
        }
        setTimeout(function () {
            drag.removeClass('drag-shade');
            drag_input.val(null);
            files = [];
            let info='';
            if(fail){
                info = `，失败原因：\n${upload_error}`
            }
            alert(`上传完毕！成功：${suc}个，失败：${fail}个${info}`);
        }, 300)
    }
})();