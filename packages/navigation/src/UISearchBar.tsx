import * as React from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import {
    ColorVariants,
    UIBackgroundView,
    UIImage,
    UIIndicator,
    UILabel,
    UILabelColors,
    UILabelRoles,
    UITextView,
    UITextViewProps,
    useUITextViewValue,
} from '@tonlabs/uikit.hydrogen';
import { UIConstant } from '@tonlabs/uikit.core';
import { UIAssets } from '@tonlabs/uikit.assets';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { HEADER_HEIGHT, ICON_SEARCH_SIZE, ICON_SEARCHING_INDICATOR_SIZE } from './constants';

type OnPress = () => void | Promise<void>;

type UISearchBarRightButtonProps = {
    /**
     * Label text for button
     */
    label?: string;
    /**
     * Press handler
     */
    onPress?: OnPress;
    /**
     * Accessibility label for the button for screen readers.
     */
    accessibilityLabel?: string;
};

function renderRightAction({
    label,
    onPress,
    accessibilityLabel,
}: UISearchBarRightButtonProps) {
    if (label == null) {
        return null;
    }

    return (
        <TouchableOpacity
            hitSlop={{
                top: UIConstant.smallContentOffset(),
                bottom: UIConstant.smallContentOffset(),
                left: UIConstant.contentOffset(),
                right: UIConstant.contentOffset(),
            }}
            onPress={onPress}
            style={styles.actionButton}
        >
            <UILabel
                role={UILabelRoles.Action}
                color={UILabelColors.TextAccent}
                accessibilityLabel={accessibilityLabel}
            >
                {label}
            </UILabel>
        </TouchableOpacity>
    );
}

type UISearchBarProps = Omit<UITextViewProps, 'placeholder'> & {
    /**
     * Configuration for right item
     * Action button by default
     */
    headerRight?: (props: UISearchBarRightButtonProps) => React.ReactNode;
    /**
     * Label that will be passed to headerRight
     */
    headerRightLabel?: string;
    /**
     * onPress handler that will be passed to headerRight
     */
    headerRightOnPress?: OnPress;
    /**
     * Alternative string for placeholder
     */
    placeholder?: string;
    /**
     * Whether to show indicator animation on the right side of input
     */
    searching?: boolean;
};

export function UISearchBar({
    headerRight = renderRightAction,
    headerRightLabel,
    headerRightOnPress,
    placeholder,
    searching,
    onChangeText: onChangeTextProp,
    ...inputProps
}: UISearchBarProps) {
    const [searchText, setSearchText] = React.useState('');
    const ref = React.useRef<TextInput>(null);
    const {
        inputHasValue,
        clear,
    } = useUITextViewValue(ref, false, { value: searchText, ...inputProps });

    const onChangeText = React.useCallback(
        (text: string) => {
            if (onChangeTextProp) {
                onChangeTextProp(text);
            }

            setSearchText(text);
        },
        [onChangeTextProp, setSearchText],
    );

    const onClear = React.useCallback(
        () => {
            if (onChangeTextProp) {
                onChangeTextProp('');
            }
            clear();
        },
        [onChangeTextProp, clear],
    );

    return (
        <UIBackgroundView style={styles.container}>
            <UIBackgroundView
                style={styles.searchContainer}
                color={ColorVariants.BackgroundSecondary}
            >
                <UIImage
                    source={UIAssets.icons.ui.search}
                    style={styles.searchIcon}
                    tintColor={ColorVariants.IconSecondary}
                />
                <UITextView
                    ref={ref}
                    placeholder={placeholder || uiLocalized.Search}
                    onChangeText={onChangeText}
                    {...inputProps}
                />
                {searching && (
                    <UIIndicator
                        style={styles.loadingIcon}
                        size={ICON_SEARCHING_INDICATOR_SIZE}
                        trackWidth={2}
                    />
                )}
                {!searching && inputHasValue && (
                    <TouchableOpacity
                        testID="search_bar_clear_btn"
                        style={styles.clearButtonContainer}
                        onPress={onClear}
                    >
                        <UIImage
                            source={UIAssets.icons.ui.clear}
                            tintColor={ColorVariants.BackgroundPrimaryInverted}
                        />
                    </TouchableOpacity>
                )}
            </UIBackgroundView>
            {headerRight({
                label: headerRightLabel,
                onPress: headerRightOnPress,
            })}
        </UIBackgroundView>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: HEADER_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: UIConstant.smallContentOffset(),
        paddingHorizontal: UIConstant.contentOffset(),
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        borderRadius: UIConstant.mediumBorderRadius(),
        paddingLeft: 10,
        paddingRight: 14,
    },
    searchIcon: {
        width: ICON_SEARCH_SIZE,
        height: ICON_SEARCH_SIZE,
        marginRight: UIConstant.tinyContentOffset(),
    },
    loadingIcon: {
        flex: undefined,
        marginLeft: UIConstant.tinyContentOffset(),
    },
    actionButton: {
        marginLeft: UIConstant.contentOffset(),
    },
    clearButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 24,
    },
});
