package com.honeyguide.fc.honeyguide.remoteserver;

import com.honeyguide.fc.honeyguide.Linker;
import com.honeyguide.fc.honeyguide.UserContext;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Administrator on 2015/2/3.
 */
public class LinkerServer extends BasicServer {
    public static final String SPLITOR = "\1";

    public List<Linker> getLinkers(UserContext userContext) {
        List<Linker> linkers = new ArrayList<>();
        String data = userContext.serializeToString();
        String response = post(data);
        String[] pieces = response.split(SPLITOR);

        for (int i = 0; i < pieces.length; i++) {
            Linker linker = new Linker();
            if (linker.parseFromString(pieces[i])) {
                linkers.add(linker);
            }
        }
        return linkers;
    }

    public boolean updateLinkers(String timestamp, List<Linker> timestampLinkers) {
        ExchangeContext exchangeContext = new ExchangeContext();
        exchangeContext.timestamp = timestamp;
        exchangeContext.timestampLinkers = timestampLinkers;
        String response = post(exchangeContext.serializeToString());
        if (exchangeContext.parseFromString(response)) {
            timestamp = exchangeContext.timestamp;
            timestampLinkers = exchangeContext.timestampLinkers;
        }
        return true;
    }
}
