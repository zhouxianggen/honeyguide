package com.fc.honeyguide;

import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;

import com.fc.honeyguide.define.Comb;

import java.util.ArrayList;
import java.util.List;

public class CombListAdapter extends BaseAdapter {
    public List<Comb> combs = new ArrayList<>();

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
        return null;
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
