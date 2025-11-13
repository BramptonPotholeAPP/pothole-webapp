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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

interface PotholeReport {
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
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  
  const [formData, setFormData] = useState<PotholeReport>({
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

  const handleInputChange = (field: keyof PotholeReport, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormData({ ...formData, photo: event.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate a mock report ID
    const newReportId = `PH-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setReportId(newReportId);
    setSubmitted(true);
    
    // In a real app, this would send data to backend
    console.log('Pothole Report Submitted:', formData, newReportId);
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
        {/* Submission Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="600" sx={{ mb: 3 }}>
              Pothole Report Form
            </Typography>

            <form onSubmit={handleSubmit}>
              {/* Location Information */}
              <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
                <LocationOnIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Location Information
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  fullWidth
                  label="Street Address or Intersection *"
                  placeholder="e.g., 123 Main St or Queen St & Kennedy Rd"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Road Name *"
                      value={formData.roadName}
                      onChange={(e) => handleInputChange('roadName', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
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
                  </Grid>
                </Grid>
              </Box>

              {/* Pothole Details */}
              <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
                Pothole Details
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <FormControl fullWidth required>
                  <InputLabel>Severity Level</InputLabel>
                  <Select
                    value={formData.severity}
                    label="Severity Level"
                    onChange={(e) => handleInputChange('severity', e.target.value)}
                  >
                    <MenuItem value="low">Low - Small surface crack</MenuItem>
                    <MenuItem value="medium">Medium - Noticeable pothole</MenuItem>
                    <MenuItem value="high">High - Large pothole, difficult to avoid</MenuItem>
                    <MenuItem value="critical">Critical - Dangerous, immediate attention needed</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Description *"
                  multiline
                  rows={4}
                  placeholder="Describe the pothole size, location details, any landmarks nearby..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />

                <Box>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<PhotoCameraIcon />}
                    fullWidth
                    sx={{ mb: 1 }}
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
                    <Alert severity="success" sx={{ mt: 1 }}>
                      Photo uploaded: {formData.photo.name}
                    </Alert>
                  )}
                </Box>
              </Box>

              {/* Contact Information */}
              <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
                Your Contact Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                We'll use this to send you updates on the repair status
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  fullWidth
                  label="Full Name *"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                  required
                />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Email Address *"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Phone Number (Optional)"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                endIcon={<SendIcon />}
                fullWidth
                sx={{ mt: 4 }}
              >
                Submit Report
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Info Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Track Report */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Track Your Report
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Already submitted? Check your report status
            </Typography>
            <TextField
              fullWidth
              label="Report ID"
              placeholder="PH-2025-XXXXXX"
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
                <Typography variant="subtitle2" fontWeight="600">
                  Status: {trackingResult.status}
                </Typography>
                <Typography variant="body2">Ward: {trackingResult.ward}</Typography>
                <Typography variant="body2">Submitted: {trackingResult.submittedDate}</Typography>
                <Typography variant="body2">Est. Completion: {trackingResult.estimatedCompletion}</Typography>
              </Alert>
            )}
          </Paper>

          {/* Info Cards */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                📝 Submission Tips
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Be as specific as possible about the location
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Photos help us assess severity faster
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Include nearby landmarks or intersections
                </Typography>
                <Typography component="li" variant="body2">
                  You'll receive email updates at each stage
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="success.main">
                ⏱️ What Happens Next?
              </Typography>
              <Box display="flex" flexDirection="column" gap={1.5}>
                <Box>
                  <Typography variant="body2" fontWeight="600">
                    1. Review (24-48 hours)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Our team reviews your submission
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="600">
                    2. Assessment
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Severity level verified and prioritized
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="600">
                    3. Scheduling
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Repair work scheduled based on priority
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="600">
                    4. Completion
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    You'll be notified when repairs are done
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
