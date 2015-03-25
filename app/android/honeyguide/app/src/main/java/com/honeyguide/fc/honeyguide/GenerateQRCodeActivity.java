package com.honeyguide.fc.honeyguide;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Environment;
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

/**
 * Created by Administrator on 2015/3/5.
 */
public class GenerateQRCodeActivity extends ActionbarActivity {
    private static final String TAG = GenerateQRCodeActivity.class.getSimpleName();
    private Context mContext;
    private ImageView mImageView;
    private Button mShootScreenButton;
    private String mCombTitle;
    private String mCombUrl;
    private int mWidth;
    private int mHeight;
    private Bitmap mBitmap;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.generate_qrcode);
        mImageView = (ImageView) findViewById(R.id.qr_code);

        actionBarTitle.setText(getString(R.string.actionbar_title_generate_qr_code));
        actionBarAction.setText(getString(R.string.action_finish));
        actionBarAction.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                finish();
            }
        });

        mShootScreenButton = (Button) findViewById(R.id.button_shoot);
        mShootScreenButton.setOnClickListener(new View.OnClickListener() {
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
                        Toast.makeText(mContext, getString(R.string.toast_save_screen_shoot) + path,
                                Toast.LENGTH_SHORT).show();
                    } catch (Exception e) {
                        Toast.makeText(mContext, getString(R.string.error_save_screen_shoot),
                                Toast.LENGTH_SHORT).show();
                    }
                }
            }
        });

        mContext = this;
        Bundle extras = getIntent().getExtras();
        if (extras == null) {
            finish();
        }
        mCombTitle = extras.getString(getString(R.string.extras_comb_title), "");
        mCombUrl = extras.getString(getString(R.string.extras_comb_url), "");
        Log.d(TAG, mCombTitle);
        Log.d(TAG, mCombUrl);
        if (mCombTitle.isEmpty() || mCombUrl.isEmpty()) {
            finish();
        }

        TextView textView = (TextView) findViewById(R.id.title);
        textView.setText(mCombTitle);

        mWidth = (int) getResources().getDimension(R.dimen.qr_code_width);
        mHeight = (int) getResources().getDimension(R.dimen.qr_code_height);
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
            Toast.makeText(mContext, getString(R.string.error_generate_qr_code_failed),
                    Toast.LENGTH_SHORT).show();
        }
        return null;
    }
}
