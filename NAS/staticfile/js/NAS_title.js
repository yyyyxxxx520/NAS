let title = document.querySelector('.title'),
    user_info = title.querySelector('.user-info'),
    head = user_info.querySelector('.head-portrait'),
    user_name = user_info.querySelector('.user-name'),
    user_close = user_info.querySelector('.user-close')

user_close.addEventListener('click', async function () {
    let result = await axios.get('/NAS_user_action/', {
        params: {
            'state': 'close',
        },
    });
    if (result.data.code === 1){
        window.location.href = result.data.url
    }
})



