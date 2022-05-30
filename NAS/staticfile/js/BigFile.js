(function () {
    let big_input = $('.big-input'),
        upload = $('.upload'),
        big_bar = $('.big_bar'),
        big_value = $('.big_value'),
        big_span = $('.big_bar span'),
        files = [];
    upload[0].addEventListener('click', function () {
        big_input.click();
    });
    big_input[0].addEventListener('change', async function () {
        files = big_input[0].files;
        if (!files) return;
        upload.addClass('btn-loading');
        let load_size = 0;
        let total_size = 0;
        let src = 0;
        for (let i = 0; i < files.length; i++) {
            total_size += files[i].size;
        }
        big_bar[0].style.display = 'flex';
        big_span[0].innerText = '准备文件中'
        big_value[0].style.width = '0';
        let res = await upload_fun();

        console.log(src, files.length, res);
        if (src === files.length) {
        }

        async function upload_fun() {
            for (let i = 0; i < files.length; i++) {
                try {
                    let HASH;
                    let slice = 1024 * 1024;
                    let count;
                    big_span[0].innerText = '正在编码';
                    const fileReader = new FileReader();
                    fileReader.readAsArrayBuffer(files[i]);
                    fileReader.onload = async e => {
                        try {
                            let buffer = e.target.result,
                                md5 = new SparkMD5.ArrayBuffer();
                            md5.append(buffer);
                            HASH = md5.end();

                            // 以get请求发起传输请求，传输文件HASH值
                            let result = await axios.get('BigFile/', {
                                params: {
                                    'HASH': HASH,
                                    'state': 'start',
                                },
                            });
                            // 判断是否允许传输，允许传输则获取已存在的文件大小
                            if (result.data['code'] === 0) {
                                alert('传输失败，错误代码：' + result.data['msg'])
                                return
                            }
                            let old_size = result.data['size'];
                            load_size += old_size;
                            // 获取需要上传的次数
                            count = Math.ceil((files[i].size - old_size) / slice);
                            // 循环切片传输
                            for (let index = 0; index < count; index++) {
                                try {
                                    let start = index * slice + old_size;
                                    let end = (index + 1) * slice + old_size;
                                    let slice_file = files[i].slice(start, end);
                                    let form_data = new FormData;
                                    form_data.append('csrfmiddlewaretoken', $('[name=csrfmiddlewaretoken]').val());
                                    form_data.append('filename', `${index + 1}_${files[i].name}`);
                                    form_data.append('dirname', `files[i].name`);
                                    form_data.append('HASH', HASH);
                                    form_data.append('slice_file', slice_file);

                                    // 上传文件
                                    result = await axios.post('BigFile/', form_data, {
                                        onUploadProgress(ev) {
                                            if (load_size === total_size) {
                                                big_span[0].innerText = '文件校验中';
                                            }
                                        }
                                    });

                                    // 判断上传是否成功
                                    if (result.data['code'] === 0) {
                                        throw result.data['msg']
                                    } else {
                                        load_size += slice_file.size;
                                        let pro = Math.floor((load_size / total_size * 100)) + '%';
                                        big_value[0].style.width = pro;
                                        big_span[0].innerText = pro;
                                    }
                                } catch (e) {
                                    alert("文件传输失败，请检查设置，错误信息：" + e)
                                }
                            }
                            // 如果上传完毕，则发送get请求让服务器将文件保存至相应的目录
                            if (result.data['size'] === files[i].size) {
                                result = await axios.get('BigFile/', {
                                    params: {
                                        'filename': files[i].name,
                                        'HASH': HASH,
                                        'state': 'end',
                                    },
                                });
                                if (result.data['code'] === 1) {
                                    // alert('文件传输成功！');
                                    src += 1
                                    if (load_size === total_size) {
                                        big_span[0].innerText = '上传完毕';
                                        alert(`文件上传完毕，总计上传${src}个文件！`);
                                        upload.removeClass('btn-loading');
                                    }
                                } else {
                                    throw result.data['msg']

                                }
                            } else {
                                throw '本地文件与服务器文件不符，请确认后重新上传'
                            }
                        } catch (e) {
                            alert('文件传输失败，错误代码：' + e)
                        }

                    };
                } catch (e) {
                    alert('文件传输失败，错误代码：' + e)
                    return
                }
            }
        }
    });

})();