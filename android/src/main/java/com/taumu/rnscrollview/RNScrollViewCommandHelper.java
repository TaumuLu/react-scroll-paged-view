/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 * <p>
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.taumu.rnscrollview;

import javax.annotation.Nullable;

import java.util.Map;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.views.scroll.ReactScrollViewCommandHelper;

public class RNScrollViewCommandHelper extends ReactScrollViewCommandHelper {

    public static final int COMMAND_SET_SCROLL_ENABLED = 10;

    public interface ScrollCommandHandler<T> extends ReactScrollViewCommandHelper.ScrollCommandHandler<T> {
        void setRNScrollEnabled(T scrollView, boolean data);
    }

    public static Map<String, Integer> getCommandsMap() {
        Map<String, Integer> map = ReactScrollViewCommandHelper.getCommandsMap();
        map.put("setScrollEnabled", COMMAND_SET_SCROLL_ENABLED);
        return map;
    }

    public static <T> void receiveCommand(
            ScrollCommandHandler<T> viewManager,
            T scrollView,
            int commandType,
            @Nullable ReadableArray args) {

        try {
            ReactScrollViewCommandHelper.receiveCommand(viewManager, scrollView, commandType, args);
        } catch (IllegalArgumentException e) {
            if(commandType == COMMAND_SET_SCROLL_ENABLED) {
                boolean isEnable = args.getBoolean(0);
                viewManager.setRNScrollEnabled(scrollView, isEnable);
            } else {
                throw e;
            }
        }
    }
}
