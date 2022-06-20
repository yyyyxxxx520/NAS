let token = $('.right-content [name=csrfmiddlewaretoken]').val(),
    file_list = [],
    upload_count = 0,
    upload_input = document.querySelector('.upload-input'),
    left_nav = document.querySelector('.left-nav'),
    home_nav = left_nav.querySelector('.home'),
    doc_nav = left_nav.querySelector('.doc'),
    img_nav = left_nav.querySelector('.img'),
    video_nav = left_nav.querySelector('.video'),
    audio_nav = left_nav.querySelector('.audio'),
    link_nav = left_nav.querySelector('.link'),
    share_nav = left_nav.querySelector('.share'),
    privacy_nav = left_nav.querySelector('.privacy'),
    right_content_shadow = document.querySelector('.right-content-shadow'),
    upload_btn = document.querySelector('.upload-btn'),
    upload_file = document.querySelector('.upload-btn .upload-file'),
    upload_folder = document.querySelector('.upload-btn .upload-folder'),
    operate_folder = document.querySelector('.file-operate .operate-folder'),
    operate_share = document.querySelector('.file-operate .operate-share'),
    operate_download = document.querySelector('.file-operate .operate-download'),
    operate_delete = document.querySelector('.file-operate .operate-delete'),
    operate_rename = document.querySelector('.file-operate .operate-rename'),
    operate_move = document.querySelector('.file-operate .operate-move'),
    operate_copy = document.querySelector('.file-operate .operate-copy'),
    search = document.querySelector('.top-tools .search'),
    search_input = search.querySelector('input'),
    table_file_list = document.querySelector('.table-file-list'),
    table_header = document.querySelector('.file-container .table-header'),
    file_breadcrumb = document.querySelector('.file_breadcrumb'),
    breadcrumb = file_breadcrumb.querySelector('.breadcrumb'),
    return_previous = document.querySelector('.return_previous'),
    all_file = document.querySelector('.all_file'),
    all_check = document.querySelector('.file-container .all_check');


// 左侧筛选栏方法
function left_nav_fun() {
    // 点击全部文件事件
    home_nav.addEventListener('click', function () {
        if (this.querySelector('.text').classList[2] === 'nav-text-activ') {
            return
        }
        update_file_list('home');
        // return_previous.style.display =
        // return_previous.innerText = '返回上一层';
        return_previous.removeAttribute('style');
        all_file.removeAttribute('style');
        document.querySelector('.nav-text-active').classList.remove('nav-text-active');
        this.querySelector('.text').classList.add('nav-text-active');

    });

    // 点击我的文档事件
    doc_nav.addEventListener('click', function () {
        breadcrumb_hidden(this, 'doc');
    });
    img_nav.addEventListener('click', function () {
        breadcrumb_hidden(this, 'img');
    });
    video_nav.addEventListener('click', function () {
        breadcrumb_hidden(this, 'video');
    });
    audio_nav.addEventListener('click', function () {
        breadcrumb_hidden(this, 'audio');
    });
    link_nav.addEventListener('click', function () {
        breadcrumb_hidden(this, 'link');
    });
    share_nav.addEventListener('click', function () {
        breadcrumb_hidden(this, 'share');
    });
    privacy_nav.addEventListener('click', function () {
        breadcrumb_hidden(this, 'privacy');
    });

    async function breadcrumb_hidden(nav, state) {
        nav = nav.querySelector('.text').classList;
        if (nav[2] === 'nav-text-active') {
            return
        }
        await update_file_list(state);
        // if(breadcrumb.querySelector('li')){breadcrumb.querySelector('li').remove();}
        // return_previous.innerText = '全部文件';
        // return_previous.style.color = 'black';
        // return_previous.style.cursor = 'auto';
        all_file.style.color = 'black';
        return_previous.style.display = 'none';
        document.querySelector('.nav-text-active').classList.remove('nav-text-active');
        nav.add('nav-text-active');
    }

}


