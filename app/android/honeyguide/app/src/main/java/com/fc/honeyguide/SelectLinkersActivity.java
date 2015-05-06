package com.fc.honeyguide;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.fc.honeyguide.define.Account;
import com.fc.honeyguide.define.Comb;
import com.fc.honeyguide.define.Linker;
import com.fc.honeyguide.util.ImageLoadTask;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class SelectLinkersActivity extends ActionBarActivity {
    private static final String TAG = "SelectLinkersActivity";
    private LinkerListAdapter mListAdapter = null;
    private ListView mListView;
    private Handler mHandler = new Handler();
    private String mCombId;
    private String mBeeId;
    private List<Linker> mSelectedLinkers = new ArrayList<>();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.linker_list);
        initializeActionBar();
        mListView = (ListView) findViewById(R.id.linker_list);

        Bundle extras = getIntent().getExtras();
        if (extras == null) {
            finish();
        }
        mCombId = extras.getString(getString(R.string.EXTRA_COMB_ID));
        mBeeId = extras.getString(getString(R.string.EXTRA_BEE_ID));

        Button buttonFinish = (Button) findViewById(R.id.action_finish);
        buttonFinish.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent intent = new Intent();
                //intent.putExtra(getString(R.string.extras_linker_position), mPosition);
                //intent.putExtra(getString(R.string.extras_linker_id), mLinkerId);
                setResult(RESULT_OK, intent);
                finish();
            }
        });

        mListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Linker linker = (Linker) mListAdapter.getItem(position);
                if (linker.selected == false) {
                    Intent intent = new Intent(SelectLinkersActivity.this,
                            SetLinkerActivity.class);
                    String url = String.format("%scomb=%s&bee=%s",
                            linker.url, mCombId, mBeeId);
                    intent.putExtra(getString(R.string.EXTRA_LINKER_URL), url);
                    intent.putExtra(getString(R.string.EXTRA_LINKER_ID), url);
                    startActivityForResult(intent, 1);
                }
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        Log.d(TAG, "onResume");
        if (mListAdapter == null) {
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
                    String linkerId = extras.getString(getString(R.string.EXTRA_LINKER_ID));
                    setLinkerSelected(linkerId);
                }
            }
        }
    }

    private void initializeActionBar() {
        ActionBar actionBar = getSupportActionBar();
        actionBar.setDisplayShowCustomEnabled(true);
        actionBar.setCustomView(R.layout.actionbar_select_linkers);
        actionBar.setDisplayHomeAsUpEnabled(true);
        View customView = actionBar.getCustomView();
        TextView textView = (TextView) customView.findViewById(R.id.title);
        textView.setText("选择服务");
    }

    private void setLinkerSelected(String linkerId) {
        for (int i = 0; i < mListAdapter.getCount(); i++) {
            Linker linker = (Linker) mListAdapter.getItem(i);
            if (linker.id.equals(linkerId)) {
                linker.selected = true;
                mListAdapter.refreshView(mListView.getChildAt(
                        i - mListView.getFirstVisiblePosition()));
                break;
            }
        }
    }

    private void initializeAdapter() {
        new Thread(new Runnable() {
            public void run() {
                final Context context = getApplicationContext();
                final List<Linker> linkers = new ArrayList<>();
                final String error = ((MyApplication)getApplicationContext()).getLinkerManager().
                        getLinkers(linkers);
                mHandler.post(new Runnable() {
                    public void run() {
                        if (error.isEmpty()) {
                            mListAdapter = new LinkerListAdapter();
                            mListAdapter.linkers = linkers;
                            mListView.setAdapter(mListAdapter);
                        } else {
                            Toast.makeText(context, error, Toast.LENGTH_SHORT).show();
                        }
                    }
                });
            }
        }).start();
    }

    class LinkerListAdapter extends BaseAdapter {
        private List<Linker> linkers = new ArrayList<>();

        @Override
        public int getCount() {
            return linkers.size();
        }

        @Override
        public Object getItem(int position) {
            return linkers.get(position);
        }

        @Override
        public long getItemId(int position) {
            return linkers.get(position).title.hashCode();
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View view;
            if (convertView != null) {
                view = convertView;
            }
            else {
                view = getLayoutInflater().inflate(R.layout.linker_list_item, parent, false);
            }

            LinkerListItemViewHolder holder = (LinkerListItemViewHolder) view.getTag();
            if (holder == null) {
                holder = new LinkerListItemViewHolder();
                holder.icon = (ImageView) view.findViewById(R.id.icon);
                holder.title = (TextView) view.findViewById(R.id.title);
                holder.description = (TextView) view.findViewById(R.id.description);
                holder.clickCount = (TextView) view.findViewById(R.id.click_count);
                holder.price = (TextView) view.findViewById(R.id.price);
                holder.actionDelete = (Button) view.findViewById(R.id.action_delete);
                holder.actionDeleteOnClickListener = new ActionDeleteOnClickListener();
                holder.actionDelete.setOnClickListener(holder.actionDeleteOnClickListener);
                view.setTag(holder);
            }
            holder.position = position;
            holder.actionDeleteOnClickListener.position = position;
            refreshView(view);

            return view;
        }

        public void refreshView(View view) {
            LinkerListItemViewHolder holder = (LinkerListItemViewHolder) view.getTag();
            if (holder == null) {
                return;
            }
            Linker linker = (Linker) getItem(holder.position);
            new ImageLoadTask(linker.icon, holder.icon).execute();
            holder.title.setText(linker.title);
            holder.description.setText(linker.description);
            holder.clickCount.setText(String.valueOf(linker.clickCount));
            holder.price.setText(String.valueOf(linker.price));
            if (linker.selected) {
                holder.actionDelete.setVisibility(View.VISIBLE);
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

    static class LinkerListItemViewHolder {
        public ImageView icon;
        public TextView title;
        public TextView description;
        public TextView clickCount;
        public TextView price;
        public Button actionDelete;
        public int position;
        public ActionDeleteOnClickListener actionDeleteOnClickListener;
    }

    class ActionDeleteOnClickListener implements View.OnClickListener {
        public int position;

        @Override
        public void onClick(View view) {
            Linker linker = (Linker) mListAdapter.getItem(position);
            linker.selected = false;
            mListAdapter.refreshView(mListView.getChildAt(
                    position - mListView.getFirstVisiblePosition()));
        }
    }
}
