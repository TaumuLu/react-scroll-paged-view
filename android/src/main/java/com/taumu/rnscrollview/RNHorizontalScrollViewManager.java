package com.taumu.rnscrollview;

import android.util.Log;

import javax.annotation.Nullable;

import java.util.Map;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.scroll.FpsListener;
import com.facebook.react.views.scroll.ReactHorizontalScrollView;
import com.facebook.react.views.scroll.ReactHorizontalScrollViewManager;


@ReactModule(name = RNHorizontalScrollViewManager.REACT_CLASS)
public class RNHorizontalScrollViewManager extends ReactHorizontalScrollViewManager
        implements RNScrollViewCommandHelper.ScrollCommandHandler<ReactHorizontalScrollView> {

    protected static final String REACT_CLASS = "RNHorizontalScrollView";
    private @Nullable
    FpsListener mFpsListener = null;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    public RNHorizontalScrollViewManager() {
        this(null);
    }

    public RNHorizontalScrollViewManager(@Nullable FpsListener fpsListener) {
        mFpsListener = fpsListener;
    }


    @Override
    public ReactHorizontalScrollView createViewInstance(ThemedReactContext context) {
        return new RNHorizontalScrollView(context, mFpsListener);
    }

    @Override
    public @Nullable
    Map<String, Integer> getCommandsMap() {
        return RNScrollViewCommandHelper.getCommandsMap();
    }

    @Override
    public void receiveCommand(
            ReactHorizontalScrollView scrollView,
            int commandId,
            @Nullable ReadableArray args) {
        RNScrollViewCommandHelper.receiveCommand(this, scrollView, commandId, args);
    }

    public void setRNScrollEnabled(ReactHorizontalScrollView scrollView, boolean value) {
        scrollView.setScrollEnabled(value);
    }
}
