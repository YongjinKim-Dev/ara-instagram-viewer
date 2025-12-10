const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  savePostImage: (postId, imageData, mode = 'replace') => ipcRenderer.invoke('save-post-image', postId, imageData, mode),
  toggleLike: (postId) => ipcRenderer.invoke('toggle-like', postId),
  updateCropPosition: (postId, cropY, imageIndex = 0) => ipcRenderer.invoke('update-crop-position', postId, cropY, imageIndex),
  deletePost: (postId) => ipcRenderer.invoke('delete-post', postId)
})
