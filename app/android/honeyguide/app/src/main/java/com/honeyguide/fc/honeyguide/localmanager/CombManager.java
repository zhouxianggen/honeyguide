package com.honeyguide.fc.honeyguide.localmanager;

import android.content.Context;

import com.honeyguide.fc.honeyguide.Account;
import com.honeyguide.fc.honeyguide.Comb;
import com.honeyguide.fc.honeyguide.MyApplication;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Administrator on 2015/1/28.
 */
public class CombManager {
    private MyApplication context;

    public CombManager(MyApplication context) {
        this.context = context;
    }

    public boolean addNewComb(Comb comb) {
        comb.url = "http://www.baidu.com";
        return true;
    }
}
