

// Check if the string contains any special characters
export function hasSpecialChar(string: string): boolean {
    // Check if the string contains any special characters
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(string);
}
