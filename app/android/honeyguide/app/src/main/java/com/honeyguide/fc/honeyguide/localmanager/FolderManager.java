package com.honeyguide.fc.honeyguide.localmanager;

import android.content.Context;
import android.content.SharedPreferences;

import com.honeyguide.fc.honeyguide.Account;
import com.honeyguide.fc.honeyguide.Folder;
import com.honeyguide.fc.honeyguide.FolderInfoHolder;
import com.honeyguide.fc.honeyguide.R;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2015/1/29.
 */
public class FolderManager {
    private SharedPreferences mRef;
    private Context mContext;
    private Map<String, List<Folder>> mMapAccountFolders;

    public FolderManager(Context context) {
        mContext = context;
        mRef = context.getSharedPreferences(
                context.getString(R.string.account_manager_preference_file_key), Context.MODE_PRIVATE);
        mMapAccountFolders = new HashMap<String, List<Folder>>();
    }

    public List<Folder> getAccountFolders(Account account) {
        List<Folder> folders = mMapAccountFolders.get(account.name);
        if (folders == null) {
            folders = new ArrayList<Folder>();
        }
        return folders;
    }
}
