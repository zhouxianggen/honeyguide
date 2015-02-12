package com.honeyguide.fc.honeyguide;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;

import com.honeyguide.fc.honeyguide.util.CommonUtils;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import java.util.LinkedList;
import java.util.List;

/**
 * Created by Administrator on 2015/2/3.
 */
public class AddLinkerActivity extends ActionbarActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = getIntent();
        String linker_url = intent.getStringExtra(getString(R.string.EXTRA_LINKER_URL));
        String user_id = intent.getStringExtra(getString(R.string.EXTRA_USER_ID));
        String option = getString(R.string.linker_option_register);
        List<NameValuePair> params = new LinkedList<NameValuePair>();
        params.add(new BasicNameValuePair(getString(R.string.linker_url_param_option), option));
        params.add(new BasicNameValuePair(getString(R.string.linker_url_param_user_id), user_id));
        linker_url = CommonUtils.setUrlParams(linker_url, params);

        mActionBarTitle.setText(getString(R.string.add_linker_actionbar_title));
        mActionBarAction.setText(getString(R.string.add_linker_actionbar_action));
        setContentView(R.layout.add_linker);

        WebView webView = (WebView) findViewById(R.id.linker_web_page);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setSupportZoom(true);
        webView.getSettings().setBuiltInZoomControls(true);
        webView.loadUrl(linker_url);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });
    }
}
