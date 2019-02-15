import { StyleSheet } from 'react-native';

import UIColor from '../UIColor';
import UIFont from '../UIFont';
import UIConstant from '../UIConstant';

const text = {
    ...UIConstant.disabledOutline(),
    backgroundColor: 'transparent',
    textAlign: 'left',
};

const primary = {
    ...text,
    color: UIColor.textPrimary(),
};

const caution = {
    ...text,
    color: UIColor.textCaution(),
};

const secondary = {
    ...text,
    color: UIColor.textSecondary(),
};

const error = {
    ...text,
    color: UIColor.error(),
};

const success = {
    ...text,
    color: UIColor.success(),
};

const tertiary = {
    ...text,
    color: UIColor.textTertiary(),
};

const white = {
    ...text,
    color: UIColor.white(),
};

const action = {
    ...text,
    color: UIColor.primary(),
};

const UITextStyle = StyleSheet.create({
    // [Text Primary]
    // HeadLine - fontSize: 64, lineHeight: 84
    primaryHeadlineLight: {
        ...primary,
        ...UIFont.headlineLight(),
    },

    // Title - fontSize: 36, lineHeight: 48
    primaryTitleLight: {
        ...primary,
        ...UIFont.titleLight(),
    },
    // Subtitle - fontSize: 24, lineHeight: 32
    primarySubtitleLight: {
        ...primary,
        ...UIFont.subtitleLight(),
    },
    primarySubtitleBold: {
        ...primary,
        ...UIFont.subtitleBold(),
    },
    primarySubtitleRegular: {
        ...primary,
        ...UIFont.subtitleRegular(),
    },
    // Accent - fontSize: 20, lineHeight: 28
    primaryAccentRegular: {
        ...primary,
        ...UIFont.accentRegular(),
    },
    primaryAccentBold: {
        ...primary,
        ...UIFont.accentBold(),
    },
    // Body
    primaryBodyRegular: {
        ...primary,
        ...UIFont.bodyRegular(),
    },
    primaryBodyMedium: {
        ...primary,
        ...UIFont.bodyMedium(),
    },
    primaryBodyBold: {
        ...primary,
        ...UIFont.bodyBold(),
    },
    // Small - fontSize: 16, lineHeight: 20
    primarySmallMedium: {
        ...primary,
        ...UIFont.smallMedium(),
    },
    primarySmallRegular: {
        ...primary,
        ...UIFont.smallRegular(),
    },
    primarySmallBold: {
        ...primary,
        ...UIFont.smallBold(),
    },
    // Caption - fontSize: 14, lineHeight: 20
    primaryCaptionRegular: {
        ...primary,
        ...UIFont.captionRegular(),
    },
    primaryCaptionMedium: {
        ...primary,
        ...UIFont.captionMedium(),
    },
    // Tiny - fontSize: 12, lineHeight: 16
    primaryTinyRegular: {
        ...primary,
        ...UIFont.tinyRegular(),
    },
    primaryTinyMedium: {
        ...primary,
        ...UIFont.tinyMedium(),
    },

    // [Text Secondary]
    // Accent - fontSize: 20, lineHeight: 28
    secondaryAccentRegular: {
        ...secondary,
        ...UIFont.accentRegular(),
    },
    // Body - fontSize: 18, lineHeight: 24
    secondaryBodyRegular: {
        ...secondary,
        ...UIFont.bodyRegular(),
    },
    secondaryBodyMedium: {
        ...secondary,
        ...UIFont.bodyMedium(),
    },
    secondaryBodyBold: {
        ...secondary,
        ...UIFont.bodyBold(),
    },
    // Small - fontSize: 16, lineHeight: 20
    secondarySmallRegular: {
        ...secondary,
        ...UIFont.smallRegular(),
    },
    secondarySmallMedium: {
        ...secondary,
        ...UIFont.smallRegular(),
    },
    // Caption - fontSize: 14, lineHeight: 20
    secondaryCaptionRegular: {
        ...secondary,
        ...UIFont.captionRegular(),
    },
    secondaryCaptionMedium: {
        ...secondary,
        ...UIFont.captionMedium(),
    },
    // Tiny - fontSize: 12, lineHeight: 16
    secondaryTinyRegular: {
        ...secondary,
        ...UIFont.tinyRegular(),
    },
    secondaryTinyMedium: {
        ...secondary,
        ...UIFont.tinyMedium(),
    },

    // [Text Caution]
    // Caption - fontSize: 14, lineHeight: 20
    cautionCaptionRegular: {
        ...caution,
        ...UIFont.captionRegular(),
    },

    // [Text success]
    // Caption - fontSize: 14, lineHeight: 20
    successCaptionRegular: {
        ...success,
        ...UIFont.captionRegular(),
    },
    successSmallRegular: {
        ...success,
        ...UIFont.smallRegular(),
    },

    // [Text tertiary]
    // Body - fontSize: 18, lineHeight: 24
    tertiaryBodyRegular: {
        ...tertiary,
        ...UIFont.bodyRegular(),
    },
    // Tiny - fontSize: 12, lineHeight: 16
    tertiaryTinyRegular: {
        ...tertiary,
        ...UIFont.tinyRegular(),
    },
    // Tiny - fontSize: 12, lineHeight: 16
    tertiaryTinyMedium: {
        ...tertiary,
        ...UIFont.tinyMedium(),
    },
    // Tiny - fontSize: 12, lineHeight: 16
    tertiaryTinyBold: {
        ...tertiary,
        ...UIFont.tinyBold(),
    },

    // [Text white]
    // Tiny - fontSize: 12, lineHeight: 16
    whiteTinyRegular: {
        ...white,
        ...UIFont.tinyRegular(),
    },

    // [Text Action]
    // Small - fontSize: 16, lineHeight: 20
    actionSmallMedium: {
        ...action,
        ...UIFont.smallMedium(),
    },

    // [Text Error]
    errorCaptionMedium: {
        ...error,
        ...UIFont.captionMedium(),
    },
});

export default UITextStyle;
