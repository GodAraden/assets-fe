<template>
  <img src="/favicon.ico" width="64" height="64" />
  <h3>文件上传 UI，一切从简</h3>

  <div style="display: grid; grid-template-columns: 72px 1fr; gap: 20px; margin-bottom: 16px">
    <!-- 文件上传框 -->
    <label for="asset">文件</label> <input type="file" ref="input" id="asset" />
    <!-- 密钥输入框 -->
    <label for="key">密钥</label> <input type="password" v-model="key" id="key" />
    <!-- 上传后是否保留原文件名，即不加时间戳 -->
    <label for="hold">保留原名</label> <input type="checkbox" v-model="hold" id="hold" />
  </div>

  <button class="btn" @click="onUpload">上传</button> <br /><br />
  <button class="btn" @click="copy" :disabled="tip === defaultTip || tip === successTip">
    {{ tip }}
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MD5 } from 'crypto-js'
import axios from 'axios'

const defaultTip = '上传成功后，这里会展示用于访问文件的文件名，点击复制完整URL 🙌'
const successTip = '复制成功 🎇'

const input = ref<HTMLInputElement>()
const key = ref('')
const hold = ref(false)
const tip = ref(defaultTip)

// 复制资源完整访问 url 到剪切板
function copy() {
  if (tip.value !== defaultTip && tip.value !== successTip) {
    const domain = import.meta.env.PROD ? 'http://assets.araden.top/' : 'http://localhost:10086/'
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(domain + tip.value).then(() => {
        tip.value = successTip
      })
    } else {
      let textArea = document.createElement('textarea')
      textArea.value = domain + tip.value
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand('copy')
      textArea.remove()
      tip.value = successTip
    }
  }
}

// 上传资源，资源的命名单独传一下
async function upLoadAsset(params: { asset: File; key: string; hold: boolean }) {
  const formData = new FormData()
  formData.append('asset', params.asset)
  formData.append('hold', params.hold ? 'original' : '')
  formData.append('name', params.asset.name)
  try {
    const url = import.meta.env.PROD ? 'http://assets.araden.top/' : '/api/'
    const { data } = await axios.post<string>(url, formData, {
      headers: {
        'upload-assets-key': MD5(params.key + new Date().toLocaleDateString('zh-CN')).toString()
      }
    })
    return data
  } catch (error) {
    return `${error.response.data.statusCode}: ${error.response.data.message}`
  }
}

// 上传按钮点击事件处理
async function onUpload() {
  const file = input.value.files[0]
  if (!file) return
  const data = await upLoadAsset({
    asset: file,
    hold: hold.value,
    key: key.value
  })
  tip.value = data
  setTimeout(() => {
    tip.value = defaultTip
  }, 23300)
}
</script>

<style>
.btn {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  cursor: pointer;
  transition: border-color 0.25s;
  background-color: #f9f9f9;
}
.btn:hover {
  border-color: #646cff;
}
.btn:focus,
.btn:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}
</style>
