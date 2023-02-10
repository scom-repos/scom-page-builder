export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}

export interface ValidationError {
    property: string;
    message: string;
}

