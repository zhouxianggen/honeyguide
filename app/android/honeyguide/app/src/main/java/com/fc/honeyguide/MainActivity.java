package com.fc.honeyguide;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.app.Fragment;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.View;
import android.widget.ImageButton;
import android.widget.RadioGroup;

public class MainActivity extends ActionBarActivity {
    private static final String TAG = "MainActivity";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        initializeActionBar();

        Log.d(TAG, "setOnCheckedChangeListener");
        RadioGroup radioGroup = (RadioGroup) findViewById(R.id.footer);
        radioGroup.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                Log.d(TAG, "onCheckedChanged " + checkedId);
                FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
                Fragment fragment = null;
                switch (checkedId) {
                    case R.id.selector_created:
                        fragment = new CreatedCombListFragment();
                        break;
                    case R.id.selector_collected:
                        fragment = new CollectedCombListFragment();
                        break;
                    default:
                        break;
                }
                if (fragment != null) {
                    transaction.replace(R.id.content, fragment);
                    transaction.addToBackStack(null);
                    transaction.commit();
                }
            }
        });

        if (findViewById(R.id.content) != null) {

            // if we're being restored from a previous state,
            // then we don't need to do anything and should return or else
            // we could end up with overlapping fragments.
            if (savedInstanceState != null) {
                Log.d(TAG, "savedInstanceState not null");
                return;
            }

            Log.d(TAG, "start created comb list fragment");
            CreatedCombListFragment fragment = new CreatedCombListFragment();
            fragment.setArguments(getIntent().getExtras());
            getSupportFragmentManager().beginTransaction().add(R.id.content, fragment).commit();
        }
    }

    private void initializeActionBar() {
        ActionBar actionBar = getSupportActionBar();
        actionBar.setDisplayShowCustomEnabled(true);
        actionBar.setCustomView(R.layout.actionbar_main);

        View customView = actionBar.getCustomView();
        ImageButton buttonScan = (ImageButton)customView.findViewById(
                R.id.action_scan);
        buttonScan.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                //Intent intent = new Intent(MainActivity.this, AddCombActivity.class);
                //startActivityForResult(intent, 1);
            }
        });

        ImageButton buttonAdd = (ImageButton)customView.findViewById(
                R.id.action_add);
        buttonAdd.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, AddCombActivity.class);
                startActivityForResult(intent, 1);
            }
        });
        //actionBar.setDisplayHomeAsUpEnabled(true);
    }

    @Override
    public void onResume() {
        super.onResume();
    }
}