// 顶端工具栏方法
function top_tools_fun() {

    // 新建文件夹事件
    operate_folder.addEventListener('click', function () {
        // 将文件列表拉至最顶端
        table_file_list.scroll(0, 0);
        // 判断有没有已经存在的新建文件夹窗口
        if (document.querySelectorAll('.new_folder_input').length) return;
        // 创建样式
        let div1 = document.createElement('div');
        let div2 = document.createElement('div');
        let div3 = document.createElement('div');
        let div4 = document.createElement('div');
        let div5 = document.createElement('div');

        div1.classList = 'new-folder table-file';
        div2.classList = 'file-info';
        div3.classList = 'file-change-date';
        div4.classList = 'file-upload-date';
        div5.classList = 'file-size';
        div1.append(div2);
        div1.append(div3);
        div1.append(div4);
        div1.append(div5);

        let checkbox = document.createElement('input');
        let i = document.createElement('i');
        let text = document.createElement('input');
        let ok = document.createElement('button');
        let no = document.createElement('button');
        checkbox.type = 'checkbox';
        checkbox.disabled = true;
        text.classList = 'new_folder_input';
        text.title = '输入文件夹名称';
        ok.classList = 'new_folder_ok';
        ok.title = '新建文件夹';
        no.classList = 'new_folder_no';
        no.title = '取消文件夹';

        div2.append(checkbox);
        div2.append(i);
        div2.append(text);
        div2.append(ok);
        div2.append(no);
        // 将新建文件夹的输入框添加到最上面
        table_file_list.insertBefore(div1, document.querySelector('.table-file'));
        // 让input输入框获取焦点
        text.focus();
    });
    // 分享文件事件
    operate_share.addEventListener('click', function () {
        alert('分享');
    });
    // 下载文件事件
    operate_download.addEventListener('click', async function () {
        let result = await file_info_active();
        if (!result) {
            return
        }
        // let csrf = document.querySelector('input[name=csrfmiddlewaretoken]').value;
        document.querySelector('body .body_shadow').style.display = 'flex';
        let dir = result[0];
        let file = result[1];

        // 获取需要下载的文件的大小
        let get_size = new FormData;
        get_size.append('download_dir', JSON.stringify(dir));
        get_size.append('download_file', JSON.stringify(file));
        get_size.append('state', 'get_size');
        get_size.append('csrfmiddlewaretoken', token);
        result = await axios.post('/NAS_download_file/', get_size);
        if (result.data.size > 100 * 1024 * 1024) {
            layer.confirm(`当前选中文件较大(${size_conversion(result.data.size)})，推荐使用本地下载软件下载大文件！网页下载较慢，是否继续下载？`, {
                    icon: 3,
                    title: '提示'
                },
                // 确定下载方法
                async function (index) {
                    layer.close(index);
                    await download_start();
                },
                // 取消下载方法
                function (index) {
                    layer.close(index);
                    document.querySelector('body .body_shadow').style.display = 'none';
                });
            let layer_close = document.querySelector('.layui-layer-setwin .layui-layer-close')
            layer_close.addEventListener('click', function () {
                document.querySelector('body .body_shadow').style.display = 'none';
            })
        } else {
            await download_start();
        }

        async function download_start() {

            let filedata = new FormData;
            if (dir.length === 0 && file.length === 1) {
                filedata.append('download_file', JSON.stringify(file));
                filedata.append('state', 'download_one');
                filedata.append('csrfmiddlewaretoken', token);
                result = await axios.post('/NAS_download_file/', filedata);
            } else {
                filedata.append('download_dir', JSON.stringify(dir));
                filedata.append('download_file', JSON.stringify(file));
                filedata.append('state', 'touch_zip');
                filedata.append('csrfmiddlewaretoken', token);
                result = await axios.post('/NAS_download_file/', filedata);
            }
            if (result.data.code === 1) {
                let url = window.origin + '/NAS_download_file/';
                await download_form(url, 'download', result.data.zip_path, result.data.file_name);
                document.querySelector('body .body_shadow').style.display = 'none';
                if (result.data.file_name === 'NAS_download.zip') {
                    let remove_zip = new FormData;
                    remove_zip.append('state', 'remove_zip');
                    remove_zip.append('zip_path', result.data.zip_path);
                    remove_zip.append('csrfmiddlewaretoken', token);
                    await axios.post('/NAS_download_file/', remove_zip);
                }
            } else {
                layer.alert(result.data.msg)
            }
        }


    });
    // 删除文件事件
    operate_delete.addEventListener('click', async function () {
        let result = await file_info_active();
        if (!result) {
            return
        }
        let del_dir = result[0];
        let del_file = result[1];
        layer.confirm(`当前选中${del_file.length}个文件、${del_dir.length}个文件夹，确定都要删除吗？`, {icon: 3, title: '提示'},
            // 确定删除方法
            async function (index) {
                layer.close(index);
                document.querySelector('body .body_shadow').style.display = 'flex';
                let filedata = new FormData;
                filedata.append('del_dir', JSON.stringify(del_dir));
                filedata.append('del_file', JSON.stringify(del_file));
                filedata.append('csrfmiddlewaretoken', token);

                let result = await axios.post('/NAS_delete/', filedata);
                layer.alert(result.data['msg']);
                let nav = document.querySelector('.nav-text-active').parentNode.classList[1];
                update_file_list(nav);
                document.querySelector('body .body_shadow').style.display = 'none';
            },
            // 取消删除方法
            function (index) {
                layer.close(index);
            });
    });
    // 重命名文件事件
    operate_rename.addEventListener('click', async function () {
        let result = await file_info_active();
        if (!result) {
            return
        }
        let dir = result[0];
        console.log(dir)
        let file = result[1];

        if (dir.length + file.length > 1) {
            layer.msg('只能处理单个文件或文件夹！', {icon: 2});
            return
        }
        let act = table_file_list.querySelector('.file-info .active');
        let cur_dir = act.nextElementSibling.getAttribute('cur_dir');
        file = file.length ? file[0][0] : ' ';
        let def = dir.length ? dir : file;
        layer.prompt({
            title: '请输入新名称',
            value: def,
            btn2: function (index) {
                //点击取消执行的代码
            }
        }, async function (input_val, index) {
            let fd = new FormData;
            fd.append('csrfmiddlewaretoken', token);
            fd.append('state', 'rename');
            fd.append('dir', dir);
            fd.append('file', file);
            fd.append('cur_dir', cur_dir);
            fd.append('rename', input_val);
            let result = await axios.post('/NAS/', fd);
            if (result.data['code']) {
                layer.alert(result.data['msg']);
                update_file_list('home');
            } else {
                layer.alert(result.data['msg'], '提示');
            }

            layer.close(index);
        })
    });
    // 移动文件事件
    operate_move.addEventListener('click', async function () {
        await move_selector_folder('移动');
    });
    // 复制文件事件
    operate_copy.addEventListener('click', function () {
        move_selector_folder('复制');
    });
    // 查找文件事件
    search.addEventListener('keypress', function (ev) {
        if (ev.code.toUpperCase() === 'ENTER') {
            let search_val = search_input.value;
            search_fun(search_val);
        }
    })
    // 查找文件事件
    search.querySelector('i').addEventListener('click', function () {
        let search_val = search.querySelector('input').value;
        search_fun(search_val);
    })

    // 查找文件方法
    async function search_fun(search_val) {
        if (!search_val) {
            return
        }
        let file_class = left_nav.querySelector('.nav-text-active').parentNode.classList[1];
        if (file_class === 'share' || file_class === 'privacy') {
            file_class = 'home';
            document.querySelector('.nav-text-active').classList.remove('nav-text-active');
            home_nav.querySelector('p').classList.add('nav-text-active');
        }
        update_file_list('search', breadcrumb.getAttribute('cur_dir'), JSON.stringify([search_val, file_class]));
    }

}

