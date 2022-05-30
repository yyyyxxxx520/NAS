(function () {
    let file_input = $('.multifile-input'),
        multifile = $('.multifile'),
        upload_list = $('.multifile-info'),
        file_info = $('.multifile-info span'),
        progress = $('.multifile-progress'),
        value = $('.multifile-value'),
        pro_span = $('.multifile-progress span'),
        select = $('.multifile-select'),
        update = $('.multifile-update'),
        file = [],
        no_update = [];


    select[0].addEventListener('click', function () {
        file_input.val(null);
        multifile.children().remove();
        file_input.click();
        no_update = [];
    });
    file_input[0].addEventListener('change', function () {
        let ch = multifile.children();
        for (let i = 0; i < ch.length; i++) {
            ch[i].remove();
        }
        file = file_input[0].files;
        for (let i = 0; i < file.length; i++) {
            multifile.append(creation_element(i, file.length, file[i]))
        }
    });

    multifile[0].addEventListener('click', function (ev) {
        ev = ev || window.event;
        if (ev.target.nodeName.toUpperCase() === 'EM') {
            let h5 = ev.target.parentNode.parentNode;
            let file_id = h5.id;
            let upload_state = h5.querySelector('.multifile-progress span').innerText;
            if (upload_state === '等待上传' || upload_state === '上传成功') {
                no_update.push(file_id);
                h5.remove();
                // if (!multifile.children().length){
                //     file_input.val(null);
                // }
            }

        }
    })

    update[0].addEventListener('click', async function () {
        let upload_error = ''
        let suc = 0;
        let fail = 0;
        upload_list = $('.multifile-info');
        console.log(file);
        if (!multifile.children().length || !file.length) {
            alert('请先选择文件再点击上传！' + !file.length)
            return
        }
        select.addClass('btn-disabled');
        update.addClass('btn-loading');

        await (async function () {
            for (let i = 0; i < upload_list.length; i++) {
                let file_id = upload_list[i].id;
                let pro_value = upload_list[i].querySelector('.multifile-value');
                let pro_span = upload_list[i].querySelector('.multifile-progress span');
                // console.log(file_id,pro_value,pro_span)

                if (isNoUpload(file_id)) continue;
                try {
                    let fileData = new FormData();
                    fileData.append('csrfmiddlewaretoken', $('[name=csrfmiddlewaretoken]').val());
                    fileData.append('file', file[file_id]);
                    let result = await axios.post(
                        '/index/',
                        fileData,
                        {
                            onUploadProgress(ev) {
                                let pro = Math.floor(ev.loaded / ev.total * 100) + '%'
                                pro_value.style.width = pro;
                                pro_span.innerText = pro;
                            }
                        }
                    );
                    if (result.data['code'] === 1) {
                        pro_span.innerText = '上传成功';
                        suc += 1;
                        continue
                    }
                    throw result.data['mes'];
                } catch (e) {
                    fail += 1;
                    upload_error += (file[file_id].name + '上传失败，错误原因：' + e + '\n');
                } finally {
                }
            }
        })();
        setTimeout(function () {
            select.removeClass('btn-disabled');
            update.removeClass('btn-loading');
            file_input.val(null);
            no_update = [];
            let info='';
            if(fail){
                info = `，失败原因：\n${upload_error}`
            }
            alert(`上传完毕！成功：${suc}个，失败：${fail}个${info}`);
        }, 300)
    })

    function isNoUpload(id) {
        for (let i = 0; i < no_update.length; i++) {
            if (id === no_update[i]) return true;
        }
        return false;
    }
})();

async function creation_element(file_id, max_length, file) {
    let file_name = file.name;
    if (file_name.length > 18) {
        file_name = file_name.slice(0, 9) + '...' + file_name.slice(file_name.length - 9)
    }
    let file_size = await size_conversion(file.size);
    let h5 = document.createElement('h5');
    let li = document.createElement('li');
    let li_span = document.createElement('span');
    let li_i = document.createElement('i');
    let li_em = document.createElement('em');
    let progress = document.createElement('div');
    let container = document.createElement('div');
    let value = document.createElement('div');
    let progress_span = document.createElement('span');

    h5.classList.add('multifile-info');
    h5.id = file_id;
    h5.title = file.name;

    li_span.innerText = `(${file_id + 1}/${max_length})：` + file_name;
    li_i.innerText = file_size;
    li_em.innerText = '移除';
    progress.classList.add('progress_bar');
    progress.classList.add('multifile-progress');
    container.classList.add('progress_container');
    container.classList.add('multifile-container');
    value.classList.add('progress_value');
    value.classList.add('multifile-value');
    progress_span.innerText = '等待上传';

    li.append(li_span);
    li.append(li_i);
    li.append(li_em);
    progress.append(container);
    progress.append(progress_span);
    container.append(value);
    h5.append(li);
    h5.append(progress);

    return h5;
}


function size_conversion(file_size) {
    switch (true) {
        case file_size > 1024 * 1024 * 1024 * 1024:
            file_size = (file_size / (1024 * 1024 * 1024 * 1024)).toFixed(1) + 'T';
            break;
        case file_size > 1024 * 1024 * 1024:
            file_size = (file_size / (1024 * 1024 * 1024)).toFixed(1) + 'G';
            break;
        case file_size > 1024 * 1024:
            file_size = (file_size / (1024 * 1024)).toFixed(1) + 'M';
            break;
        case file_size > 1024:
            file_size = (file_size / (1024)).toFixed(1) + 'K';
            break;

    }
    return file_size
}

