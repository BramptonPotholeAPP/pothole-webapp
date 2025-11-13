import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  BrightnessAuto as AutoModeIcon,
  Contrast as ContrastIcon,
  Language as LanguageIcon,
  Accessible as AccessibleIcon,
  Dashboard as DashboardIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material';
import { useSettingsStore } from '../store/settingsStore';
import { useTranslation } from '../i18n/useTranslation';

export const Settings = () => {
  const { t } = useTranslation();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const {
    themeMode,
    contrastMode,
    language,
    widgets,
    reducedMotion,
    screenReaderMode,
    fontSize,
    setThemeMode,
    setContrastMode,
    setLanguage,
    setReducedMotion,
    setScreenReaderMode,
    setFontSize,
    toggleWidget,
    resetSettings,
  } = useSettingsStore();

  const handleReset = () => {
    resetSettings();
    setShowResetDialog(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 700, mb: 4 }}
        role="heading"
        aria-level={1}
      >
        {t('settings.title')}
      </Typography>

      {showSuccessMessage && (
        <Alert severity="success" sx={{ mb: 3 }} role="alert">
          {t('common.success')} - {t('settings.resetSettings')}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Appearance Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{ p: 3, height: '100%' }}
            elevation={2}
            role="region"
            aria-label={t('settings.appearance')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <DarkModeIcon sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {t('settings.appearance')}
              </Typography>
            </Box>

            <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
              <FormLabel
                component="legend"
                sx={{ fontWeight: 600, mb: 1 }}
                id="theme-mode-label"
              >
                {t('settings.theme')}
              </FormLabel>
              <RadioGroup
                aria-labelledby="theme-mode-label"
                value={themeMode}
                onChange={(e) => setThemeMode(e.target.value as any)}
              >
                <FormControlLabel
                  value="light"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LightModeIcon fontSize="small" />
                      {t('settings.themeLight')}
                    </Box>
                  }
                />
                <FormControlLabel
                  value="dark"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DarkModeIcon fontSize="small" />
                      {t('settings.themeDark')}
                    </Box>
                  }
                />
                <FormControlLabel
                  value="auto"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AutoModeIcon fontSize="small" />
                      {t('settings.themeAuto')}
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <FormLabel
                component="legend"
                sx={{ fontWeight: 600, mb: 1 }}
                id="contrast-mode-label"
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ContrastIcon fontSize="small" />
                  {t('settings.contrast')}
                </Box>
              </FormLabel>
              <RadioGroup
                aria-labelledby="contrast-mode-label"
                value={contrastMode}
                onChange={(e) => setContrastMode(e.target.value as any)}
              >
                <FormControlLabel
                  value="normal"
                  control={<Radio />}
                  label={t('settings.contrastNormal')}
                />
                <FormControlLabel
                  value="high"
                  control={<Radio />}
                  label={t('settings.contrastHigh')}
                />
              </RadioGroup>
            </FormControl>
          </Paper>
        </Grid>

        {/* Language & Dashboard */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{ p: 3, height: '100%' }}
            elevation={2}
            role="region"
            aria-label={t('settings.language')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <LanguageIcon sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {t('settings.language')}
              </Typography>
            </Box>

            <FormControl fullWidth sx={{ mb: 4 }}>
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                aria-label={t('settings.language')}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="fr">Français</MenuItem>
                <MenuItem value="pa">ਪੰਜਾਬੀ (Punjabi)</MenuItem>
                <MenuItem value="hi">हिन्दी (Hindi)</MenuItem>
              </Select>
            </FormControl>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DashboardIcon sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {t('settings.dashboard')}
              </Typography>
            </Box>

            <List dense>
              {widgets.map((widget) => (
                <ListItem key={widget.id} role="listitem">
                  <ListItemText primary={widget.name} />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={widget.enabled}
                      onChange={() => toggleWidget(widget.id)}
                      inputProps={{
                        'aria-label': `Toggle ${widget.name}`,
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Accessibility Settings */}
        <Grid size={{ xs: 12 }}>
          <Paper
            sx={{ p: 3 }}
            elevation={2}
            role="region"
            aria-label={t('settings.accessibility')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AccessibleIcon sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {t('settings.accessibility')}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl component="fieldset" sx={{ width: '100%' }}>
                  <FormLabel
                    component="legend"
                    sx={{ fontWeight: 600, mb: 1 }}
                    id="font-size-label"
                  >
                    {t('settings.fontSize')}
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="font-size-label"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value as any)}
                  >
                    <FormControlLabel
                      value="small"
                      control={<Radio />}
                      label={t('settings.fontSmall')}
                    />
                    <FormControlLabel
                      value="medium"
                      control={<Radio />}
                      label={t('settings.fontMedium')}
                    />
                    <FormControlLabel
                      value="large"
                      control={<Radio />}
                      label={t('settings.fontLarge')}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <List>
                  <ListItem role="listitem">
                    <ListItemText
                      primary={t('settings.reducedMotion')}
                      secondary="Minimize animations and transitions"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={reducedMotion}
                        onChange={(e) => setReducedMotion(e.target.checked)}
                        inputProps={{
                          'aria-label': t('settings.reducedMotion'),
                        }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem role="listitem">
                    <ListItemText
                      primary={t('settings.screenReader')}
                      secondary="Optimize interface for screen readers"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={screenReaderMode}
                        onChange={(e) => setScreenReaderMode(e.target.checked)}
                        inputProps={{
                          'aria-label': t('settings.screenReader'),
                        }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Reset Button */}
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<ResetIcon />}
              onClick={() => setShowResetDialog(true)}
              aria-label={t('settings.resetSettings')}
            >
              {t('settings.resetSettings')}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Reset Confirmation Dialog */}
      <Dialog
        open={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        aria-labelledby="reset-dialog-title"
      >
        <DialogTitle id="reset-dialog-title">
          {t('settings.resetSettings')}
        </DialogTitle>
        <DialogContent>
          <Typography>{t('settings.resetConfirm')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetDialog(false)} autoFocus>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleReset} color="error" variant="contained">
            {t('common.reset')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
