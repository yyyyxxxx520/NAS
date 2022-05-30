(function () {
    let preview = $('.preview_btn');
    let in_file = $('.preview_input');
    let img = $('.base64-preview img');

    preview[0].addEventListener('click', function () {
        in_file.click();
    })
    in_file[0].addEventListener('change', function () {
        let val = in_file.val();
        if (val) {
            let file = in_file[0].files[0]
            if (file.size > 2 * 1024 * 1024 || !image_type(file)) {
                alert('仅支持2MB以内的图片文件！')
                return
            }
            preview.addClass('btn-disabled');
            (async function () {
                const base = await image_base64(file);
                img.attr('src', base)

            })();
            preview.removeClass('btn-disabled');
        }

    })

})();

