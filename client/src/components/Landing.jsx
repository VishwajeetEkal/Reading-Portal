import React from 'react';
import {Typography, StepLabel, CssBaseline, Container, Stack, Box, ButtonGroup, Grid,createTheme, ThemeProvider,Paper} from '@mui/material';
import {Button} from '@mui/material';
import landing from '../images/Landing.jpg'

const Landing = () => {
  return (
  <>
    <Box sx={{background:'#1c1a1a'}}>
        <Typography variant='h2' align="center" color="#19529c">UBook</Typography>
        <Typography variant='h5' align="center" color="#cc232e" gutterBottom>Easy Book, Easy Read</Typography>
      <Box
        sx={{
          width: '100%',
          height: 835,
          backgroundImage: 'url('+landing+')',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          display:'Flex',
          justifyContent:'center',
        }}
      >
        <Box sx={{width:'25%',padding:20}}>
          <Box sx={{background:'white',opacity:'0.7'}} textAlign="center" mt={2} padding={10}>
          <StepLabel sx={{justifyContent:'center'} }icon={ <img src={require("../images/ubook.png")} alt="" width="250" height="90" /> } />
          <Typography variant='h4' align ='center' color='MenuText'> Please choose to:</Typography>
            <Button style = {{marginRight:"32px"}} variant="contained"href="/Login">Login</Button>
            <Button variant="contained"href="/signup">Signup</Button>          
          </Box>
        </Box>       
      </Box>           
    </Box> 
  </>
  );
}
export default Landing;
/*<Box textAlign="center" mt={2}>
            <Button style = {{marginRight:"32px"}} variant="contained"href="/Login">Login</Button>
            <Button variant="contained"href="/signup">Signup</Button>          
          </Box>*/   