import request, { uploadImage } from '../utils/request'
import { bettemInitUser,appFlag } from '../utils/baseConfig';

/**
 * 在models的effects中call使用
 */
export async function login(params) {
  if(appFlag==='init'){
    return  new Promise(resolve => {
      resolve(bettemInitUser);
    })
  }
  return request('mobileControllerv2.do?login', {
    method: 'POST',
    body: params,
  })
}

export async function uploadImg(params) {
  return uploadImage('mobilePoorController.do?uploadFile', params)
}

export async function baseUploadImg(url, params) {
  return uploadImage(url, params)
}

export async function getDestituteFamily(params) {
  return request('mobilePoorController.do?peopleList', {
    method: 'POST',
    body: params,
  })
}

export async function getAreaTree(params) {
  return request('mobileHelpController.do?areaTree', {
    method: 'POST',
    body: params,
  })
}

export async function baseRequest(url, params) {
  return request(url, {
    method: 'POST',
    body: params,
  })
}
