import {Color, SvgProps} from 'react-native-svg';
import React, {FC, ComponentType} from 'react';

export default (Icon, color) => (
  props,
) => <Icon color={color} {...props} />;
