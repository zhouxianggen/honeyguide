package com.honeyguide.fc.honeyguide;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2015/1/21.
 */
public class Account {
    public static final String STATUS_OK = "ok";
    public static final String STATUS_GET = "get";
    public static final String STATUS_REGISTER = "register";

    public String id = "2e34587f";
    public String password = "123456";
    public String name = "tang";
    public String avatar = "path to icon";
    public String email = "tang@gmail.com";
    public String tel = "13926277206";
    public Map<Folder, List<Comb>> folderCombs;
    public String status;
    public Date updateTime;

    public boolean isEmpty() {
        return id.isEmpty();
    }

    public List<Folder> getFolders() {
        List<Folder> folders = new ArrayList<>();
        //folders.addAll(folderCombs.keySet());
        Folder folder = new Folder();
        folder.title = "我创建的";
        folder.combCount = "1";
        folders.add(folder);
        return folders;
    }

    public String makeStorageKey() {
        return "\1" + id;
    }

    public String getId() {
        return id;
    }

    public boolean parseFromString(String str) {
        /*String[] tuple = str.split("\1");
        if (tuple.length == 5) {
            mId = tuple[0];
            mName = tuple[1];
            mAvatar = tuple[2];
            mEmail = tuple[3];
            mTel = tuple[4];
            return true;
        }*/
        return false;
    }

    public boolean parseFromStream(InputStream inputStream) throws IOException {
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
        StringBuilder stringBuilder = new StringBuilder();
        String line;
        while ((line = bufferedReader.readLine()) != null) {
            stringBuilder.append(line);
        }
        return parseFromString(stringBuilder.toString());
    }

    public String serializeToString(){
        return id + "\1" + name + "\1" + avatar + "\1" + email + "\1" + tel;
    }
}