// 文件显示栏方法
function file_list_fun() {
    var interval_time = new Date().getTime() - 1000;

    table_header.addEventListener('click', async function (ev) {
        switch (ev.target.className){
            case 'file-name-header':
                start_sort('.file-name-header');
                break;
            case 'change-date-header':
                console.log('修改时间排序');
                start_sort('.change-date-header');
                break;
            case 'upload-date-header':
                console.log('上传时间排序');
                start_sort('.upload-date-header');
                break;
            case 'file-size-header':
                console.log('文件大小排序');
                start_sort('.file-size-header');
                break;
        }
        function start_sort(class_name) {
            let file_header = table_header.querySelector(class_name);
            if (file_header.getAttribute('id') !== '1'){
                sort(class_name, );
                file_header.setAttribute('id', '1');
            }
            else{
                sort(class_name, 'little');
                file_header.setAttribute('id', '0');
            }
        }
        function sort(class_name,orientation = 'big') {
            let table_file = table_file_list.querySelectorAll('.table-file');
            let file_name_list = new Array;
            let dir_name_list = new Array;
            let table_file_list_new = new Array();
            let table_dir_list_new = new Array();
            for (let i=0;i<table_file.length;i++){
                let name = ''
                if (class_name === '.file-name-header'){
                    name = table_file[i].querySelector('.file-name').innerText;
                }
                else if (class_name === '.change-date-header'){
                    name = table_file[i].querySelector('.change-date').innerText;
                }
                else if (class_name === '.upload-date-header'){
                    name = table_file[i].querySelector('.file-upload-date').innerText;
                }
                else if (class_name === '.file-size-header'){
                    name = table_file[i].querySelector('.file-size').innerText;
                    let par_name = '';
                    if (name.indexOf("B") !== -1){
                        par_name = parseFloat(name.slice(0,-2))
                    }
                    if (name.indexOf("KB") !== -1){
                        name = parseFloat(par_name) * 1024
                    }
                    else if (name.indexOf("MB") !== -1){
                        name = parseFloat(par_name) * 1024 * 1024
                    }
                    else if (name.indexOf("GB") !== -1){
                        name = parseFloat(par_name) * 1024 * 1024 * 1024
                    }
                    else if (name.indexOf("TB") !== -1){
                        name = parseFloat(par_name) * 1024 * 1024 * 1024 * 1024
                    }
                }
                if (table_file[i].querySelector('.file-info i').className === 'dir'){
                    dir_name_list.push(name);
                    table_dir_list_new.push(table_file_list.childNodes[i])
                }
                else{
                    file_name_list.push(name);
                    table_file_list_new.push(table_file_list.childNodes[i])
                }

            }
            for (let i=0;i<file_name_list.length - 1;i++){
                for (let j=i+1;j<file_name_list.length;j++){
                    if (orientation === 'big') {
                        if (file_name_list[i] < file_name_list[j]) {
                            let temp = file_name_list[i];
                            file_name_list[i] = file_name_list[j];
                            file_name_list[j] = temp;

                            let temp_table = table_file_list_new[i];
                            table_file_list_new[i] = table_file_list_new[j];
                            table_file_list_new[j] = temp_table;
                        }
                    }else{
                        if (file_name_list[i] > file_name_list[j]) {
                            let temp = file_name_list[i];
                            file_name_list[i] = file_name_list[j];
                            file_name_list[j] = temp;

                            let temp_table = table_file_list_new[i];
                            table_file_list_new[i] = table_file_list_new[j];
                            table_file_list_new[j] = temp_table;
                        }
                    }
                }
            }
            for (let i=0;i<dir_name_list.length - 1;i++){
                for (let j=i+1;j<dir_name_list.length;j++){
                    if (orientation === 'big'){
                        if (dir_name_list[i] < dir_name_list[j]){
                        let temp = dir_name_list[i];
                        dir_name_list[i] = dir_name_list[j];
                        dir_name_list[j] = temp;

                        let temp_table = table_dir_list_new[i];
                        table_dir_list_new[i] = table_dir_list_new[j];
                        table_dir_list_new[j] = temp_table;
                    }
                    }else{
                        if (dir_name_list[i] > dir_name_list[j]){
                        let temp = dir_name_list[i];
                        dir_name_list[i] = dir_name_list[j];
                        dir_name_list[j] = temp;

                        let temp_table = table_dir_list_new[i];
                        table_dir_list_new[i] = table_dir_list_new[j];
                        table_dir_list_new[j] = temp_table;
                    }
                    }

                }
            }
            // 删除原有数据
            while (table_file_list.hasChildNodes()) {
                table_file_list.removeChild(table_file_list.lastChild);
            }
            // 添加排序后
            for (let i=0;i<table_dir_list_new.length;i++){
                table_file_list.append(table_dir_list_new[i])
            }
            for (let i=0;i<table_file_list_new.length;i++){
                table_file_list.append(table_file_list_new[i])
            }

        }
    })

    // 点击文件列表事件
    table_file_list.addEventListener('click', async function (ev) {
        switch (ev.target.className) {
            // 点击确认新建文件夹方法
            case 'new_folder_ok':
                let input_val = ev.target.previousElementSibling.value;
                if (input_val.length > 60) {
                    layer.msg('名称过长，请修改后再保存！');
                    return
                }
                new_folder(input_val, ev.target.parentNode.parentNode);
                break
            // 点击取消新建文件夹方法
            case 'new_folder_no':
                ev.target.parentNode.parentNode.remove();
                break
            // 点击文件或目录名称父元素方法
            case 'file-info':
                let i_class = ev.target.querySelector('i').className;
                if (i_class === 'dir') {
                    let path = ev.target.querySelector('i').getAttribute('cur_dir');
                    let result = await update_file_list('home', path);
                }
                break
            // 点击文件或目录名称方法
            case 'file-name':
                let pre_class = ev.target.previousElementSibling.className;
                if (pre_class === 'dir') {
                    let path = ev.target.previousElementSibling.getAttribute('cur_dir')
                    await update_file_list('home', path);
                }
                break
            // 点击目录图标方法
            case 'dir':
                let path = ev.target.getAttribute('cur_dir');
                await update_file_list('home', path);
                break
            case 'checkbox':
                ev.target.classList.add('active');
                break
            case 'checkbox active':
                ev.target.classList.remove('active');
                break
            case 'download':
                for (let i=0;i<ev.path.length;i++){
                    if (ev.path[i].className === 'table-file'){
                        if (!ev.path[i].querySelector('.active')){
                            await ev.path[i].querySelector('.checkbox').click();

                        }
                        await operate_download.click();
                        ev.path[i].querySelector('.checkbox').click();
                    }
                }
                break
            case 'share':
                console.log('分享文件');
                break
            default:
                console.log();
        }
    })
    // 双击文件列表事件
    table_file_list.addEventListener('dblclick', async function (ev) {
        for (let i = 0; i < ev.path.length; i++) {
            if (ev.path[i].className === 'file-info') {
                let file_i = ev.path[i].querySelector('i');
                let file_name = ev.path[i].querySelector('.file-name').title;
                let cur_dir = file_i.getAttribute('cur_dir');
                switch (file_i.className) {
                    case 'image':
                        let src = file_i.children[0].getAttribute('src') + '&compress=0';
                        let img = table_file_list.querySelectorAll('.file-info i img');
                        thumbnail(src, img);
                        break
                    case 'video':
                    case 'pdf':
                    case 'word':
                    case 'ppt':
                    case 'txt':
                    case 'conf':
                    case 'bat':
                    case 'excel':
                        window.open(`/online_preview/?cur_dir=${cur_dir}&filename=${file_name}&type=${file_i.className}`);
                        break
                }
                // console.log(file_i.className, file_name)
            }
        }

    })

    // 文件列表按钮事件
    table_file_list.addEventListener('keypress', function (ev) {
        // console.log(ev.keyCode, ev.target.classList[0])
    });

    // 文件列表滚动事件
    table_file_list.addEventListener('scroll', async function () {
        if (this.scrollTop + this.clientHeight > this.scrollHeight - 1 && this.scrollTop) {
            if (new Date().getTime() - interval_time > 1000) {
                layer.msg('正在加载！');
                interval_time = new Date().getTime();
                let state = table_file_list.getAttribute('state');
                let path = breadcrumb.getAttribute('cur_dir');
                let start = this.children.length;
                let result = await axios.get('/NAS/', {
                    params: {
                        'state': state,
                        'cur_dir': path,
                        'standby': 1,
                        'start': start
                    },
                });
                let file_data = result.data.file_data;
                if (result.data.code !== 1) {
                    layer.msg(result.data.msg);
                    return
                }
                if (file_data.length === 0) {
                    layer.msg('已完全加载完毕！');
                    return
                }


                for (let i = 0; i < file_data.length; i++) {
                    create_file_doc(file_data[i][0], file_data[i][2], file_data[i][3], file_data[i][3], file_data[i][4], file_data[i][1], file_data[i][5])
                }
                layer.msg(`加载完毕，加载成功 ${file_data.length} 条，总计 ${this.children.length} 条！`);
                file_breadcrumb.querySelector('.load_info').innerText = `已加载${this.children.length}个`;
            }

        }
    })

    // 点击返回上一层事件
    return_previous.addEventListener('click', function () {
        let dir = breadcrumb.getAttribute('cur_dir').split('\\');
        if (!dir[0]) {
            return
        }
        dir.pop();
        let cur = '';
        for (let i = 0; i < dir.length; i++) {
            cur += dir[i] + '\\';
        }
        let result = update_file_list('home', cur);
    })

    // 点击全部文件方法
    all_file.addEventListener('click', function () {
        let dir = breadcrumb.getAttribute('cur_dir').split('\\');
        if (!dir[0]) {
            return
        }
        update_file_list('home', '');
    })

    // 点击面包屑导航事件
    breadcrumb.addEventListener('click', function (ev) {
        if (this.children.length < 2 || ev.target === breadcrumb.lastElementChild || ev.target === breadcrumb) {
            return
        }
        let path = ''
        for (let i = 0; i < this.children.length; i++) {
            let ti = this.children[i].getAttribute('title');
            if (ti) {
                path += ti + '\\';
            }
            if (this.children[i] === ev.target) {
                break
            }
        }
        let result = update_file_list('home', path);
    })

    // 点击选择全部按钮
    all_check.addEventListener('click', function () {
        let check = table_file_list.querySelectorAll('input[type=checkbox]');
        if (this.classList[1] === 'active') {
            this.classList.remove('active');
            let act = table_file_list.querySelectorAll('.active');
            for (let i = 0; i < act.length; i++) {
                act[i].classList.remove('active');
                act[i].checked = false;
            }
        } else {
            this.classList.add('active');
            for (let i = 0; i < check.length; i++) {
                check[i].classList.add('active');
                check[i].checked = true;
            }

        }
    })

    // 文件显示栏按键点击事件
    table_file_list.addEventListener('keypress', function (ev) {
        // console.log(ev.code)
        if (ev.code.toUpperCase() === 'ENTER') {
            let dia = document.querySelector('.layui-layer-dialog');
            if (dia) {
                let times = dia.getAttribute('times');
                layer.close(times);
                return
            }
            let input_val = ev.target.value;
            if (input_val.length > 60) {
                layer.msg('名称过长，请修改后再保存！');
                return
            }
            new_folder(input_val, ev.target.parentNode);
        } else if (ev.code.toUpperCase() === 'ESCAPE') {
            let dia = document.querySelector('.layui-layer-dialog');
            if (dia) {
                let times = dia.getAttribute('times');
                layer.close(times);
                return
            }
            ev.target.parentNode.parentNode.remove()
        }
    })

    // body全局按键点击事件
    document.body.addEventListener('keypress', function (ev) {
        let up_code = ev.code.toUpperCase();
        if (up_code === 'ESCAPE' || up_code === 'ENTER') {
            let dia = document.querySelector('.layui-layer-dialog');
            if (dia) {
                let times = dia.getAttribute('times');
                layer.close(times);
            }
        }
    })

    // 新建文件夹方法
    async function new_folder(input_val, node) {
        if (input_val.length) {
            let fd = new FormData;
            fd.append('csrfmiddlewaretoken', token);
            fd.append('state', 'new_folder');
            fd.append('cur_dir', breadcrumb.getAttribute('cur_dir'));
            fd.append('folder_name', input_val);
            let result = await axios.post('/NAS/', fd);
            if (result.data['code']) {
                layer.alert(result.data['msg']);
                // ev.target.parentNode.parentNode.remove();
                node.remove();
                update_file_list('home');
            } else {
                layer.alert(result.data['msg'], '提示');
            }
        } else {
            layer.msg('请输入文件夹名称再点击回车或确定按钮！');
        }
    }

}

