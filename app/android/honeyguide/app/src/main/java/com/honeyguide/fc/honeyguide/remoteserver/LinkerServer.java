package com.honeyguide.fc.honeyguide.remoteserver;

import com.honeyguide.fc.honeyguide.Linker;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Administrator on 2015/2/3.
 */
public class LinkerServer extends BasicServer {
    private String url;

    public LinkerServer(String url) {
        this.url = url;
    }

    public List<Linker> getLinkers(String accountId) {
        List<Linker> linkers = new ArrayList<>();
        //String data = "account_id=" + accountId;
        //String response = post(data);
        Linker linker1 = new Linker();
        linker1.id = "1";
        linker1.title = "去淘宝";
        linker1.url = "file:///android_res/raw/linker_sample.html";
        linker1.combCount = "34";
        linker1.price = "0.5元/次（前100次免费）";
        linker1.icon = "http://www.appdh.com/appdh/wp-content/uploads/apps/com.taobao.taobao/com.taobao.taobao.png";
        linker1.description = "快速访问您的淘宝店，支持微信内访问";
        linkers.add(linker1);
        Linker linker2 = new Linker();
        linker2.id = "2";
        linker2.title = "风先生";
        linker2.url = "file:///android_res/raw/linker_sample.html";
        linker2.combCount = "200";
        linker2.price = "免费";
        linker2.icon = "http://cdn.appshopper.com/icons/854/888513_larger.png";
        linker2.description = "服务最好的同城速递";
        linkers.add(linker2);
        return linkers;
    }
}
