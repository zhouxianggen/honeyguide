package com.fc.honeyguide.manager;

import com.fc.honeyguide.define.Account;
import com.fc.honeyguide.MyApplication;

public class AccountManager extends Manager {

    public AccountManager(MyApplication context) {
        super(context, "account_manager");
        mServer = "http://54.149.127.185/get_created_combs?";
    }

    Account getCurrentAccount() {
        Account account = new Account();
        return account;
    }
}
