package com.taumu.rnscrollview;

import android.util.Log;

import javax.annotation.Nullable;

import java.util.Map;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.scroll.FpsListener;
import com.facebook.react.views.scroll.ReactScrollView;
import com.facebook.react.views.scroll.ReactScrollViewManager;

@ReactModule(name = RNScrollViewManager.REACT_CLASS)
public class RNScrollViewManager extends ReactScrollViewManager
        implements RNScrollViewCommandHelper.ScrollCommandHandler<ReactScrollView> {

    protected static final String REACT_CLASS = "RNScrollView";
    private @Nullable
    FpsListener mFpsListener = null;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    public RNScrollViewManager() {
        this(null);
    }

    public RNScrollViewManager(@Nullable FpsListener fpsListener) {
        mFpsListener = fpsListener;
    }


    @Override
    public ReactScrollView createViewInstance(ThemedReactContext context) {
        return new RNScrollView(context, mFpsListener);
    }

    @Override
    public @Nullable
    Map<String, Integer> getCommandsMap() {
        return RNScrollViewCommandHelper.getCommandsMap();
    }

    @Override
    public void receiveCommand(
            ReactScrollView scrollView,
            int commandId,
            @Nullable ReadableArray args) {
        RNScrollViewCommandHelper.receiveCommand(this, scrollView, commandId, args);
    }

    public void setRNScrollEnabled(ReactScrollView scrollView, boolean value) {
        scrollView.setScrollEnabled(value);
    }
}
