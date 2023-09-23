<template>
  <img src="/favicon.ico" width="64" height="64" />
  <h3>文件上传，一切从简【doge】</h3>
  <div style="display: grid; grid-template-columns: 36px 1fr; gap: 20px; margin-bottom: 16px">
    <label for="asset">文件</label>
    <input type="file" ref="input" id="asset" />
    <label for="key">密钥</label>
    <input type="password" v-model="key" id="key" />
  </div>
  <button id="upload" @click="onUpload">上传</button> <br /><br />
  <span>{{ tip }}</span>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { upLoadAsset } from './api/upload'

const input = ref<HTMLInputElement>()
const key = ref('')
const tip = ref('上传成功会在这里展示用于访问文件的文件名')

async function onUpload() {
  const file = input.value.files[0]
  if (!file) return
  const data = await upLoadAsset({
    asset: file,
    key: key.value
  })
  tip.value = data
}
</script>