// 文件上传方法
function file_upload_fun() {
    let upload_ok = 0;
    // 点击上传或上传文件夹事件
    upload_btn.addEventListener('click', async function (ev) {
        if (ev.target.classList[0] === 'upload-folder') {
            // console.log('上传文件夹', upload_input.getAttribute('type'));
            upload_input.setAttribute('webkitdirectory', '');
            upload_input.click();

        } else {
            upload_input.removeAttribute('webkitdirectory');
            upload_input.click();
        }
    });
    // 选中文件事件
    upload_input.addEventListener('change', async function () {

        // console.log(this.files)
        file_list = Array.from(this.files);
        this.value = '';
        if (!file_list) {
            return
        }
        document.querySelector('.title .transfer').style.display = 'flex';
        let cur_dir = breadcrumb.getAttribute('cur_dir');
        console.log('获取到的cur_dir:', cur_dir);
        // 将传输进度添加到传输栏里
        let em = new Array();
        let pro_upload_ok = document.querySelector('.title .progress-upload-ok');
        let pro_upload_all = document.querySelector('.title .progress-upload-all');
        let up_li = document.querySelectorAll('.title .transfer .uploading-li');

        // 将所有上传任务添加到进肚栏中
        for (let i = 0; i < file_list.length; i++) {
            em.push(await create_change_pro(file_list[i].name, '', file_list[i].size));
        }

        upload_ok += em.length;
        pro_upload_ok.innerText = upload_ok;
        pro_upload_all.innerText = em.length + up_li.length;
        // 挨个上传文件
        for (let i = 0; i < file_list.length; i++) {
            await upload_file_fun(file_list[i], em[i], cur_dir);

            // pro_title.innerText = `正在上传中( ${upload_ok} / ${em.length + up_li.length} )`
        }
        // 更新文件列表
        let nav = document.querySelector('.nav-text-active').parentNode.classList[1];
        update_file_list(nav, breadcrumb.getAttribute('cur_dir'));
    });

    // 上传文件
    async function upload_file_fun(file, em, cur_dir) {
        let em_filename = em.querySelector('.file-name');
        let em_uploadpro = em.querySelector('.upload-pro');
        let em_progress = em.querySelector('.uploading-file-progress');
        let em_value = em.querySelector('.uploading-file-value');
        let em_close = em.querySelector('.uploading-close');
        let em_open = em.querySelector('.uploading-open');

        // 每个切片大小为50M
        let slice_size = 50 * 1024 * 1024;
        em_uploadpro.innerText = '准备';
        async function get_hash(file) {
            let pro = new Promise(function (resolve, reject) {
                let fileReader = new FileReader();
                fileReader.readAsArrayBuffer(file);
                fileReader.onload = function (e) {
                    let f = e.target.result;
                    let md5 = new SparkMD5.ArrayBuffer();
                    md5.append(f);
                    let HASH = md5.end();
                    resolve(HASH)
                }
                fileReader.onerror = function (err) {
                    resolve(-1)
                }
            });
            return await pro.then(function (result) {
                return result;
            })
        }

        // Promise同步上传操作，并将数据传出来
        let Pro = new Promise(async function (resolve, reject) {
            if (file.size === 0) {
                let result = await axios.get('/BIG_upload/', {
                    params: {
                        'filename': file.name,
                        'state': 'touch_null_file',
                        'filepath': file.webkitRelativePath,
                        'cur_dir': cur_dir
                    },
                });
                em_close.style.display = 'none';
                em_progress.style.display = 'none';
                em_open.style.display = 'inline-block';
                if (result.data.code === 1) {
                    em_uploadpro.innerText = '成功';
                    em_open.setAttribute('cur_dir', result.data['save_path']);
                    resolve(file.name + '上传成功！');
                } else {
                    em_uploadpro.innerText = '失败';
                    resolve(file.name + '上传失败！');
                }

            } else {
                let start = file.slice(0, 500 * 1024 * 1024);
                let start_hash = await get_hash(start);
                if (start_hash === -1) {
                    layer.alert('获取hash校验值失败，请刷新浏览器后重试，或联系管理员！');
                    return
                }
                let Mdate = new Date(file.lastModifiedDate.toLocaleString()).getTime();
                let HASH = start_hash + '_' + Mdate;
                em_filename.setAttribute('hash', HASH);
                // 向服务器请求数据，查看服务器是否有上次上传中断的临时数据
                let result = await axios.get('/BIG_upload/', {
                    params: {
                        'HASH': HASH,
                        'filename': file.name,
                        'filesize': file.size,
                        'state': 'get_exist_size',
                    },
                });
                let file_name = result.data['file_name']
                if (result.data['code'] === 0) {
                    em_uploadpro.innerText = '失败';
                    em_uploadpro.style.color = 'red';
                    layer.alert(result.data['msg'])
                    return
                }
                // 开始上传，如果服务器已经有了一些缓存文件将不会再次上传已有的文件
                // 获取总的切片大小
                let exist_size = result.data['size'];
                let server_size = exist_size;
                let count = Math.ceil((file.size - exist_size) / slice_size);
                for (let index = 0; index < count; index++) {
                    let start = index * slice_size + exist_size;
                    let end = (index + 1) * slice_size + exist_size;
                    let data = file.slice(start, end);
                    let filedata = new FormData;
                    filedata.append('csrfmiddlewaretoken', token);
                    filedata.append('file', data);
                    filedata.append('HASH', HASH);
                    filedata.append('state', 'upload');
                    let result = await axios.post('/BIG_upload/', filedata,
                        {
                            onUploadProgress(ev) {

                                let pro = Math.floor(((server_size + ev.loaded) / file.size) * 100) + '%';
                                em_uploadpro.innerText = pro;
                                em_value.style.width = pro;
                            }
                        }
                    );
                    server_size += result.data['size'];
                }
                em_uploadpro.innerText = '校验'
                // 数据上传完毕，将文件拷贝至指定文件夹并校验文件完整性
                if (file.size === server_size) {
                    let result = await axios.get('/BIG_upload/', {
                        params: {
                            'HASH': HASH,
                            'filename': file.name,
                            'state': 'end',
                            'filepath': file.webkitRelativePath,
                            'cur_dir': cur_dir
                        },
                    });
                    console.log('实际上传后使用的cur_dir:', cur_dir);
                    if (result.data['code'] === 1) {
                        console.log(file_name + '上传成功！')
                        em_uploadpro.innerText = '完成';
                        em_uploadpro.style.color = 'green';
                        em_close.style.display = 'none';
                        em_progress.style.display = 'none';
                        em_open.style.display = 'inline-block';
                        em_open.setAttribute('cur_dir', result.data['save_path']);
                        // update_file_list('home', breadcrumb.getAttribute('cur_dir'));
                        resolve(file_name + '上传成功！');
                    } else {
                        console.log('上传失败，错误信息：' + result.data['msg'])
                        resolve('上传失败！错误信息：' + result.data['msg']);
                    }

                } else {
                    resolve('上传失败！本地文件和服务器文件不一致')
                }

            }
        });
        return await Pro.then(function (result) {
            upload_ok -= 1;
            let pro_upload_ok = document.querySelector('.title .progress-upload-ok');
            pro_upload_ok.innerText = upload_ok;
            if (upload_ok % 10 === 0) {
                update_file_list('home', breadcrumb.getAttribute('cur_dir'));
            }
            return 'res：' + result;
        })
    }
}

