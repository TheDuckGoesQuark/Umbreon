import React, {useMemo, useState} from "react";
import {
    ButtonStylesParams,
    ColorScheme,
    ColorSchemeProvider,
    MantineProvider,
    MantineTheme, useMantineColorScheme,
    useMantineTheme
} from "@mantine/core";
import {useColorScheme} from "@mantine/hooks";

const ThemeProvider: React.FC = ({children}) => {
    const preferredColorScheme = useColorScheme();
    const [colorScheme, setColorScheme] = useState<ColorScheme>(preferredColorScheme);
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    return (<ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
    >
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                fontFamily: 'Open Sans, sans serif',
                spacing: {xs: 15, sm: 20, md: 25, lg: 30, xl: 40},
                colors: {
                    dark: ['#030303'],
                    neutral: ['#2441b2'],
                    light: ['#1768ab'],
                    lightest: ['#06bbe0'],
                    white: ['#ffffff'],
                },
            }}
            defaultProps={{
                Button: (theme: MantineTheme, params: ButtonStylesParams) => ({
                    root: {height: 42, padding: '0 30px', radius: 'xs'},
                }),
                Header: (theme: MantineTheme, params: ButtonStylesParams) => ({
                    root: {height: 100},
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