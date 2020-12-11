const fs = require('fs');
const path = require('path');
const copydir = require('copy-dir');

const consoleStyle = {
    redBG: '\x1b[97;41m',
    greenBG: '\x1b[97;42m',
    end:'\x1b[0m',
};

const log = (msg, style = '')=>{
    console.log(style, msg, consoleStyle.end);
};
const project = process.cwd();
// console.log(process.execPath)
// console.log(__dirname)
// console.log(process.cwd())

const sourcePath = path.join(project, 'build');
const targetPath = path.join(project, 'docs');

log('开始执行文件拷贝');
log('build to docs');
copydir(sourcePath, targetPath, { cover: true }, function(err){
    if(err) throw err;
    log('\n所有拷贝操作已经完成！');
});

