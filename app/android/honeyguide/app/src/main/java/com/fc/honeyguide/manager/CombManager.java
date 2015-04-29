package com.fc.honeyguide.manager;

import android.content.SharedPreferences;

import com.fc.honeyguide.R;
import com.fc.honeyguide.define.Account;
import com.fc.honeyguide.define.Comb;
import com.fc.honeyguide.MyApplication;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

public class CombManager extends Manager {

    public CombManager(MyApplication context) {
        super(context, context.getString(R.string.preference_comb_manager));
        mServer = "http://54.149.127.185/get_created_combs?";
    }

    public boolean syncCreatedCombs() {
        try {
            Account account = mContext.getAccountManager().getCurrentAccount();
            String url = String.format("%sbee=%s", mServer, account.id);
            HttpResponse httpResponse = new DefaultHttpClient().execute(new HttpGet(url));
            if (httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
                String key = mContext.getString(R.string.preference_key_created_combs);
                String result = EntityUtils.toString(httpResponse.getEntity());
                SharedPreferences.Editor editor = mPreferences.edit();
                editor.putString(key, result);
                editor.commit();
                return true;
            }
        } catch (Exception e) {
        }
        return false;
    }

    public List<Comb> getCreatedCombs() {
        String key = mContext.getString(R.string.preference_key_created_combs);
        List<Comb> combs = new ArrayList<>();

        if (!mPreferences.contains(key) && !syncCreatedCombs()) {
            return null;
        }

        String result = mPreferences.getString(key, "");
        try {
            JSONObject jsonObject = new JSONObject(result);
            JSONArray jsonArray = jsonObject.getJSONArray("combs");
            for (int i = 0; i < jsonArray.length(); i++) {
                Comb comb = new Comb();
                if (comb.parseFromJsonObject(jsonArray.getJSONObject(i))) {
                    combs.add(comb);
                }
            }
            return combs;
        } catch (Exception e) {
        }
        return null;
    }

    public Comb getComb(String combId) {
        Comb comb = new Comb();
        return comb;
    }
}
