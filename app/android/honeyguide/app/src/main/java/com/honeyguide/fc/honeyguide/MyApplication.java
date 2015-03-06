package com.honeyguide.fc.honeyguide;

import android.app.Application;

import com.honeyguide.fc.honeyguide.localmanager.AccountManager;
import com.honeyguide.fc.honeyguide.localmanager.CombManager;
import com.honeyguide.fc.honeyguide.localmanager.LinkerManager;

/**
 * Created by Administrator on 2015/3/6.
 */
public class MyApplication extends Application {
    private LinkerManager mLinkerManager;
    private AccountManager mAccountManager;
    private CombManager mCombManager;

    public LinkerManager getLinkerManager() { return mLinkerManager; }
    public AccountManager getAccountManager() { return mAccountManager; }
    public CombManager getCombManager() { return mCombManager; }

    @Override
    public void onCreate() {
        super.onCreate();

        mLinkerManager = new LinkerManager(this);
        mAccountManager = new AccountManager(this);
        mCombManager = new CombManager(this);
    }
}
