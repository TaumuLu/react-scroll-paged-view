package com.taumu.rnscrollview;
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import android.os.StrictMode;
import android.util.Log;
import android.view.MotionEvent;
import android.view.VelocityTracker;
import android.view.View;
import android.view.ViewParent;
import android.widget.OverScroller;
import android.widget.ScrollView;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.views.modal.ReactModalHostView;
import com.facebook.react.views.scroll.FpsListener;
import com.facebook.react.views.scroll.ReactScrollView;
import com.facebook.react.views.scroll.ReactScrollViewHelper;

import java.lang.reflect.Field;
import java.lang.reflect.Method;

import javax.annotation.Nullable;


public class RNScrollView extends ReactScrollView {

  static private boolean mScrollEnabled = true;
  private Class scrollViewClass = ScrollView.class;
  private boolean mDragging;

  public RNScrollView(ReactContext context) {
    super(context);
  }

  public RNScrollView(ReactContext context, @Nullable FpsListener fpsListener) {
    super(context, fpsListener);
  }

  @Override
  public boolean onInterceptTouchEvent(MotionEvent ev) {
    Log.i("Test", "onInterceptTouchEvent: " + mScrollEnabled);
    if (!mScrollEnabled) {
      return false;
    }

    // if (super.onInterceptTouchEvent()) {
      // 会将滑动时的触摸操作停止
      // NativeGestureUtil.notifyNativeGestureStarted(this, ev);
    ReactScrollViewHelper.emitScrollBeginDragEvent(this);
    mDragging = true;

    invokeEnableFpsListener();
    return true;
    // }
    //
    // return false;
  }

  // public boolean invokeOnInterceptTouchEvent(MotionEvent event) {
  //   Class classSV = ScrollView.class;
  //   //使用MethodType构造出要调用方法的返回类型
  //   // MethodType methodType = MethodType.methodType(void.class);
  //
  //   try {
  //     Method onInterceptTouchEvent = classSV.getDeclaredMethod("onInterceptTouchEvent", MotionEvent.class);
  //     Object test = onInterceptTouchEvent.invoke(this, event);
  //     return (boolean) test;
  //   } catch (Exception e) {
  //     e.printStackTrace();
  //   }
  //   return false;
  // }
  //
  // public boolean superOnInterceptTouchEvent(MotionEvent ev) {
  //   Log.i("Test", "superOnInterceptTouchEvent: ");
  //   /*
  //    * This method JUST determines whether we want to intercept the motion.
  //    * If we return true, onMotionEvent will be called and we do the actual
  //    * scrolling there.
  //    */
  //
  //   /*
  //    * Shortcut the most recurring case: the user is in the dragging
  //    * state and he is moving his finger.  We want to intercept this
  //    * motion.
  //    */
  //   final int action = ev.getAction();
  //   boolean mIsBeingDragged = getInvokeField("mIsBeingDragged");
  //   if ((action == MotionEvent.ACTION_MOVE) && (mIsBeingDragged)) {
  //     return true;
  //   }
  //
  //   /*
  //    * Don't try to intercept touch if we can't scroll anyway.
  //    */
  //   if (getScrollY() == 0 && !canScrollVertically(1)) {
  //     return false;
  //   }
  //   VelocityTracker mVelocityTracker = getInvokeField("mVelocityTracker");
  //   final int INVALID_POINTER = getInvokeField("INVALID_POINTER");
  //   OverScroller mScroller = getInvokeField("mScroller");
  //
  //   switch (action & MotionEvent.ACTION_MASK) {
  //     case MotionEvent.ACTION_MOVE: {
  //       /*
  //        * mIsBeingDragged == false, otherwise the shortcut would have caught it. Check
  //        * whether the user has moved far enough from his original down touch.
  //        */
  //
  //       /*
  //        * Locally do absolute value. mLastMotionY is set to the y value
  //        * of the down event.
  //        */
  //       final int activePointerId = getInvokeField("mActivePointerId");
  //       if (activePointerId == INVALID_POINTER) {
  //         // If we don't have a valid id, the touch down wasn't on content.
  //         break;
  //       }
  //
  //       final int pointerIndex = ev.findPointerIndex(activePointerId);
  //       final String TAG = getInvokeField("TAG");
  //       if (pointerIndex == -1) {
  //         Log.e(TAG, "Invalid pointerId=" + activePointerId
  //                 + " in onInterceptTouchEvent");
  //         break;
  //       }
  //
  //       final int y = (int) ev.getY(pointerIndex);
  //
  //       int mLastMotionY = getInvokeField("mLastMotionY");
  //       final int yDiff = Math.abs(y - mLastMotionY);
  //
  //       int mTouchSlop = getInvokeField("mTouchSlop");
  //       if (yDiff > mTouchSlop && (getNestedScrollAxes() & SCROLL_AXIS_VERTICAL) == 0) {
  //         mIsBeingDragged = true;
  //         mLastMotionY = setInvokeField("mLastMotionY", y);
  //         invokeMethod("initVelocityTrackerIfNotExists");
  //         invokeMethod("initVelocityTrackerIfNotExists");
  //         mVelocityTracker.addMovement(ev);
  //         setInvokeField("mNestedYOffset", 0);
  //         Object mScrollStrictSpan = getInvokeField("mScrollStrictSpan");
  //         if (mScrollStrictSpan == null) {
  //           mScrollStrictSpan = setInvokeField("mScrollStrictSpan",  strictModeInvokeMethod("enterCriticalSpan", "ScrollView-scroll"));
  //         }
  //         final ViewParent parent = getParent();
  //         if (parent != null) {
  //           parent.requestDisallowInterceptTouchEvent(true);
  //         }
  //       }
  //       break;
  //     }
  //
  //     case MotionEvent.ACTION_DOWN: {
  //       final int y = (int) ev.getY();
  //       boolean isInChild = inChild((int) ev.getX(), (int) y);
  //       if (!isInChild) {
  //         mIsBeingDragged = false;
  //         invokeMethod("recycleVelocityTracker");
  //         break;
  //       }
  //
  //       /*
  //        * Remember location of down touch.
  //        * ACTION_DOWN always refers to pointer index 0.
  //        */
  //       int mLastMotionY = setInvokeField("mLastMotionY", y);
  //       int mActivePointerId = setInvokeField("mActivePointerId", ev.getPointerId(0));
  //
  //       invokeMethod("initOrResetVelocityTracker");
  //       mVelocityTracker.addMovement(ev);
  //       /*
  //        * If being flinged and user touches the screen, initiate drag;
  //        * otherwise don't.  mScroller.isFinished should be false when
  //        * being flinged.
  //        */
  //
  //       mIsBeingDragged = !mScroller.isFinished();
  //       Object mScrollStrictSpan = getInvokeField("mScrollStrictSpan");
  //       if (mIsBeingDragged && mScrollStrictSpan == null) {
  //         mScrollStrictSpan = setInvokeField("mScrollStrictSpan", strictModeInvokeMethod("enterCriticalSpan", "ScrollView-scroll"));
  //       }
  //       startNestedScroll(SCROLL_AXIS_VERTICAL);
  //       break;
  //     }
  //
  //     case MotionEvent.ACTION_CANCEL:
  //     case MotionEvent.ACTION_UP:
  //       /* Release the drag */
  //       mIsBeingDragged = setInvokeField("mIsBeingDragged", false);
  //       int mActivePointerId = setInvokeField("mActivePointerId", INVALID_POINTER);
  //       invokeMethod("recycleVelocityTracker");
  //       int mScrollX = getInvokeField("mScrollX");
  //       int mScrollY = getInvokeField("mScrollY");
  //
  //       if (mScroller.springBack(mScrollX, mScrollY, 0, 0, 0, (int) invokeMethod("getScrollRange"))) {
  //         postInvalidateOnAnimation();
  //       }
  //       stopNestedScroll();
  //       break;
  //     case MotionEvent.ACTION_POINTER_UP:
  //       invokeMethod("onSecondaryPointerUp", ev);
  //       break;
  //   }
  //
  //   /*
  //    * The only time we want to intercept motion events is if we are in the
  //    * drag mode.
  //    */
  //   return mIsBeingDragged;
  // }

