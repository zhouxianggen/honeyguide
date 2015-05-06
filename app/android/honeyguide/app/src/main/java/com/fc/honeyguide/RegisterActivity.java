package com.fc.honeyguide;

import android.support.v7.app.ActionBar;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.support.v7.app.ActionBarActivity;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.fc.honeyguide.manager.AccountManager;

public class RegisterActivity extends ActionBarActivity {
    private Handler mHandler = new Handler();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().requestFeature(Window.FEATURE_ACTION_BAR);
        setContentView(R.layout.register);
        initializeActionBar();

        Button button = (Button) findViewById(R.id.register);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final String username = ((TextView)findViewById(R.id.username)).getText().
                        toString();
                final String password = ((TextView)findViewById(R.id.password)).getText().
                        toString();

                new Thread(new Runnable() {
                    public void run() {
                        final Context context = getApplicationContext();
                        AccountManager manager = ((MyApplication)context).getAccountManager();
                        final String result = manager.register(username, password);
                        mHandler.post(new Runnable() {
                            public void run() {
                                if (!result.isEmpty()) {
                                    Toast.makeText(context, result, Toast.LENGTH_SHORT).show();
                                    return;
                                }
                                Intent intent = new Intent(RegisterActivity.this, MainActivity.class);
                                startActivity(intent);
                            }
                        });
                    }
                }).start();
            }
        });
    }

    private void initializeActionBar() {
        ActionBar actionBar = getSupportActionBar();
        actionBar.setDisplayShowCustomEnabled(true);
        actionBar.setCustomView(R.layout.actionbar_common);
        actionBar.setDisplayHomeAsUpEnabled(true);
        View customView = actionBar.getCustomView();
        TextView textView = (TextView) customView.findViewById(R.id.title);
        textView.setText("注册");
    }
}
