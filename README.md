
# 定义
------

### 1. 角色

1. `发布者(publisher)` 发布蜂窝的人
2. `体验者(taster)` 体验蜂蜜的人
3. `分享者(sharer)` 分享蜂蜜的人
4. `接引者(guider)` 指引体验者到达蜂窝的人

------

### 2. 对象

#### `蜂窝(comb)`

| Property | Desc |
|:-------------|:-------------|
| id | `蜂窝`ID |
| publisher_id | `发布者`ID |
| title | 由`发布者`设置的标题 |
| position | 蜂窝的位置 |
| link_id_1 | 由`发布者`选择的第1个`链接` |
| link_id_2 | 由`发布者`选择的第1个`链接` |
| enable_share | 由`发布者`设置的能否被分享 |
| daily_taste_count | 最近一天体验人数 |
| weekly_taste_count | 最近一周体验人数 |
| monthly_taste_count | 最近一月体验人数 |

#### `激励(motivation)`

| Property | Desc |
|:-------------|:-------------|
| comb_id | `蜂窝`ID |
| link_id | `链接`ID |
| fee | 激励费用 |

#### `体验(taste)`

| Property | Desc |
|:-------------|:-------------|
| id | `体验`ID |
| taster_id | `体验者`ID |
| comb_id | `蜂窝`ID |
| share_id | `体验者`选择的`分享`ID |
| link_id | `体验者`选择的`链接`ID |
| date | 发生日期 |
| position | 发生位置 |

#### `分享(share)`

| Property | Desc |
|:-------------|:-------------|
| id | `分享`ID |
| sharer_id | `分享者`ID |
| comb_id | `蜂窝`ID |
| date | 日期 |
| position | 位置 |
| likes | 被赞的次数 |
| daily_refer_count | 最近一天参考人数 |
| weekly_refer_count | 最近一周参考人数 |
| monthly_refer_count | 最近一月参考人数 |

#### `描述(desc)`

| Property | Desc |
|:-------------|:-------------|
| id | `描述`ID |
| share_id | `分享`ID |
| type | 类型（图片，视频等） |
| content | `描述`的内容 |


[example](D:/honeyguide/pic/desc_example.jpg)

#### `链接(link)`

| Property | Desc |
|:-------------|:-------------|
| id | `链接`ID |
| guider_id | `接引者`ID |
| url | `接引者`提供的`链接`地址 |
| price | `接引者`设置的使用计费 |
| comb_count | 包含该链接的comb数量 |
| taste_count | 使用该链接的taste数量 |


## 协议...

## 参考

+ [tornado template](https://github.com/tornadoweb/tornado/blob/master/tornado/template.py)

### HTML5

+ [tutorial](http://www.html-5-tutorial.com/nav-element.htm)
+ [table](http://colintoh.com/blog/display-table-anti-hero)
