import './App.css';
import TopBar from './TopBar';
import { ThemeProvider } from '@material-ui/core/styles'
import { theme } from './theme'

function App() {
  return (
	     <ThemeProvider theme={theme}>
	  <TopBar/>
		  </ThemeProvider>
  );
}

export default App;
