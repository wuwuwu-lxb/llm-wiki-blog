# React 组件库参考资料

这个目录保存 React 组件库和设计系统的外部参考清单，用于后续做前端改版时快速筛选可用方案。

## 已下载资料

- `awesome-react-components.md`
  - 来源：`https://github.com/brillout/awesome-react-components`
  - 用途：查找编辑器、图表、图片、拖拽、表格、命令面板等具体 React 组件。
- `awesome-react-design-systems.md`
  - 来源：`https://github.com/jbranchaud/awesome-react-design-systems`
  - 用途：参考成熟 React 设计系统的组件组织方式和视觉规范。

## 当前项目倾向

- 优先考虑 `shadcn/ui`、Radix、Headless UI 这类源码可控或 headless 的方案。
- 对内容型页面，组件库只作为基础设施，不应该把页面做成传统后台卡片堆叠。
- 对 dashboard、标签分类、文章编辑、鉴权管理等工作台页面，可以使用更密集、更克制的组件布局。
- 对公开博客和 self-LLM 展示页面，应优先考虑视觉叙事、阅读体验、图像渲染和动态交互。
