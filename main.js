const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// Enable subscription manager for premium version
const SubscriptionManager = require('./subscription-manager.js');

let mainWindow;
let subscriptionManager;

function createWindow() {
  // Initialize subscription manager if available
  if (SubscriptionManager) {
    subscriptionManager = new SubscriptionManager();
  }

  // Check subscription status before showing main window
  checkSubscriptionStatus();

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'icons/icon-512.png'),
    show: false, // Don't show until ready
    frame: true, // Use default frame for MSIX compatibility
    backgroundColor: '#ffffff', // Solid white background for MSIX compatibility
    autoHideMenuBar: true, // Hide menu bar by default
  });

  // Load the app
  mainWindow.loadFile('index.html');

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    // Open DevTools in development
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Initialize subscription monitoring
    if (subscriptionManager) {
      subscriptionManager.startSubscriptionMonitoring();
    }
  
    // Simplified initialization for MSIX compatibility
    mainWindow.webContents.on('dom-ready', () => {
      // Basic initialization - no complex JavaScript injection for MSIX safety
      console.log('App loaded successfully');
    });

  // Create application menu (simplified for MSIX)
  createMenu();
}




// Check subscription status and show subscription window if needed
function checkSubscriptionStatus() {
  if (!subscriptionManager) return;

  const status = subscriptionManager.getSubscriptionStatus();

  // Show subscription window if trial expired and not subscribed
  if (!status.canUseApp) {
    showSubscriptionWindow();
  }
}

// Show subscription management window
function showSubscriptionWindow() {
  const subscriptionWindow = new BrowserWindow({
    width: 600,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'icons/icon-512.png'),
    show: false,
    frame: true,
    backgroundColor: '#ffffff',
    resizable: false,
    parent: mainWindow,
    modal: true
  });

  subscriptionWindow.loadFile('subscription-ui.html');

  subscriptionWindow.once('ready-to-show', () => {
    subscriptionWindow.show();
  });

  subscriptionWindow.on('closed', () => {
    // Keep main window open - don't close it when subscription window closes
    // setTimeout(() => {
    //   const status = subscriptionManager.getSubscriptionStatus();
    //   if (!status.canUseApp && mainWindow) {
    //     // If still no access, close main window
    //     mainWindow.close();
    //   }
    // }, 1000);
  });
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Task',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('new-task');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
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
        { role: 'paste' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Focus Planner',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About',
              message: 'Focus Planner',
              detail: 'A modern task management app\nVersion 1.0.5'
            });
          }
        }
      ]
    }
  ];

  // macOS specific menu adjustments
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event handlers
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create window when dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Basic window controls for MSIX compatibility
if (ipcMain && typeof ipcMain.on === 'function') {
  ipcMain.on('close-window', () => {
    if (mainWindow) mainWindow.close();
  });
}

// IPC handlers for subscription and premium features
if (ipcMain && typeof ipcMain.handle === 'function') {
  ipcMain.handle('get-subscription-status', async () => {
    if (subscriptionManager) {
      return subscriptionManager.getSubscriptionStatus();
    }
    return { canUseApp: true, isTrialActive: false, isSubscribed: false, statusType: 'free', message: 'Free version' };
  });

  ipcMain.handle('purchase-subscription', async () => {
    if (subscriptionManager) {
      return await subscriptionManager.purchaseSubscription();
    }
    return { success: false, message: 'Subscription manager not available' };
  });

  ipcMain.handle('open-store-subscription', async () => {
    if (subscriptionManager) {
      subscriptionManager.openStoreSubscriptionPage();
      return { success: true, message: 'Opening Microsoft Store...' };
    }
    return { success: false, message: 'Subscription manager not available' };
  });

  ipcMain.handle('export-data', async (_event, payload) => {
    try {
      const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
        title: 'Export tasks',
        defaultPath: 'focus-planner-export.json',
        filters: [{ name: 'JSON', extensions: ['json'] }]
      });
      if (canceled || !filePath) return { success: false, message: 'Export canceled' };
      fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
      return { success: true, path: filePath };
    } catch (e) {
      return { success: false, message: e.message };
    }
  });
}

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});