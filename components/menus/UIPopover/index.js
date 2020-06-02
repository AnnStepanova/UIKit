// @flow
import React from 'react';
import { View, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { Popover } from 'react-native-simple-popover';

import type { ViewLayoutEvent } from 'react-native/Libraries/Components/View/ViewPropTypes';

import UIColor from '../../../helpers/UIColor';
import UIPopoverBackground from '../UIPopoverBackground';
import UIDevice from '../../../helpers/UIDevice';
import UIEventHelper from '../../../helpers/UIEventHelper';
import UICustomSheet from '../../menus/UICustomSheet';
import UIComponent from '../../UIComponent';
import UIStyle from '../../../helpers/UIStyle';
import UIConstant from '../../../helpers/UIConstant';

import type { ClassNameProp } from '../../../types';

let masterRef = null;
const MENU_TRIGGER = 'menu-trigger';

type Placement = 'top' | 'bottom' | 'left' | 'right';

export type PopoverProps = {
    placement?: Placement,
    children?: React$Node,
    testID?: string,
    style?: ViewStyleProp,
    containerStyle?: ViewStyleProp,
    componentStyle?: ViewStyleProp,
    narrow?: boolean,
    component?: React$Node,
    needCloseOnClick?: boolean,
    // if clicked element contains this className, then not to close popover
    exceptionClassName?: string,
    narrowContainerStyle?: ViewStyleProp,
    onShow: () => void,
    onHide?: () => void,
};

export type PopoverState = {
    isVisible: boolean,
    triggerWidth: number,
    marginLeft: number,
};

const styles = StyleSheet.create({
    slimContainer: {
        width: UIConstant.elasticWidthHalfNormal(),
    },
});

export default class UIPopover<Props, State>
    extends UIComponent<any & PopoverProps, any & PopoverState> {
    static defaultProps: any & PopoverProps = {
        placement: 'bottom',
        narrow: false,
        needCloseOnClick: true,
        onShow: () => {},
    };

    static hide() {
        if (masterRef) {
            masterRef.hide();
        }
    }

    // This trick with class name required to suppress flow warning
    // on undeclared className prop.
    static setClassNameTrick: ClassNameProp = {
        className: MENU_TRIGGER,
    };

    firstClickIgnored: boolean;
    countdown: ?TimeoutID;
    isMenu: boolean;
    constructor(props: Props & PopoverProps) {
        super(props);
        this.firstClickIgnored = false;
        this.isMenu = false;
        this.state = {
            isVisible: false,
            triggerWidth: 0,
            marginLeft: 0,
        };
        this.countdown = null;
    }

    // Events
    onTriggerLayout = (e: ViewLayoutEvent) => {
        const { width: triggerWidth } = e.nativeEvent.layout;
        this.setTriggerWidth(triggerWidth);
    };

    onLayout = (e: ViewLayoutEvent) => {
        const { width: menuWidth } = e.nativeEvent.layout;
        const triggerWidth = this.getTriggerWidth();
        if (menuWidth > triggerWidth) {
            this.setMarginLeft((triggerWidth - menuWidth) / 2);
        }
    };

    onShow = async (ignoreFirstClick: boolean = false) => {
        if (this.needPopover()) {
            if (!this.isVisible()) {
                UIPopover.hide(); // hide previously opened masterRef if any

                this.initClickListenerForWeb(ignoreFirstClick);
                UIPopoverBackground.initBackgroundForTablet(() => UIPopover.hide());
                await this.setIsVisible();
                masterRef = this;

                setTimeout(() => {
                    this.props.onShow();
                }, UIConstant.animationSmallDuration());
            } else {
                this.hide();
            }
        } else if (this.isMenu) {
            this.showNarrowMenu();
        } else {
            UICustomSheet.show({
                containerStyle: this.props.narrowContainerStyle,
                component: this.props.component,
                onShow: this.props.onShow,
            });
        }
    };

    // Setters
    setIsVisible(isVisible: boolean = true) {
        return new Promise<void>((resolve) => {
            this.setStateSafely({ isVisible }, resolve);
        });
    }

    setTriggerWidth(triggerWidth: number) {
        this.setStateSafely({ triggerWidth });
    }

    setMarginLeft(marginLeft: number) {
        this.setStateSafely({ marginLeft });
    }

    // Getters
    getTriggerWidth(): number {
        return this.state.triggerWidth;
    }

    getMarginLeft(): number {
        return this.state.marginLeft;
    }

    isVisible(): boolean {
        return this.state.isVisible;
    }

    needPopover() {
        return (Platform.OS === 'web' && !this.props.narrow) || UIDevice.isTablet();
    }

    // Actions
    // When using `LongPress` to display the menu, it is necessary to ignore
    // the first click event that occurs once releasing the click/touch on web
    // otherwise, the menu will hide automatically once releasing the touch/click
    // preventing to be able to select any option from the menu.
    show() {
        this.onShow(true);
        this.clearHideTimeout();
        this.countdown = setTimeout(() => this.hide(), 60000); // 1 min
    }

    clearHideTimeout() {
        if (this.countdown) {
            clearTimeout(this.countdown);
        }
    }

    hide() {
        if (this.needPopover()) {
            if (this.props.onHide) {
                this.props.onHide();
            }

            this.firstClickIgnored = false;
            this.setIsVisible(false);

            this.deinitClickListenerForWeb();
            UIPopoverBackground.hideBackgroundForTablet();
            masterRef = null;
        }

        this.clearHideTimeout();
    }

    clickListener: (e: any) => void;
    initClickListenerForWeb(ignoreFirstClick: boolean = false) {
        if (Platform.OS !== 'web') {
            return;
        }
        const listenerType =
            UIDevice.isDesktopWeb() || UIDevice.isWebkit()
                ? 'click'
                : 'touchend';
        this.clickListener = (e: any) => {
            if (!this.props.needCloseOnClick) {
                return;
            }

            if (ignoreFirstClick && !this.firstClickIgnored) {
                this.firstClickIgnored = true;
                return;
            }
            const eventResult = UIEventHelper.checkEventTarget(e, MENU_TRIGGER, this.props.exceptionClassName);
            if (!eventResult) {
                this.hide();
            }
        };
        window.addEventListener(listenerType, this.clickListener);
    }

    deinitClickListenerForWeb() {
        if (Platform.OS !== 'web') {
            return;
        }
        const listenerType =
            UIDevice.isDesktopWeb() || UIDevice.isWebkit()
                ? 'click'
                : 'touchend';
        window.removeEventListener(listenerType, this.clickListener);
    }

    showNarrowMenu(): void {
        // Virtual
    }

    // Render
    renderMenu(): ?(React$Node[]) {
        return null;
    }

    renderPopover = () => {
        const menuStyle = this.isMenu
            ? [UIStyle.padding.horizontal()]
            : [styles.slimContainer, UIStyle.padding.default()];
        return (
            <View
                {...UIPopover.setClassNameTrick}
                style={[
                    UIStyle.border.radiusDefault(),
                    UIStyle.common.cardShadow(),
                    UIColor.getBackgroundColorStyle(UIColor.backgroundPrimary()),
                    ...menuStyle,
                    this.props.componentStyle,
                    { marginLeft: this.getMarginLeft() },
                ]}
                onLayout={this.onLayout}
            >
                {this.props.component || this.renderMenu()}
            </View>
        );
    };

    render() {
        const {
            placement,
            testID,
            children,
            containerStyle,
            style,
        } = this.props;
        const testIDProp = testID ? { testID } : null;

        return (
            <Popover
                placement={placement}
                arrowWidth={0}
                arrowHeight={0}
                isVisible={this.isVisible()}
                component={this.renderPopover}
            >
                <TouchableOpacity
                    {...UIPopover.setClassNameTrick}
                    {...testIDProp}
                    onPress={this.onShow}
                    onLayout={this.onTriggerLayout}
                    style={containerStyle}
                >
                    <View pointerEvents="none" style={style}>
                        {children}
                    </View>
                </TouchableOpacity>
            </Popover>
        );
    }
}