// 移动或复制文件时选择移动到那个文件夹方法
async function move_selector_folder(state) {
    let result = file_info_active();
    if (!result) {
        return
    }
    let move_dialog = document.querySelector('.move-folder-selector-dialog');
    let selector_dialog = move_dialog.querySelector('.selector-dialog');
    let move_folder_list = move_dialog.querySelector('.move-folder-list');
    let operate_type = move_dialog.querySelector('.operate-type');
    let move_close = move_dialog.querySelector('.move-close');
    let move_action = move_dialog.querySelector('.move-action');
    let move_return = move_dialog.querySelector('.folder-skip-return');
    let move_home = move_dialog.querySelector('.folder-skip-home');
    let move_folder_shadow = move_dialog.querySelector('.move-folder-shadow')
    move_dialog.style.display = 'block';
    operate_type.innerText = `${state}`;
    await get_folder('', '');

    move_close.addEventListener('click', function () {
        move_dialog.style.display = 'none';
        state = '';
    })
    move_action.onclick = async function(){
        move_folder_shadow.style.display = 'flex';
        let move_cur_dir = move_folder_list.getAttribute('cur_dir');
        let result = file_info_active();
        let move_dir = result[0];
        let move_file = result[1];
        let cur_dir = breadcrumb.getAttribute('cur_dir');
        let move_state = state==='移动' ? 'move' : 'copy';

        let formdata = new FormData;
        formdata.append('csrfmiddlewaretoken', token);
        formdata.append('cur_dir', cur_dir);
        formdata.append('move_cur_dir', move_cur_dir);
        formdata.append('move_dir', JSON.stringify(move_dir));
        formdata.append('move_file', JSON.stringify(move_file));
        formdata.append('state', move_state);
        result = await axios.post('/NAS/', formdata);
        if (result.data.code){
            layer.alert(result.data.msg);
            move_dialog.style.display = 'none';
            update_file_list('home', cur_dir);
        }
        else{
            layer.alert(result.data.msg);
        }
        move_folder_shadow.style.display = 'none';
    }
    move_folder_list.addEventListener('click', async function (ev) {
        for (let i = 0; i < ev.path.length; i++) {
            if (ev.path[i].className === 'move-folder') {
                let cur_dir = move_folder_list.getAttribute('cur_dir');
                let folder = ev.path[i].querySelector('.folder-name').innerText;
                await get_folder(cur_dir, folder);
                break;
            }
        }
    })
    move_return.addEventListener('click', function () {
        let cur_dir = move_folder_list.getAttribute('cur_dir');
        if (cur_dir) {
            let cur_dir_sp = cur_dir.split('\\');
            cur_dir = ''
            for (let i = 0; i < cur_dir_sp.length - 1; i++) {
                cur_dir += cur_dir_sp[i] + '\\';
            }
            get_folder(cur_dir, '');
        }

    })
    move_home.addEventListener('click', function () {
        if (move_folder_list.getAttribute('cur_dir')){
            get_folder('', '');
        }
    })

    selector_dialog.onmousedown = function(ev){
        //event的兼容性
        var ev = ev||event;
        //获取鼠标按下的坐标
        var x1 = ev.clientX;
        var y1 = ev.clientY;

        //获取元素的left，top值
        var l = selector_dialog.offsetLeft;
        var t = selector_dialog.offsetTop;

        //给可视区域添加鼠标的移动事件
        document.onmousemove = function(ev) {

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
            selector_dialog.style.top = lt + 'px';
            selector_dialog.style.left = ls + 'px';
        }
        //清除
        document.onmouseup = function(ev){
            document.onmousemove = null;
        }
    }

    async function get_folder(cur_dir, folder) {
        let formdata = new FormData;
        formdata.append('csrfmiddlewaretoken', token);
        formdata.append('cur_dir', cur_dir);
        formdata.append('folder', folder);
        formdata.append('state', 'get_folder');
        result = await axios.post('/NAS/', formdata);
        // 循环删除已有的文件夹
        while (move_folder_list.hasChildNodes()) {
            move_folder_list.removeChild(move_folder_list.lastChild);
        }
        // 添加文件夹
        if (result.data.code) {
            move_folder_list.setAttribute('cur_dir', result.data.cur_dir);
            let folders = result.data.folders;
            if (folders.length) {
                for (let i = 0; i < folders.length; i++) {
                    let div = document.createElement("div");
                    let img = document.createElement("img");
                    let span = document.createElement("span");

                    div.className = 'move-folder';
                    img.className = 'dir';
                    span.className = 'folder-name';
                    img.setAttribute('src', "/static/view_image/dir.png");
                    span.innerText = folders[i];

                    div.append(img);
                    div.append(span);

                    move_folder_list.append(div);
                }
            } else {
                let div = document.createElement("div");
                let img = document.createElement("img");
                let span = document.createElement("span");

                div.className = 'no-folder';
                img.className = 'dir';
                span.className = 'no-folder-text';
                img.setAttribute('src', "/static/view_image/dir.png");
                span.innerText = `${operate_type.innerText}到 ${result.data.folder} 文件夹下`;

                div.append(img);
                div.append(span);

                move_folder_list.append(div);
            }
        }
    }
}

