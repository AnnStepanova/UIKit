// @flow
import React from 'react';
import { View, Text } from 'react-native';
import type { TextStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIStyle from '../../../helpers/UIStyle';
import UIColor from '../../../helpers/UIColor';
import UIActionComponent from '../../UIActionComponent';
import type { ActionProps, ActionState } from '../../UIActionComponent';

export type MenuItemType = ActionProps & {
    title: string,
    titleStyle?: TextStyleProp,
    details?: string,
    detailsStyle?: TextStyleProp,
    chosen?: boolean,
    reversedColors?: boolean,
};

export default class MenuItem extends UIActionComponent<MenuItemType, ActionState> {
    static defaultProps: MenuItemType = {
        ...UIActionComponent.defaultProps,
        reversedColors: false,
        chosen: false,
        titleStyle: null,
        details: '',
        detailsStyle: null,
    };

    static testIDs = {
        menuItem: (value: string) => `menuItem_${value}`,
    };

    renderContent() {
        const {
            title, details, titleStyle, detailsStyle, chosen, disabled, reversedColors,
        } = this.props;

        const contentStyle = details
            ? UIStyle.common.justifySpaceBetween()
            : UIStyle.common.justifyCenter();
        const marginRight = details ? UIStyle.margin.rightDefault() : null;

        const chosenStraight = reversedColors ? !chosen : chosen;
        const defaultTitleStyle = chosenStraight
            ? UIStyle.color.stateTextPrimary(UIColor.Theme.Light, disabled, this.isTapped(), this.isHover())
            : UIStyle.text.action();
        const defaultDetailsStyle = chosenStraight
            ? UIStyle.text.primary()
            : UIStyle.text.tertiary();

        const containerStyle = [
            UIStyle.common.centerLeftContainer(),
            UIStyle.height.buttonHeight(),
            contentStyle,
        ];

        const content = (
            <React.Fragment>
                <Text
                    numberOfLines={1}
                    style={[
                        UIStyle.text.smallMedium(),
                        marginRight,
                        defaultTitleStyle,
                        titleStyle,
                    ]}
                    testID={MenuItem.testIDs.menuItem(title)}
                >
                    {title}
                </Text>
                <Text
                    numberOfLines={1}
                    style={[
                        UIStyle.text.smallRegular(),
                        defaultDetailsStyle,
                        detailsStyle,
                    ]}
                >
                    {details}
                </Text>
            </React.Fragment>
        );

        return (
            <View style={containerStyle}>
                {content}
            </View>
        );
    }
}
