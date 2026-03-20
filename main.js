const { app, BrowserWindow, Menu, shell } = require('electron');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "Velo One Sheets",
    autoHideMenuBar: false, // We will use a custom native menu
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // Ensures local storage and sessions persist
      partition: 'persist:velo-sheets' 
    }
  });

  // Load your live cloud app
  mainWindow.loadURL('https://sheets.velocomputing.tech');

  // Intercept links that open in a new tab (target="_blank") 
  // and open them in the user's default OS browser (Chrome/Edge)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Create a Custom Native Windows Menu
  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'Reload App', accelerator: 'CmdOrCtrl+R', click: () => mainWindow.reload() },
        { type: 'separator' },
        { role: 'quit', label: 'Exit Velo One' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'togglefullscreen' },
        { role: 'toggledevtools', label: 'Developer Tools' } // Good for your DevOps work
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
