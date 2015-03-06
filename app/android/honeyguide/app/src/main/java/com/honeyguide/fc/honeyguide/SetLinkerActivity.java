package com.honeyguide.fc.honeyguide;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.EditText;
import android.widget.LinearLayout;

/**
 * Created by Administrator on 2015/2/27.
 */
public class SetLinkerActivity extends ActionbarActivity {
    private WebView mWebView;
    private SetLinkerHandler mHandler = new SetLinkerHandler();
    private String mLinkerId;
    private int mPosition;

    class SetLinkerHandler extends Handler {
        public void onFinish() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    mActionBarAction.setText(getString(R.string.set_linker_actionbar_action_finish));
                    mActionBarAction.setOnClickListener(new View.OnClickListener() {
                        public void onClick(View v) {
                            Intent intent = new Intent();
                            intent.putExtra(getString(R.string.extras_linker_position), mPosition);
                            intent.putExtra(getString(R.string.extras_linker_id), mLinkerId);
                            setResult(RESULT_OK, intent);
                            finish();
                        }
                    });
                }
            });
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.set_linker);

        mActionBarTitle.setText(getString(R.string.set_linker_actionbar_title));
        mActionBarAction.setText(getString(R.string.set_linker_actionbar_action_help));
        mActionBarAction.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                // display help info
            }
        });

        mWebView = (WebView) findViewById(R.id.webview);
        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        mWebView.addJavascriptInterface(new WebAppInterface(), "Android");
        mWebView.setScrollBarStyle(WebView.SCROLLBARS_OUTSIDE_OVERLAY);

        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            mLinkerId = extras.getString(getString(R.string.extras_linker_id));
            mPosition = extras.getInt(getString(R.string.extras_linker_position));
            String accountId = extras.getString(getString(R.string.extras_account_id));
            String linkerUrl = extras.getString(getString(R.string.extras_linker_url));
            String url = String.format("%s/?action=set&account_id=%s", linkerUrl, accountId);
            //String url = "file:///android_res/raw/linker_sample.html";
            mWebView.loadUrl(url);
        } else {
            Intent intent = new Intent();
            setResult(RESULT_CANCELED, intent);
            finish();
        }
    }

    @Override
    public void onResume() {
        super.onResume();
    }

    public class WebAppInterface {
        @JavascriptInterface
        public void onFinish() {
            mHandler.onFinish();
        }
    }
}
