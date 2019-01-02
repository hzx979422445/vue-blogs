import Vue from 'vue'
import axios from 'axios'
import {Message, Loading} from 'element-ui'
import qs from 'qs'

let axiosIns = axios.create({})
let loading
let needLoadingRequestCount = 0
let ajaxMethod = ['get', 'post', 'put', 'delete']
let api = {}
/**
 * 设置默认请求路径
 */
axiosIns.defaults.baseURL = process.env.API_ROOT

/**
 * 开始加载请求的loading
 */
function startLoading () {
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

/**
 * 结束加载请求的loading
 */
function endLoading () {
  loading.close()
}

/**
 *打开loading
 */
export function showFullScreenLoading () {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

/**
 *关闭loading
 */
export function tryHideFullScreenLoading () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

axiosIns.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'
axiosIns.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest'
axiosIns.defaults.responseType = 'json'

/**
 * 添加请求拦截器
 */
axiosIns.interceptors.request.use(
  (config) => {
    config.headers.Accept = '* '
    config.headers['Content-Type'] = 'application/json'
    if (config['Page-Number'] !== undefined) {
      config.headers['Page-Number'] = config['Page-Number']
      config.headers['Page-Size'] = config['Page-Size']
      config.headers['OrderBy'] = config['OrderBy']
      config.headers['Dir'] = config['Dir']
    }
    if (config['Content-Type']) {
      config.headers['Content-Type'] = config['Content-Type']
    }
    if (config['formData']) {
      qs.stringify(config.data)
    } else {
      JSON.stringify(config.data)
    }
    showFullScreenLoading()
    return config
  }, (error) => {
    Message('请求异常,无法访问服务器')
    tryHideFullScreenLoading()
    return Promise.reject(error)
  }
)
/**
 * 添加一个响应拦截器
 */
axiosIns.interceptors.response.use(
  (response) => {
    let curPage = response.data.body.curPage
    if (curPage) {
      sessionStorage.setItem('curPage', curPage)
    }
    tryHideFullScreenLoading()
    let code = response.data.code
    if (code === 100000) {
      return response.data.body
    } else if (code === 100001) {
      Message('服务器运行异常')
    } else if (code === 100002) {
      Message('没有访问资源的权限')
    } else if (code === 100003) {
      Message('没有找到资源')
    } else if (code === 100004) {
      Message('请求异常')
    }
  },
  (error) => {
    setTimeout(() => {
      Message('请求异常,无法访问服务器')
      tryHideFullScreenLoading()
      return Promise.reject(error)
    }, 2000)
  }
)
/**
 * 参数说明:url:请求地址
 * data:请求参数
 * config:请求拦截器配置(暂时用于配置header分页和header基础参数)
 */
ajaxMethod.forEach((method) => {
  api[method] = function (uri, data, config) {
    return new Promise(function (resolve, reject) {
      axiosIns[method](uri, data, config).then((response) => {
        resolve(response)
      }).catch((response) => {
        reject(response)
      })
    }).catch((error) => {
      console.error(error)
    })
  }
})
Vue.prototype.$axios = api
export default {}
