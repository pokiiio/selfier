const {
    app,
    Menu,
    BrowserWindow
} = require('electron')

var mainWindow = null

var template = [{
    label: 'File',
    submenu: [{
            label: 'Stop/Restart Image',
            accelerator: 'CmdOrCtrl+P',
            click: function () {
                mainWindow.webContents.send('pause');
            }
        },
        {
            label: 'Save Photo',
            accelerator: 'CmdOrCtrl+S',
            click: function () {
                mainWindow.webContents.send('save');
            }
        }, {
            label: 'Toggle Developer Tools',
            accelerator: 'CmdOrCtrl+D',
            click: function () {
                mainWindow.toggleDevTools();
            }
        }, {
            accelerator: 'CmdOrCtrl+Q',
            label: 'Exit',
            click: function () {
                app.quit();
            }
        }
    ]
}];

app.on('ready', function () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        useContentSize: true
    });
    mainWindow.loadURL('file://' + __dirname + '/index.html')
    mainWindow.on('closed', () => {
        mainWindow = null
    });
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
})