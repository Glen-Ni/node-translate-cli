import * as querystring from "querystring";
import * as md5 from "md5";
import * as https from "https";
import {appid, secret} from "../privacy";

export const translate = (words) => {
  const salt = Math.round(Math.random() * 100);

  const query = querystring.stringify({
    q: words,
    from: 'en',
    to: 'zh',
    appid,
    salt,
    sign: md5(appid + words + salt + secret)
  });

  const options = {
    hostname: 'fanyi-api.baidu.com',
    port: 443,
    path: '/api/trans/vip/translate?' + query,
    method: 'GET',
  };

  const request = https.request(options, (response) => {
    let chunks = [];
    response.on('data', (chunk) => {
      chunks.push(chunk)
      // console.log(`响应主体: ${JSON.parse(chunk)}`);
    });
    type BaiduResult = {

    }
    response.on('end', () => {
      const string = Buffer.concat(chunks).toString();
      const obj = JSON.parse(string);
      console.log('结果',obj);
    });
  });

  request.on('error', (e) => {
    console.error(`请求遇到问题: ${e.message}`);
  });

// 将数据写入请求主体。
  request.end();

};