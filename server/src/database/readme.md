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

| 项目       | 字段      | 数据类型 | 唯一  | 空值  | 默认  | 说明                                                                                                                                                                                          |
| :--------: | :-------: | :------: | :---: | :---: | :---: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 数据库名称 | `dbname`  | string   | ✔     |       |       |                                                                                                                                                                                               |
| 类型名称   | `type`    | string   |       |       |       | 仅存放类型名称，内容位于translations数据集。类型例如匕首、长剑、大刀、轻甲、重甲等。前端需要根据预先定义的具体类型来区分到底是武器还是护甲。护甲的具体分类由equip决定，其他类型都是分好类了的 |
| 效果名称   | `effects` | string[] |       |       |       | 数组中仅存放效果名称，内容位于translations数据集。                                                                                                                                            |
| 属性值     | `rating`  | number   |       |       | 0     | 对于武器，则是伤害；对于护甲，则是防御                                                                                                                                                        |
| 装备部位   | `equip`   | string[] |       |       |       | 数组中仅存放装备部位名称，内容位于translations数据集。对于武器左右手，前端需要判断是否需要合并成双手                                                                                          |


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
| 数据库名称 | `dbname`      | string               | ✔     |       |                        | 填写需要翻译的`dbname`                                        |
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

## type 表

```
type-armor              护甲
type-garment            衣裳
type-lightarmor         轻甲
type-heavyarmor         重甲

type-book               书籍
type-scroll             卷轴
type-spelltome          法术书

type-food               食物
type-food-wine          酒

type-ingredient         配料

type-potion             魔药
type-potion-fire        魔药（火）
type-potion-frost       魔药（冰）
type-potion-health      魔药（命）
type-potion-magic       魔药（魔）
type-potion-poison      魔药（毒）
type-potion-shock       魔药（电）
type-potion-stamina     魔药（耐）

type-weapon             武器
type-weapon-arrow       箭
type-weapon-battleaxe   战斧
type-weapon-bolt        矢
type-weapon-bow         弓
type-weapon-crossbow    弩
type-weapon-dagger      匕首
type-weapon-greatsword  巨剑
type-weapon-hammer      巨锤
type-weapon-mace        手锤
type-weapon-pickaxe     鹤嘴锄
type-weapon-staff       法杖
type-weapon-sword       剑
type-weapon-waraxe      手斧
type-weapon-woodaxe     伐木斧

type-misc-key           钥匙
type-misc-artifact      工艺
type-misc-clutter       整体
type-misc-dragonclaw    龙爪
type-misc-gem           宝石
type-misc-gold          金钱
type-misc-goldsack      钱包
type-misc-hide          毛皮
type-misc-ingot         矿锭
type-misc-leather       革质
type-misc-lockpick      开锁器
type-misc-ore           矿石
type-misc-remains       遗物
type-misc-soulgem       灵魂石
type-misc-soulgem-azura 灵魂石（阿祖拉）
type-misc-strips        革带
type-misc-torch         火炬
type-misc-trollskull    巨魔头骨
type-misc-wood          木材

```



## Equip 类型

护甲：
```
equip-head        头部
equip-face        脸部
equip-chest       胸部
equip-forearms    臂膀
equip-finger      手指
equip-shield      盾牌
equip-leg         膝盖
equip-feet        足部
```
武器：
```
equip-hand-left   左手
equip-hand-right  右手
equip-hand-either 左手或右手
```

[actor-1]:https://github.com/valorad/inventory/blob/master/server/src/database/interface/actor.interface.ts#L4
[trans-1]:https://github.com/valorad/inventory/blob/master/server/src/database/interface/translation.interface.ts#L3
[trans-2]:https://github.com/valorad/inventory/blob/master/server/src/database/interface/translation.interface.ts#L5