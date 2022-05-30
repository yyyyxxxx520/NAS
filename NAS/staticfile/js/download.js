
(async function () {

    let download_list = $('.download_list'),
        download_select = $('.download-select'),
        download_shadow = $('.download-shadow'),
        shadow_span = $('.download-shadow span'),
        _html = $('html'),
        _body = $('body');


    download_select[0].addEventListener('click', async function () {
        let result = await axios.get('/download_file', {params: {'path': 'image'},});
        download_list.children().remove();
        for (let i=0;i<result.data['dir_list'].length;i++){
            let filename = result.data['dir_list'][i];
            let h5 = await download_creation(filename, 0, true);
            download_list.append(h5);
        }
        let data = JSON.parse(result.data['file_list']);
        for (let filename in data){
            let filesize = data[filename];
            let h5 = await download_creation(filename, filesize, false);
            download_list.append(h5);
        }

    });
    download_list[0].addEventListener('click', async function (ev) {
        ev = ev || window.event;
        let em = ev.target;
        if(em.classList[0] ==='download'){
            let filename = em.parentNode.title;

            download_shadow[0].style.display = 'block';
            shadow_span[0].innerText = '正在请求数据....';
            _html[0].style.overflow = 'hidden';
            _body[0].style.overflow = 'hidden';
            console.log(filename + '正在请求数据');

            let fm = new FormData;
            fm.append('filename', filename);
            let result = await axios.post('/download_file/', fm);
            console.log(result);
            shadow_span[0].innerText = '正在准备文件....';
            var url = window.origin + '/download_file/';
            await download_form(url, filename);
            download_shadow[0].style.display = 'none';
            shadow_span[0].innerText = '正在请求数据....';
            _html[0].style.overflow = 'auto';
            _body[0].style.overflow = 'auto';
        }
    })
async function download_creation(filename, size, isdir) {
        let cutname = filename;
        if (filename.length > 18) {
            console.log('-----')
            filename = filename.slice(0, 9) + '...' + filename.slice(filename.length - 9)
        }

        let h5 = document.createElement('h5');
        let span = document.createElement('span');
        let i = document.createElement('i');
        let em = document.createElement('em');
        h5.classList.add('download-list-info');
        h5.title = cutname;
        size = await size_conversion(size)

        if (isdir) {
            span.innerText = '目录：' + filename;
            i.innerText = '';
            em.innerText = '进入';
            em.classList.add('into');
        } else {
            span.innerText = '文件：' + filename;
            i.innerText = size;
            em.innerText = '下载';
            em.classList.add('download');
        }
        h5.append(span);
        h5.append(i);
        h5.append(em);
        return h5
    }
})();

async function download_form(url, filepath) {
    let form = document.createElement('form');
    let input = document.createElement('input');
    form.action = url;
    form.method = 'post';
    input.type = 'hidden';
    input.name = 'filename';
    input.value = filepath;
    form.append(input);
    let body = document.querySelector('body');
    body.append(form);
    form.submit();
    body.removeChild(form);
}


