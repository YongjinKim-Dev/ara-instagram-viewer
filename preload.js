const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  savePostImage: (postId, imageData) => ipcRenderer.invoke('save-post-image', postId, imageData)
})
