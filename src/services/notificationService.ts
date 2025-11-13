import type { Notification, EmailAlert, EscalationRule } from '../types/notification';
import type { Pothole } from '../types/pothole';

// Escalation rules based on priority
const ESCALATION_RULES: EscalationRule[] = [
  {
    priority: 'critical',
    deadlineDays: 1,
    escalateAfterDays: 1,
    notifyRoles: ['supervisor', 'manager', 'director'],
  },
  {
    priority: 'high',
    deadlineDays: 3,
    escalateAfterDays: 2,
    notifyRoles: ['supervisor', 'manager'],
  },
  {
    priority: 'medium',
    deadlineDays: 7,
    escalateAfterDays: 5,
    notifyRoles: ['supervisor'],
  },
  {
    priority: 'low',
    deadlineDays: 14,
    escalateAfterDays: 10,
    notifyRoles: ['supervisor'],
  },
];

class NotificationService {
  // Send email alert for new submission
  async sendSubmissionEmail(pothole: Pothole, contactEmail: string): Promise<EmailAlert> {
    const email: EmailAlert = {
      to: contactEmail,
      subject: `Pothole Report Confirmed - ID: ${pothole.id}`,
      body: `
Dear Resident,

Thank you for reporting a pothole in Brampton. Your report has been received and logged in our system.

Report Details:
- Report ID: ${pothole.id}
- Location: ${pothole.road_name || 'Not specified'}
- Ward: ${pothole.ward || 'Not specified'}
- Priority: ${pothole.priority?.toUpperCase() || 'MEDIUM'}
- Detected: ${new Date(pothole.detected_at).toLocaleDateString()}

Your report is important to us. Our maintenance team will review it and schedule repairs based on the severity and priority.

You can track your report status at any time using your Report ID.

Thank you for helping keep Brampton's roads safe!

Best regards,
Brampton Road Maintenance Team
      `,
      type: 'submission_confirmation',
      potholeId: pothole.id,
      sentAt: new Date().toISOString(),
    };

    // In production, this would send via email service (SendGrid, AWS SES, etc.)
    console.log('Email sent:', email);
    return email;
  }

  // Send status update email
  async sendStatusUpdateEmail(
    pothole: Pothole,
    contactEmail: string,
    oldStatus: string,
    newStatus: string
  ): Promise<EmailAlert> {
    const email: EmailAlert = {
      to: contactEmail,
      subject: `Pothole Report Update - ID: ${pothole.id}`,
      body: `
Dear Resident,

Your pothole report has been updated.

Report ID: ${pothole.id}
Location: ${pothole.road_name || 'Not specified'}
Status Changed: ${oldStatus.toUpperCase()} → ${newStatus.toUpperCase()}

${this.getStatusMessage(newStatus)}

Thank you for your patience.

Best regards,
Brampton Road Maintenance Team
      `,
      type: 'status_update',
      potholeId: pothole.id,
      sentAt: new Date().toISOString(),
    };

    console.log('Status update email sent:', email);
    return email;
  }

  // Send escalation email to supervisors
  async sendEscalationEmail(pothole: Pothole, daysOverdue: number): Promise<EmailAlert> {
    const rule = ESCALATION_RULES.find((r) => r.priority === pothole.priority);
    const recipients = rule?.notifyRoles.join(', ') || 'supervisor';

    const email: EmailAlert = {
      to: `${recipients}@brampton.ca`,
      subject: `ESCALATION: Overdue Pothole Repair - ID: ${pothole.id}`,
      body: `
URGENT: Pothole Repair Overdue

Report ID: ${pothole.id}
Location: ${pothole.road_name || 'Not specified'}
Ward: ${pothole.ward || 'Not specified'}
Priority: ${pothole.priority?.toUpperCase() || 'MEDIUM'}
Status: ${pothole.status.toUpperCase()}

Days Overdue: ${daysOverdue}
Deadline: ${rule?.deadlineDays} days
Detected: ${new Date(pothole.detected_at).toLocaleDateString()}

This repair is past its deadline and requires immediate attention.
Please review and take appropriate action.

Escalation Level: ${rule?.notifyRoles.length || 1}
Notified Roles: ${recipients}
      `,
      type: 'escalation',
      potholeId: pothole.id,
      sentAt: new Date().toISOString(),
    };

    console.log('Escalation email sent:', email);
    return email;
  }

