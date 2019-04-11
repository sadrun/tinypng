const commander = require('commander');
const pkg = require('../package');
const {init, addKey, deleteKey, emptyKey, list, targetFiles, compress, deepCompress} = require('../lib/subCommand.js');
const { getKeys } = require('../lib/util.js');

// 主命令
commander
.version(pkg.version, '-v, --version')
.usage('[options]')
.option('-p, --path <newPath>', '压缩后的图片存放到指定路径（使用相对路径）')
.option('-a, --add <key>', '添加API_KEY')
.option('--delete <key>', '删除指定API_KEY')
.option('-l, --list', '显示已储存的API_KEY')
.option('--empty', '清空已储存的API_KEY')
.option('-h, --help', '在https://tinypng.com/developers 获取key，然后在https://tinypng.com/dashboard/api 找到key')

// 子命令
commander
.command('deep')
.description('把该目录内的所有图片（含子目录）的图片都进行压缩')
.action(()=> {
    if (getApiKeys().length === 0) {
        console.log('请初始化你的API_KEY')
        init();
    } else {
        deepCompress();
    }
})

commander.parse(process.argv);

// 选择入口
if (commander.path) {
    // 把图片存放到其他路径
    compress(commander.path);
} else if (commander.add) {
    // 添加API_KEY
    addKey(commander.add);
} else if (commander.delete) {
    // 删除API_KEY
    deleteKey(commander.delete);
} else if (commander.list) {
    // 显示API_KEY
    list();
} else if (commander.empty) {
    // 清空API_KEY
    emptyKey();
} else {
    // 主命令
    if (typeof commander.args[0] === 'object') {
        // 子命令
        return;
    }
    if (commander.args.length !== 0) {
        // console.log('未知命令');
        targetFiles(commander.args);
        return;
    }
    if (getKeys().length === 0) {
        console.log('请初始化你的API_KEY')
        init();
    } else {
        compress();
    }
};
