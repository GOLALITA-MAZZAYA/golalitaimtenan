import React from "react";
import { StatusBar } from "react-native";

export const GeneralStatusBarColor= ({ backgroundColor, ...props }) => {
// @ts-ignore
    return <StatusBar
        hidden={true}
        translucent
        backgroundColor={backgroundColor}
        {...props}
    />
}

