export interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { id: "length", label: "Almeno 10 caratteri", test: (v) => v.length >= 10 },
  { id: "uppercase", label: "Una lettera maiuscola", test: (v) => /[A-Z]/.test(v) },
  { id: "lowercase", label: "Una lettera minuscola", test: (v) => /[a-z]/.test(v) },
  { id: "number", label: "Un numero", test: (v) => /[0-9]/.test(v) },
  {
    id: "special",
    label: "Un carattere speciale (es. ! ? # @ %)",
    test: (v) => /[^A-Za-z0-9]/.test(v),
  },
];

export function passwordMeetsRequirements(password: string) {
  return PASSWORD_REQUIREMENTS.every((requirement) => requirement.test(password));
}
