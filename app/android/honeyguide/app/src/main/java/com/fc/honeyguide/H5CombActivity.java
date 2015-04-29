package com.fc.honeyguide;

import android.app.ActionBar;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class H5CombActivity extends Activity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.h5_comb);
        initializeActionBar();

        Intent intent = getIntent();
        String combUrl = intent.getStringExtra(getString(R.string.EXTRA_COMB_URL));
        WebView webView = (WebView) findViewById(R.id.h5_comb_view);
        webView.getSettings().setJavaScriptEnabled(true);
        //webView.getSettings().setSupportZoom(true);
        //webView.getSettings().setBuiltInZoomControls(true);
        webView.loadUrl(combUrl);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });
    }

    private void initializeActionBar() {
        ActionBar actionBar = getActionBar();
        actionBar.setDisplayShowCustomEnabled(true);
        actionBar.setCustomView(R.layout.actionbar_h5_comb);
        actionBar.setDisplayHomeAsUpEnabled(true);
    }
}
