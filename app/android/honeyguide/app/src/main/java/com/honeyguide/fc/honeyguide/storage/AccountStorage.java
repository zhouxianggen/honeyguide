package com.honeyguide.fc.honeyguide.storage;

import android.content.Context;
import android.content.SharedPreferences;

import com.honeyguide.fc.honeyguide.Account;
import com.honeyguide.fc.honeyguide.R;

/**
 * Created by Administrator on 2015/1/21.
 */
public class AccountStorage {
    static private String REF_KEY_ACCOUNT_IDS = "account_ids";
    private SharedPreferences mRef;

    protected AccountStorage(Context context) {
        mRef = context.getSharedPreferences(
                context.getString(R.string.account_storage_preference_file_key), Context.MODE_PRIVATE);
    }
    public String[] getAccountIds() {
        return mRef.getString(REF_KEY_ACCOUNT_IDS, "").split(",");
    }

    public Account getAccount(String accountId) {
        Account account = new Account();
        account.parseFromString(mRef.getString(accountId, ""));
        return account;
    }

    public void setAccount(Account account) {
        mRef.edit().putString(account.mId, account.serializeToString());
    }
}
