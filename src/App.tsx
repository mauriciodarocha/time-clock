import MomentUtils from '@date-io/moment';
import { ThemeProvider } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { useState } from 'react';
import './App.css';
import MainStructure from './features/main/MainStructure';
import { StoreProvider } from './store/Store';
import TimeClockTheme from './theme/TimeClockTheme'
import moment from "moment";

const App: React.FunctionComponent = () => {
  const [locale,] = useState("en");
  moment.locale("en");
  
  return (
    <ThemeProvider theme={TimeClockTheme}>
      <StoreProvider>
        <MuiPickersUtilsProvider utils={MomentUtils} locale={locale}>
          <MainStructure />
        </MuiPickersUtilsProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}
 
export default App;