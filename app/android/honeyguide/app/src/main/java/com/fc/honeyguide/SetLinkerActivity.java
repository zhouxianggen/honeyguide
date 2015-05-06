package com.fc.honeyguide;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarActivity;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;

public class SetLinkerActivity extends ActionBarActivity {
    private String mLinkerId;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.set_linker);
        initializeActionBar();

        mLinkerId = getIntent().getStringExtra(getString(R.string.EXTRA_LINKER_ID));
        String url = getIntent().getStringExtra(getString(R.string.EXTRA_LINKER_URL));
        WebView webView = (WebView) findViewById(R.id.web_view);
        webView.addJavascriptInterface(new WebAppInterface(), "Android");
        webView.setScrollBarStyle(WebView.SCROLLBARS_OUTSIDE_OVERLAY);
        webView.getSettings().setJavaScriptEnabled(true);
        //webView.getSettings().setSupportZoom(true);
        //webView.getSettings().setBuiltInZoomControls(true);
        webView.loadUrl(url);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
    }

    private void initializeActionBar() {
        ActionBar actionBar = getSupportActionBar();
        actionBar.setDisplayShowCustomEnabled(true);
        actionBar.setCustomView(R.layout.actionbar_common);
        actionBar.setDisplayHomeAsUpEnabled(true);
        View customView = actionBar.getCustomView();
        TextView textView = (TextView) customView.findViewById(R.id.title);
        textView.setText("设置服务");
    }

    public class WebAppInterface {
        @JavascriptInterface
        public void onFinish() {
            Intent intent = new Intent();
            intent.putExtra(getString(R.string.EXTRA_LINKER_ID), mLinkerId);
            setResult(RESULT_OK, intent);
            finish();
        }
    }
}
