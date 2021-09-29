import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { UIConstant as CoreConstants } from '@tonlabs/uikit.core';
import {
    UIBackgroundView,
    UIBackgroundViewColors,
    Theme,
    TouchableOpacity,
    useTheme,
} from '@tonlabs/uikit.hydrogen';
import { UIConstant } from '../../constants';
import { usePaginationStyle } from './animations';

type CircleProps = {
    active: boolean;
    onPress: (event: any) => void;
    theme: Theme;
};

function Circle({ active, onPress, theme }: CircleProps) {
    const { animatedStyles } = usePaginationStyle(active, theme);

    return (
        <Animated.View style={[animatedStyles, styles.circle]}>
            <TouchableOpacity hitSlop={UIConstant.carousel.circleHitSlop} onPress={onPress}>
                <UIBackgroundView
                    color={
                        active
                            ? UIBackgroundViewColors.BackgroundAccent
                            : UIBackgroundViewColors.BackgroundNeutral
                    }
                    style={styles.circle}
                />
            </TouchableOpacity>
        </Animated.View>
    );
}

function getPaginationWidth(amount: number) {
    return amount * (UIConstant.carousel.circleSize + CoreConstants.contentOffset());
}

type PaginationProps = {
    pages: React.ReactElement[];
    setPage: (index: number) => void;
    activeIndex: number;
};

export const Pagination: React.FC<PaginationProps> = React.memo(
    ({ pages, setPage, activeIndex }: PaginationProps) => {
        const theme = useTheme();

        const onHandlePress = React.useCallback(
            (index: number) => {
                setPage(index);
            },
            [setPage],
        );

        return (
            <View style={[{ width: getPaginationWidth(pages.length) }, styles.pagination]}>
                {pages.map((_, index) => {
                    return (
                        <Circle
                            // eslint-disable-next-line react/no-array-index-key
                            key={`Circles_${index}`}
                            active={index === activeIndex}
                            onPress={() => onHandlePress(index)}
                            theme={theme}
                        />
                    );
                })}
            </View>
        );
    },
);

const styles = StyleSheet.create({
    circle: {
        width: UIConstant.carousel.circleSize,
        height: UIConstant.carousel.circleSize,
        borderRadius: UIConstant.carousel.circleSize / 2,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        alignItems: 'center',
    },
});
