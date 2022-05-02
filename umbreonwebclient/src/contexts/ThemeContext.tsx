import React, {useEffect, useMemo, useState} from "react";
import {
    ColorScheme,
    ColorSchemeProvider,
    MantineProvider,
    MantineTheme,
    useMantineColorScheme,
    useMantineTheme
} from "@mantine/core";
import {useColorScheme} from "@mantine/hooks";
import {FlagKey, getCookieFlag, setCookieFlag} from "../utils/cookieFlag";

const ThemeProvider: React.FC = ({children}) => {
    const preferredColorScheme = useColorScheme(getCookieFlag(FlagKey.DARK_MODE, 'light') ? 'dark' : 'light');
    const [colorScheme, setColorScheme] = useState<ColorScheme>(preferredColorScheme);
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    useEffect(() => {
        if (preferredColorScheme === 'dark') {
            setCookieFlag(FlagKey.DARK_MODE, true)
        } else {
            setCookieFlag(FlagKey.DARK_MODE, false)
        }
    }, [preferredColorScheme]);

    return (<ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
    >
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                colorScheme,
                fontFamily: 'Open Sans, sans serif',
                spacing: {xs: 15, sm: 20, md: 25, lg: 30, xl: 40},
            }}
            defaultProps={{
                Card: (theme: MantineTheme) => ({
                    root: {shadow: 'xl', p: 'lg'}
                })
            }}
        >
            {children}
        </MantineProvider>
    </ColorSchemeProvider>)
};

const useTheme = () => {
    const colourContext = useMantineColorScheme();
    const themeContext = useMantineTheme();
    if (!themeContext || !colourContext) {
        throw new Error(
            "useTheme must be used within a AuthProvider"
        );
    }
    return useMemo(() => (
            {...themeContext, ...colourContext}
        ), [colourContext, themeContext]
    );
}

export {ThemeProvider, useTheme}