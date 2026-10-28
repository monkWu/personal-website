# 陈屿 · 个人网站

一个可以直接打开的静态个人作品集网站。暖纸色 + 赭红，衬线中文标题，克制的动效，适合设计师、开发者、创作者用来介绍自己。

![桌面端预览](preview/desktop.png)

## 快速开始

不需要安装任何依赖，直接双击 `index.html` 即可预览；也可以在项目目录启动一个本地服务器：

```bash
cd website
python3 -m http.server 4173
```

然后访问 <http://127.0.0.1:4173>。

## 文件结构

```text
.
├── index.html              # 页面结构（所有文案都在这里）
├── assets/
│   ├── styles.css          # 设计变量、布局、动效、响应式
│   ├── main.js             # 主题、菜单、滚动显现、作品悬停预览等
│   └── favicon.svg         # 站点图标
├── preview/
│   ├── desktop.png
│   └── mobile.png
├── .nojekyll               # 让 GitHub Pages 按静态文件原样发布
├── .gitignore
└── README.md
```

纯 HTML / CSS / JavaScript，没有构建步骤和第三方依赖。字体通过 Google Fonts 加载，断网时会自动回退到系统字体（macOS 上为宋体 / 苹方）。

## 如何改成你自己的

### 1. 名字与文案

全部文案在 `index.html` 中，按页面顺序搜索并替换即可：

- 姓名：`陈屿`、`Chen Yu`、`屿`（导航左上角的印章字）
- 职位与简介：Hero 区域、`about` 区域
- 作品：`work-list` 里的四个 `li.work-item`
- 能力、笔记、联系方式、社交链接

替换作品时，除了标题和描述，也建议同步修改：

```html
<li class="work-item"
    data-title="项目名"
    data-index="01"
    data-c1="#2e3828"   <!-- 悬停预览卡渐变的起始色 -->
    data-c2="#8b9768">  <!-- 悬停预览卡渐变的结束色 -->
```

作品的链接目前都指向页面底部的联系区（`#contact`），方便访客直接来信询问案例。如果你有自己的案例页，把 `href` 换成对应地址即可。

### 2. 邮箱

`hello@chenyu.design` 出现在三处可见位置：关于区的信息表、联系区的大号邮箱、移动端菜单底部。另外，复制按钮的 `data-email` 属性、页尾的 JSON-LD 结构化数据里也各有一处，替换时请一并修改。

### 3. 社交链接

在 `index.html` 搜索 `socials`，把 GitHub / 即刻 / 小红书 / Instagram 的地址换成你的个人主页。用不到的条目直接删掉整个 `<li>` 即可。

### 4. 颜色与字体

打开 `assets/styles.css` 顶部的 `:root`：

```css
--paper: #f3efe6;   /* 纸张底色 */
--ink: #191713;     /* 主文字 */
--accent: #c2482c;  /* 赭红强调色 */
```

深色模式使用 `html[data-theme="dark"]` 下的同名变量。想换成蓝色系、墨绿系，只需要改这几处。

字体由 `index.html` 里的 Google Fonts 链接控制：

- 标题：Instrument Serif + Noto Serif SC
- 正文：Inter + 苹方

换成其他字体时，同时修改 `--serif` / `--sans` 两个变量即可。

### 5. 标题与 SEO

在 `<head>` 中修改 `<title>`、`description` 和 Open Graph 文案。上线后建议把 `og:image` 换成一张可公网访问的分享图（1200 × 630）。

## 已包含的功能

- 响应式布局，适配桌面、平板和手机
- 深色 / 浅色主题，跟随系统偏好并记住选择
- 滚动显现、导航高亮、平滑锚点
- 作品列表悬停时的浮动预览卡
- 可展开的「笔记」条目（无需额外页面）
- 一键复制邮箱、上海时区实时时钟
- 尊重 `prefers-reduced-motion`，键盘可访问，含跳转链接

## 部署

这是一个纯静态站点，把整个文件夹上传到任意静态托管即可：

- **GitHub Pages**：推送到仓库，在 Settings → Pages 选择分支根目录
- **Vercel / Netlify**：导入仓库，框架选择 “Other”，构建命令留空，输出目录为 `.`
- **自己的服务器**：把文件放进 Nginx 的站点目录

### 说明

页面中的人物信息、项目、笔记均为示例内容，发布前请替换成真实信息。字体通过 Google Fonts 加载，如果目标访客主要在中国大陆，建议将字体文件下载到本地自托管，或直接把 `--serif` / `--sans` 改成系统字体，访问会更稳定。
