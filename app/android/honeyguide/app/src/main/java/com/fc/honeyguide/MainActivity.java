package com.fc.honeyguide;

import android.app.ActionBar;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.app.Fragment;
import android.view.View;
import android.widget.ImageButton;
import android.widget.RadioGroup;

public class MainActivity extends FragmentActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        initializeActionBar();

        if (findViewById(R.id.content) != null) {

            // if we're being restored from a previous state,
            // then we don't need to do anything and should return or else
            // we could end up with overlapping fragments.
            if (savedInstanceState != null) {
                return;
            }

            CreatedCombListFragment fragment = new CreatedCombListFragment();
            fragment.setArguments(getIntent().getExtras());
            getSupportFragmentManager().beginTransaction().add(R.id.content, fragment).commit();
        }

        RadioGroup radioGroup = (RadioGroup) findViewById(R.id.footer);
        radioGroup.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup group, int checkedId) {
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
    }

    private void initializeActionBar() {
        ActionBar actionBar = getActionBar();
        actionBar.setDisplayShowCustomEnabled(true);
        actionBar.setCustomView(R.layout.actionbar_main);

        View customView = actionBar.getCustomView();
        ImageButton buttonScan = (ImageButton)customView.findViewById(
                R.id.actionbar_action_scan);
        buttonScan.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                //Intent intent = new Intent(MainActivity.this, AddCombActivity.class);
                //startActivityForResult(intent, 1);
            }
        });

        ImageButton buttonAdd = (ImageButton)customView.findViewById(
                R.id.actionbar_action_add);
        buttonAdd.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                //
            }
        });
        actionBar.setDisplayHomeAsUpEnabled(true);
    }

    @Override
    public void onResume() {
        super.onResume();
    }
}
