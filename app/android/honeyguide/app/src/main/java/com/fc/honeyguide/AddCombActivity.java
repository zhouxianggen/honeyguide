package com.fc.honeyguide;

import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.ParcelFileDescriptor;
import android.provider.MediaStore;
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

import com.fc.honeyguide.define.Account;
import com.fc.honeyguide.define.Comb;
import com.fc.honeyguide.define.Linker;
import com.fc.honeyguide.manager.CombManager;
import com.fc.honeyguide.util.ImageLoadTask;

import java.io.ByteArrayOutputStream;
import java.io.FileDescriptor;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class AddCombActivity extends ActionBarActivity {
    private static final String TAG = "AddCombActivity";
    private static final int SELECT_LINKERS_REQUEST = 1;
    private static final int SET_ICON_REQUEST = 2;
    private Handler mHandler = new Handler();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.add_comb);
        initializeActionBar();

        Account account = ((MyApplication)getApplication()).getAccountManager().getCurrentAccount();
        Comb comb = ((MyApplication)getApplication()).getNewComb();
        comb.id = String.format("%s_%d", account.id, System.currentTimeMillis());

        Button buttonFinish = (Button) findViewById(R.id.action_finish);
        buttonFinish.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                EditText editText = (EditText) findViewById(R.id.title);
                Comb comb = ((MyApplication)getApplication()).getNewComb();
                comb.title = editText.getText().toString();
                Log.d(TAG, "start add comb ");
                String error = comb.check();
                if (error.isEmpty()) {
                    Log.d(TAG, "check is ok");
                    new Thread(new Runnable() {
                        public void run() {
                            final String error1 = ((MyApplication) getApplication()).
                                    getCombManager().addComb();
                            mHandler.post(new Runnable() {
                                public void run() {
                                    if (error1.isEmpty()) {
                                        finish();
                                    } else {
                                        Toast.makeText(getApplicationContext(), error1,
                                                Toast.LENGTH_SHORT).show();
                                    }
                                }
                            });
                        }
                    }).start();
                } else {
                    Toast.makeText(getApplicationContext(), error, Toast.LENGTH_SHORT).show();
                }
            }
        });

        Button buttonSetLinkers = (Button) findViewById(R.id.set_linkers);
        buttonSetLinkers.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent intent = new Intent(AddCombActivity.this, SelectLinkersActivity.class);
                startActivityForResult(intent, SELECT_LINKERS_REQUEST);
            }
        });

        Button buttonSetIcon = (Button) findViewById(R.id.set_icon);
        buttonSetIcon.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent intent = new Intent();
                intent.setType("image/*");
                intent.setAction(Intent.ACTION_GET_CONTENT);
                startActivityForResult(Intent.createChooser(intent, "Select Picture"),
                        SET_ICON_REQUEST);
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        //super.onActivityResult(requestCode, resultCode, data);
        Log.d(TAG, "onActivityResult with request code " + String.valueOf(requestCode));
        Log.d(TAG, "onActivityResult with result code " + String.valueOf(resultCode));
        if (requestCode == SELECT_LINKERS_REQUEST) {
            if (resultCode == RESULT_OK) {
                LinearLayout linearLayout = (LinearLayout) findViewById(R.id.linkers);
                linearLayout.removeAllViews();
                Comb comb = ((MyApplication)getApplication()).getNewComb();
                for (Linker linker : comb.linkers) {
                    Log.d(TAG, "add linker with icon " + linker.icon);
                    LayoutInflater layoutInflater = getLayoutInflater();
                    View view = layoutInflater.inflate(R.layout.horizontal_linker_list_item,
                            null);
                    ImageView imageView = (ImageView) view.findViewById(R.id.icon);
                    new ImageLoadTask(linker.icon, imageView).execute();
                    linearLayout.addView(view);
                }
            }
        } else if (requestCode == SET_ICON_REQUEST) {
            if (resultCode == RESULT_OK) {
                Uri uri = data.getData();
                Log.d(TAG, "get path from " + uri.toString());
                Bitmap bitmap = getBitmapFromUri(uri);
                if (bitmap != null) {
                    Comb comb = ((MyApplication)getApplication()).getNewComb();
                    comb.icon = getImageUri(bitmap).toString();
                    Log.d(TAG, "path is " + comb.icon);
                    ImageView imageView = (ImageView) findViewById(R.id.icon);
                    imageView.setImageBitmap(bitmap);
                }
            }
        }
    }

    public Uri getImageUri(Bitmap image) {
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        image.compress(Bitmap.CompressFormat.JPEG, 100, bytes);
        String path = MediaStore.Images.Media.insertImage(getContentResolver(), image,
                "Title", null);
        return Uri.parse(path);
    }

    private Bitmap getBitmapFromUri(Uri uri) {
        try {
            ParcelFileDescriptor parcelFileDescriptor =
                    getContentResolver().openFileDescriptor(uri, "r");
            FileDescriptor fileDescriptor = parcelFileDescriptor.getFileDescriptor();
            Bitmap image = BitmapFactory.decodeFileDescriptor(fileDescriptor);
            parcelFileDescriptor.close();
            return image;
        } catch (Exception e) {
            return null;
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
