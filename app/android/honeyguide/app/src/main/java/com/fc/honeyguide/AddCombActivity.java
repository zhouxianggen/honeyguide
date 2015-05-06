package com.fc.honeyguide;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarActivity;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.View.OnClickListener;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.fc.honeyguide.define.Comb;
import com.fc.honeyguide.util.ImageLoadTask;

import java.util.ArrayList;
import java.util.List;

public class AddCombActivity extends ActionBarActivity {
    private static final String TAG = "AddCombActivity";
    private Comb mComb = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.add_comb);
        initializeActionBar();

        mComb = ((MyApplication)getApplicationContext()).getCombManager().createComb();
        if (mComb == null) {
            Toast.makeText(getApplicationContext(),
                    getString(R.string.error_create_comb_failed), Toast.LENGTH_SHORT).show();
            finish();
        }

        Button buttonFinish = (Button) findViewById(R.id.action_finish);
        buttonFinish.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                String error = mComb.check();
                if (error.isEmpty()) {
                    finish();
                } else {
                    Toast.makeText(getApplicationContext(), error, Toast.LENGTH_SHORT).show();
                }
            }
        });

        EditText editText = (EditText) findViewById(R.id.title);
        editText.addTextChangedListener(new TextWatcher() {
            @Override
            public void afterTextChanged(Editable s) {
                mComb.title = s.toString();
            }
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
            }
        });

        Button buttonSetLinkers = (Button) findViewById(R.id.set_linkers);
        buttonSetLinkers.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent intent = new Intent(AddCombActivity.this, SelectLinkersActivity.class);
                intent.putExtra(getString(R.string.EXTRA_BEE_ID), mComb.beeId);
                intent.putExtra(getString(R.string.EXTRA_COMB_ID), mComb.id);
                startActivityForResult(intent, 1);
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 1) {
            if (resultCode == RESULT_OK) {
                Bundle extras = data.getExtras();
                if (extras != null) {
                }
            }
        }
    }

    private void initializeActionBar() {
        ActionBar actionBar = getSupportActionBar();
        actionBar.setDisplayShowCustomEnabled(true);
        actionBar.setCustomView(R.layout.actionbar_add_comb);
        actionBar.setDisplayHomeAsUpEnabled(true);
        View customView = actionBar.getCustomView();
        TextView textView = (TextView) customView.findViewById(R.id.title);
        textView.setText("添加新密");
    }
}
