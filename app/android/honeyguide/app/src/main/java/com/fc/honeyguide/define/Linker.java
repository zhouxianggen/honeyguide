package com.fc.honeyguide.define;

import android.util.Log;

import org.json.JSONObject;

public class Linker {
    private static final String TAG = "Linker";

    public String id = "";
    public String title = "";
    public String icon = "";
    public String url = "";
    public String description = "";
    public Double price = 0.0;
    public Integer clickCount = 0;
    public boolean selected = false;

    public String serializeToString() {
        return String.format("{\"id\": \"%s\", \"title\": \"%s\", \"icon\": \"%s\", " +
                "\"url\": \"%s\", \"description\": \"%s\", \"price\": %f, " +
                "\"clickCount\":  %d}",
                id, title, icon, url, description, price, clickCount);
    }

    public boolean parseFromJsonObject(JSONObject jsonObject) {
        try {
            id = jsonObject.getString("id");
            title = jsonObject.getString("title");
            icon = jsonObject.getString("icon");
            url = jsonObject.getString("url");
            description = jsonObject.getString("description");
            price = jsonObject.getDouble("price");
            clickCount = jsonObject.getInt("click_count");
        } catch (Exception e) {
            Log.d(TAG, "parseFromJsonObject failed " + e.toString());
            return false;
        }
        return true;
    }
}
