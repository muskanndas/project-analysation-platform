/** Allowed department values for student registration */
export const STUDENT_DEPARTMENTS = ['Computer Science', 'AI', 'EC'];

export const isValidStudentDepartment = (value) =>
  STUDENT_DEPARTMENTS.includes(String(value || '').trim());
