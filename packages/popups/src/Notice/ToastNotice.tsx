import * as React from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { useHover, Portal } from '@tonlabs/uikit.hydrogen';
import { UIConstant } from '@tonlabs/uikit.navigation';
import type { SnapPoints, ToastNoticeProps } from './types';
import { Notice } from './Notice';
import { useNoticeHeight } from './hooks/useNoticeHeight';
import {
    useToastNoticeXSnapPoints,
    useNoticePosition,
    useToastNoticeYSnapPoints,
} from './toastNoticeHooks';

export const ToastNotice: React.FC<ToastNoticeProps> = ({
    type,
    color,
    visible,
    title,
    action,
    onTap,
    onCloseAnimationEnd,
    suspendClosingTimer,
    continueClosingTimer,
    keyboardHeight,
    countdownValue,
    countdownProgress,
    hasCountdown,
    testID,
}: ToastNoticeProps) => {
    const windowHeight = useSharedValue<number>(0);
    const { noticeHeight, onLayoutNotice } = useNoticeHeight();

    const { isHovered, onMouseEnter, onMouseLeave } = useHover();

    const onLayoutFullPortalContainer = React.useCallback((event: LayoutChangeEvent) => {
        windowHeight.value = event.nativeEvent.layout.height;
    }, []);

    const xSnapPoints: SnapPoints = useToastNoticeXSnapPoints();
    const ySnapPoints: SnapPoints = useToastNoticeYSnapPoints(
        type,
        noticeHeight,
        keyboardHeight,
        windowHeight,
    );

    const { noticePositionStyle, gestureHandler, onPress, onLongPress, onPressOut } =
        useNoticePosition(
            xSnapPoints,
            ySnapPoints,
            visible,
            isHovered,
            onCloseAnimationEnd,
            suspendClosingTimer,
            continueClosingTimer,
            onTap,
        );

    return (
        <Portal absoluteFill>
            <View
                style={styles.fullPortalContainer}
                onLayout={onLayoutFullPortalContainer}
                pointerEvents="box-none"
            >
                <View style={styles.container} pointerEvents="box-none">
                    <View style={styles.content} pointerEvents="box-none">
                        <PanGestureHandler onGestureEvent={gestureHandler}>
                            <Animated.View
                                style={[noticePositionStyle, styles.notice]}
                                onLayout={onLayoutNotice}
                                // @ts-expect-error
                                onMouseEnter={onMouseEnter}
                                onMouseLeave={onMouseLeave}
                            >
                                <Notice
                                    type={type}
                                    title={title}
                                    color={color}
                                    testID={testID}
                                    onPress={onPress}
                                    onLongPress={onLongPress}
                                    onPressOut={onPressOut}
                                    action={action}
                                    countdownValue={countdownValue}
                                    countdownProgress={countdownProgress}
                                    hasCountdown={hasCountdown}
                                />
                            </Animated.View>
                        </PanGestureHandler>
                    </View>
                </View>
            </View>
        </Portal>
    );
};

const styles = StyleSheet.create({
    fullPortalContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        position: 'absolute',
        height: 0,
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: UIConstant.notice.toastIndentFromScreenEdges,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        maxWidth: UIConstant.notice.maxWidth,
    },
    notice: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
    },
});
