package com.honeyguide.fc.honeyguide.localmanager;

import android.content.Context;
import android.content.SharedPreferences;

import com.honeyguide.fc.honeyguide.Account;
import com.honeyguide.fc.honeyguide.MyApplication;
import com.honeyguide.fc.honeyguide.R;
import com.honeyguide.fc.honeyguide.remoteserver.AccountServer;

/**
 * 管理用户账户信息
 */
public class AccountManager {
    private MyApplication context;
    private SharedPreferences preferences;
    private AccountServer server;
    private Account currentAccount;

    public AccountManager(MyApplication context) {
        this.context = context;
        preferences = context.getSharedPreferences(
                context.getString(R.string.shared_preferences_account_manager),
                Context.MODE_PRIVATE);
        server = new AccountServer(context.getString(R.string.remote_server_url));
    }

    public void setCurrentAccount(Account account) {
        preferences.edit().putString(
                context.getString(R.string.key_current_account_id), account.id);
        preferences.edit().putString(
                context.getString(R.string.key_current_account_password), account.password);
        preferences.edit().commit();
        currentAccount = account;
    }

    public Account getCurrentAccount() {
        if (currentAccount == null) {
            String id = preferences.getString(
                    context.getString(R.string.key_current_account_id), "");
            String password = preferences.getString(
                    context.getString(R.string.key_current_account_password), "");
            if (!id.isEmpty() && !password.isEmpty()) {
                currentAccount = server.getAccount(id, password);
            }
        }
        return new Account();
        //return mCurrentAccount;
    }
}
