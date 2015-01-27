package com.honeyguide.fc.honeyguide;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

/**
 * Created by Administrator on 2015/1/21.
 */
public class Account {
    public String mId;
    public String mName;
    public String mAvatar;
    public String mEmail;
    public String mTel;

    public boolean isEmpty() {
        return mId.isEmpty();
    }

    public String makeStorageKey() {
        return "\1" + mId;
    }

    public String getId() {
        return mId;
    }

    public boolean parseFromString(String str) {
        String[] tuple = str.split("\1");
        if (tuple.length == 5) {
            mId = tuple[0];
            mName = tuple[1];
            mAvatar = tuple[2];
            mEmail = tuple[3];
            mTel = tuple[4];
            return true;
        }
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
        return mId + "\1" + mName + "\1" + mAvatar + "\1" + mEmail + "\1" + mTel;
    }
}
