/**
 * Date utility functions
 * Provides safe date parsing and formatting to prevent "Invalid time value" errors
 */

/**
 * Safely format a date string for display
 * @param dateString - The date string to format (ISO string, timestamp, etc.)
 * @param fallback - Text to display if date is invalid (default: 'N/A')
 * @returns Formatted date string or fallback text
 */
export function formatDate(
  dateString: string | null | undefined,
  fallback: string = 'N/A'
): string {
  if (!dateString) return fallback;
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return fallback;
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Safely format a date string with time
 * @param dateString - The date string to format
 * @param fallback - Text to display if date is invalid (default: 'N/A')
 * @returns Formatted date and time string or fallback text
 */
export function formatDateTime(
  dateString: string | null | undefined,
  fallback: string = 'N/A'
): string {
  if (!dateString) return fallback;
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return fallback;
  }
  
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Check if a date string is valid
 * @param dateString - The date string to validate
 * @returns true if valid, false otherwise
 */
export function isValidDate(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Get month-year string for grouping (YYYY-MM format)
 * @param dateString - The date string to format
 * @returns Month-year string or null if invalid
 */
export function getMonthYear(dateString: string | null | undefined): string | null {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return null;
  }
  
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Format a relative time (e.g., "2 days ago", "in 3 hours")
 * @param dateString - The date string to format
 * @returns Relative time string or fallback
 */
export function formatRelativeTime(
  dateString: string | null | undefined,
  fallback: string = 'Never'
): string {
  if (!dateString) return fallback;
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return fallback;
  }
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  
  return formatDate(dateString, fallback);
}
