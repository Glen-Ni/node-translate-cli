## 基于Node.js的命令行翻译工具

### How to use
- 安装
```shell
> npm install translate-cli -g
```
- 使用
```shell
> fy <content>
# content支持中英文
```
example:
```shell
> fy 我是谁
#【翻译结果】 Who am I?
> fy Who am I
#【翻译结果】 我是谁
```

### 技术栈
- TypeScript
- Node.js: http module
- [commander.js](https://github.com/tj/commander.js)
- 一点点服务器知识（nginx、pm2）

### 实现原理
- 使用[百度翻译API](http://api.fanyi.baidu.com/doc/11)
- 输入 => 获取API需要的sign（向个人服务器请求）=> 使用百度翻译API获取翻译结果 => 输出
- 为了不暴露百度翻译API秘钥，通过接口向个人服务器发请求获取MD5加密后的sign