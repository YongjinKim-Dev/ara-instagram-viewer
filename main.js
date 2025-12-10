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

// 이미지 저장 IPC 핸들러 (mode: 'replace' | 'add')
ipcMain.handle('save-post-image', async (event, postId, imageData, mode = 'replace') => {
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

    // 새 파일명으로 저장
    const fileName = `${postId}_${Date.now()}.png`
    const fullPath = path.join(postsDir, fileName)
    fs.writeFileSync(fullPath, imageBuffer)
    const newImagePath = `/posts/${fileName}`

    const post = postsJson[postIndex]

    // images 배열로 마이그레이션 (하위호환)
    if (!post.images) {
      post.images = post.image ? [post.image] : []
    }

    if (mode === 'replace') {
      // 기존 모든 이미지 삭제
      for (const imgPath of post.images) {
        if (imgPath && imgPath.startsWith('/posts/')) {
          const oldPath = path.join(__dirname, 'public', imgPath)
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath)
          }
        }
      }
      post.images = [newImagePath]
    } else if (mode === 'add') {
      // 이미지 추가
      post.images.push(newImagePath)
    }

    // 하위호환: image 필드도 첫 번째 이미지로 유지
    post.image = post.images[0] || null

    fs.writeFileSync(postsJsonPath, JSON.stringify(postsJson, null, 2))

    return { success: true, imagePath: newImagePath, images: post.images }
  } catch (e) {
    console.error('Failed to save image:', e)
    return { success: false, error: e.message }
  }
})

// 좋아요 토글 IPC 핸들러
ipcMain.handle('toggle-like', async (event, postId) => {
  try {
    const postsDir = path.join(__dirname, 'public', 'posts')
    const postsJsonPath = path.join(postsDir, 'posts.json')

    const postsJson = JSON.parse(fs.readFileSync(postsJsonPath, 'utf8'))

    const postIndex = postsJson.findIndex(p => p.id === postId)
    if (postIndex === -1) {
      return { success: false, error: 'Post not found' }
    }

    // liked 토글
    postsJson[postIndex].liked = !postsJson[postIndex].liked
    fs.writeFileSync(postsJsonPath, JSON.stringify(postsJson, null, 2))

    return { success: true, liked: postsJson[postIndex].liked }
  } catch (e) {
    console.error('Failed to toggle like:', e)
    return { success: false, error: e.message }
  }
})

// 크롭 위치 업데이트 IPC 핸들러
ipcMain.handle('update-crop-position', async (event, postId, cropY, imageIndex = 0) => {
  try {
    const postsDir = path.join(__dirname, 'public', 'posts')
    const postsJsonPath = path.join(postsDir, 'posts.json')

    const postsJson = JSON.parse(fs.readFileSync(postsJsonPath, 'utf8'))

    const postIndex = postsJson.findIndex(p => p.id === postId)
    if (postIndex === -1) {
      return { success: false, error: 'Post not found' }
    }

    const post = postsJson[postIndex]
    const images = post.images || (post.image ? [post.image] : [])

    // cropYs 배열 초기화 (하위호환)
    if (!post.cropYs) {
      post.cropYs = images.map(() => post.cropY ?? 50)
    }

    // 배열 길이 맞추기
    while (post.cropYs.length < images.length) {
      post.cropYs.push(50)
    }

    // 해당 이미지의 cropY 업데이트
    post.cropYs[imageIndex] = cropY

    // 하위호환: cropY는 첫 번째 이미지 기준
    post.cropY = post.cropYs[0]

    fs.writeFileSync(postsJsonPath, JSON.stringify(postsJson, null, 2))

    return { success: true, cropYs: post.cropYs }
  } catch (e) {
    console.error('Failed to update crop position:', e)
    return { success: false, error: e.message }
  }
})

// 게시글 삭제 IPC 핸들러
ipcMain.handle('delete-post', async (event, postId) => {
  try {
    const postsDir = path.join(__dirname, 'public', 'posts')
    const postsJsonPath = path.join(postsDir, 'posts.json')

    const postsJson = JSON.parse(fs.readFileSync(postsJsonPath, 'utf8'))

    const postIndex = postsJson.findIndex(p => p.id === postId)
    if (postIndex === -1) {
      return { success: false, error: 'Post not found' }
    }

    const post = postsJson[postIndex]

    // 모든 이미지 파일 삭제 (images 배열 + 단일 image)
    const imagesToDelete = post.images || (post.image ? [post.image] : [])
    for (const imgPath of imagesToDelete) {
      if (imgPath && imgPath.startsWith('/posts/')) {
        const fullPath = path.join(__dirname, 'public', imgPath)
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath)
        }
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