  // private boolean inChild(int x, int y) {
  //   if (getChildCount() > 0) {
  //     final int scrollY = getInvokeField("mScrollY");
  //     final View child = getChildAt(0);
  //     return !(y < child.getTop() - scrollY
  //             || y >= child.getBottom() - scrollY
  //             || x < child.getLeft()
  //             || x >= child.getRight());
  //   }
  //   return false;
  // }

  // public <T> T getInvokeField(String fieldName) {
  //   try {
  //     Field field = ScrollView.class.getDeclaredField(fieldName);
  //     field.setAccessible(true);
  //     return (T) field.get(this);
  //   } catch (Exception e) {
  //     e.printStackTrace();
  //   }
  //   return null;
  // }
  //
  // public <T> T setInvokeField(String fieldName, T value) {
  //   try {
  //     Field field = scrollViewClass.getDeclaredField(fieldName);
  //     field.setAccessible(true);
  //     field.set(this, value);
  //   } catch (Exception e) {
  //     e.printStackTrace();
  //   }
  //   return value;
  // }
  //
  // public <T> T invokeMethod(String methodName, Object... params) {
  //   try {
  //     Method method = ScrollView.class.getDeclaredMethod(methodName);
  //     method.setAccessible(true);
  //     return (T) method.invoke(this, params);
  //   } catch (Exception e) {
  //     e.printStackTrace();
  //   }
  //   return null;
  // }
  //
  // public <T> T strictModeInvokeMethod(String methodName, Object... params) {
  //   try {
  //     Method method = StrictMode.class.getDeclaredMethod(methodName);
  //     method.setAccessible(true);
  //     return (T) method.invoke(this, params);
  //   } catch (Exception e) {
  //     e.printStackTrace();
  //   }
  //   return null;
  // }

  public void invokeEnableFpsListener() {
    Class classRSV = ReactScrollView.class;

    try {
      Method enableFpsListener = classRSV.getDeclaredMethod("enableFpsListener");
      enableFpsListener.invoke(this);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
