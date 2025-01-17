import * as React from 'react';
import Animated, {
    interpolateColor,
    useAnimatedProps,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
} from 'react-native-reanimated';
import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import { Platform, ColorValue } from 'react-native';
import {
    ContentAnimations,
    ActionButtonColorScheme,
    UIActionButtonType,
    ActionButtonAnimations,
    ActionButtonColors,
} from './types';
import { runUIGetTransparentColor } from './runUIGetTransparentColor';

export const useButtonColorScheme = (type: UIActionButtonType): ActionButtonColorScheme => {
    return React.useMemo((): ActionButtonColorScheme => {
        switch (type) {
            case UIActionButtonType.Accent:
                return {
                    overlay: {
                        normal: ColorVariants.BackgroundAccent,
                        hover: ColorVariants.SpecialAccentLight,
                        pressed: ColorVariants.SpecialAccentDark,
                        disabled: ColorVariants.BackgroundNeutral,
                    },
                    content: {
                        normal: ColorVariants.StaticTextPrimaryLight,
                        hover: ColorVariants.StaticTextPrimaryLight,
                        pressed: ColorVariants.StaticTextPrimaryLight,
                        disabled: ColorVariants.StaticTextOverlayLight,
                    },
                };
            case UIActionButtonType.Primary:
            default:
                return {
                    overlay: {
                        normal: ColorVariants.BackgroundBW,
                        hover: ColorVariants.BackgroundBW,
                        pressed: ColorVariants.BackgroundBW,
                        disabled: ColorVariants.BackgroundBW,
                    },
                    content: {
                        normal: ColorVariants.TextAccent,
                        hover: ColorVariants.SpecialAccentLight,
                        pressed: ColorVariants.SpecialAccentDark,
                        disabled: ColorVariants.TextTertiary,
                    },
                };
        }
    }, [type]);
};

export function useContentAnimatedStyles(
    hoverAnimValue: Animated.SharedValue<number>,
    pressAnimValue: Animated.SharedValue<number>,
    hoverOverlayColor: ColorVariants,
    pressOverlayColor: ColorVariants,
    contentColor: ColorVariants,
): ContentAnimations {
    const theme = useTheme();

    const titleColorAnimValue = useDerivedValue(() => {
        return interpolateColor(
            -hoverAnimValue.value + pressAnimValue.value * 1001,
            [-1, 0, 1000],
            [
                theme[ColorVariants[hoverOverlayColor]] as string,
                theme[ColorVariants[contentColor]] as string,
                theme[ColorVariants[pressOverlayColor]] as string,
            ],
        );
    });

    const titleStyle = useAnimatedStyle(() => {
        return {
            color: titleColorAnimValue.value,
        };
    });

    const iconProps = useAnimatedProps(() => {
        return {
            tintColor: titleColorAnimValue.value as ColorValue,
        };
    });

    return {
        titleStyle,
        iconProps,
    };
}

export function useButtonAnimations(
    backgroundColor: ColorVariants,
    hoverOverlayColor: ColorVariants,
    pressOverlayColor: ColorVariants,
): ActionButtonAnimations {
    const theme = useTheme();

    const hoverAnim = useSharedValue(0);
    const backgroundColorValue = useDerivedValue(() => {
        return interpolateColor(
            hoverAnim.value,
            [0, 1],
            [
                theme[ColorVariants[backgroundColor]] as string,
                theme[ColorVariants[hoverOverlayColor]] as string,
            ],
        );
    });
    const backgroundStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: backgroundColorValue.value,
        };
    });

    const pressAnim = useSharedValue(0);
    const pressOverlayColorValue = useDerivedValue(() => {
        return interpolateColor(
            pressAnim.value,
            [0, 1],
            [
                runUIGetTransparentColor(theme[ColorVariants[pressOverlayColor]] as string),
                theme[ColorVariants[pressOverlayColor]] as string,
            ],
        );
    });
    const pressOverlayStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: pressOverlayColorValue.value,
        };
    });

    return {
        hover: {
            animationParam: hoverAnim,
            backgroundStyle,
            overlayStyle: undefined,
        },
        press: {
            animationParam: pressAnim,
            backgroundStyle: Platform.OS === 'web' ? undefined : backgroundStyle,
            overlayStyle: pressOverlayStyle,
        },
    };
}

export function useButtonColors(
    disabled: boolean | undefined,
    overlay: ActionButtonColors,
    content: ActionButtonColors,
) {
    return React.useMemo(() => {
        let backgroundColor: ColorVariants = overlay.normal;
        let contentColor: ColorVariants = content.normal;

        if (disabled) {
            backgroundColor = overlay.disabled;
        }

        if (disabled) {
            contentColor = content.disabled;
        }

        return {
            contentColor,
            backgroundColor,
        };
    }, [disabled, overlay, content]);
}
