import React, {useState} from "react";
import {ButtonStylesParams, ColorScheme, ColorSchemeProvider, MantineProvider, MantineTheme} from "@mantine/core";
import {useColorScheme} from "@mantine/hooks";

export interface ThemeContextType {
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

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
                    root: {height: 42, padding: '0 30px', radius: 'xs', variant: 'light'},
                })
            }}
        >
            {children}
        </MantineProvider>
    </ColorSchemeProvider>)
};

const useTheme = () => {
    const context = React.useContext(ThemeContext);
    if (context === undefined) {
        throw new Error(
            "useTheme must be used within a AuthProvider"
        );
    }
    return context;
}

export {ThemeProvider, useTheme}