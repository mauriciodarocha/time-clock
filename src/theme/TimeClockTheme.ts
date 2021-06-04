import { createMuiTheme, ThemeOptions } from "@material-ui/core";

interface MyThemeOptions extends ThemeOptions {}

const TimeClockTheme = createMuiTheme({
    palette: {
        success: {
            main: 'rgb(141, 232, 145)'
        },
        error: {
            main: 'rgb(247, 149, 149)'
        },
        warning: {
            main: 'rgb(251, 244, 144)'
        },
    },
    overrides: {
        MuiAlert: {
            root: {
                '& *': {
                    color: 'rgba(0,0,0,0.6)',
                }
            }
        }, 
        MuiFormControl: {
            root: {
                '& *': {
                    color: 'rgba(0,0,0,0.6)',
                    fontSize: '14px',
                },
            }
        },
        MuiButton: {
            root: {
                textTransform: 'initial',
                borderRadius: '2px',
                padding: '0 10px',
            },
            textPrimary: {
                padding: '5px 30px',
                color: 'rgba(0,0,0,0.5)',
                backgroundColor: 'rgba(175, 221, 233, 1)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                '&:hover': {
                    backgroundColor: 'rgba(175, 221, 233, 1)',
                    boxShadow: 'none'
                }
            },
        },
        MuiFormLabel: {
            root: {
                '&.Mui-focused': {
                    color: '#999'
                }
            }
        },
        MuiInput: {
            root: {
                borderBottomColor: '#999',
                '&.Mui-focused:after': {
                    borderBottomColor: '#999'
                },
            },
        },
        MuiFormHelperText: {
            root: {
                color: 'rgba(0,0,0,0.5)'
            }
        }
    },
} as MyThemeOptions);

export default TimeClockTheme;