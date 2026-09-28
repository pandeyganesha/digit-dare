import { Box, ThemeProvider, createTheme } from '@mui/system'

const theme = createTheme({
  palette: {
    background: {
      primary: 'rgb(217, 238, 233)'
    },
    text: {
      primary: '#173A5E',
      secondary: '#46505A',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <Box
            sx = {{
              bgcolor: 'background.primary',
              boxShadow: 1,
              borderRadius: 2,
              width: '60vh',
              height: '60vh',
            }}/>
      </Box>
    </ThemeProvider>
  );
}

export default App