  // Create dashboard notification
  createNotification(
    type: Notification['type'],
    severity: Notification['severity'],
    title: string,
    message: string,
    potholeId?: string,
    actionRequired: boolean = false
  ): Notification {
    return {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      title,
      message,
      potholeId,
      createdAt: new Date().toISOString(),
      read: false,
      actionRequired,
    };
  }

  // Check for overdue repairs and create escalations
  checkForOverdueRepairs(potholes: Pothole[]): Notification[] {
    const notifications: Notification[] = [];
    const now = new Date();

    potholes.forEach((pothole) => {
      // Only check non-completed potholes
      if (pothole.status === 'completed') return;

      const detectedDate = new Date(pothole.detected_at);
      const daysElapsed = Math.floor((now.getTime() - detectedDate.getTime()) / (1000 * 60 * 60 * 24));

      const rule = ESCALATION_RULES.find((r) => r.priority === pothole.priority) || ESCALATION_RULES[2]; // default to medium

      // Check if repair is overdue
      if (daysElapsed > rule.deadlineDays) {
        const daysOverdue = daysElapsed - rule.deadlineDays;
        
        // Check if escalation is needed
        if (daysElapsed >= rule.escalateAfterDays) {
          const notification = this.createNotification(
            'escalation',
            'error',
            `OVERDUE: ${pothole.priority?.toUpperCase()} Priority Repair`,
            `Pothole at ${pothole.road_name || 'Unknown Location'} is ${daysOverdue} days overdue. Immediate action required.`,
            pothole.id,
            true
          );
          notifications.push(notification);

          // Send escalation email
          this.sendEscalationEmail(pothole, daysOverdue);
        }
      }
    });

    return notifications;
  }

  // Create notification for high-priority submissions
  createHighPriorityAlert(pothole: Pothole): Notification {
    return this.createNotification(
      'high-priority',
      'warning',
      `${pothole.priority?.toUpperCase()} Priority Pothole Detected`,
      `New ${pothole.priority} priority pothole reported at ${pothole.road_name || 'Unknown Location'} in ${pothole.ward || 'Unknown Ward'}. Requires immediate attention.`,
      pothole.id,
      true
    );
  }

  // Create notification for new submission
  createSubmissionNotification(pothole: Pothole): Notification {
    return this.createNotification(
      'submission',
      'info',
      'New Pothole Report',
      `New pothole reported at ${pothole.road_name || 'Unknown Location'} - Priority: ${pothole.priority || 'medium'}`,
      pothole.id,
      false
    );
  }

  // Helper method for status messages
  private getStatusMessage(status: string): string {
    switch (status) {
      case 'scheduled':
        return 'Your report has been reviewed and scheduled for repair. Our crew will address it soon.';
      case 'in_progress':
        return 'Repair work is currently in progress. Thank you for your patience.';
      case 'completed':
        return 'The repair has been completed. Thank you for reporting this issue!';
      default:
        return 'Your report is being reviewed by our maintenance team.';
    }
  }

  // Get escalation deadline for a pothole
  getDeadline(pothole: Pothole): Date {
    const rule = ESCALATION_RULES.find((r) => r.priority === pothole.priority) || ESCALATION_RULES[2];
    const deadline = new Date(pothole.detected_at);
    deadline.setDate(deadline.getDate() + rule.deadlineDays);
    return deadline;
  }

  // Calculate days until deadline
  getDaysUntilDeadline(pothole: Pothole): number {
    const deadline = this.getDeadline(pothole);
    const now = new Date();
    const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysRemaining;
  }
}

export const notificationService = new NotificationService();
