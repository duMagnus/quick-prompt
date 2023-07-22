const { app, BrowserWindow, globalShortcut, ipcMain, Menu, Tray } = require('electron')
const url = require('url')
const path = require('path');

let win;

let tray = null

function createWindow() {
    win = new BrowserWindow({
        frame: false,
        resizable: false,
        transparent: true,
        width: 800,
        height: 420,
        show: false,
    })

    // win.setBackgroundColor('#2b2b2b')

    win.loadURL(
        url.format({
            pathname: path.join(__dirname, 'dist/quick-prompt/index.html'),
            protocol: 'file:',
            slashes: true
        })
    )

    win.on('blur', () => {
        win.hide()
    })

    // win.webContents.openDevTools()

    win.on('closed', function () {
        win = null
    })

}

app.on('ready', createWindow)

app.whenReady().then(() => {
    tray = new Tray(path.join(__dirname, '/favicon.png'))
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Close', type: 'normal', click: () => {app.quit()} }
    ])
    tray.setToolTip('Quick Prompt')
    tray.setContextMenu(contextMenu)
    
    const { screen } = require('electron')
    const ret = globalShortcut.register('CommandOrControl+Alt+K', () => {
        let pos = checkPosition(screen);
        win.setPosition(pos.x, pos.y)
        win.show()
    })
})

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    if (win === null) {
        createWindow()
    }
})

function checkPosition(screen) {
    let pos = screen.getCursorScreenPoint();
    let xDiff = 0;
    let yDiff = 0;

    const windowSize = win.getContentSize();
    const screenSize = screen.getPrimaryDisplay().workArea;

    if (pos.x + windowSize[0] >= screenSize.width) {
        xDiff = (pos.x + windowSize[0]) - screenSize.width + 20;
    }
    if (pos.y + windowSize[1] >= screenSize.height) {
        yDiff = (pos.y + windowSize[1]) - screenSize.height + 20;
    }

    finalPosition = { x: (pos.x - xDiff), y: (pos.y - yDiff) }

    return finalPosition;
}

ipcMain.on('resize-window', (event, width, height) => {
  mainWindow.setSize(width, height);
});