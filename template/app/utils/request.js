// const codeMessage = {
//   200: '服务器成功返回请求的数据',
//   201: '新建或修改数据成功。',
//   202: '一个请求已经进入后台排队（异步任务）',
//   204: '删除数据成功。',
//   400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
//   401: '用户没有权限（令牌、用户名、密码错误）。',
//   403: '用户得到授权，但是访问是被禁止的。',
//   404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
//   406: '请求的格式不可得。',
//   410: '请求的资源被永久删除，且不会再得到的。',
//   422: '当创建一个对象时，发生一个验证错误。',
//   500: '服务器发生错误，请检查服务器',
//   502: '网关错误',
//   503: '服务不可用，服务器暂时过载或维护',
//   504: '网关超时',
// }

// function checkStatus(response) {
//   if (response.status >= 200 && response.status < 300) {
//     return response
//   }
//   return response
//   //   const errortext = codeMessage[response.status] || response.statusText
//   //   notification.error({
//   //     message: `请求错误 ${response.status}: ${response.url}`,
//   //     description: errortext,
//   //   })
//   //   const error = new Error(errortext)
//   //   error.name = response.status
//   //   error.response = response
//   //   throw error
// }

export const baseUrl = 'http://189.203.201.100/' // 正式地址正式库
/**
 * Requests a URL, returning a promise.
 *      An object containing either "data" or "err"
 */
export default function request(url, options) {
  // console.log(baseUrl + url, options)
  const defaultOptions = {
    credentials: 'include',
  }
  const newOptions = { ...defaultOptions, ...options }
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    }
    newOptions.body = JSON.stringify(newOptions.body)
  }

  return fetchRequest(fetch_promise(baseUrl + url, newOptions), 20000) // 20s
}

function fetchRequest(fetchpromise, timeout) {
  let abort_fn = null
  const abort_promise = new Promise(resolve => {
    abort_fn = () => {
      resolve('请求超时')
      // reject(new TypeError("abort promise"));
    }
  })
  const abortable_promise = Promise.race([fetchpromise, abort_promise])
  setTimeout(() => {
    abort_fn()
  }, timeout)

  return abortable_promise
}

function fetch_promise(url, newOptions) {
  return new Promise(resolve => {
    fetch(url, newOptions)
      // .then(checkStatus)
      .then(response => {
        if (newOptions.method === 'DELETE' || response.status === 204) {
          return response.text()
        }
        return response.json()
      })
      .then(jsonData => {
        // console.log(jsonData)
        resolve(jsonData)
      })
      .catch(err => {
        // reject(err);
        if (err.message === 'Network request failed') {
          return '网络出错'
        }
        resolve({ staus: '0' })
        return { staus: '0' }
      })
  })
}

export function uploadImage(url, params = {}) {
  // console.log(url, params)
  const uploadImagefun = new Promise(resolve => {
    const formData = new FormData()
    Object.keys(params).forEach(key => {
      formData.append(key, params[key])
    })
    const file = {
      uri: params.path,
      type: 'multipart/form-data',
      name: 'image.jpg',
    }
    formData.append('file', file)

    fetch(baseUrl + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data;charset=utf-8',
        // "x-access-token": token,
      },
      credentials: 'include',
      body: formData,
    })
      .then(response => response.json())
      .then(responseData => {
        // console.log(responseData)
        resolve(responseData)
      })
      .catch(err => {
        // console.log(err)
        resolve(err)
      })
  })
  return uploadImagefun
}
