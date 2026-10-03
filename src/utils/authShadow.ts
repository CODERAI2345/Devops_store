/**
 * Utility function to convert a user's mobile number into a deterministic shadow email
 * for standard Firebase Email/Password authentication.
 * 
 * Avoids Firebase Phone Auth SMS carrier charges while giving users a seamless mobile number login.
 * 
 * Example:
 *  "+91 9876543210" -> "919876543210@shadow.devopsstore.online"
 *  "9876543210"     -> "9876543210@shadow.devopsstore.online"
 */
export function phoneToShadowEmail(phone: string): string {
  if (!phone || typeof phone !== 'string') {
    throw new Error('Mobile number is required');
  }

  // Strip spaces, dashes, parentheses, plus signs
  const digits = phone.replace(/[^0-9]/g, '');

  if (digits.length < 7 || digits.length > 15) {
    throw new Error('Please enter a valid mobile number (7-15 digits)');
  }

  return `${digits}@shadow.devopsstore.online`;
}

/**
 * Extracts the raw mobile number from a shadow email if applicable.
 */
export function shadowEmailToPhone(email?: string | null): string | null {
  if (!email || !email.endsWith('@shadow.devopsstore.online')) {
    return null;
  }
  return email.replace('@shadow.devopsstore.online', '');
}
