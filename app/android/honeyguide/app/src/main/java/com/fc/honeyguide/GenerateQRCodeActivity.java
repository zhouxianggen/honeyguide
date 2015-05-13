package com.fc.honeyguide;

import android.graphics.Bitmap;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Environment;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import java.io.File;
import java.io.FileOutputStream;

public class GenerateQRCodeActivity extends ActionBarActivity {
    private static final String TAG = "GenerateQRCodeActivity";
    private ImageView mImageView;
    private String mCombTitle;
    private String mCombUrl;
    private int mWidth;
    private int mHeight;
    private Bitmap mBitmap;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.generate_qrcode);
        initializeActionBar();

        Bundle extras = getIntent().getExtras();
        mCombTitle = extras.getString(getString(R.string.EXTRA_COMB_TITLE), "");
        mCombUrl = extras.getString(getString(R.string.EXTRA_COMB_URL), "");
        if (mCombTitle.isEmpty() || mCombUrl.isEmpty()) {
            finish();
        }
        TextView textView = (TextView) findViewById(R.id.title);
        textView.setText(mCombTitle);

        mImageView = (ImageView) findViewById(R.id.qr_code);
        mWidth = (int) getResources().getDimension(R.dimen.qr_code_width);
        mHeight = (int) getResources().getDimension(R.dimen.qr_code_height);

        Button buttonSave = (Button) findViewById(R.id.button_save);
        buttonSave.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                if (mBitmap != null && !mCombTitle.isEmpty()) {
                    String path = Environment.getExternalStorageDirectory() + "/honey_" +
                            mCombTitle + ".png";
                    File file = new File(path);
                    try {
                        file.createNewFile();
                        FileOutputStream outputStream = new FileOutputStream(file);
                        mBitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream);
                        outputStream.close();
                        Toast.makeText(getApplicationContext(),
                                getString(R.string.toast_save_screen_shoot) + path,
                                Toast.LENGTH_SHORT).show();
                    } catch (Exception e) {
                        Toast.makeText(getApplicationContext(),
                                getString(R.string.error_save_qr_code_failed) + e.toString(),
                                Toast.LENGTH_SHORT).show();
                    }
                }
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        if (mBitmap == null) {
            mBitmap = generateQRCodeBitmap(mCombUrl, mWidth, mHeight);
        }
        if (mBitmap != null) {
            mImageView.setImageBitmap(mBitmap);
        }
    }

    private void initializeActionBar() {
        ActionBar actionBar = getSupportActionBar();
        actionBar.setDisplayShowCustomEnabled(true);
        actionBar.setCustomView(R.layout.actionbar_common);
        actionBar.setDisplayHomeAsUpEnabled(true);
        View customView = actionBar.getCustomView();
        TextView textView = (TextView) customView.findViewById(R.id.title);
        textView.setText("生成二维码");
    }

    private Bitmap generateQRCodeBitmap(String data, int width, int height) {
        try {
            com.google.zxing.Writer writer = new QRCodeWriter();

            BitMatrix bm = writer.encode(data, BarcodeFormat.QR_CODE, width, height);
            Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);

            for (int i = 0; i < width; i++) {
                for (int j = 0; j < height; j++) {
                    bitmap.setPixel(i, j, bm.get(i, j) ? Color.BLACK : Color.WHITE);
                }
            }
            return bitmap;
        } catch (WriterException e) {
            Toast.makeText(getApplicationContext(),
                    getString(R.string.error_generate_qr_code_failed) + e.toString(),
                    Toast.LENGTH_SHORT).show();
        }
        return null;
    }
}
