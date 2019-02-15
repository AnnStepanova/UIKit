import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

import UITextStyle from '../../../helpers/UITextStyle';
import UIConstant from '../../../helpers/UIConstant';
import UIComponent from '../../UIComponent';

const styles = StyleSheet.create({
    textButton: {
        height: UIConstant.buttonHeight(),
        backgroundColor: 'transparent',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },
    detailsText: {
        marginRight: UIConstant.contentOffset(),
    },
});

class UITextButton extends UIComponent {
    // Render
    textSecondary;

    renderTitle() {
        const {
            title, textStyle, details, disabled,
        } = this.props;
        const defaultTitleStyle = disabled
            ? UITextStyle.secondarySmallMedium
            : UITextStyle.actionSmallMedium;
        return (
            <Text style={[defaultTitleStyle, textStyle, { flexGrow: details ? 1 : 0 }]}>
                {title}
            </Text>
        );
    }

    renderDetails() {
        const { details, detailsStyle } = this.props;
        if (!details || !details.length) {
            return null;
        }
        return (
            <Text style={[UITextStyle.secondarySmallRegular, detailsStyle]}>
                {details}
            </Text>
        );
    }

    render() {
        const { buttonStyle, onPress, disabled } = this.props;
        return (
            <TouchableOpacity
                style={[
                    styles.textButton,
                    buttonStyle,
                ]}
                disabled={disabled}
                onPress={() => onPress()}
            >
                {this.renderTitle()}
                {this.renderDetails()}
            </TouchableOpacity>
        );
    }
}

export default UITextButton;

UITextButton.defaultProps = {
    buttonStyle: {},
    textStyle: {},
    detailsStyle: {},
    title: '',
    details: '',
    disabled: false,
    onPress: () => {
    },
};

UITextButton.propTypes = {
    buttonStyle: StylePropType,
    textStyle: StylePropType,
    detailsStyle: StylePropType,
    title: PropTypes.string,
    details: PropTypes.string,
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
};
