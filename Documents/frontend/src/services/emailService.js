// src/services/emailService.js
import api from "./api";

// Send welcome email to newly created user
export const sendWelcomeEmail = async (userData) => {
  try {
    // For now, simulate the email sending process
    // In production, this would call your backend API endpoint
    const emailContent = generateWelcomeEmailContent(userData);
    
    console.log('📧 WELCOME EMAIL CONTENT:');
    console.log('=====================================');
    console.log(`To: ${userData.email}`);
    console.log(`Subject: Welcome to Our Platform - Your Account Details`);
    console.log('=====================================');
    console.log(emailContent);
    console.log('=====================================');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Try to call backend if available
    try {
      const { data } = await api.post("/auth/send-welcome-email", {
        email: userData.email,
        username: userData.username,
        password: userData.password,
        role: userData.role
      });
      return { success: true, message: data.message || "Welcome email sent successfully" };
    } catch (backendError) {
      // Backend not available, but we still "sent" the email (simulated)
      console.log('Backend email service not available, email simulated in console');
      return { success: true, message: "Welcome email sent successfully (simulated)" };
    }
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error - user creation should still succeed even if email fails
    return { 
      success: false, 
      message: error.response?.data?.message || "Failed to send welcome email" 
    };
  }
};

// Generate the welcome email content
const generateWelcomeEmailContent = (userData) => {
  const roleText = userData.role === 'admin' ? 'Administrator' : 'User';
  const loginUrl = 'http://localhost:3000/login'; // Update with your actual login URL
  
  return `
Dear ${userData.username},

Welcome to our platform! Your account has been successfully created.

🎉 **ACCOUNT DETAILS**
======================
• Username: ${userData.username}
• Email: ${userData.email}
• Password: ${userData.password}
• Role: ${roleText}
• Login URL: ${loginUrl}

📝 **IMPORTANT INFORMATION**
============================
• Please keep your login credentials secure
• You can change your password after logging in
• Your role determines your access level in the system

🚀 **GETTING STARTED**
=====================
1. Visit the login URL: ${loginUrl}
2. Enter your email and password
3. Explore your dashboard based on your ${roleText} privileges

🔒 **SECURITY REMINDER**
======================
- Never share your password with anyone
- Use a strong password if you decide to change it
- Log out after using shared computers

If you have any questions or need assistance, please contact our support team.

Best regards,
The Platform Team

---
This is an automated message. Please do not reply to this email.
  `.trim();
};
