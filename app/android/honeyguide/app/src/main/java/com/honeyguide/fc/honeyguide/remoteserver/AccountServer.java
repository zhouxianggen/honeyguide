package com.honeyguide.fc.honeyguide.remoteserver;

import com.honeyguide.fc.honeyguide.Account;

/**
 * Created by Administrator on 2015/1/21.
 */
public class AccountServer extends BasicServer {

    public Account getAccount(String accountId, String accountPassword) {
        Account account = new Account();
        account.mId = accountId;
        account.mPassword = accountPassword;
        account.mStatus = Account.STATUS_GET;
        String data = account.serializeToString();
        String response = post(data);
        account.parseFromString(response);
        return account;
    }

    public Account registerAccount(String accountId, String accountPassword) {
        Account account = new Account();
        account.mId = accountId;
        account.mPassword = accountPassword;
        account.mStatus = Account.STATUS_REGISTER;
        String data = account.serializeToString();
        String response = post(data);
        account.parseFromString(response);
        return account;
    }

}
