package com.fc.honeyguide.manager;

import android.content.SharedPreferences;

import com.fc.honeyguide.MyApplication;


public class Manager {
    protected SharedPreferences mPreferences;
    protected MyApplication mContext;
    protected String mName;
    protected String mServer;

    public Manager(MyApplication context, String name) {
        mContext = context;
        mName = name;
        mPreferences = mContext.getSharedPreferences(mName, mContext.MODE_PRIVATE);
    }
}
