package com.honeyguide.fc.honeyguide.util;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Administrator on 2015/2/3.
 */
public class KeyValueParser {
    private static final String DEFAULT_ITEM_DELIM = "\2";
    private static final String DEFAULT_PAIR_DELIM = "\3";
    private Map<String, String> mKV = new HashMap<>();

    public boolean parse(String str) {
        return parse(str, DEFAULT_ITEM_DELIM, DEFAULT_PAIR_DELIM);
    }

    public boolean parse(String str, String itemDelim, String pairDelim) {
        mKV.clear();
        String[] items = str.split(itemDelim);
        for (int i = 0; i < items.length; i++) {
            String[] tuple = items[i].split(pairDelim);
            if (tuple.length == 2) {
                mKV.put(tuple[0], tuple[1]);
                continue;
            }
            return false;
        }
        return true;
    }

    public String get(String key) {
        return mKV.get(key);
    }

}
