package com.fc.honeyguide;

import android.app.Application;

import com.fc.honeyguide.manager.AccountManager;
import com.fc.honeyguide.manager.CombManager;
import com.fc.honeyguide.manager.LinkerManager;

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
