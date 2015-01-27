package com.honeyguide.fc.honeyguide;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v4.view.PagerAdapter;
import android.support.v4.view.ViewPager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.LinearLayout;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Administrator on 2015/1/26.
 */
public class WizardActivity extends Activity implements ViewPager.OnPageChangeListener {
    private ViewPager mViewPager;
    private PagerAdapter mPagerAdapter;
    private LinearLayout mSelectors;
    private ImageButton mGoButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.wizard);

        final LayoutInflater inflater = LayoutInflater.from(this);
        List<View> views = new ArrayList<View>();
        views.add(inflater.inflate(R.layout.wizard_step_1, null));
        views.add(inflater.inflate(R.layout.wizard_step_2, null));
        views.add(inflater.inflate(R.layout.wizard_step_3, null));
        mSelectors = (LinearLayout) findViewById(R.id.wizard_selectors);
        for (int i = 0; i < views.size(); i++) {
            View view = inflater.inflate(R.layout.wizard_selector, null);
            if (i == 0) {
                view.setSelected(true);
            }
            mSelectors.addView(view);
        }
        mGoButton = (ImageButton) findViewById(R.id.wizard_go_button);
        mGoButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(WizardActivity.this, MainActivity.class);
                startActivity(intent);
                SharedPreferences settings = getSharedPreferences(getString(R.string.global_preference_file_key), MODE_PRIVATE);
                settings.edit().putBoolean(getString(R.string.settings_wizard_finished), true);
                settings.edit().apply();
                finish();
            }
        });

        mViewPager = (ViewPager) findViewById(R.id.wizard_viewpager);
        mPagerAdapter = new WizardPagerAdapter(views);
        mViewPager.setAdapter(mPagerAdapter);
        mViewPager.setOnPageChangeListener(this);
    }

    @Override
    public void onPageScrollStateChanged(int state) {

    }

    @Override
    public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

    }

    @Override
    public void onPageSelected(int position) {
        for (int i = 0; i < mSelectors.getChildCount(); i++) {
            mSelectors.getChildAt(i).setSelected(false);
        }
        mSelectors.getChildAt(position).setSelected(true);
        if (position + 1 == mSelectors.getChildCount()) {
            mGoButton.setVisibility(View.VISIBLE);
        }
        else {
            mGoButton.setVisibility(View.INVISIBLE);
        }
    }

    private class WizardPagerAdapter extends PagerAdapter {
        private List<View> mViews;

        public WizardPagerAdapter(List<View> views) {
            super();
            this.mViews = views;
        }

        @Override
        public Object instantiateItem(ViewGroup container, int position) {
            container.addView(mViews.get(position));
            return mViews.get(position);
        }

        @Override
        public  void destroyItem(ViewGroup container, int position, Object object) {
            container.removeView(mViews.get(position));
        }

        @Override
        public int getCount() {
            return mViews.size();
        }

        @Override
        public boolean isViewFromObject(View view, Object object) {
            return view == object;
        }
    }
}
