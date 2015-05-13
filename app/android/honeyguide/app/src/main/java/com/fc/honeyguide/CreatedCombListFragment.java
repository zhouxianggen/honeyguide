package com.fc.honeyguide;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.fc.honeyguide.define.Account;
import com.fc.honeyguide.define.Comb;
import com.fc.honeyguide.define.Linker;
import com.fc.honeyguide.manager.AccountManager;
import com.fc.honeyguide.util.ImageLoadTask;

import java.util.ArrayList;
import java.util.List;

public class CreatedCombListFragment extends Fragment {
    private static final String TAG = "CreatedCombListFragment";
    private static final int VISIT_H5_COMB_REQUEST = 1;
    private static final int GENERATE_QR_CODE_REQUEST = 2;
    private CreatedCombListAdapter mListAdapter;
    private ListView mListView;
    private Handler mHandler = new Handler();

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        Log.d(TAG, "onCreateView");
        View view = inflater.inflate(R.layout.comb_list, container, false);
        mListView = (ListView) view.findViewById(R.id.comb_list);
        mListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Intent intent = new Intent(getActivity(), H5CombActivity.class);
                Account account = ((MyApplication)getActivity().getApplicationContext()).
                        getAccountManager().getCurrentAccount();
                Comb comb = mListAdapter.combs.get(position);
                String url = String.format("%s&bee=%s", comb.url, account.id);
                intent.putExtra(getString(R.string.EXTRA_COMB_URL), url);
                intent.putExtra(getString(R.string.EXTRA_COMB_TITLE), comb.title);
                startActivityForResult(intent, VISIT_H5_COMB_REQUEST);
            }
        });

        mListAdapter = new CreatedCombListAdapter();
        mListView.setAdapter(mListAdapter);

        return view;
    }

    @Override
    public void onResume() {
        super.onResume();
        Log.d(TAG, "onResume");
        updateAdapter();
    }

    private void updateAdapter() {
        new Thread(new Runnable() {
            public void run() {
                final Context context = getActivity().getApplicationContext();
                final List<Comb> combs = new ArrayList<>();
                final String error = ((MyApplication)getActivity().getApplicationContext()).
                        getCombManager().getCreatedCombs(combs);
                mHandler.post(new Runnable() {
                    public void run() {
                        if (error.isEmpty()) {
                            mListAdapter.combs = combs;
                            mListAdapter.notifyDataSetChanged();
                        } else {
                            Toast.makeText(context, error, Toast.LENGTH_SHORT).show();
                        }
                    }
                });
            }
        }).start();
    }

    class CreatedCombListAdapter extends CombListAdapter {
        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View view;
            if (convertView != null) {
                view = convertView;
            }
            else {
                view = getActivity().getLayoutInflater().inflate(
                        R.layout.created_comb_list_item, parent, false);
            }

            CombViewHolder holder = (CombViewHolder) view.getTag();
            if (holder == null) {
                holder = new CombViewHolder();
                holder.icon = (ImageView) view.findViewById(R.id.comb_icon);
                holder.title = (TextView) view.findViewById(R.id.comb_title);
                holder.waggleCount = (TextView) view.findViewById(R.id.waggle_count);
                holder.tasteCount = (TextView) view.findViewById(R.id.taste_count);
                holder.generateQRCode = (ImageButton) view.findViewById(R.id.generate_qr_code);
                holder.generateQRCodeOnClickListener = new GenerateQRCodeOnClickListener();
                holder.generateQRCode.setOnClickListener(
                        holder.generateQRCodeOnClickListener);
                view.setTag(holder);
            }
            holder.position = position;
            holder.generateQRCodeOnClickListener.position = position;
            refreshView(view);

            return view;
        }

        public void refreshView(View view) {
            CombViewHolder holder = (CombViewHolder) view.getTag();
            if (holder == null) {
                return;
            }
            Comb comb = (Comb) getItem(holder.position);
            new ImageLoadTask(comb.icon, holder.icon).execute();
            holder.title.setText(comb.title);
            holder.waggleCount.setText(String.valueOf(comb.waggleCount));
            holder.tasteCount.setText(String.valueOf(comb.tasteCount));
        }
    }

    static class CombViewHolder {
        public ImageView icon;
        public TextView title;
        public TextView waggleCount;
        public TextView tasteCount;
        public ImageButton generateQRCode;
        public GenerateQRCodeOnClickListener generateQRCodeOnClickListener;
        public int position;
    }

    class GenerateQRCodeOnClickListener implements View.OnClickListener {
        public int position;

        @Override
        public void onClick(View view) {
            Log.d(TAG, "start GenerateQRCodeActivity");
            Comb comb = (Comb) mListAdapter.getItem(position);
            Intent intent = new Intent(getActivity(), GenerateQRCodeActivity.class);
            intent.putExtra(getString(R.string.EXTRA_COMB_TITLE), comb.title);
            intent.putExtra(getString(R.string.EXTRA_COMB_URL), comb.url);
            startActivityForResult(intent, GENERATE_QR_CODE_REQUEST);
        }
    }
}
