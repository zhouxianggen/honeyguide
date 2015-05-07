package com.fc.honeyguide.manager;

import android.content.SharedPreferences;
import android.util.Log;

import com.fc.honeyguide.R;
import com.fc.honeyguide.define.Account;
import com.fc.honeyguide.define.Comb;
import com.fc.honeyguide.define.Linker;
import com.fc.honeyguide.MyApplication;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.List;

public class LinkerManager extends Manager {
    private static final String TAG = "LinkerManager";

    public LinkerManager(MyApplication context) {
        super(context, context.getString(R.string.preference_linker_manager));
        mServer = "http://54.149.127.185/linker_manager?";
    }

    public String getLinkers(List<Linker> linkers) {
        try {
            Account account = mContext.getAccountManager().getCurrentAccount();
            String url = String.format("%sbee=%s&act=get_linkers", mServer, account.id);
            Log.d(TAG, "sync linkers from " + url);
            HttpResponse httpResponse = new DefaultHttpClient().execute(new HttpPost(url));
            Log.d(TAG, "code is " + String.valueOf(httpResponse.getStatusLine().getStatusCode()));
            if (httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
                String result = EntityUtils.toString(httpResponse.getEntity());
                Log.d(TAG, "result is: " + result);
                JSONObject jsonObject = new JSONObject(result);
                String status = jsonObject.getString("status");
                if (!status.equals("ok")) {
                    return status;
                }
                JSONArray jsonArray = jsonObject.getJSONArray("linkers");
                for (int i = 0; i < jsonArray.length(); i++) {
                    Linker linker = new Linker();
                    if (linker.parseFromJsonObject(jsonArray.getJSONObject(i))) {
                        Log.d(TAG, "add linker with " + linker.title);
                        linkers.add(linker);
                    }
                }
                return mContext.getString(R.string.error_none);
            }
            return mContext.getString(R.string.error_sync_created_combs_failed);
        } catch (Exception e) {
            Log.d(TAG, "exception: " + String.valueOf(e));
            return mContext.getString(R.string.error_exception);
        }
    }
}
