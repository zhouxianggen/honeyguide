package com.fc.honeyguide.define;

import org.json.JSONObject;

public class Linker {
    public String id = "";
    public String title = "";
    public String icon = "";
    public String url = "";
    public String description = "";
    public Double price = 0.0;
    public Integer clickCount = 0;
    public boolean selected = false;

    public boolean parseFromJsonObject(JSONObject jsonObject) {
        try {
            id = jsonObject.getString("id");
            title = jsonObject.getString("title");
            icon = jsonObject.getString("icon");
            url = jsonObject.getString("url");
            description = jsonObject.getString("description");
            price = jsonObject.getDouble("price");
            clickCount = jsonObject.getInt("clickCount");
        } catch (Exception e) {
            return false;
        }
        return true;
    }
}