// 更新数据列表和路径
async function update_file_list(state, path = breadcrumb.getAttribute('cur_dir'), standby = true) {
    right_content_shadow.style.display = 'flex';
    table_file_list.setAttribute('state', state);
    table_file_list.scrollTop = 0;
    let result = await axios.get('/NAS/', {
        params: {
            'state': state,
            'cur_dir': path,
            'standby': standby,
        },
    });
    // console.log(result.data)
    if (result.data.code === 1) {
        let file_data = result.data.file_data;
        let folders = result.data.folders;
        while (table_file_list.hasChildNodes()) {
            table_file_list.removeChild(table_file_list.lastChild);
        }

        if (folders.length > 0 || file_data.length > 0) {
            document.querySelector('.table-no-file').style.display = 'none';
        } else {
            document.querySelector('.table-no-file').style.display = 'flex';
        }

        for (let i = 0; i < folders.length; i++) {
            create_file_doc(folders[i].name, 'dir', folders[i].mtime, folders[i].ctime, '-', '', folders[i].fol_path)
        }
        for (let i = 0; i < file_data.length; i++) {
            create_file_doc(file_data[i][0], file_data[i][2], file_data[i][3], file_data[i][3], file_data[i][4], file_data[i][1], file_data[i][5])
        }
        let count = folders.length + file_data.length;
        file_breadcrumb.querySelector('.load_info').innerText = `已加载${count}个`;
        // 修改面包屑导航和url路径
        breadcrumb.setAttribute('cur_dir', result.data.cur_dir);
        // 删除原有面包屑
        while (breadcrumb.hasChildNodes()) {
            breadcrumb.removeChild(breadcrumb.lastChild);
        }
        if (state === 'home' || JSON.parse(standby)[1] === 'home') {
            // let li = document.createElement('li');
            // li.innerText = '全部文件';
            // breadcrumb.append(li);
            // 对新面包屑切片获取内容
            let sp = result.data.cur_dir.split('\\');
            // 循环添加新面包屑
            for (let i = 0; i < sp.length; i++) {
                if (sp[i]) {
                    let li = document.createElement('li');
                    li.innerText = sp[i];
                    li.title = sp[i];
                    breadcrumb.append(li);
                }
            }
            // 修改url
            if (window.history) {
                // 支持History API
                history.replaceState(null, "cur_dir", `?cur_dir=${path}`)
            }
            right_content_shadow.style.display = 'none';
            // 将面包屑滚动条拉到最右边
            breadcrumb.scroll(breadcrumb.clientWidth, 0);
            return 1
        } else {
            right_content_shadow.style.display = 'none';
            return 1
        }
    } else {
        layer.alert(result.data.msg)
    }

}

