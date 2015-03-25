package com.honeyguide.fc.honeyguide;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.View.OnClickListener;
import android.widget.BaseAdapter;
import android.widget.Button;
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
 * Created by Administrator on 2015/2/2.
 */
public class AddCombActivity extends ActionbarActivity {
    private static final String TAG = AddCombActivity.class.getSimpleName();
    private Context context;
    private LayoutInflater layoutInflater;
    private ListView linkerListView;
    private TextView hintTextView;
    private LinkerListAdapter linkerListAdapter;
    private LinearLayout selectedLinkersLayout;
    private AddCombHandler handler = new AddCombHandler();
    private Comb newComb;

    class AddCombHandler extends Handler {
        public void onLinkerSelected(final int position) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    hintTextView.setVisibility(View.GONE);
                    Linker linker = (Linker) linkerListAdapter.getItem(position);
                    linkerListAdapter.setLinkerSelected(position);
                    View view = layoutInflater.inflate(R.layout.horizontal_linker_list_item,
                            selectedLinkersLayout, false);
                    view.setTag(linker.id);
                    ImageView imageView = (ImageView) view.findViewById(R.id.icon);
                    new ImageLoadTask(linker.icon, imageView).execute();
                    selectedLinkersLayout.addView(view);
                }
            });
        }
        public void onLinkerDeleted(final int position) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Linker linker = (Linker) linkerListAdapter.getItem(position);
                    linkerListAdapter.setLinkerDeleted(position);
                    View view = selectedLinkersLayout.findViewWithTag(linker.id);
                    selectedLinkersLayout.removeView(view);
                }
            });
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.add_comb2);
        linkerListView = (ListView) findViewById(R.id.linker_list);
        selectedLinkersLayout = (LinearLayout) findViewById(R.id.selected_linkers);
        hintTextView = (TextView) findViewById(R.id.hint);

        actionBarTitle.setText(getString(R.string.actionbar_title_add_comb));
        actionBarAction.setText(getString(R.string.action_finish));
        actionBarAction.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                EditText editText = (EditText) findViewById(R.id.title);
                newComb.title = editText.getText().toString();

                for (int i = 0; i < linkerListAdapter.mLinkers.size(); i++) {
                    if (linkerListAdapter.mLinkers.get(i).selected) {
                        newComb.linkers.add(linkerListAdapter.mLinkers.get(i));
                    }
                }

                if (newComb.title.isEmpty()) {
                    Toast.makeText(context, getString(R.string.error_comb_title_is_empty),
                            Toast.LENGTH_SHORT).show();
                } else if (newComb.linkers.isEmpty()) {
                    Toast.makeText(context, getString(R.string.error_comb_linkers_is_empty),
                            Toast.LENGTH_SHORT).show();
                } else {
                    if (((MyApplication)getApplicationContext()).getCombManager().
                            addNewComb(newComb)) {
                        Log.d(TAG, "start GenerateQRCodeActivity");
                        Intent intent = new Intent(AddCombActivity.this,
                                GenerateQRCodeActivity.class);
                        intent.putExtra(getString(R.string.extras_comb_title), newComb.title);
                        intent.putExtra(getString(R.string.extras_comb_url), newComb.url);
                        startActivity(intent);
                        finish();
                    } else {
                        Toast.makeText(context, getString(R.string.error_comb_server_stopped),
                                Toast.LENGTH_SHORT).show();
                    }
                }
            }
        });

        context = this;
        layoutInflater = getLayoutInflater();

        newComb = new Comb();
        newComb.linkers = new ArrayList<>();
        newComb.publisherId = ((MyApplication)getApplicationContext()).getAccountManager().
                getCurrentAccount().id;
    }

    @Override
    public void onResume() {
        super.onResume();

        if (linkerListAdapter == null) {
            initializeAdapter();
        }
    }

    private void initializeAdapter() {
        linkerListAdapter = new LinkerListAdapter();
        linkerListAdapter.mLinkers = ((MyApplication)getApplicationContext()).
                getLinkerManager().getLinkers();
        linkerListView.setAdapter(linkerListAdapter);
    }

    class LinkerListAdapter extends BaseAdapter {
        private List<Linker> mLinkers = new ArrayList<Linker>();

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
                view = layoutInflater.inflate(R.layout.linker_list_item4, parent, false);
            }

            LinkerViewHolder holder = (LinkerViewHolder) view.getTag();
            if (holder == null) {
                holder = new LinkerViewHolder();
                holder.icon = (ImageView) view.findViewById(R.id.icon);
                holder.title = (TextView) view.findViewById(R.id.title);
                holder.usage = (TextView) view.findViewById(R.id.usage);
                holder.description = (TextView) view.findViewById(R.id.description);
                holder.action = (Button) view.findViewById(R.id.action);
                holder.actionListener = new ButtonOnClickListener();
                holder.action.setOnClickListener(holder.actionListener);
                view.setTag(holder);
            }
            holder.position = position;
            holder.actionListener.position = position;
            refreshView(view);

            return view;
        }

        public void refreshView(View view) {
            LinkerViewHolder holder = (LinkerViewHolder) view.getTag();
            if (holder == null) {
                return;
            }
            Linker linker = (Linker) getItem(holder.position);
            //holder.icon.setImageURI(Uri.parse(linker.icon));
            holder.title.setText(linker.title);
            String usage = String.format("%s %s", linker.combCount, linker.price);
            holder.usage.setText(usage);
            holder.description.setText(linker.description);
            if (linker.selected) {
                holder.action.setText(getString(R.string.add_comb_linker_item_action_delete));
            }
            else {
                holder.action.setText(getString(R.string.add_comb_linker_item_action_add));
            }
            new ImageLoadTask(linker.icon, holder.icon).execute();
        }

        public int getPosition(String linkerId) {
            int position = 0;
            for (; position < mLinkers.size(); position++) {
                if (mLinkers.get(position).id.equals(linkerId)) {
                    break;
                }
            }
            return position;
        }

        public void setLinkerSelected(int position) {
            Linker linker = mLinkers.get(position);
            linker.selected = true;
            View view = linkerListView.getChildAt(position -
                    linkerListView.getFirstVisiblePosition());
            refreshView(view);
        }

        public void setLinkerDeleted(int position) {
            Linker linker = mLinkers.get(position);
            linker.selected = false;
            View view = linkerListView.getChildAt(position -
                    linkerListView.getFirstVisiblePosition());
            refreshView(view);
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

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 1) {
            if (resultCode == RESULT_OK) {
                Bundle extras = data.getExtras();
                if (extras != null) {
                    int position = extras.getInt(getString(R.string.extras_linker_position));
                    handler.onLinkerSelected(position);
                }
            }
        }
    }

    static class LinkerViewHolder {
        public ImageView icon;
        public TextView title;
        public TextView usage;
        public TextView description;
        public Button action;
        public ButtonOnClickListener actionListener;
        public int position;
    }

    class ButtonOnClickListener implements OnClickListener {
        public int position;

        @Override
        public void onClick(View view) {
            Linker linker = (Linker) linkerListAdapter.getItem(position);
            if (linker.selected) {
                handler.onLinkerDeleted(position);
            } else {
                // start edit linker activity
                Intent intent = new Intent(AddCombActivity.this, SetLinkerActivity.class);
                intent.putExtra(getString(R.string.extras_account_id), newComb.publisherId);
                intent.putExtra(getString(R.string.extras_linker_url), linker.url);
                intent.putExtra(getString(R.string.extras_linker_id), linker.id);
                intent.putExtra(getString(R.string.extras_linker_position), position);
                Log.d(TAG, "start SetLinkerActivity");
                startActivityForResult(intent, 1);
            }
        }
    }
}
