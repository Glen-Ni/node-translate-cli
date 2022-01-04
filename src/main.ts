import * as querystring from "querystring";
import * as md5 from "md5";
import * as https from "https";
import {appid, secret} from "../privacy";
import * as http from "http";
import * as buffer from "buffer";

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


const ERROR_MAP = {
  52000: '成功',
  52001: '请求超时',
  52002: '系统错误',
  52003: '未授权用户',
  54000: '必填参数为空',
  54001: '签名错误',
  54003: '访问频率受限',
  54004: '账户余额不足',
  54005: '长query请求频繁',
  58000: '客户端IP非法',
  58001: '译文语言方向不支持',
  58002: '服务当前已关闭',
  90107: '认证未通过或未生效',
};

export const translate = async (words: string) => {
  const salt = Math.round(Math.random() * 100);
  let from, to;

  if (/[a-zA-Z]/.test(words[0])) {
    from = 'en';
    to = 'zh';
  } else {
    from = 'zh';
    to = 'en';
  }

  const res = await getSign<{ data: string }>(words, salt) as { data: string };
  const query = querystring.stringify({
    q: words,
    from,
    to,
    appid,
    salt,
    sign: res.data
  });

  console.log('query', query);

  const options = {
    hostname: 'fanyi-api.baidu.com',
    port: 443,
    path: '/api/trans/vip/translate?' + query,
    method: 'GET',
  };

  const request = https.request(options, (response) => {
    let chunks: Buffer[] = [];
    response.on('data', (chunk) => {
      chunks.push(chunk);
      // console.log(`响应主体: ${JSON.parse(chunk)}`);
    });
    response.on('end', () => {
      const string = Buffer.concat(chunks).toString();
      const obj: BaiduResult = JSON.parse(string);
      if (obj.error_code) {
        // @ts-ignore
        console.log('【错误】 ' + obj.error_code + ' ' + ERROR_MAP[obj.error_code] + ' ' + obj.error_msg);
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

function getSign<F>(q:string, salt: number) {
  const query = querystring.stringify({
    q,
    salt,
  });
  const options = {
    hostname: 'resume.glenni.ga',
    path: '/apis?' + query,
    method: 'GET',
  };
  return new Promise((resolve, reject) => {
    const request = http.request(options, (response) => {
      let chunks: Buffer[] = [];
      response.on('data', (chunk) => {
        chunks.push(chunk);
      });
      response.on('end', () => {
        const string = Buffer.concat(chunks).toString();
        const obj: F = JSON.parse(string);
        resolve(obj);
      });
    });
    request.on('error', (e) => {
      reject(e);
    });
    request.end();
  });
}