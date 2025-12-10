const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')


function createWindow() {
  // 인스타그램 모바일 비율 (9:16)
  const win = new BrowserWindow({
    width: 390,
    height: 844,
    minWidth: 350,
    minHeight: 600,
    maxWidth: 500,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#000000',
    resizable: true
  })

  // 개발 모드에서는 localhost, 프로덕션에서는 빌드된 파일
  if (process.env.NODE_ENV !== 'production') {
    win.loadURL('http://localhost:5173')
    // win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 이미지 저장 IPC 핸들러
ipcMain.handle('save-post-image', async (event, postId, imageData) => {
  try {
    const postsDir = path.join(__dirname, 'public', 'posts')
    const postsJsonPath = path.join(postsDir, 'posts.json')

    // posts.json 읽기
    const postsJson = JSON.parse(fs.readFileSync(postsJsonPath, 'utf8'))

    // 해당 포스트 찾기
    const postIndex = postsJson.findIndex(p => p.id === postId)
    if (postIndex === -1) {
      return { success: false, error: 'Post not found' }
    }

    // base64 이미지 데이터를 파일로 저장
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '')
    const imageBuffer = Buffer.from(base64Data, 'base64')

    // 기존 이미지 삭제 (있으면)
    const existingImagePath = postsJson[postIndex].image
    if (existingImagePath && existingImagePath.startsWith('/posts/')) {
      const oldPath = path.join(__dirname, 'public', existingImagePath)
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath)
      }
    }

    // 새 파일명으로 저장 (캐시 무효화)
    const fileName = `${postId}_${Date.now()}.png`
    const fullPath = path.join(postsDir, fileName)
    fs.writeFileSync(fullPath, imageBuffer)
    const newImagePath = `/posts/${fileName}`

    // posts.json 업데이트
    postsJson[postIndex].image = newImagePath
    fs.writeFileSync(postsJsonPath, JSON.stringify(postsJson, null, 2))

    return { success: true, imagePath: newImagePath }
  } catch (e) {
    console.error('Failed to save image:', e)
    return { success: false, error: e.message }
  }
})

// 게시글 삭제 IPC 핸들러
ipcMain.handle('delete-post', async (event, postId) => {
  try {
    const postsDir = path.join(__dirname, 'public', 'posts')
    const postsJsonPath = path.join(postsDir, 'posts.json')

    // posts.json 읽기
    const postsJson = JSON.parse(fs.readFileSync(postsJsonPath, 'utf8'))

    // 해당 포스트 찾기
    const postIndex = postsJson.findIndex(p => p.id === postId)
    if (postIndex === -1) {
      return { success: false, error: 'Post not found' }
    }

    // 이미지 파일 삭제
    const imagePath = postsJson[postIndex].image
    if (imagePath && imagePath.startsWith('/posts/')) {
      const fullPath = path.join(__dirname, 'public', imagePath)
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath)
      }
    }

    // posts.json에서 제거
    postsJson.splice(postIndex, 1)
    fs.writeFileSync(postsJsonPath, JSON.stringify(postsJson, null, 2))

    return { success: true }
  } catch (e) {
    console.error('Failed to delete post:', e)
    return { success: false, error: e.message }
  }
})
