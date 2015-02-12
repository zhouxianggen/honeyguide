package com.honeyguide.fc.honeyguide;

import android.app.ActionBar;
import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

/**
 * Created by Administrator on 2015/2/3.
 */
public class ActionbarActivity extends Activity {
    protected ActionBar mActionBar;
    protected TextView mActionBarTitle;
    protected Button mActionBarAction;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        initializeActionBar();
    }

    private void initializeActionBar() {
        mActionBar = getActionBar();
        mActionBar.setDisplayShowCustomEnabled(true);
        mActionBar.setCustomView(R.layout.actionbar_custom);

        View customView = mActionBar.getCustomView();
        mActionBarTitle = (TextView)customView.findViewById(R.id.actionbar_title);
        mActionBarAction = (Button)customView.findViewById(R.id.actionbar_action);
        mActionBar.setDisplayHomeAsUpEnabled(true);
    }
}
