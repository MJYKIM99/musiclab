# 🌊 Ocean Loop - 开始使用

## ⚡ 快速启动（3步）

### 1️⃣ 清理旧服务器
```bash
pkill -f http.server
pkill -f SimpleHTTP
```

### 2️⃣ 启动服务器
```bash
./start.sh
```
或者直接：
```bash
python3 serve.py
```

### 3️⃣ 打开浏览器
访问：**http://localhost:8080**

---

## 🚨 如果遇到 502 错误

### 方法 1：使用测试页面
```bash
# 先打开测试页面检查系统
http://localhost:8080/test.html
```

### 方法 2：完全重启
```bash
# 1. 杀死所有Python服务器
ps aux | grep python | grep http | awk '{print $2}' | xargs kill -9

# 2. 重新启动
python3 serve.py
```

### 方法 3：更换端口
```bash
# 编辑 serve.py，把 PORT = 8080 改成 PORT = 9000
# 然后运行
python3 serve.py
```

### 方法 4：使用备用服务器
```bash
# Node.js
npx http-server -p 8080 -o

# PHP
php -S localhost:8080

# Python 标准库
python3 -m http.server 8080
```

---

## 🎮 基本操作

| 操作 | 效果 |
|------|------|
| 点击 | 创建粒子 |
| 拖拽 | 修改粒子 |
| 空格 | 截图 |
| 退格 | 重置 |
| H | 隐藏/显示帮助 |
| M | 静音/取消静音 |
| B | 收缩所有粒子 |

---

## 🔍 诊断工具

### 检查服务器是否运行
```bash
curl http://localhost:8080/
# 应该返回 HTML 内容
```

### 检查端口占用
```bash
lsof -i :8080
# 显示占用端口的进程
```

### 查看浏览器控制台
```
按 F12 打开开发者工具
查看 Console 标签页中的错误信息
```

---

## 📂 文件说明

| 文件 | 用途 |
|------|------|
| `index.html` | 主页面 - 从这里开始 |
| `test.html` | 测试页面 - 检查系统状态 |
| `sketch.js` | 主程序逻辑 |
| `Loop.js` | 粒子系统类 |
| `interactions.js` | 交互控制 |
| `serve.py` | 自定义服务器（推荐） |
| `start.sh` | 启动脚本 |

---

## ⚙️ 推荐配置

### 浏览器
- ✅ Chrome（最佳性能）
- ✅ Firefox
- ✅ Safari
- ⚠️ Edge（可能需要刷新）

### 系统要求
- 现代浏览器（支持 Web Audio API）
- Python 3.x（或其他HTTP服务器）
- 建议使用鼠标或触摸屏

---

## 🐛 常见问题

### Q: 页面空白怎么办？
A:
1. 打开浏览器控制台（F12）查看错误
2. 尝试访问 test.html 检查系统
3. 清除浏览器缓存后刷新（Ctrl+Shift+R）

### Q: 没有声音？
A:
1. 点击页面任意位置激活音频
2. 按 M 键确认未静音
3. 检查系统音量和浏览器音量

### Q: 性能卡顿？
A:
1. 按退格键重置所有粒子
2. 编辑 sketch.js 减少 MAX_OSCILLATORS 数量
3. 关闭其他浏览器标签页

---

## 📚 更多帮助

- 详细文档：`README.md`
- 故障排除：`TROUBLESHOOTING.md`
- 项目概览：`PROJECT_OVERVIEW.md`
- 快速指南：`QUICKSTART.md`

---

## 🎯 验证安装

运行这个命令检查所有文件：
```bash
ls -1 *.html *.js *.py
```

应该看到：
```
index.html
test.html
Loop.js
sketch.js
interactions.js
serve.py
```

---

## ✅ 成功标志

当你看到：
- ✅ 服务器在终端显示运行信息
- ✅ 浏览器打开页面显示黑色画布
- ✅ 点击后出现动画粒子
- ✅ 有声音播放（点击页面后）

恭喜！系统正常运行！🎉

---

## 💡 提示

**第一次使用建议：**
1. 先访问 `test.html` 确认系统正常
2. 再打开 `index.html` 开始创作
3. 点击任意位置激活音频上下文
4. 按 H 键隐藏帮助面板获得完整视图

**创作建议：**
- 慢慢点击，观察粒子互动
- 尝试拖拽现有粒子
- 使用数字键 1-9 快速生成
- 按 R 键创建随机效果

---

准备好了吗？运行 `./start.sh` 开始吧！🌊✨
