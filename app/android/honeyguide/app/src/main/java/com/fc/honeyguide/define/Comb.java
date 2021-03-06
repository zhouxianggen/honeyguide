package com.fc.honeyguide.define;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class Comb {
    public String id = "";
    public String icon= "";
    public String title = "";
    public String url = "";
    public int waggleCount = 0;
    public int tasteCount = 0;
    public List<Linker> linkers = new ArrayList<>();

    public Comb() {
    }

    public String check() {
        if (title.isEmpty()) return "标题不能为空";
        if (linkers.isEmpty()) return "服务不能为空";
        return "";
    }

    public boolean parseFromJsonObject(JSONObject jsonObject) {
        try {
            id = jsonObject.getString("id");
            icon = jsonObject.getString("icon");
            title = jsonObject.getString("title");
            url = jsonObject.getString("url");
            waggleCount = jsonObject.getInt("waggle_count");
            tasteCount = jsonObject.getInt("taste_count");
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    public String serializeToString() {
        String linkersString = "";
        for (Linker linker : linkers) {
            if (linkersString.isEmpty()) {
                linkersString = linker.serializeToString();
            } else {
                linkersString += ", " + linker.serializeToString();
            }
        }
        return String.format("{\"id\": \"%s\", \"title\": \"%s\", \"icon\": \"%s\", " +
                "\"url\": \"%s\", \"waggleCount\": %d, \"tasteCount\": %d, " +
                "\"linkers\":  [%s]}",
                id, title, icon, url, waggleCount, tasteCount, linkersString);
    }
}
