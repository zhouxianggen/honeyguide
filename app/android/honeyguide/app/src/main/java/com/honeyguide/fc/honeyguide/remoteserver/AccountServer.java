package com.honeyguide.fc.honeyguide.remoteserver;

import com.honeyguide.fc.honeyguide.Account;

/**
 * Created by Administrator on 2015/1/21.
 */
public class AccountServer extends BasicServer {
    private String url;

    public AccountServer(String url) {
        this.url = url;
    }

    public Account getAccount(String accountId, String accountPassword) {
        Account account = new Account();
        account.id = accountId;
        account.password = accountPassword;
        account.status = Account.STATUS_GET;
        String data = account.serializeToString();
        String response = post(data);
        account.parseFromString(response);
        return account;
    }

}
