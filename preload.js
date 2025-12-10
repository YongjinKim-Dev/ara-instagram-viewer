const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  savePostImage: (postId, imageData) => ipcRenderer.invoke('save-post-image', postId, imageData),
  toggleLike: (postId) => ipcRenderer.invoke('toggle-like', postId),
  updateCropPosition: (postId, cropY) => ipcRenderer.invoke('update-crop-position', postId, cropY),
  deletePost: (postId) => ipcRenderer.invoke('delete-post', postId)
})
