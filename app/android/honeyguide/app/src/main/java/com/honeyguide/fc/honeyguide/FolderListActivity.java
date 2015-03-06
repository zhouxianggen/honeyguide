package com.honeyguide.fc.honeyguide;

import android.app.ActionBar;
import android.app.ListActivity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Filterable;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.honeyguide.fc.honeyguide.localmanager.AccountManager;
import com.honeyguide.fc.honeyguide.localmanager.FolderManager;

import java.util.ArrayList;
import java.util.List;
import android.os.Handler;

/**
 * Created by Administrator on 2015/1/27.
 */
public class FolderListActivity extends ListActivity {
    private Context mContext;
    private LayoutInflater mLayoutInflater;
    private ActionBar mActionBar;
    private TextView mActionBarTitle;
    private ListView mFolderList;
    private Account mAccount;
    private AccountManager mAccountManager;
    private FolderListAdapter mAdapter;
    private FolderListHandler mHandler = new FolderListHandler();

    class FolderListHandler extends Handler {
        public void refreshTitle() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    mActionBarTitle.setText(getString(R.string.folder_list_title));
                }
            });
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        initializeActionBar();
        setContentView(R.layout.folder_list);

        mFolderList = getListView();
        mFolderList.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
        mFolderList.setLongClickable(true);
        mFolderList.setFastScrollEnabled(true);
        mFolderList.setScrollingCacheEnabled(false);

        mLayoutInflater = getLayoutInflater();
        mContext = this;
    }

    @Override
    public void onResume() {
        super.onResume();

        if (mAdapter == null) {
            initializeAdapter();
        }

        mHandler.refreshTitle();
    }

    private void initializeAdapter() {
        mAdapter = new FolderListAdapter();
        mAdapter.mFolders = ((MyApplication)getApplicationContext()).getAccountManager().
                getCurrentAccount().getFolders();
        setListAdapter(mAdapter);
    }

    private void restorePreviousAdapterData() {
        final Object previousData = getLastNonConfigurationInstance();
        if (previousData != null) {
            mAdapter.mFolders = (ArrayList<Folder>) previousData;
        }
    }

    private void initializeActionBar() {
        mActionBar = getActionBar();
        mActionBar.setDisplayShowCustomEnabled(true);
        mActionBar.setCustomView(R.layout.actionbar_custom);

        View customView = mActionBar.getCustomView();
        mActionBarTitle = (TextView)customView.findViewById(R.id.actionbar_title);
        mActionBar.setDisplayHomeAsUpEnabled(true);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement

        return super.onOptionsItemSelected(item);
    }

    class FolderListAdapter extends BaseAdapter {
        private List<Folder> mFolders = new ArrayList<Folder>();

        @Override
        public int getCount() {
            return mFolders.size();
        }

        @Override
        public Object getItem(int position) {
            return mFolders.get(position);
        }

        @Override
        public long getItemId(int position) {
            return mFolders.get(position).name.hashCode();
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View view;
            if (convertView != null) {
                view = convertView;
            }
            else {
                view = mLayoutInflater.inflate(R.layout.folder_list_item, parent, false);
            }

            FolderViewHolder holder = (FolderViewHolder) view.getTag();
            if (holder == null) {
                holder = new FolderViewHolder();
                holder.folderListItemWrapper = (LinearLayout) view.findViewById(R.id.folder_list_item_wrapper);
                holder.chip = (View) view.findViewById(R.id.chip);
                holder.folderName = (TextView) view.findViewById(R.id.folder_name);
                holder.folderStatus = (TextView) view.findViewById(R.id.folder_status);
                holder.combCountWrapper = (LinearLayout) view.findViewById(R.id.comb_count_wrapper);
                holder.combCountIcon = (View) view.findViewById(R.id.comb_count_icon);
                holder.combCount = (TextView) view.findViewById(R.id.comb_count);
                view.setTag(holder);
            }

            FolderInfoHolder folder = (FolderInfoHolder) getItem(position);
            if (folder == null) {
                return view;
            }

            holder.folderName.setText(folder.name);
            holder.folderStatus.setText(folder.status);
            holder.combCount.setText(Integer.toString(folder.combCount));

            return view;
        }

        @Override
        public boolean areAllItemsEnabled() {
            return true;
        }

        @Override
        public boolean isEnabled(int position) {
            return true;
        }
    }

    static class FolderViewHolder {
        public LinearLayout folderListItemWrapper;
        public View chip;
        public TextView folderName;
        public TextView folderStatus;
        public LinearLayout combCountWrapper;
        public View combCountIcon;
        public TextView combCount;
    }
}
