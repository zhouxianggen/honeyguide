
# 目的

长远目标：利用移动智能网络连接人和服务
短期目标：建立更有效的推广机制
中期目标：O2O

# 问题

从推广的几个关键环节理解目前的推广模式：
1，寻找推广对象
2，制作推广内容
3，建立推广途径
4，决定推广费用

目前的推广模式（图）

基于平台的推广模式：（淘宝）
问题1，商家要进行推广，要请专业人员研究平台的推广机制，制作推广内容，并给平台投入推广费，大部分卖家承担不起这种推广。
问题2，绝大部分实体店只有通过发传单，在门口贴活动进行推广，受地理位置限制。（美团等团购APP提供了一种新的途径）。
问题3，卖家服务质量的好坏主要由平台决定，造成服务质量由大卖家决定。
问题4，这种模式依赖于平台吸引了大部分用户的注意力，而目前的趋势是随着信息源的增长，用户的注意力开始分散。
问题5，个人信息源成为获取信息的重要来源，但还未产生经济价值。

基于个人信息源的推广模式：（微店）
问题1，商家需要寻找推广对象，寻找粉丝关注，建设良好的推广内容来留住粉丝。这个门槛依然很高。
问题2，用来与用户交互的功能模板封闭造成单一。


# 解决方案
优势：
1，商家只需决定推广费的多少，无需关注于内容制作和推广途径；
2，推广费直接付给为他推广的用户,可以根据效益随时调整；
3，第三方服务提供者

# 时机：为何是现在？

# 市场规模


# 定义
------

### 1. 角色

1. `发布者(publisher)
	
	`
2. `体验者(taster)`
3. `分享者(sharer)`
4. `接引者(guider)`

------

### 2. 玩具

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


## 协议

	**note** 不包括相互认证的说明 

1. 开发者注册，获取ID；
2. 开发者提供linker服务器地址，title，描述，图标；
3. 平台验证linker；
4. linker在收到发布者的请求后提供发布交互；
5. linker在收到体验者的请求后提供体验交互；

### 请求浏览comb信息
请求参数
+ comb_id
+ share_id
+ rank_style
+ client_info

返回数据
+ 

## 参考

+ [tornado template](https://github.com/tornadoweb/tornado/blob/master/tornado/template.py)

### HTML5

+ [tutorial](http://www.html-5-tutorial.com/nav-element.htm)
+ [table](http://colintoh.com/blog/display-table-anti-hero)