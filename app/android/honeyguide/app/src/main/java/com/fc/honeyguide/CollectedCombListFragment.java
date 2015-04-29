package com.fc.honeyguide;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import com.fc.honeyguide.define.Comb;
import com.fc.honeyguide.util.ImageLoadTask;

public class CollectedCombListFragment extends Fragment {
    private CreatedCombListAdapter mListAdapter;
    private ListView mListView;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.comb_list, container, false);
        mListView = (ListView) view.findViewById(R.id.comb_list);
        mListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Intent intent = new Intent(getActivity(), H5CombActivity.class);
                intent.putExtra(getString(R.string.EXTRA_COMB_URL),
                        mListAdapter.combs.get(position).url);
                startActivityForResult(intent, 1);
            }
        });
        return view;
    }

    @Override
    public void onResume() {
        super.onResume();

        if (mListAdapter == null) {
            initializeAdapter();
        }
    }

    private void initializeAdapter() {
        mListAdapter = new CreatedCombListAdapter();
        mListAdapter.combs = ((MyApplication)getActivity().getApplicationContext()).
                getCombManager().getCreatedCombs();
        mListView.setAdapter(mListAdapter);
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
            new ImageLoadTask(comb.icon, holder.icon).execute();
            holder.title.setText(comb.title);
            holder.waggleCount.setText(comb.waggleCount);
            holder.tasteCount.setText(comb.tasteCount);
        }
    }

    static class CombViewHolder {
        public ImageView icon;
        public TextView title;
        public TextView waggleCount;
        public TextView tasteCount;
        public int position;
    }
}
