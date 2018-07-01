# inventory 数据库

使用了mongoDB

## 配置

`/server/config/inventory.json`

## 数据集

![dbDataflow](https://i.imgur.com/fI0uVF4.png)

注：数据集说明省略了mongoDB及mongoose的字段：`_id` 和 `__v`

### actors

`actors`数据集存放玩家信息

| 项目       | 字段      | 数据类型            | 唯一  | 空值  | 默认  | 说明 |
| :--------: | :-------: | :-----------------: | :---: | :---: | :---: | :--- |
| 数据库名称 | `dbname`  | string              | ✔     |       |       |      |
| 头像       | `icon`    | string              |       | ✔     |       |      |
| 已装备     | `equiped` | [IEquiped][actor-1] |       |       | {}    |      |


### baseItems

`baseItems`数据集存放物品基本信息，而详细信息需要根据`category`字段外联`gears`，`consumables`和`books`表继续查询

| 项目       | 字段       | 数据类型 | 唯一  | 空值  | 默认  | 说明 |
| :--------: | :--------: | :------: | :---: | :---: | :---: | :--- |
| 数据库名称 | `dbname`   | string   | ✔     |       |       |      |
| 分类       | `category` | string   |       | ✔     |       |      |
| 重量       | `weight`   | number   |       |       | 0     |      |
| 价值       | `value`    | number   |       |       | 0     |      |

### invItems

`invItems`数据集存放玩家物品栏内物品的实时情况。

物品数量在引用信息对应的ref-item中。

`refItems`的所有人和`invItems`的持有人不一定是同一个玩家，若不同，则此物品为“偷窃”.

| 项目     | 字段     | 数据类型   | 唯一  | 空值  | 默认  | 说明                      |
| :------: | :------: | :--------: | :---: | :---: | :---: | :------------------------ |
| 物品名称 | `item`   | string     |       |       |       | 填写`baseItems`的`dbname` |
| 持有人   | `holder` | string     |       |       |       | 填写`actors`的`dbname`    |
| 引用信息 | `refs`   | ObjectId[] |       |       | []    |                           |

### books

`books`数据集存放书籍类物品

| 项目       | 字段      | 数据类型 | 唯一  | 空值  | 默认  | 说明                                                                     |
| :--------: | :-------: | :------: | :---: | :---: | :---: | :----------------------------------------------------------------------- |
| 数据库名称 | `dbname`  | string   | ✔     |       |       |                                                                          |
| 内容名称   | `content` | string   |       | ✔     |       | 存放的只是内容名称，不是实际的内容。实际的内容存放于translations数据集中 |


### consumables

`consumables`数据集存放消耗类物品，例如魔药、卷轴、食物、原料等等。

| 项目       | 字段      | 数据类型 | 唯一  | 空值  | 默认  | 说明                                                                         |
| :--------: | :-------: | :------: | :---: | :---: | :---: | :--------------------------------------------------------------------------- |
| 数据库名称 | `dbname`  | string   | ✔     |       |       |                                                                              |
| 类型名称   | `type`    | string   |       | ✔     |       | 仅存放类型名称，内容位于translations数据集。类型例如魔药、卷轴、食物、原料等 |
| 效果名称   | `effects` | string[] |       | ✔     |       | 数组中仅存放效果名称，内容位于translations数据集。                           |

### gears

`gears`数据集存放装备，存放信息比`consumables`丰富，主要是护甲和武器
弓箭属于`gears`（弓和箭都是）

| 项目       | 字段      | 数据类型 | 唯一  | 空值  | 默认  | 说明                                                                                                                                       |
| :--------: | :-------: | :------: | :---: | :---: | :---: | :----------------------------------------------------------------------------------------------------------------------------------------- |
| 数据库名称 | `dbname`  | string   | ✔     |       |       |                                                                                                                                            |
| 类型名称   | `type`    | string   |       |       |       | 仅存放类型名称，内容位于translations数据集。类型例如匕首、长剑、大刀、轻甲、重甲等。前端需要根据预先定义的具体类型来区分到底是武器还是护甲 |
| 效果名称   | `effects` | string[] |       |       |       | 数组中仅存放效果名称，内容位于translations数据集。                                                                                         |
| 属性值     | `rating`  | number   |       |       | 0     | 对于武器，则是伤害；对于护甲，则是防御                                                                                                     |
| 装备部位   | `equip`   | string[] |       |       |       | 数组中仅存放装备部位名称，内容位于translations数据集。                                                                                     |


### refItems

`refItems`数据集中的数据是对`baseItems`的引用。相当于`baseItems`是抽象类，`refItems`是实例。

`refItems`才是存在于游戏世界中的。

| 项目     | 字段    | 数据类型 | 唯一  | 空值  | 默认  | 说明                      |
| :------: | :-----: | :------: | :---: | :---: | :---: | :------------------------ |
| 物品名称 | `item`  | string   |       |       |       | 填写`baseItems`的`dbname` |
| 所有人   | `owner` | string   |       |       |       | 填写`actors`的`dbname`    |
| 数量     | `num`   | number   |       |       | 0     |                           |

### translations

`translations`数据集存放翻译。

| 项目       | 字段          | 数据类型             | 唯一  | 空值  | 默认                   | 说明                                                          |
| :--------: | :-----------: | :------------------: | :---: | :---: | :--------------------: | :------------------------------------------------------------ |
| 数据库名称 | `dbname`      | string               | ✔     |       |                        | 填写需要翻译的`dbname`                                                              |
| 物品名称   | `name`        | [ILanguage][trans-1] |       | ✔     | [langDefault][trans-2] | 有物品名称，也有菜单翻译（如type-xxx, equip-xxx, effect-xxx） |
| 物品描述   | `description` | [ILanguage][trans-1] |       | ✔     | [langDefault][trans-2] | 存放物品描述，也存放书籍内容(content-xxx)                     |

## dbname 命名规则

**大类别-名称**


```
item-iron_helmet

actor-lora

```
**大类别-子类别1-子类别2-...-名称**


```

item-bow-dragonrend
item-dagger-dragonrend

```

如果可以，尽量使用大类别-名称，如果遇到冲突才会在中间添加子类别。

其中大类别有：
```
actor-
item-
type-
equip-
effect-
content-

```


[actor-1]:https://github.com/valorad/inventory/blob/master/server/src/database/interface/actor.interface.ts#L4
[trans-1]:https://github.com/valorad/inventory/blob/master/server/src/database/interface/translation.interface.ts#L3
[trans-2]:https://github.com/valorad/inventory/blob/master/server/src/database/interface/translation.interface.ts#L5