const request = require('request');

module.exports = (type, version, path) => {
    console.log(version)
    console.log(path)
    console.log(`上传${type}版本路径信息....`.green);
    return new Promise((resolve, reject) => {
        request( {
            method: 'POST',
            url:'http://m-book_list_app.zuzuche.net/car/api/RnVersion/upload',
            formData:{
                version, 
                path
            }
        }, (error, response, body) => {
            if ( error) {
                throw error;
            }
            body = JSON.parse(body);
            if ( body.code == 200 ) {
                console.log(`上传${type}成功`.green);
                resolve();
            } else {
                console.dir(body);
                throw '接口异常';
            }
        })
    });
}