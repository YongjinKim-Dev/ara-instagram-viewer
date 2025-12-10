const { app, BrowserWindow } = require('electron')
const path = require('path')


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
