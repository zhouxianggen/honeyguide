package com.honeyguide.fc.honeyguide.localmanager;

import android.content.Context;
import android.content.SharedPreferences;

import com.honeyguide.fc.honeyguide.Account;
import com.honeyguide.fc.honeyguide.R;
import com.honeyguide.fc.honeyguide.remoteserver.AccountServer;

/**
 * 管理用户账户信息
 */
public class AccountManager {
    private SharedPreferences mRef;
    private AccountServer mAccountServer;

    protected AccountManager(Context context) {
        mRef = context.getSharedPreferences(
                context.getString(R.string.account_manager_preference_file_key), Context.MODE_PRIVATE);

        mAccountServer.setRemoteServerAddress(context.getString(R.string.account_manager_remote_server_url));
    }

    public void storageAccountInfo(Account account) {
        mRef.edit().putString(account.getId(), account.serializeToString());
        mRef.edit().commit();
    }

    public Account autoGenerateAccount() {
        Account account = new Account();
        account.parseFromString(mAccountServer.autoGenerateAccount());
        if (!account.isEmpty()) {
            storageAccountInfo(account);
        }
        return account;
    }

    public Account getAccount(String accountId, String accountPassWord) {
        Account account = new Account();
        String info = mRef.getString(accountId, "");
        if (info.isEmpty()) {
            info = mAccountServer.getAccount(accountId, accountPassWord);
        }
        account.parseFromString(info);
        if (! account.isEmpty()) {
            storageAccountInfo(account);
        }
        return account;
    }

    public Account getCurrentAccount(Context context) {
        return getAccount(mRef.getString(context.getString(R.string.account_manager_current_account_id), ""), "");
    }

    public void setCurrentAccount(Context context, Account account) {
        mRef.edit().putString(context.getString(R.string.account_manager_current_account_id), account.getId());
        mRef.edit().commit();
    }
}
