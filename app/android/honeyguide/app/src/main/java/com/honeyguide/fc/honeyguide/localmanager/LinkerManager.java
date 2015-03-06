package com.honeyguide.fc.honeyguide.localmanager;

import android.content.Context;
import android.content.SharedPreferences;

import com.honeyguide.fc.honeyguide.Account;
import com.honeyguide.fc.honeyguide.Linker;
import com.honeyguide.fc.honeyguide.MyApplication;
import com.honeyguide.fc.honeyguide.R;
import com.honeyguide.fc.honeyguide.remoteserver.AccountServer;
import com.honeyguide.fc.honeyguide.remoteserver.LinkerServer;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2015/2/11.
 */
public class LinkerManager {
    private MyApplication context;
    private SharedPreferences preferences;
    private LinkerServer server;

    public LinkerManager(MyApplication context) {
        this.context = context;
        preferences = context.getSharedPreferences(
                context.getString(R.string.shared_preferences_linker_manager),
                Context.MODE_PRIVATE);
        server = new LinkerServer(context.getString(R.string.remote_server_url));
    }

    public List<Linker> getLinkers() {
        List<Linker> linkers = server.getLinkers(
                context.getAccountManager().getCurrentAccount().id);
        return linkers;
    }
}