// 数据上传下载进度显示框方法
function transfer() {
    let transfer_list = document.querySelector('.transfer_list'),
        transfer = transfer_list.querySelector('.transfer'),
        transfer_state = transfer_list.querySelector('.transfer-state'),
        uploading = transfer_list.querySelector('.uploading'),
        downloading = transfer_list.querySelector('.downloading'),
        transfer_end = transfer_list.querySelector('.transfer-end'),
        active = transfer_list.querySelector('.active'),
        transfer_progress = transfer_list.querySelector('.transfer-progress'),
        progress_title = transfer_list.querySelector('.progress-title'),
        progress_list = transfer_list.querySelector('.progress-list'),
        uploading_progress = transfer_list.querySelector('.uploading-progress')
        // active = transfer_list.querySelector('.active'),
    ;
    transfer_list.addEventListener('click', function (ev) {
        let class_name = ev.target.classList[0];
        switch (class_name) {
            case 'tli':
                if (getComputedStyle(transfer).display === 'none') {
                    transfer.style.display = 'flex';
                } else {
                    transfer.style.display = 'none';
                }
                break
            case 'uploading':
                // add_active();
                break
            case 'downloading':
                // add_active();
                break
            case 'transfer-end':
                // add_active();
                break
        }

        function add_active() {
            transfer_list.querySelector('.active').classList.remove('active');
            ev.target.classList.add('active');
            progress_title.innerText = ev.target.innerText;
        }
    })

    // 如果打开了文件传输窗口，则点击其他窗口都会关闭文件传输窗口
    document.querySelector('body').addEventListener('click', function (ev) {

        for (let i = 0; i < ev.path.length; i++) {
            if (ev.path[i].className === 'transfer_list') {
                return
            }
        }
        if (getComputedStyle(transfer).display === 'flex') {
            transfer.style.display = 'none';
        }

    })
}

