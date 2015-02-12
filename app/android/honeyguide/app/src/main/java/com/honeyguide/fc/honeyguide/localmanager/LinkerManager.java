package com.honeyguide.fc.honeyguide.localmanager;

import android.content.Context;
import android.content.SharedPreferences;

import com.honeyguide.fc.honeyguide.Account;
import com.honeyguide.fc.honeyguide.Linker;
import com.honeyguide.fc.honeyguide.R;
import com.honeyguide.fc.honeyguide.remoteserver.AccountServer;
import com.honeyguide.fc.honeyguide.remoteserver.LinkerServer;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2015/2/11.
 */
public class LinkerManager {
    private Context mContext;
    private SharedPreferences mRef;
    private LinkerServer mLinkerServer;
    private String mTimestamp;
    private List<Linker> mTimestampLinkers;

    public LinkerManager(Context context) {
        mContext = context;
        mRef = context.getSharedPreferences(
                context.getString(R.string.linker_manager_preference_file_key), Context.MODE_PRIVATE);

        mLinkerServer = new LinkerServer();
        mLinkerServer.setRemoteServerAddress(context.getString(R.string.linker_manager_remote_server_url));

        mTimestamp = "";
        mTimestampLinkers = new ArrayList<>();
    }

    public List<Linker> getLinkers(Account currentAccount) {
        List<Linker> linkers = new ArrayList<>();
        return linkers;
    }

    public List<Linker> searchLinkers(Account currentAccount, String query) {
        List<Linker> linkers = new ArrayList<>();
        return linkers;
    }

    public String updateLinkers() {
        return "";
    }
}
