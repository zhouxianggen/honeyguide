package com.honeyguide.fc.honeyguide;

import com.honeyguide.fc.honeyguide.util.PVTable;

import java.util.List;

/**
 * Created by Administrator on 2015/1/28.
 */
public class Comb {
    public String id;
    public String publisherId;
    public String title;
    public String position;
    public boolean enableShare;
    public List<Linker> linkers;
    public PVTable<Integer> pv;
    public String url;
}
