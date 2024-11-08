import React, { useState, useEffect } from 'react';
import { Button, Switch, AppBar, Toolbar, Typography, Container, Paper, FormControlLabel, Box, Grid, Select, MenuItem } from '@mui/material';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

const App = () => {
  const [isTrackee, setIsTrackee] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [trackingStarted, setTrackingStarted] = useState(false);
  const [position, setPosition] = useState(null);
  const [locationMode, setLocationMode] = useState('hardcoded');
  const trackeePosition = locationMode === 'hardcoded' ? { latitude: 30.766851, longitude: 76.576063 } : position;

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const geofence = {
    latitude: 30.766851, // Hardcoded latitude
    longitude: 76.576063, // Hardcoded longitude
    radius: 1000, // Hardcoded radius in meters
  };

  useEffect(() => {
    if (isTrackee && locationMode === 'automatic') {
      navigator.geolocation.watchPosition(
        (pos) => {
          const coords = pos.coords;
          setPosition(coords);
        },
        (error) => console.error(error),
        { enableHighAccuracy: true, distanceFilter: 10 }
      );
    }
  }, [isTrackee, locationMode]);

  const startTracking = () => {
    setTrackingStarted(true);
    if (locationMode === 'hardcoded') {
      checkGeofence(trackeePosition);
    }
  };

  const stopTracking = () => {
    setTrackingStarted(false);
    setPosition(null);
  };

  const checkGeofence = (coords) => {
    const distance = calculateDistance(coords.latitude, coords.longitude, geofence.latitude, geofence.longitude);
    if (distance > geofence.radius) {
      alert('Geofence Alert: The trackee has exited the geofence boundary.');
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon1 - lon2) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const triggerGeofenceExitAlert = () => {
    alert('Geofence Alert: The trackee has exited the geofence boundary.');
  };

  const triggerGeofenceEntryAlert = () => {
    alert('Geofence Alert: The trackee has entered the geofence boundary.');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Geofencing Example</Typography>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
            label="Dark Mode"
          />
          {/* Invisible Buttons */}
          <Button 
            onClick={triggerGeofenceExitAlert} 
            style={{ 
              position: 'absolute', 
              top: 10, 
              right: 10, 
              backgroundColor: 'inherit', // same color as the background
              color: 'inherit',
              border: 'none', 
              padding: 0,
              width: '30px',
              height: '30px',
              cursor: 'pointer' 
            }}
          />
          <Button 
            onClick={triggerGeofenceEntryAlert} 
            style={{ 
              position: 'absolute', 
              top: 10, 
              left: 10, 
              backgroundColor: 'inherit', // same color as the background
              color: 'inherit',
              border: 'none', 
              padding: 0,
              width: '30px',
              height: '30px',
              cursor: 'pointer' 
            }}
          />
        </Toolbar>
      </AppBar>
      <Container>
        <Grid container spacing={3} justifyContent="center" alignItems="flex-start" style={{ minHeight: '80vh' }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '40px', textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>Trackee Panel</Typography>
              <FormControlLabel
                control={<Switch checked={isTrackee} onChange={() => setIsTrackee(!isTrackee)} />}
                label="Trackee Mode"
                style={{ marginBottom: '20px' }}
              />
              <Select
                value={locationMode}
                onChange={(e) => setLocationMode(e.target.value)}
                style={{ marginBottom: '20px' }}
              >
                <MenuItem value="hardcoded">Hardcoded Coordinates</MenuItem>
                <MenuItem value="automatic">Automatic (Google)</MenuItem>
              </Select>
              {isTrackee && (
                <Typography variant="body1" style={{ marginTop: '20px', fontSize: '18px' }}>
                  Your Position: {trackeePosition ? `${trackeePosition.latitude}, ${trackeePosition.longitude}` : 'Loading...'}
                </Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '40px', textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>Tracker Panel</Typography>
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: '20px', fontSize: '18px' }}
                onClick={startTracking}
                disabled={trackingStarted}
              >
                {trackingStarted ? 'Tracking Started' : 'Start Tracking'}
              </Button>
              {trackingStarted && (
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ marginTop: '20px', fontSize: '18px' }}
                  onClick={stopTracking}
                >
                  Stop Tracking
                </Button>
              )}
              {trackingStarted && (
                <Typography variant="body1" style={{ marginTop: '20px', fontSize: '18px' }}>
                  Tracking in progress...
                </Typography>
              )}
              <Typography variant="body1" style={{ marginTop: '20px', fontSize: '18px' }}>
                Trackee Position: {trackeePosition ? `${trackeePosition.latitude}, ${trackeePosition.longitude}` : 'Not available'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default App;