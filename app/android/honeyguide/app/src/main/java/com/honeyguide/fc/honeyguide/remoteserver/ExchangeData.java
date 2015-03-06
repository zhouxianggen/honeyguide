package com.honeyguide.fc.honeyguide.remoteserver;

import com.honeyguide.fc.honeyguide.Linker;

import java.util.List;

/**
 * Created by Administrator on 2015/2/11.
 */
public class ExchangeData {
    public String timestamp;
    List<Linker> byTimestampLinkers;

    public String serializeToString() {
        return "";
    }

    public boolean parseFromString(String str) {
        return true;
    }
}
