package com.honeyguide.fc.honeyguide.remoteserver;

import com.honeyguide.fc.honeyguide.Account;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Administrator on 2015/1/21.
 */
public class AccountServer extends BasicServer {
    public String autoGenerateAccount() {
        List<NameValuePair> params = new ArrayList<NameValuePair>(1);
        params.add(new BasicNameValuePair("option", "auto_generate_account"));
        return post(params);
    }

    public String getAccount(String accountId, String accountPassword) {
        if (accountId.isEmpty() || accountPassword.isEmpty()) {
            return "";
        }
        List<NameValuePair> params = new ArrayList<NameValuePair>(3);
        params.add(new BasicNameValuePair("option", "get_account_info"));
        params.add(new BasicNameValuePair("account_id", accountId));
        params.add(new BasicNameValuePair("account_password", accountPassword));
        return post(params);
    }

    public String registerAccount(Account account) {
        List<NameValuePair> params = new ArrayList<NameValuePair>(3);
        params.add(new BasicNameValuePair("option", "register_account"));
        params.add(new BasicNameValuePair("account_id", account.mId));
        params.add(new BasicNameValuePair("account_password", account.mTel));
        return post(params);
    }

}
