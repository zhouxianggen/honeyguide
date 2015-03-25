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
    protected ActionBar actionBar;
    protected TextView actionBarTitle;
    protected Button actionBarAction;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        initializeActionBar();
    }

    private void initializeActionBar() {
        actionBar = getActionBar();
        actionBar.setDisplayShowCustomEnabled(true);
        actionBar.setCustomView(R.layout.actionbar_custom);

        View customView = actionBar.getCustomView();
        actionBarTitle = (TextView)customView.findViewById(R.id.actionbar_title);
        actionBarAction = (Button)customView.findViewById(R.id.actionbar_action);
        actionBar.setDisplayHomeAsUpEnabled(true);
    }
}
