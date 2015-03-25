package com.honeyguide.fc.honeyguide;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.honeyguide.fc.honeyguide.util.ImageLoadTask;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Administrator on 2015/3/9.
 */
public class CombListActivity extends ActionbarActivity {
    private static final String TAG = CombListActivity.class.getSimpleName();
    private Context context;
    private LayoutInflater layoutInflater;
    private ListView combListView;
    private CombListAdapter adapter;
    private String folderTitle;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.comb_list);
        combListView = (ListView) findViewById(R.id.comb_list);
        combListView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
        combListView.setLongClickable(true);
        combListView.setFastScrollEnabled(true);
        combListView.setScrollingCacheEnabled(false);

        actionBarTitle.setText(getString(R.string.actionbar_title_comb_list));
        actionBarAction.setText(getString(R.string.action_add));
        actionBarAction.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent intent = new Intent(CombListActivity.this, AddCombActivity.class);
                intent.putExtra(getString(R.string.extras_folder_title), folderTitle);
                startActivityForResult(intent, 1);
            }
        });

        Bundle extras = getIntent().getExtras();
        if (extras == null) {
            finish();
        }
        folderTitle = extras.getString(getString(R.string.extras_folder_title), "");
        if (folderTitle.isEmpty()) {
            finish();
        }
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

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 1) {
            if (resultCode == RESULT_OK) {
                Bundle extras = data.getExtras();
                if (extras != null) {
                    // do something here
                }
            }
        }
    }

    private void initializeAdapter() {
        adapter = new CombListAdapter();
        adapter.combs = ((MyApplication)getApplicationContext()).
                getCombManager().getCombs(folderTitle);
        combListView.setAdapter(adapter);
    }

    class CombListAdapter extends BaseAdapter {
        private List<Comb> combs = new ArrayList<Comb>();

        @Override
        public int getCount() {
            return combs.size();
        }

        @Override
        public Object getItem(int position) {
            return combs.get(position);
        }

        @Override
        public long getItemId(int position) {
            return combs.get(position).title.hashCode();
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View view;
            if (convertView != null) {
                view = convertView;
            }
            else {
                view = layoutInflater.inflate(R.layout.comb_list_item, parent, false);
            }

            CombViewHolder holder = (CombViewHolder) view.getTag();
            if (holder == null) {
                holder = new CombViewHolder();
                holder.icon = (ImageView) view.findViewById(R.id.icon);
                holder.new_share_count = (TextView) view.findViewById(R.id.new_share_count);
                holder.title = (TextView) view.findViewById(R.id.title);
                holder.linkers = (LinearLayout) view.findViewById(R.id.linkers);
                view.setTag(holder);
            }
            holder.position = position;
            refreshView(view);

            return view;
        }

        public void refreshView(View view) {
            CombViewHolder holder = (CombViewHolder) view.getTag();
            if (holder == null) {
                return;
            }
            Comb comb = (Comb) getItem(holder.position);
            //new ImageLoadTask(comb.getLatestShare(), holder.icon).execute();
            holder.title.setText(comb.title);
            holder.new_share_count.setText(comb.newShareCount);
            // show linkers
            for (int i = 0; i < comb.linkers.size(); i++) {
                Linker linker = comb.linkers.get(i);
                View view1 = layoutInflater.inflate(R.layout.horizontal_linker_list_item2,
                        holder.linkers, false);
                ImageView imageView = (ImageView) view1.findViewById(R.id.icon);
                new ImageLoadTask(linker.icon, imageView).execute();
                TextView textView = (TextView) view1.findViewById(R.id.taste_count);
                textView.setText(linker.tasteCount);
                holder.linkers.addView(view1);
            }
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

    static class CombViewHolder {
        public ImageView icon;
        public TextView new_share_count;
        public TextView title;
        public LinearLayout linkers;
        public int position;
    }
}
