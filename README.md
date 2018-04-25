# inventory
> 高仿[SkyUI](https://www.nexusmods.com/skyrimspecialedition/mods/12604) 5的[Angular](https://github.com/angular/angular)物品栏.
> 
> An Inventory highly resembles [SkyUI](https://www.nexusmods.com/skyrimspecialedition/mods/12604) 5

主要是希望当成 [GraphQL](https://github.com/graphql/graphql-js) 和 [Angular-Redux](https://github.com/angular-redux/store) 的练手项目。

由于所需技术栈尚未完全补全，这里只是挖个坑，进度应该会非常缓慢。😐

## 运行
``` bash
##### 后台 #####

# 编译 (Webpack)
npm run build:s

# 运行 (Koa)
npm run start:s

# 单元测试 (Jest)
npm run test:s

```

## 为啥做物品栏
Redux和GraphQL是针对大型复杂项目的，而自己能想到的大型一点的，但是又不是复杂到我无法完成的项目中，物品栏可能是比较合适的。业务逻辑比较清晰，比较灵活，比较常见。

## 为啥要仿SkyUI

首先我是老滚辐射粉😆!

然后SkyUI的设计比较现代，也相对来说对前端友好一些。

另外我不是美工。比如《巫师3》的：每一件物品都是图标。我这个手残让我画那么多图标？emmmmmm...


# To Do:

前端：

- 界面：首页
- 界面：物品栏页（物品详情 增加物品-控制台 删除物品-R-移动端-更多）

后台：

- ✔️ 数据库设计
- ✔️ 业务逻辑(action)单元测试
- ✔️ i18n框架
- 数据库文档
- 接口： 
  - ✔️ graph
  - 路由 - 基础路由
  - 接口文档


## 后台数据集

![dbDataflow](https://i.imgur.com/W0YV09E.png)

## 后台API

请查看 [API 说明文档(WIP)](https://valoradinventory.docs.apiary.io/)

# License

MIT License

所有图标、界面的版权属于Bethesda Game Studios和/或SkyUI团队。

Thanks to Bethesda Game Studios for creating The Elder Scrolls V: Skyrim (and SSE), providing the base content and allowing us to mod it.
