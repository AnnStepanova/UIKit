import React, { useReducer } from 'react';
import { StyleSheet } from 'react-native';
import dayjs from 'dayjs';

import { useTheme, ColorVariants, UIBackgroundView } from '@tonlabs/uikit.hydrogen';
import { UIBottomSheet, UINavigationBar } from '@tonlabs/uikit.navigation';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { Calendar } from './components/Calendar';
import { SelectMonth } from './components/SelectMonth';
import { CalendarContext, useCalendar } from './calendarContext';
import { Utils } from '../utils';
import {
    PickerAction,
    PickerActionName,
    PickerOptionsType,
    PickerPropsType,
    PickerStateType,
    UIDateTimePickerMode,
    UIDateTimePickerType,
} from '../../types';
import { UITimeInput } from './components/UITimeInput';
import { DateTimeInputHeader } from './DateTimeInputHeader';

const reducer = (state: PickerStateType, action: PickerAction) => {
    switch (action.type) {
        case PickerActionName.Set:
            return { ...state, ...action.payload };
        case PickerActionName.ToggleTime:
            return { ...state, timeOpen: !state.timeOpen };
        case PickerActionName.ToggleMonth:
            return { ...state, monthOpen: !state.monthOpen };
        default:
            throw new Error('Unexpected action');
    }
};

const headerTitles: Record<UIDateTimePickerMode, string> = {
    [UIDateTimePickerMode.Time]: uiLocalized.DateTimePicker.ChooseTime,
    [UIDateTimePickerMode.Date]: uiLocalized.DateTimePicker.ChooseDate,
    [UIDateTimePickerMode.MonthYear]: uiLocalized.DateTimePicker.ChooseDate,
    [UIDateTimePickerMode.DateTime]: uiLocalized.DateTimePicker.ChooseDateTime,
};

function Content() {
    const contextValue = React.useContext(CalendarContext);
    switch (contextValue.mode) {
        default:
        case UIDateTimePickerMode.DateTime:
            return (
                <>
                    <Calendar />
                    <SelectMonth />
                    <UITimeInput />
                </>
            );
        case UIDateTimePickerMode.MonthYear:
            return <SelectMonth />;
        case UIDateTimePickerMode.Date:
            return (
                <>
                    <Calendar />
                    {/* <SelectMonth /> */}
                </>
            );
        case UIDateTimePickerMode.Time:
            return <UITimeInput />;
    }
}

function DatePickerContent(props: UIDateTimePickerType) {
    const theme = useTheme();
    const options: PickerOptionsType = {
        backgroundColor: theme[ColorVariants.BackgroundPrimary],
        textHeaderColor: theme[ColorVariants.TextPrimary],
        textDefaultColor: theme[ColorVariants.TextPrimary],
        selectedTextColor: theme[ColorVariants.StaticTextPrimaryLight],
        mainColor: theme[ColorVariants.BackgroundAccent],
        textSecondaryColor: theme[ColorVariants.TextSecondary],
        borderColor: theme[ColorVariants.BackgroundOverlay],
        textFontSize: 15,
        textHeaderFontSize: 17,
        headerAnimationDistance: 100,
        daysAnimationDistance: 200,
    };

    const calendarUtils = new Utils(props as UIDateTimePickerType & PickerPropsType<Utils>);

    const [state, dispatch] = useReducer(reducer, {
        activeDate: props.current ? new Date(props.current) : new Date(), // Date in calendar also save time
        selectedDate: props.selected ? dayjs(props.selected) : dayjs(),
        monthOpen: false, // TODO
    });

    const contextValue = {
        ...props,
        reverse: false,
        options: { ...options },
        utils: calendarUtils,
        isAmPmTime: props.isAmPmTime ?? false,
        state,
        dispatch,
        time: undefined,
        isTimeValidated: true,
    };

    return (
        <CalendarContext.Provider value={contextValue}>
            <UINavigationBar
                title={headerTitles[props.mode]}
                headerLeftItems={[
                    {
                        label: uiLocalized.Cancel,
                        onPress: props.onClose,
                    },
                ]}
                headerRightItems={[
                    {
                        label: uiLocalized.Done,
                        onPress: () => {
                            if (props.onValueRetrieved) {
                                props.onValueRetrieved(dayjs(state.time).toDate());
                            }
                        },
                    },
                ]}
            />
            <UIBackgroundView color={ColorVariants.BackgroundTertiary} style={styles.underline} />
            <Content />
        </CalendarContext.Provider>
    );
}

export function DatePicker(props: UIDateTimePickerType) {
    const theme = useTheme();

    return (
        <UIBottomSheet
            style={[
                {
                    backgroundColor: theme[ColorVariants.BackgroundPrimary],
                },
            ]}
            visible={props.visible}
            onClose={props.onClose}
        >
            <DatePickerContent {...props} />
        </UIBottomSheet>
    );
}

const styles = StyleSheet.create({
    underline: {
        height: 1,
    },
});
