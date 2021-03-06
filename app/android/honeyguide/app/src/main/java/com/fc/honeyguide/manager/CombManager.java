package com.fc.honeyguide.manager;

import android.content.SharedPreferences;
import android.util.Log;

import com.fc.honeyguide.R;
import com.fc.honeyguide.define.Account;
import com.fc.honeyguide.define.Comb;
import com.fc.honeyguide.MyApplication;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class CombManager extends Manager {
    private static final String TAG = "CombManager";

    public CombManager(MyApplication context) {
        super(context, context.getString(R.string.preference_comb_manager));
        mServer = "http://54.149.127.185/comb_manager?";
    }

    public String syncCreatedCombs(List<Comb> combs) {
        try {
            Account account = mContext.getAccountManager().getCurrentAccount();
            String url = String.format("%sbee=%s&act=get_created_combs", mServer, account.id);
            Log.d(TAG, "sync created combs from " + url);
            HttpResponse httpResponse = new DefaultHttpClient().execute(new HttpGet(url));
            Log.d(TAG, "code is " + String.valueOf(httpResponse.getStatusLine().getStatusCode()));
            if (httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
                String result = EntityUtils.toString(httpResponse.getEntity());
                Log.d(TAG, "result is: " + result);
                JSONObject jsonObject = new JSONObject(result);
                String status = jsonObject.getString("status");
                if (!status.equals("ok")) {
                    return status;
                }
                JSONArray jsonArray = jsonObject.getJSONArray("combs");
                for (int i = 0; i < jsonArray.length(); i++) {
                    Comb comb = new Comb();
                    if (comb.parseFromJsonObject(jsonArray.getJSONObject(i))) {
                        Log.d(TAG, "add comb with " + comb.title);
                        combs.add(comb);
                    }
                }
                String key = mContext.getString(R.string.preference_key_created_combs);
                SharedPreferences.Editor editor = mPreferences.edit();
                editor.putString(key, result);
                editor.commit();
                return mContext.getString(R.string.error_none);
            }
            return mContext.getString(R.string.error_sync_created_combs_failed);
        } catch (Exception e) {
            Log.d(TAG, "exception: " + String.valueOf(e));
            return mContext.getString(R.string.error_exception);
        }
    }

    public String getCreatedCombs(List<Comb> combs) {
        String key = mContext.getString(R.string.preference_key_created_combs);

        if (!mPreferences.contains(key)) {
            String error = syncCreatedCombs(combs);
            return error;
        }
        String result = mPreferences.getString(key, "");
        try {
            JSONObject jsonObject = new JSONObject(result);
            JSONArray jsonArray = jsonObject.getJSONArray("combs");
            for (int i = 0; i < jsonArray.length(); i++) {
                Comb comb = new Comb();
                if (comb.parseFromJsonObject(jsonArray.getJSONObject(i))) {
                    Log.d(TAG, "add comb with " + comb.title);
                    combs.add(comb);
                }
            }
            return mContext.getString(R.string.error_none);
        } catch (Exception e) {
            Log.d(TAG, "exception: " + String.valueOf(e));
            return mContext.getString(R.string.error_exception);
        }
    }

    public String getCollectedCombs(List<Comb> combs) {
        return mContext.getString(R.string.error_sync_collected_combs_failed);
    }

    public String addComb() {
        try {
            Account account = mContext.getAccountManager().getCurrentAccount();
            Comb comb = mContext.getNewComb();
            HttpClient httpclient = new DefaultHttpClient();
            String url = String.format("%sact=add_comb", mServer);
            HttpPost httppost = new HttpPost(url);
            List<NameValuePair> nameValuePairs = new ArrayList<>();
            nameValuePairs.add(new BasicNameValuePair("bee", account.id));
            nameValuePairs.add(new BasicNameValuePair("comb", comb.serializeToString()));
            httppost.setEntity(new UrlEncodedFormEntity(nameValuePairs, "UTF-8"));
            Log.d(TAG, " begin to post");
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
                List<Comb> combs = new ArrayList<>();
                syncCreatedCombs(combs);
                return mContext.getString(R.string.error_none);
            }
            return mContext.getString(R.string.error_sync_add_comb_failed);
        } catch (Exception e) {
            Log.d(TAG, "exception: " + String.valueOf(e));
            return mContext.getString(R.string.error_exception);
        }
    }
}
