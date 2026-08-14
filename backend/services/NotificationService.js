/**
 * Notification Service (SOLID - Single Responsibility)
 * Encapsulates admin alerts and student notifications for PYQ status transitions.
 */
export class NotificationService {
  /**
   * Triggers alert to Admin moderation team when a new PYQ is submitted by a student
   */
  async notifyAdminsOnNewSubmission(pyqPaper, uploader) {
    const logMessage = `🔔 [ADMIN ALERT] New PYQ Pending Approval: "${pyqPaper.title}" | Uploaded by: ${
      uploader?.name || uploader?.email || 'Student'
    } at ${new Date().toISOString()}`;

    console.log(logMessage);
    
    // In production, this can connect to Nodemailer, Socket.io, or Webhook push services
    return {
      success: true,
      channel: 'in-app-moderation-queue',
      logMessage,
    };
  }

  /**
   * Notifies student when their submission is approved or rejected by an admin
   */
  async notifyStudentOnStatusChange(pyqPaper, status, feedbackReason = '') {
    const isApproved = status === 'approved';
    const message = isApproved
      ? `🎉 [STUDENT NOTIFICATION] Congratulations! Your PYQ submission "${pyqPaper.title}" has been APPROVED and is now live!`
      : `⚠️ [STUDENT NOTIFICATION] Your PYQ submission "${pyqPaper.title}" was REJECTED. Reason: "${feedbackReason}"`;

    console.log(message);

    return {
      success: true,
      recipient: pyqPaper.uploadedBy,
      message,
    };
  }
}

export default new NotificationService();
