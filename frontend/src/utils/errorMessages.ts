/**
 * Maps API error codes from SYSTEM_Design.md to user-facing messages.
 */

const ERROR_MESSAGES: Record<string, string> = {
    'AUTH-001': 'Invalid email or password.',
    'AUTH-002': 'Session expired, please log in again.',
    'AUTH-003': 'You do not have permission to perform this action.',
    'VALID-001': 'Please check the form for errors and try again.',
    'DB-001': 'The requested resource was not found.',
    'DB-002': 'Email is already in use.',
    'SYSTEM-001': 'Something went wrong. Please try again later.',
};

const GENERIC_ERROR = 'An unexpected error occurred. Please try again.';

/**
 * Returns a user-friendly message for a given API error code.
 */
export function getErrorMessage(code: string | undefined): string {
    if (!code) return GENERIC_ERROR;
    return ERROR_MESSAGES[code] ?? GENERIC_ERROR;
}

export { ERROR_MESSAGES, GENERIC_ERROR };
