package com.honeyguide.fc.honeyguide.localmanager;

import android.content.Context;

import com.honeyguide.fc.honeyguide.Account;
import com.honeyguide.fc.honeyguide.Comb;
import com.honeyguide.fc.honeyguide.Linker;
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

    public List<Comb> getCombs(String folderName) {
        List<Comb> combs = new ArrayList<>();
        Comb comb = new Comb();
        comb.title = "VEROMODA 西城广场店";
        comb.newShareCount = "98";
        comb.linkers = new ArrayList<>();
        Linker linker1 = new Linker();
        linker1.id = "1";
        linker1.title = "去淘宝";
        linker1.url = "file:///android_res/raw/linker_sample.html";
        linker1.combCount = "34";
        linker1.price = "0.5元/次（前100次免费）";
        linker1.icon = "http://www.appdh.com/appdh/wp-content/uploads/apps/com.taobao.taobao/com.taobao.taobao.png";
        linker1.description = "快速访问您的淘宝店，支持微信内访问";
        linker1.tasteCount = "38";
        comb.linkers.add(linker1);
        Linker linker2 = new Linker();
        linker2.id = "2";
        linker2.title = "风先生";
        linker2.url = "file:///android_res/raw/linker_sample.html";
        linker2.combCount = "200";
        linker2.price = "免费";
        linker2.icon = "http://cdn.appshopper.com/icons/854/888513_larger.png";
        linker2.description = "服务最好的同城速递";
        linker2.tasteCount = "50";
        comb.linkers.add(linker2);
        combs.add(comb);
        return combs;
    }
}
