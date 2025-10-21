// Preload script for secure communication between main and renderer processes
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Example: Send message to main process
  sendToMain: (channel, data) => {
    // Whitelist of valid channels
    const validChannels = ['new-task', 'save-data', 'load-data', 'minimize-window', 'maximize-window', 'close-window', 'drag-window'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },

  // Example: Receive messages from main process
  receiveFromMain: (channel, func) => {
    const validChannels = ['task-created', 'data-saved', 'subscription-status-changed'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },

  // Subscription API
  subscription: {
    getStatus: () => ipcRenderer.invoke('get-subscription-status'),
    purchase: () => ipcRenderer.invoke('purchase-subscription'),
    openStore: () => ipcRenderer.invoke('open-store-subscription'),
    onStatusChange: (callback) => {
      ipcRenderer.on('subscription-status-changed', (event, status) => callback(status));
    }
  },

  // Premium helpers
  premium: {
    openUpgrade: () => ipcRenderer.send('subscription', 'open'),
    exportData: (data) => ipcRenderer.invoke('export-data', data)
  },

  // Platform info
  platform: process.platform,

  // Version info
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
});

// Remove this preload script reference from main.js if not needed
console.log('Preload script loaded successfully');