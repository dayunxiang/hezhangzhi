import axios from 'axios'
import qs from 'qs'
import {baseUrl} from '@/config/env';

axios.defaults.baseURL = baseUrl;
// //在main.js设置全局的请求次数，请求的间隙
// axios.defaults.retry = 4;
// axios.defaults.retryDelay = 1000;
//
// axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
//   var config = err.config;
//   // If config does not exist or the retry option is not set, reject
//   if(!config || !config.retry) return Promise.reject(err);
//
//   // Set the variable for keeping track of the retry count
//   config.__retryCount = config.__retryCount || 0;
//
//   // Check if we've maxed out the total number of retries
//   if(config.__retryCount >= config.retry) {
//     // Reject with the error
//     return Promise.reject(err);
//   }
//
//   // Increase the retry count
//   config.__retryCount += 1;
//
//   // Create new promise to handle exponential backoff
//   var backoff = new Promise(function(resolve) {
//     setTimeout(function() {
//       resolve();
//     }, config.retryDelay || 1);
//   });
//
//   // Return the promise in which recalls axios to retry the request
//   return backoff.then(function() {
//     return axios(config);
//   });
// });


axios.interceptors.request.use(
  config => {
    // 这里写死一个token，你需要在这里取到你设置好的token的值
    const token = '';
    if (token) {
      // 这里将token设置到headers中，header的key是Authorization，这个key值根据你的需要进行修改即可
      config.headers.token = token;
    }
    return config
  },
  error => {
    return Promise.reject(error)
  });
// axios.interceptors.response.use(response => {
//   return response
// }, error => {
//   return Promise.resolve(error.response)
// });

function checkStatus(response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常'
  }
}

function checkCode(res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    // console.log(res.msg)
  }
  if (res.data && (!res.data.data)) {
    // console.log(res.data)
  }
  return res
}

export default {
  post(url, data) {
    return axios({
      method: 'post',
      url,
      data: qs.stringify(data),
      timeout: 6000,
      headers: {
        'iv-user': 'zhutiantian is a big SB',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  // let fd = new FormData();
  // fd.append('file', file);//这里上传的是一个图片文件，以base64传递
  postformdata(url, fd) {
    return axios({
      method: 'post',
      url,
      data: fd,
      timeout: 6000,
      headers: {

        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'multipart/form-data'   //hearder 很重要，Content-Type 要写对
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  get(url, params) {
    return axios({
      method: 'get',
      url,
      params, // get 请求时带的参数
      timeout: 6000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
}
