import axios from 'axios'
import { MD5 } from 'crypto-js'

export async function upLoadAsset(params: { asset: File; key: string; hold: boolean }) {
  const formData = new FormData() // 创建表单类型数据
  formData.append('asset', params.asset)
  formData.append('hold', params.hold ? 'original' : '')
  try {
    const url = import.meta.env.PROD ? 'http://assets.araden.top/' : '/api/'
    const { data } = await axios.post<string>(url, formData, {
      headers: {
        'upload-assets-key': MD5(params.key + new Date().toLocaleDateString()).toString()
      }
    })
    return data
  } catch (error) {
    return `${error.response.data.statusCode}: ${error.response.data.message}`
  }
}
