import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UILayoutConstant } from '@tonlabs/uikit.layout';

import { UISheet, UISheetProps } from './UISheet/UISheet';

export type UIBottomSheetProps = UISheetProps & {
    style?: StyleProp<ViewStyle>;
    hasDefaultInset?: boolean;
};

export function UIBottomSheet({
    children,
    style,
    hasDefaultInset = true,
    ...rest
}: UIBottomSheetProps) {
    const { visible, forId } = rest;

    const { bottom: bottomInset } = useSafeAreaInsets();

    const defaultPadding = React.useMemo(() => {
        if (!hasDefaultInset) {
            return 0;
        }

        const flattenStyle = StyleSheet.flatten(style);
        return Math.max(
            bottomInset || 0,
            UILayoutConstant.contentOffset,
            (flattenStyle?.paddingBottom as number) ?? 0,
        );
    }, [style, bottomInset, hasDefaultInset]);

    const sheetStyle = React.useMemo(() => {
        return {
            paddingBottom: defaultPadding + UILayoutConstant.rubberBandEffectDistance,
        };
    }, [defaultPadding]);

    return (
        <UISheet.Container visible={visible} forId={forId}>
            <UISheet.KeyboardAware defaultShift={-UILayoutConstant.rubberBandEffectDistance}>
                <UISheet.IntrinsicSize>
                    <UISheet.Content {...rest} style={[styles.bottom, style, sheetStyle]}>
                        {children}
                    </UISheet.Content>
                </UISheet.IntrinsicSize>
            </UISheet.KeyboardAware>
        </UISheet.Container>
    );
}

const styles = StyleSheet.create({
    bottom: {
        width: '100%',
        maxWidth: UILayoutConstant.elasticWidthBottomSheet,
        alignSelf: 'center',
        left: 'auto',
        right: 'auto',
        borderTopLeftRadius: UILayoutConstant.alertBorderRadius,
        borderTopRightRadius: UILayoutConstant.alertBorderRadius,
        overflow: 'hidden',
    },
});
