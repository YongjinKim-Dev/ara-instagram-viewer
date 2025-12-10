const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // 나중에 파일 시스템 접근 등 추가 가능
})
