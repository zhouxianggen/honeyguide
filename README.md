
# 定义
------

### 1. 角色

1. `发布者(publisher)`
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
| desc_id | `描述`ID |
| likes | 被赞的次数 |
| daily_refer_count | 最近一天参考人数 |
| weekly_refer_count | 最近一周参考人数 |
| monthly_refer_count | 最近一月参考人数 |

#### `描述(desc)`

| Property | Desc |
|:-------------|:-------------|
| id | `描述`ID |
| content | `描述`的内容 |
| date | 发生日期 |
| position | 发生位置 |


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

1. 连接开发者需要先注册
2. 连接开发者提供的服务器在收到发布请求后提供发布者发布交互界面
		请求包括发布者信息
3. 连接开发者提供的服务器在发布者放弃使用其服务后收到放弃请求
		请求包括发布者信息
4. 连接开发者提供的服务器在收到连接请求后提供用户连接界面
		请求包括发布者信息，用户信息
5. 连接开发者提供的服务器收到的各种请求统计（发布请求，放弃请求，连接请求）以平台统计为标准，这些统计将展现给用户并用于计费


## 参考

+ [tornado template](https://github.com/tornadoweb/tornado/blob/master/tornado/template.py)

### HTML5

+ [tutorial](http://www.html-5-tutorial.com/nav-element.htm)
+ [table](http://colintoh.com/blog/display-table-anti-hero)