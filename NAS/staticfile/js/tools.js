// 判断文件类型是否是图片格式
image_type = file => {
    let file_type = ['image/jpg', 'image/jpeg', 'image/png'];
    let n = false;
    for (let i = 0; i < file_type.length; i++) {
        if (file_type[i] === file.type) {
            n = true
        }
    }
    return n
}

//将图片文件转化为base64编码
image_base64 = file => {
    if (image_type(file) && file.size <= 2 * 1024 * 1024) {
        return new Promise(resolve => {
            let base = new FileReader();
            base.readAsDataURL(file);
            base.onload = ev => {
                resolve(ev.target.result);
            }
        })
    } else {
        return null
    }
}



