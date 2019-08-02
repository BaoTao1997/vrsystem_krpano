# 全景漫游平台

### 简介
krpano官方提供的编辑功能都是通过内嵌flash实现的，对于不懂flash开发的同学不太友好。于是就做了一个Vue版本的编辑器。

### ReadMe

使用说明:

访问地址：https://baotao1997.github.io/vrsystem_krpano/dist/index.html#/

`vrsystem_1.0`包含热点切换以及热点编辑配置,以及相关特效功能,并在`node`中包含保存热点信息和上传背景音乐接口(`Node`实现),使用简单的nodejs express提供静态资源服务器功能，以及提供保存接口实现本地tour.xml文件的修改，具体参考app.js文件，项目核心难点是对krpano的各种html api的理解，具体参考官网文档即可还有很多功能可以完善。

#### Todo

- [ ] 上传全景视频
- [ ] 上传背景音乐列表
- [ ] 上传全景图片列表
- [ ] 添加热点类型,编辑热点操作
- [ ] 皮肤样式自定义设置
- [ ] 级联选择器
- [ ] 添加图层嵌入
- [ ] 处理Krpano的加载问题
- [ ] 添加高德地图和百度地图的API接口功能
- [ ] 添加对应的热点类型
- [ ] 采用Vuex和多组件形式改善加载速度
- [ ] 多边形热点,图片/图像热点编辑和保存功能

## 安装

``` bash
npm install

npm run dev

npm run build

npm run build --report
```
