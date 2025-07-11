import { BugSeverity, BugPriority, CreateBugRequest } from '@/types/bug'

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

/**
 * Validates a bug creation request
 * This function includes intentional bugs for debugging practice
 */
export const validateBugRequest = (request: CreateBugRequest): ValidationResult => {
  const errors: ValidationError[] = []
  
  // Title validation
  if (!request.title || request.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title is required' })
  } else if (request.title.length < 5) {
    errors.push({ field: 'title', message: 'Title must be at least 5 characters long' })
  } else if (request.title.length > 100) {
    errors.push({ field: 'title', message: 'Title must be less than 100 characters' })
  }
  
  // Description validation
  if (!request.description || request.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Description is required' })
  } else if (request.description.length < 10) {
    errors.push({ field: 'description', message: 'Description must be at least 10 characters long' })
  }
  
  // Severity validation - INTENTIONAL BUG: Missing 'critical' check
  const validSeverities: BugSeverity[] = ['low', 'medium', 'high']
  if (!validSeverities.includes(request.severity)) {
    errors.push({ field: 'severity', message: 'Invalid severity level' })
  }
  
  // Priority validation
  const validPriorities: BugPriority[] = ['low', 'medium', 'high', 'critical']
  if (!validPriorities.includes(request.priority)) {
    errors.push({ field: 'priority', message: 'Invalid priority level' })
  }
  
  // Reporter validation
  if (!request.reportedBy || request.reportedBy.trim().length === 0) {
    errors.push({ field: 'reportedBy', message: 'Reporter name is required' })
  }
  
  // Email validation for assignedTo (if provided) - INTENTIONAL BUG: Weak regex
  if (request.assignedTo && request.assignedTo.length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]/
    if (!emailRegex.test(request.assignedTo)) {
      errors.push({ field: 'assignedTo', message: 'Invalid email format for assignee' })
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates tags array - includes debugging helper
 */
export const validateTags = (tags: string[]): ValidationResult => {
  console.log('Validating tags:', tags) // Debug log
  
  const errors: ValidationError[] = []
  
  if (tags.length > 5) {
    errors.push({ field: 'tags', message: 'Maximum 5 tags allowed' })
  }
  
  // INTENTIONAL BUG: Should check for empty strings
  const invalidTags = tags.filter(tag => tag.length < 2)
  if (invalidTags.length > 0) {
    errors.push({ field: 'tags', message: 'Each tag must be at least 2 characters long' })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Helper function to format validation errors for display
 */
export const formatValidationErrors = (errors: ValidationError[]): string => {
  return errors.map(error => `${error.field}: ${error.message}`).join(', ')
}