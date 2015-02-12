package com.honeyguide.fc.honeyguide.util;

import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;

import java.util.List;

/**
 * Created by Administrator on 2015/2/3.
 */
public class CommonUtils {
    static public String setUrlParams(String url, List<NameValuePair> params) {
        if (!url.endsWith("?")) {
            url += "?";
        }
        return url + URLEncodedUtils.format(params, "utf-8");
    }
}
