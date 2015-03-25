package com.honeyguide.fc.honeyguide;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.BaseAdapter;
import android.widget.ListView;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Administrator on 2015/1/27.
 */
public class FolderListActivity extends ActionbarActivity {
    private Context context;
    private LayoutInflater layoutInflater;
    private ListView folderListView;
    private FolderListAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.folder_list);

        actionBarTitle.setText(getString(R.string.actionbar_title_folder_list));
        actionBarAction.setText(getString(R.string.action_add_folder));

        folderListView = (ListView) findViewById(R.id.folder_list);
        folderListView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
        folderListView.setLongClickable(true);
        folderListView.setFastScrollEnabled(true);
        folderListView.setScrollingCacheEnabled(false);
        folderListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Intent intent = new Intent(FolderListActivity.this, CombListActivity.class);
                Folder folder = (Folder) adapter.getItem(position);
                intent.putExtra(getString(R.string.extras_folder_title), folder.title);
                startActivity(intent);
            }
        });

        layoutInflater = getLayoutInflater();
        context = this;
    }

    @Override
    public void onResume() {
        super.onResume();

        if (adapter == null) {
            initializeAdapter();
        }
    }

    private void initializeAdapter() {
        adapter = new FolderListAdapter();
        adapter.folders = ((MyApplication)getApplicationContext()).getAccountManager().
                getCurrentAccount().getFolders();
        folderListView.setAdapter(adapter);
    }

    class FolderListAdapter extends BaseAdapter {
        private List<Folder> folders = new ArrayList<>();

        @Override
        public int getCount() {
            return folders.size();
        }

        @Override
        public Object getItem(int position) {
            return folders.get(position);
        }

        @Override
        public long getItemId(int position) {
            return folders.get(position).title.hashCode();
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View view;
            if (convertView != null) {
                view = convertView;
            }
            else {
                view = layoutInflater.inflate(R.layout.folder_list_item2, parent, false);
            }

            FolderViewHolder holder = (FolderViewHolder) view.getTag();
            if (holder == null) {
                holder = new FolderViewHolder();
                holder.chip = view.findViewById(R.id.chip);
                holder.title = (TextView) view.findViewById(R.id.title);
                holder.combCount = (TextView) view.findViewById(R.id.comb_count);
                view.setTag(holder);
            }
            holder.position = position;
            refreshView(view);

            return view;
        }

        public void refreshView(View view) {
            FolderViewHolder holder = (FolderViewHolder) view.getTag();
            if (holder == null) {
                return;
            }
            Folder folder = (Folder) getItem(holder.position);
            holder.title.setText(folder.title);
            holder.combCount.setText(folder.combCount);
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
        public View chip;
        public TextView title;
        public TextView combCount;
        public int position;
    }
}
