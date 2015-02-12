package com.honeyguide.fc.honeyguide;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.honeyguide.fc.honeyguide.localmanager.AccountManager;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Administrator on 2015/2/2.
 */
public class AddCombActivity extends ActionbarActivity {
    private Context mContext;
    private LayoutInflater mLayoutInflater;
    private LinkerListAdapter mAdapter;
    private LinkerListHandler mHandler = new LinkerListHandler();
    private AccountManager mAccountManager;

    class LinkerListHandler extends Handler {
        public void refreshTitle() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    mActionBarTitle.setText(getString(R.string.new_comb_actionbar_title));
                }
            });
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mActionBarTitle.setText(getString(R.string.new_comb_actionbar_title));
        mActionBarAction.setText(getString(R.string.new_comb_actionbar_action_finish));
        setContentView(R.layout.add_comb);

        mActionBarAction.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                // 生成二维码
            }
        });

        mLayoutInflater = getLayoutInflater();
        mContext = this;

        mAccountManager = new AccountManager(mContext);
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
        mAdapter = new LinkerListAdapter(mContext);

        mAdapter.mLinkers = mAccountManager.getCurrentAccount().get
        mAccount = mAccountManager.getCurrentAccount();
        mAdapter.mFolders = mAccount.getFolders();
        setListAdapter(mAdapter);
    }

    class LinkerListAdapter extends BaseAdapter {
        private Context mContext;
        private List<Linker> mLinkers = new ArrayList<Linker>();

        public LinkerListAdapter(Context context) {
            mContext = context;
        }

        @Override
        public int getCount() {
            return mLinkers.size();
        }

        @Override
        public Object getItem(int position) {
            return mLinkers.get(position);
        }

        @Override
        public long getItemId(int position) {
            return mLinkers.get(position).title.hashCode();
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View view;
            if (convertView != null) {
                view = convertView;
            }
            else {
                view = mLayoutInflater.inflate(R.layout.linker_grid_item, parent, false);
            }

            LinkerViewHolder holder = (LinkerViewHolder) view.getTag();
            if (holder == null) {
                holder = new LinkerViewHolder();
                holder.linker = (LinearLayout) view.findViewById(R.id.linker);
                holder.linkerIcon = (ImageView) view.findViewById(R.id.linker_icon);
                holder.linkerTitle = (TextView) view.findViewById(R.id.linker_title);
                view.setTag(holder);
            }

            Linker linker = (Linker) getItem(position);
            if (linker.selected) {
                holder.linker.setBackgroundColor(getResources().getColor(R.color.linker_grid_item_selected_background));
            }
            else {
                holder.linker.setBackgroundColor(getResources().getColor(R.color.linker_grid_item_unselected_background));
            }
            holder.linkerIcon.setImageURI(Uri.parse(linker.icon));
            holder.linkerTitle.setText(linker.title);

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

    static class LinkerViewHolder {
        public LinearLayout linker;
        public ImageView linkerIcon;
        public TextView linkerTitle;
    }
}
