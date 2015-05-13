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
import android.widget.Toast;

public class SetLinkerActivity extends ActionBarActivity {
    private String mLinkerId;
    private WebView mWebView;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.set_linker);
        initializeActionBar();

        mLinkerId = getIntent().getStringExtra(getString(R.string.EXTRA_LINKER_ID));
        String url = getIntent().getStringExtra(getString(R.string.EXTRA_LINKER_URL));
        mWebView = (WebView) findViewById(R.id.web_view);
        mWebView.addJavascriptInterface(this, "android");
        mWebView.setScrollBarStyle(WebView.SCROLLBARS_OUTSIDE_OVERLAY);
        mWebView.getSettings().setJavaScriptEnabled(true);
        //mWebView.getSettings().setSupportZoom(true);
        //mWebView.getSettings().setBuiltInZoomControls(true);
        mWebView.loadUrl(url);

        mWebView.setWebViewClient(new WebViewClient() {
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

    @Override
    public void onBackPressed() {
        if (mWebView.canGoBack()) {
            mWebView.goBack();
            return;
        }

        // Otherwise defer to system default behavior.
        super.onBackPressed();
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

    @JavascriptInterface
    public void returnToApp(String error) {
        Toast.makeText(getApplicationContext(), "return " + error, Toast.LENGTH_SHORT).show();
        Intent intent = new Intent(SetLinkerActivity.this, SelectLinkersActivity.class);
        intent.putExtra(getString(R.string.EXTRA_LINKER_ID), mLinkerId);
        setResult(RESULT_OK, intent);
        finish();
    }
}
