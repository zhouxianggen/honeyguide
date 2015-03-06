package com.honeyguide.fc.honeyguide;

import com.honeyguide.fc.honeyguide.util.KeyValueParser;

/**
 * Created by Administrator on 2015/2/3.
 */
public class Linker {
    public String id;
    public String url;
    public String title;
    public String description;
    public String icon;
    public String price;
    public String developer;
    public String combCount;
    public String tasteCount;
    public boolean selected = false;

    public Linker() {
        id = "3a4fe60f9c";
        url = "file:///android_res/raw/linker_sample.html";
        title = "去淘宝";
        description = "最受欢迎的淘宝访问工具，安全快速访问您的网页，支持微信内访问淘宝";
        icon = "https://pilotmoon.com/popclip/extensions/icon/Taobaoicon.png";
        price = "前1000次免费，0.01元一次";
        developer = "蚂蚁科技";
        combCount = "150";
        tasteCount = "2000";
    }

    public boolean parseFromString(String str) {
        KeyValueParser parser = new KeyValueParser();
        if (parser.parse(str)) {
            id = parser.get("id");
            title = parser.get("title");
            description = parser.get("description");
            icon = parser.get("icon");
            price = parser.get("price");
            developer = parser.get("developer");
            combCount = parser.get("combCount");
            tasteCount = parser.get("tasteCount");
        }

        return false;
    }

    public int check() {
        if (id == null || id.isEmpty())  return 1;
        if (title == null || title.isEmpty())  return 2;
        if (description == null || description.isEmpty())  return 3;
        if (icon == null || icon.isEmpty())  return 4;
        if (price == null || price.isEmpty())  return 5;
        if (developer == null || developer.isEmpty())  return 6;
        if (combCount == null || combCount.isEmpty())  return 7;
        if (tasteCount == null || tasteCount.isEmpty())  return 8;
        return 0;
    }
}
