export function generatePassword(length = 16): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string;
} {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 12) score += 2;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score < 2) feedback.push("Password is very weak");
  else if (score < 3) feedback.push("Password could be stronger");
  else if (score < 4) feedback.push("Password is good");
  else feedback.push("Password is strong");

  return { score, feedback: feedback.join(". ") };
}
