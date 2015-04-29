package com.fc.honeyguide.define;

import org.json.JSONObject;

public class Comb {
    public String id;
    public String icon;
    public String title;
    public String waggleCount;
    public String tasteCount;
    public String url;

    public Comb() {
    }

    public Comb(String s) {
        parseFromString(s);
    }

    public boolean parseFromString(String s) {
        return true;
    }

    public boolean parseFromJsonObject(JSONObject obj) {
        return true;
    }
}
