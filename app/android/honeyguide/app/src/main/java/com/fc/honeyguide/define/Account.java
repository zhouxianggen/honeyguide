package com.fc.honeyguide.define;

import org.json.JSONObject;

public class Account {
    public String id;
    public String name;
    public String password;
    public String avatar;

    public boolean parseFromString(String s) {
        try {
            return parseFromJsonObject(new JSONObject(s));
        } catch (Exception e) {
            return false;
        }
    }

    public boolean parseFromJsonObject(JSONObject jsonObject) {
        try {
            id = jsonObject.getString("id");
            name = jsonObject.getString("name");
            password = jsonObject.getString("password");
            avatar = jsonObject.getString("avatar");
        } catch (Exception e) {
            return false;
        }
        return true;
    }
}
