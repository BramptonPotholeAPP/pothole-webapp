import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

interface CitizenReport {
  location: string;
  roadName: string;
  ward: string;
  description: string;
  severity: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  photo?: File | null;
}

export const CitizenPortal = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  
  const [formData, setFormData] = useState<CitizenReport>({
    location: '',
    roadName: '',
    ward: '',
    description: '',
    severity: 'medium',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    photo: null,
  });

  const steps = ['Location Details', 'Pothole Information', 'Contact Information', 'Review & Submit'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (field: keyof CitizenReport, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormData({ ...formData, photo: event.target.files[0] });
    }
  };

  const handleSubmit = () => {
    // Generate a mock report ID
    const newReportId = `CR-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setReportId(newReportId);
    setSubmitted(true);
    
    // In a real app, this would send data to backend
    console.log('Citizen Report Submitted:', formData, newReportId);
  };

  const handleTrackReport = () => {
    // Mock tracking data
    const mockStatus = ['Received', 'Under Review', 'Scheduled', 'In Progress', 'Completed'][
      Math.floor(Math.random() * 5)
    ];
    
    setTrackingResult({
      id: trackingId,
      status: mockStatus,
      submittedDate: new Date().toLocaleDateString(),
      lastUpdate: new Date().toLocaleDateString(),
      estimatedCompletion: 'Within 2 weeks',
      ward: 'Ward ' + (Math.floor(Math.random() * 10) + 1),
    });
  };

  const handleNewReport = () => {
    setSubmitted(false);
    setActiveStep(0);
    setFormData({
      location: '',
      roadName: '',
      ward: '',
      description: '',
      severity: 'medium',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      photo: null,
    });
  };

  if (submitted) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Submit a Pothole
        </Typography>
        
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 600, mx: 'auto', mt: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Report Submitted Successfully!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Thank you for helping keep Brampton's roads safe. Your report has been received and will be reviewed by our maintenance team.
          </Typography>
          
          <Box sx={{ mt: 3, p: 3, backgroundColor: 'grey.100', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Report ID
            </Typography>
            <Typography variant="h4" color="primary" sx={{ fontFamily: 'monospace', mb: 2 }}>
              {reportId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Save this ID to track your report status. You will also receive an email confirmation.
            </Typography>
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              What happens next?
            </Typography>
            <Box display="flex" flexDirection="column" gap={2} textAlign="left">
              <Box display="flex" gap={2}>
                <Typography variant="body2" color="primary">1.</Typography>
                <Typography variant="body2">
                  Our team will review your report within 24 hours
                </Typography>
              </Box>
              <Box display="flex" gap={2}>
                <Typography variant="body2" color="primary">2.</Typography>
                <Typography variant="body2">
                  We'll assess the severity and schedule repairs
                </Typography>
              </Box>
              <Box display="flex" gap={2}>
                <Typography variant="body2" color="primary">3.</Typography>
                <Typography variant="body2">
                  You'll receive email updates on the repair status
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Button
            variant="contained"
            onClick={handleNewReport}
            sx={{ mt: 4 }}
          >
            Submit Another Report
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Submit a Pothole
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Report a pothole in your community and help us maintain safer roads
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Report Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Where is the pothole located?
                </Typography>
                <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Street Address or Intersection"
                    placeholder="e.g., 123 Main St or Queen St & Kennedy Rd"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <LocationOnIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                  <Box display="flex" gap={2}>
                    <TextField
                      fullWidth
                      label="Road Name"
                      value={formData.roadName}
                      onChange={(e) => handleInputChange('roadName', e.target.value)}
                      required
                    />
                    <FormControl fullWidth required>
                      <InputLabel>Ward</InputLabel>
                      <Select
                        value={formData.ward}
                        label="Ward"
                        onChange={(e) => handleInputChange('ward', e.target.value)}
                      >
                        {[...Array(10)].map((_, i) => (
                          <MenuItem key={i + 1} value={`Ward ${i + 1}`}>
                            Ward {i + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Box>
            )}

            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Tell us about the pothole
                </Typography>
                <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 2 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Severity Estimate</InputLabel>
                    <Select
                      value={formData.severity}
                      label="Severity Estimate"
                      onChange={(e) => handleInputChange('severity', e.target.value)}
                    >
                      <MenuItem value="low">Low - Small surface crack</MenuItem>
                      <MenuItem value="medium">Medium - Noticeable pothole</MenuItem>
                      <MenuItem value="high">High - Large pothole, avoid if possible</MenuItem>
                      <MenuItem value="critical">Critical - Dangerous, immediate attention needed</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    placeholder="Describe the pothole, its size, and any other relevant details..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<PhotoCameraIcon />}
                    fullWidth
                  >
                    Upload Photo (Optional)
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </Button>
                  {formData.photo && (
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      Photo uploaded: {formData.photo.name}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Your contact information
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  We'll use this to send you updates on the repair status
                </Typography>
                <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    required
                  />
                  <Box display="flex" gap={2}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      label="Phone Number (Optional)"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    />
                  </Box>
                </Box>
              </Box>
            )}

            {activeStep === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Review Your Report
                </Typography>
                <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 2 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="primary">Location</Typography>
                      <Typography>{formData.location}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formData.roadName} - {formData.ward}
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="primary">Pothole Details</Typography>
                      <Chip
                        label={formData.severity.charAt(0).toUpperCase() + formData.severity.slice(1)}
                        size="small"
                        color={formData.severity === 'critical' ? 'error' : formData.severity === 'high' ? 'warning' : 'default'}
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2">{formData.description}</Typography>
                    </CardContent>
                  </Card>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="primary">Contact</Typography>
                      <Typography>{formData.contactName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formData.contactEmail}
                        {formData.contactPhone && ` • ${formData.contactPhone}`}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  endIcon={<SendIcon />}
                >
                  Submit Report
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Track Report & Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Track Report */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Track Your Report
            </Typography>
            <TextField
              fullWidth
              label="Report ID"
              placeholder="CR-2025-XXXXXX"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="outlined"
              onClick={handleTrackReport}
              disabled={!trackingId}
            >
              Check Status
            </Button>
            
            {trackingResult && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Status: {trackingResult.status}</Typography>
                <Typography variant="body2">Ward: {trackingResult.ward}</Typography>
                <Typography variant="body2">Submitted: {trackingResult.submittedDate}</Typography>
                <Typography variant="body2">Est. Completion: {trackingResult.estimatedCompletion}</Typography>
              </Alert>
            )}
          </Paper>

          {/* Info Card */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Reporting Tips
              </Typography>
              <Typography variant="body2" paragraph>
                • Be as specific as possible about the location
              </Typography>
              <Typography variant="body2" paragraph>
                • Photos help us assess the severity
              </Typography>
              <Typography variant="body2" paragraph>
                • Include landmarks or nearby intersections
              </Typography>
              <Typography variant="body2">
                • You'll receive email updates at each stage
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
