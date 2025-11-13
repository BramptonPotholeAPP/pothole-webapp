export interface Notification {
  id: string;
  type: 'submission' | 'high-priority' | 'escalation' | 'status-update';
  severity: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  potholeId?: string;
  createdAt: string;
  read: boolean;
  actionRequired?: boolean;
}

export interface EmailAlert {
  to: string;
  subject: string;
  body: string;
  type: 'submission_confirmation' | 'status_update' | 'escalation';
  potholeId: string;
  sentAt: string;
}

export interface EscalationRule {
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadlineDays: number;
  escalateAfterDays: number;
  notifyRoles: string[];
}
