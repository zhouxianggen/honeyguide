package com.fc.honeyguide.manager;

import android.content.SharedPreferences;
import android.util.Log;

import com.fc.honeyguide.R;
import com.fc.honeyguide.define.Account;
import com.fc.honeyguide.MyApplication;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class AccountManager extends Manager {
    private static final String TAG = "AccountManager";
    private Account mCurrentAccount = null;

    public AccountManager(MyApplication context) {
        super(context, "account_manager");
        mServer = "http://54.149.127.185/account_manager?";
    }

    public Account getCurrentAccount() {
        if (mCurrentAccount != null) {
            return mCurrentAccount;
        }
        String key = mContext.getString(R.string.preference_key_current_account);
        if (mPreferences.contains(key)) {
            Account account = new Account();
            if (account.parseFromString(mPreferences.getString(key, ""))) {
                mCurrentAccount = account;
                return mCurrentAccount;
            }
        }
        return null;
    }

    public String login(String username, String password) {
        Log.d(TAG, "login with " + username + " " + password);
        if (username.isEmpty()) {
            return mContext.getString(R.string.error_username_is_empty);
        }
        if (password.isEmpty()) {
            return mContext.getString(R.string.error_password_is_empty);
        }
        try {
            HttpClient httpclient = new DefaultHttpClient();
            String url = String.format("%sact=login", mServer);
            HttpPost httppost = new HttpPost(url);
            List<NameValuePair> nameValuePairs = new ArrayList<>();
            nameValuePairs.add(new BasicNameValuePair("username", username));
            nameValuePairs.add(new BasicNameValuePair("password", password));
            httppost.setEntity(new UrlEncodedFormEntity(nameValuePairs));
            HttpResponse httpResponse = httpclient.execute(httppost);
            Log.d(TAG, "code is " + String.valueOf(httpResponse.getStatusLine().getStatusCode()));
            if (httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
                String result = EntityUtils.toString(httpResponse.getEntity());
                Log.d(TAG, "result is: " + result);
                JSONObject jsonObject = new JSONObject(result);
                String status = jsonObject.getString("status");
                if (!status.equals("ok")) {
                    return status;
                }
                String strAccount = jsonObject.getString("account");
                Account account = new Account();
                if (!account.parseFromString(strAccount)) {
                    return mContext.getString(R.string.error_parse_account_failed);
                }
                mCurrentAccount = account;
                SharedPreferences.Editor editor = mPreferences.edit();
                editor.putString(mContext.getString(R.string.preference_key_current_account),
                        strAccount);
                editor.commit();
                return mContext.getString(R.string.error_none);
            }
            return mContext.getString(R.string.error_sync_account_failed);
        } catch (Exception e) {
            Log.d(TAG, "exception: " + String.valueOf(e));
            return mContext.getString(R.string.error_exception);
        }
    }

    public String register(String username, String password) {
        Log.d(TAG, "register with " + username + " " + password);
        if (username.isEmpty()) {
            return mContext.getString(R.string.error_username_is_empty);
        }
        if (password.isEmpty()) {
            return mContext.getString(R.string.error_password_is_empty);
        }
        try {
            HttpClient httpclient = new DefaultHttpClient();
            String url = String.format("%sact=register", mServer);
            HttpPost httppost = new HttpPost(url);
            List<NameValuePair> nameValuePairs = new ArrayList<>();
            nameValuePairs.add(new BasicNameValuePair("username", username));
            nameValuePairs.add(new BasicNameValuePair("password", password));
            httppost.setEntity(new UrlEncodedFormEntity(nameValuePairs));
            HttpResponse httpResponse = httpclient.execute(httppost);
            Log.d(TAG, "code is " + String.valueOf(httpResponse.getStatusLine().getStatusCode()));
            if (httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
                String result = EntityUtils.toString(httpResponse.getEntity());
                Log.d(TAG, "result is: " + result);
                JSONObject jsonObject = new JSONObject(result);
                String status = jsonObject.getString("status");
                Log.d(TAG, "status** is: " + status);
                if (status != "ok") {
                    Log.d(TAG, "status is: " + status);
                    return status;
                }
                String strAccount = jsonObject.getString("account");
                Account account = new Account();
                if (!account.parseFromString(strAccount)) {
                    Log.d(TAG, "1111111");
                    return mContext.getString(R.string.error_parse_account_failed);
                }
                Log.d(TAG, "22222");
                mCurrentAccount = account;
                SharedPreferences.Editor editor = mPreferences.edit();
                editor.putString(mContext.getString(R.string.preference_key_current_account),
                        strAccount);
                editor.commit();
                Log.d(TAG, "33333");
            }
        } catch (Exception e) {
            Log.d(TAG, "exception: " + String.valueOf(e));
            return mContext.getString(R.string.error_exception);
        }
        Log.d(TAG, "return " + mContext.getString(R.string.error_none));
        return mContext.getString(R.string.error_none);
    }
}
