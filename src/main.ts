import * as querystring from "querystring";
import * as md5 from "md5";
import * as https from "https";
import {appid, secret} from "../privacy";

type BaiduResult = {
  error_code?: string;
  error_msg?: string;
  from: string;
  to: string;
  trans_result: {
    src: string;
    dst: string;
  }[]
}

export const translate = (words) => {
  const salt = Math.round(Math.random() * 100);

  const query = querystring.stringify({
    q: words,
    from: 'en',
    to: 'sdfsdfsd',
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
      chunks.push(chunk);
      // console.log(`响应主体: ${JSON.parse(chunk)}`);
    });
    response.on('end', () => {
      const string = Buffer.concat(chunks).toString();
      const obj: BaiduResult = JSON.parse(string);
      if (obj.error_code) {
        console.log('【错误】 错误码 ' + obj.error_code + ' ' + obj.error_msg);
        process.exit();
      } else {
        console.log('【翻译结果】', obj.trans_result.map(item => item.dst).join(','));
      }
    });
  });

  request.on('error', (e) => {
    console.error(`请求遇到问题: ${e.message}`);
  });

// 将数据写入请求主体。
  request.end();

};