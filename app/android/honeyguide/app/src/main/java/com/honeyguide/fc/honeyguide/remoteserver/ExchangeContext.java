package com.honeyguide.fc.honeyguide.remoteserver;

import com.honeyguide.fc.honeyguide.Linker;

import java.util.List;

/**
 * Created by Administrator on 2015/2/11.
 */
public class ExchangeContext {
    public String timestamp;
    List<Linker> timestampLinkers;

    public String serializeToString() {
        return "";
    }

    public boolean parseFromString(String str) {
        return true;
    }
}
