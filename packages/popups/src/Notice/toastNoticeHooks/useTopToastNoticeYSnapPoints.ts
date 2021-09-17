import * as React from 'react';
import Animated, { useDerivedValue } from 'react-native-reanimated';
import { UIDevice } from '@tonlabs/uikit.core';
import { UIConstant } from '@tonlabs/uikit.navigation';
import type { SnapPoints } from '../types';

export const useTopToastNoticeYSnapPoints = (
    noticeHeight: Animated.SharedValue<number>,
    windowHeight: Animated.SharedValue<number>,
): SnapPoints => {
    const statusBarHeight = React.useMemo(() => UIDevice.statusBarHeight(), []);

    const openedYSnapPoint = useDerivedValue(() => {
        if (windowHeight.value === 0) {
            /**
             * windowHeight haven't measured yet
             * it mustn't pass an incorrect value
             */
            return 0;
        }
        return -windowHeight.value + statusBarHeight + UIConstant.contentOffset;
    }, [statusBarHeight]);
    const closedYSnapPoint = useDerivedValue(() => {
        if (windowHeight.value === 0 || noticeHeight.value === 0) {
            /**
             * windowHeight or noticeHeight haven't measured yet
             * it mustn't pass an incorrect value
             */
            return 0;
        }
        return -windowHeight.value - noticeHeight.value;
    }, []);

    return {
        openedSnapPoint: openedYSnapPoint,
        closedSnapPoint: closedYSnapPoint,
    };
};