// 获取选中的文件夹和文件，并返回
function file_info_active() {
    let act = table_file_list.querySelectorAll('.file-info .active');
    if (act.length < 1) {
        layer.msg('请先选中文件在进行操作！', {icon: 2});
        return
    }
    let dir = new Array();
    let file = new Array();
    for (let i = 0; i < act.length; i++) {
        if (act[i].nextElementSibling.className === 'dir') {
            dir.push(act[i].nextElementSibling);
        } else {
            file.push(act[i].nextElementSibling);
        }
    }

    let file_dir = breadcrumb.getAttribute('cur_dir');
    let file_path = new Array();
    let dir_path = new Array();
    for (let i = 0; i < dir.length; i++) {
        // let cur_dir = file_dir ? file_dir + '\\' : '';
        let path = dir[i].nextElementSibling.getAttribute('title');
        dir_path.push(path)
    }
    for (let i = 0; i < file.length; i++) {
        file_dir = file[i].getAttribute('cur_dir');
        let file_name = file[i].nextElementSibling.getAttribute('title');
        let file_upload_date = file[i].parentNode.nextElementSibling.nextElementSibling.innerText;
        let file_size = file[i].parentNode.parentNode.querySelector('.file-size').innerText;
        file_path.push([file_name, file_upload_date, file_size, file_dir]);
    }
    // console.log(dir_path)
    return [dir_path, file_path];
}

// 创建文件上传进度条
function create_change_pro(file_name, hash_name, file_size) {

    file_size = size_conversion(file_size);
    let li = document.createElement('li');
    li.classList.add('uploading-li');
    let info = `<div class="uploading-file-info">
                    <span class="file-name" hash_name="${hash_name}" title="${file_name}">${file_name}</span>
                    <span class="file-size">${file_size}</span>
                    <span class="upload-pro">等待</span>
                    <i class="uploading-close" title="取消上传"></i>
                    <i class="uploading-open" title="打开文件路径"></i>
                </div>
                <div class="uploading-file-progress">
                    <div class="uploading-file-value"></div>
                </div>`;
    li.innerHTML = info;
    document.querySelector('.transfer_list .uploading-progress').append(li);
    return li
}

// 格式化输出文件大小
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

// 创建标签并添加到文件列表中
async function create_file_doc(name, type, mtime, ctime, file_size, base64_name = '', path = '') {
    let background;
    if (type === 'image') {
        background = `<i class="${type}"  cur_dir="${path}">
<!--                        -->
                            <img src="/get_image/?filename=${base64_name}&cur_dir=${path}" alt="">
                        </i>`
    } else {
        background = `<i class="${type}" cur_dir="${path}" style="background: url('/static/view_image/${type}.png') no-repeat center center;"></i>`
    }
    let curtail_name = name;
    if (curtail_name.length > 50) {
        curtail_name = curtail_name.slice(0, 25) + '......' + curtail_name.slice(curtail_name.length - 25)
    }
    let doc = `<div class="file-info">
                        <input type="checkbox" class="checkbox">
                        ${background}
                        <span class="file-name" title="${name}">${curtail_name}</span>
                    </div>
                    <div class="file-change-date">
                        <div class="change-date">${mtime}</div>
                        <div class="change-operate">
                            <i class="share"></i>
                            <i class="download"></i>
                            <i class="more"></i>
                        </div>
                    </div>
                    <div class="file-upload-date">${ctime}</div>
                    <div class="file-size">${file_size}</div>`
    let table_file = document.createElement('div');
    table_file.className = 'table-file';
    table_file.innerHTML = doc;
    table_file_list.append(table_file);
}

// 创建一个form下载文件，下载成功后销毁
async function download_form(url, filepath, zip_path, file_name) {
    // let csrf = document.querySelector('input[name=csrfmiddlewaretoken]').value;
    let form = document.createElement('form');
    let input = document.createElement('input');
    let input2 = document.createElement('input');
    let input3 = document.createElement('input');
    let input4 = document.createElement('input');
    form.action = url;
    form.method = 'post';
    input.type = 'hidden';
    input2.type = 'hidden';
    input3.type = 'hidden';
    input4.type = 'hidden';
    input.name = 'state';
    input.value = filepath;
    input2.name = 'zip_path';
    input2.value = zip_path;
    input3.name = 'file_name';
    input3.value = file_name;
    input4.name = 'csrfmiddlewaretoken';
    input4.value = token;
    form.append(input);
    form.append(input2);
    form.append(input3);
    form.append(input4);
    let body = document.querySelector('body');
    body.append(form);
    form.submit();
    body.removeChild(form);
}

window.onload = async function () {
    breadcrumb.scroll(breadcrumb.clientWidth, 0);
    left_nav_fun();
    file_upload_fun();
    top_tools_fun();
    file_list_fun();
    transfer();
    await update_file_list('home');
    right_content_shadow.style.display = 'none';

}

