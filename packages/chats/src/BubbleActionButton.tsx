import * as React from 'react';
import { View } from 'react-native';

import {
    UIMsgButton,
    UIMsgButtonType,
    UIMsgButtonCornerPosition,
} from '@tonlabs/uikit.hydrogen';
import { BubblePosition, useBubbleContainerStyle, useBubblePosition } from './useBubblePosition';
import type { ActionButtonMessage } from './types';

const getButtonRadius = (
    options: ActionButtonMessage,
    position: BubblePosition,
) => {
    if (position === BubblePosition.left && options.firstFromChain) {
        return UIMsgButtonCornerPosition.TopLeft;
    } else if (position === BubblePosition.right && options.lastFromChain) {
        return UIMsgButtonCornerPosition.BottomRight;
    }
    return undefined;
};

export function BubbleActionButton(message: ActionButtonMessage) {
    const { status, text, disabled, onPress } = message; // textMode = 'ellipsize',
    const position = useBubblePosition(status);
    const containerStyle = useBubbleContainerStyle(message);

    return (
        <View style={containerStyle} onLayout={message.onLayout}>
            <UIMsgButton
                disabled={disabled}
                onPress={onPress}
                testID={`chat_action_cell_${text}`}
                title={text}
                type={UIMsgButtonType.Secondary}
                cornerPosition={getButtonRadius(message, position)}
            />
        </View>
    );
    // TODO: add textMode processing to UIMsgButton if needed
    // <TouchableOpacity
    //     style={[
    //         textMode !== 'fit' && styles.buttonFixedHeight,
    //     ]}
    // >
    //     <UILabel
    //         numberOfLines={textMode === 'ellipsize' ? 1 : undefined}
    //     >
    //         {text}
    //     </UILabel>
    // </TouchableOpacity>
}
