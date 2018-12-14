/*
let fs=require('fs');
let path=require('path');
function rmWide(p, callback){
    let arr = [p];
    let current;
    function next(index){
        current = arr[index];
        if(!current) return rm(index - 1);
        fs.stat(current, function(err, statObj){
            if(statObj.isDirectory()){
                fs.readdir(current, function(err, dirs){
                    dirs = dirs.map(dir => path.join(current, dir));
                    arr = [...arr, ...dirs];
                    next(index+1);
                });
            } else {
                next(index+1);
            }
        });
    }
    function rm(index){
        current = arr[index];
        if(!current){
            return callback();
        }
        fs.stat(current, function(err, statObj){
            if(statObj.isDirectory()){
                fs.rmdir(current, err => rm(index-1));
            } else {
                fs.unlink(current, err => rm(index-1));
            }
        })
    }
    next(0)
}
rmWide('a', data => {
    console.log('删除结束')
})*/

let fs=require('fs');
let path=require('path');
let { promisify } = require('util');
let stat = promisify(fs.stat);
let readdir = promisify(fs.readdir);
let unlink = promisify(fs.unlink);
let rmdir = promisify(fs.rmdir);
async function rmWide(p) {
    let arr = [p];
    let index = 0;
    let current;
    while (current = arr[index++]) {
        let statObj = await stat(current);
        if (statObj.isDirectory()) {
            let dirs = await readdir(current);
            dirs = dirs.map(dir => path.join(current, dir));
            arr = [...arr, ...dirs]
        }
    }
    for (let i = arr.length - 1; i >= 0; i--) {
        let statObj = await stat(arr[i]);
        if (statObj.isDirectory()) {
            await rmdir(arr[i])
        } else {
            await unlink(arr[i])
        }
    }

}
rmWide('a').then(() => {
    console.log('ok')
});
