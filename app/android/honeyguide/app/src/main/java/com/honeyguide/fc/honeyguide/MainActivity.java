package com.honeyguide.fc.honeyguide;

import android.app.ActionBar;
import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ListView;
import android.widget.TextView;


public class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        SharedPreferences settings = getSharedPreferences(getString(R.string.global_preference_file_key), MODE_PRIVATE);

        if (!settings.getBoolean(getString(R.string.settings_wizard_finished), false)) {
            Intent intent = new Intent(MainActivity.this, WizardActivity.class);
            startActivity(intent);
        }

        String userName = settings.getString(getString(R.string.settings_user_name), "");
        String password = settings.getString(getString(R.string.settings_password), "");
        if (!userName.isEmpty() && !password.isEmpty()) {
        }
        else {

        }
    }

    @Override
    public void onResume() {
        super.onResume();
    }

    private boolean readUserInfo() {
        return true;
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement

        return super.onOptionsItemSelected(item);
    }
}
