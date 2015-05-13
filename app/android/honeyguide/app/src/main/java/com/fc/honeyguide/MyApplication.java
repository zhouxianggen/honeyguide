package com.fc.honeyguide;

import android.app.Application;

import com.fc.honeyguide.define.Comb;
import com.fc.honeyguide.define.Linker;
import com.fc.honeyguide.manager.AccountManager;
import com.fc.honeyguide.manager.CombManager;
import com.fc.honeyguide.manager.LinkerManager;

import java.util.ArrayList;
import java.util.List;

public class MyApplication extends Application {
    private LinkerManager mLinkerManager;
    private AccountManager mAccountManager;
    private CombManager mCombManager;
    private Comb mNewComb;

    public LinkerManager getLinkerManager() {
        if (mLinkerManager == null) {
            mLinkerManager = new LinkerManager(this);
        }
        return mLinkerManager;
    }
    public AccountManager getAccountManager() {
        if (mAccountManager == null) {
            mAccountManager = new AccountManager(this);
        }
        return mAccountManager;
    }

    public CombManager getCombManager() {
        if (mCombManager == null) {
            mCombManager = new CombManager(this);
        }
        return mCombManager;
    }

    public Comb getNewComb() {
        if (mNewComb == null) {
            mNewComb = new Comb();
        }
        return mNewComb;
    }

    @Override
    public void onCreate() {
        super.onCreate();

        mLinkerManager = new LinkerManager(this);
        mAccountManager = new AccountManager(this);
        mCombManager = new CombManager(this);
        mNewComb = new Comb();
    }
}
