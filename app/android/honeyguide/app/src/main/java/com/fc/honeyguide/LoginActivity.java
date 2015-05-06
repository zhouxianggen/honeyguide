package com.fc.honeyguide;

import android.support.v7.app.ActionBar;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.fc.honeyguide.define.Account;
import com.fc.honeyguide.manager.AccountManager;

public class LoginActivity extends ActionBarActivity {
    private static final String TAG = "LoginActivity";
    private Handler mHandler = new Handler();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login);
        initializeActionBar();

        Account account = ((MyApplication)getApplicationContext()).getAccountManager().
                getCurrentAccount();
        if (account != null) {
            Intent intent = new Intent(LoginActivity.this, MainActivity.class);
            startActivity(intent);
        }

        TextView register = (TextView) findViewById(R.id.register);
        register.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(LoginActivity.this, RegisterActivity.class);
                startActivity(intent);
            }
        });

        Button login = (Button) findViewById(R.id.login);
        login.setOnClickListener(new View.OnClickListener() {
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
                        final String result = manager.login(username, password);
                        mHandler.post(new Runnable() {
                            public void run() {
                                Log.d(TAG, "login result is " + result);
                                if (!result.isEmpty()) {
                                    Toast.makeText(context, result, Toast.LENGTH_SHORT).show();
                                    return;
                                }
                                Intent intent = new Intent(LoginActivity.this, MainActivity.class);
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
        textView.setText("登陆");
    }
}
