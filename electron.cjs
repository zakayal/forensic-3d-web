// electron.cjs

// 导入 Electron 的 app 和 BrowserWindow 模块
// app: 控制应用的事件生命周期
// BrowserWindow: 创建和管理应用窗口
const { app, BrowserWindow } = require('electron');

// 导入 Node.js 的 path 模块，用于处理文件和目录路径
const path = require('path');

// 定义一个创建窗口的函数
const createWindow = () => {
  // 创建一个新的浏览器窗口
  const win = new BrowserWindow({
    width: 1200, // 设置窗口宽度
    height: 800,  // 设置窗口高度
    webPreferences: {
      // 预加载脚本，它会在渲染器进程加载之前运行，并且可以访问 Node.js API
      // 这是主进程和渲染器进程之间安全通信的桥梁
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  // 判断当前是否处于开发环境
  if (process.env.VITE_DEV_SERVER_URL) {
    // 如果是开发环境，加载 Vite 开发服务器的 URL
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    // 自动打开开发者工具
    win.webContents.openDevTools();
  } else {
    // 如果是生产环境，加载打包后的 index.html 文件
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }
};

// 当 Electron 完成初始化后，调用 createWindow 函数
app.whenReady().then(() => {
  createWindow();

  // 为 macOS 添加特定行为：当点击 dock 图标且没有其他窗口时，重新创建一个窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 为 Windows 和 Linux 添加特定行为：当所有窗口都关闭时，退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { // 'darwin' 指的是 macOS
    app.quit();
  }
});