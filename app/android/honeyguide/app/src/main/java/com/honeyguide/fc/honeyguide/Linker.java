package com.honeyguide.fc.honeyguide;

import com.honeyguide.fc.honeyguide.util.KeyValueParser;

/**
 * Created by Administrator on 2015/2/3.
 */
public class Linker {
    public String id;
    public String title;
    public String description;
    public String icon;
    public String price = "";
    public String developer;
    public String inUseCombCount;
    public String tasteCount;
    public boolean selected = false;

    public boolean parseFromString(String str) {
        KeyValueParser parser = new KeyValueParser();
        if (parser.parse(str)) {
            id = parser.get("id");
            title = parser.get("title");
            description = parser.get("description");
            icon = parser.get("icon");
            price = parser.get("price");
            developer = parser.get("developer");
            inUseCombCount = parser.get("inUseCombCount");
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
        if (inUseCombCount == null || inUseCombCount.isEmpty())  return 7;
        if (tasteCount == null || tasteCount.isEmpty())  return 8;
        return 0;
    }
}
