# Ocean Loop - 海洋循环

一个交互式音视觉生成艺术项目，探索粒子系统、碰撞检测和音频合成。

![Ocean Loop](logomusic.png)

## 🎨 品牌信息

**设计品牌：** yijiayidesign
**项目名称：** Music Lab - Ocean Loop
**GitHub仓库：** https://github.com/MJYKIM99/musiclab.git

---

## 🌊 项目简介

Ocean Loop 是一个基于 Web 的实验性艺术作品，通过用户交互创建令人着迷的音视觉图案。每次点击都会生成动画粒子，它们移动、碰撞并产生生成音效，每次体验都是独一无二的。

## ✨ 核心功能

### 视觉系统
- ✅ 动态粒子生成系统
- ✅ 6种数学图形模式
- ✅ 基于碰撞的颜色变化
- ✅ 流畅动画（30 FPS）
- ✅ 响应式画布
- ✅ Perlin噪声有机形状

### 音频系统
- ✅ 40个预初始化振荡器
- ✅ 4种波形类型（正弦、三角、锯齿、方波）
- ✅ 基于位置的立体声平移
- ✅ 动态音量控制
- ✅ 混响效果处理
- ✅ 碰撞触发播放

### 交互系统
- ✅ 点击/触摸创建粒子
- ✅ 拖拽修改粒子
- ✅ 10+ 键盘快捷键
- ✅ 多点触控手势
- ✅ 鼠标滚轮支持
- ✅ 截图捕获

## 🎮 操作说明

### 鼠标/触摸
- **点击/触摸**：在光标位置创建新粒子
- **拖拽**：修改现有粒子（增长/收缩）
- **长按点击**：增加生成半径
- **双击**：创建大型粒子簇
- **鼠标滚轮**：调整预览半径

### 键盘快捷键
- **空格**：截图
- **退格**：重置所有粒子
- **B**：收缩所有粒子
- **R**：随机创建粒子
- **F**：切换全屏模式
- **H**：隐藏/显示信息面板
- **M**：静音/取消静音
- **1-9**：快速生成（数字 = 粒子组数）

### 移动端手势
- **双指触摸**：截图
- **三指触摸**：收缩所有粒子

## 🚀 快速开始

### 环境要求
- 现代浏览器（Chrome、Firefox、Safari、Edge）
- Web 服务器（用于加载本地文件）

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/MJYKIM99/musiclab.git
   cd musiclab
   ```

2. **启动本地服务器**

   使用 Python 3:
   ```bash
   python3 serve.py
   ```

   或使用 Python 2:
   ```bash
   python -m SimpleHTTPServer 8080
   ```

   或使用 Node.js:
   ```bash
   npx http-server -p 8080
   ```

3. **在浏览器中打开**
   ```
   http://localhost:8080
   ```

## 📁 项目结构

```
ocean-loop-project/
├── index.html          # 主HTML文件（含UI）
├── sketch.js          # 主p5.js草图（设置/绘制循环）
├── Loop.js            # 粒子类定义
├── interactions.js    # 用户交互处理器
├── logomusic.png      # Music Lab Logo
├── serve.py           # 自定义Python服务器
├── assets/            # 资源文件夹
└── README.md          # 英文文档
└── README.zh.md       # 中文文档（本文件）
```

## 🎨 视觉模式

粒子形状在6种不同的数学模式中循环：

1. **旋转正弦波**：平滑旋转圆圈
2. **噪声天线**：有机天线状结构
3. **噪声点**：带线条的散点
4. **纯噪声**：混乱的有机形状
5. **复杂噪声**：分层噪声图案
6. **正切有机**：流动的自然形态

## 🎯 自定义设置

### 调整粒子数量
编辑 `sketch.js`:
```javascript
const MAX_OSCILLATORS = 40; // 更改最大粒子数
```

### 更改颜色
编辑 `sketch.js`:
```javascript
colorMode(RGB, 255, 255, 255, 255); // 修改颜色模式
```

### 调整音频
编辑 `sketch.js`:
```javascript
const BASE_FREQUENCY = 200; // 更改基础音高
outputVolume(0.3); // 调整主音量
```

## 🐛 故障排除

### 没有音频
- 点击页面任意位置激活音频上下文（浏览器自动播放策略）
- 检查浏览器是否静音
- 按 'M' 键取消静音
- 尝试刷新页面

### 性能缓慢
- 用退格键重置粒子
- 在 sketch.js 中减少 `MAX_OSCILLATORS`
- 关闭其他浏览器标签
- 使用现代浏览器

### 粒子不出现
- 检查浏览器控制台是否有错误（F12）
- 确保所有JavaScript文件已加载
- 尝试清除浏览器缓存

## 📝 最新更新

### 2025-10-19
- ✅ 添加 yijiayidesign 品牌标识（右上角）
- ✅ 添加 Music Lab logo（底部居中）
- ✅ 修复 `masterVolume` → `outputVolume` 问题
- ✅ 修复颜色模式不匹配（统一使用 RGB）
- ✅ 推送至 GitHub: https://github.com/MJYKIM99/musiclab.git

## 🙏 致谢

灵感来源：
- 原版 Ocean Loop by Sikai Li (https://skyl.fr/play/ocean-loop)
- p5.js 社区和示例
- 生成艺术先驱

## 🔗 资源链接

- [p5.js 文档](https://p5js.org/reference/)
- [p5.sound 参考](https://p5js.org/reference/#/libraries/p5.sound)
- [Web Audio API 指南](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [生成艺术技术](https://generativeartistry.com/)

## 📧 联系方式

**设计品牌：** yijiayidesign
**GitHub：** https://github.com/MJYKIM99/musiclab

---

**使用 p5.js 构建，充满 ❤️**
**准备创作？运行 `python3 serve.py` 开始吧！** 🌊✨
