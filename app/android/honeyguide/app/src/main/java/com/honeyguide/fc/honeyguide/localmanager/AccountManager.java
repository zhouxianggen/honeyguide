package com.honeyguide.fc.honeyguide.localmanager;

import android.content.Context;
import android.content.SharedPreferences;

import com.honeyguide.fc.honeyguide.Account;
import com.honeyguide.fc.honeyguide.R;
import com.honeyguide.fc.honeyguide.remoteserver.AccountServer;

import java.util.HashMap;
import java.util.Map;

/**
 * 管理用户账户信息
 */
public class AccountManager {
    private Context mContext;
    private SharedPreferences mRef;
    private AccountServer mAccountServer;
    private Map<String, Account> mIdAccountMap;

    public AccountManager(Context context) {
        mContext = context;
        mRef = context.getSharedPreferences(
                context.getString(R.string.account_manager_preference_file_key), Context.MODE_PRIVATE);

        mAccountServer = new AccountServer();
        mAccountServer.setRemoteServerAddress(context.getString(R.string.account_manager_remote_server_url));

        mIdAccountMap = new HashMap<>();
    }

    public Account getAccount(String id, String password) {
        Account account = mIdAccountMap.get(id);
        if (account == null) {
            account = mAccountServer.getAccount(id, password);
        }
        if (account.mStatus != Account.STATUS_OK) {
            return null;
        }
        mIdAccountMap.put(id, account);
        return account;
    }

    public Account getCurrentAccount() {
        String id = mRef.getString(mContext.getString(R.string.account_manager_current_account_id), "");
        String passWord = mRef.getString(mContext.getString(R.string.account_manager_current_account_password), "");
        if (!id.isEmpty() && !passWord.isEmpty()) {
            return getAccount(id, passWord);
        }
        return null;
    }

    public void setCurrentAccount(Account account) {
        mRef.edit().putString(mContext.getString(R.string.account_manager_current_account_id), account.mId);
        mRef.edit().putString(mContext.getString(R.string.account_manager_current_account_password), account.mPassword);
        mRef.edit().commit();
    }

    public Account registerAccount(String id, String password) {
        return mAccountServer.registerAccount(id, password);
    }
}
