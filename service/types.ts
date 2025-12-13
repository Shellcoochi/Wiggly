export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Order {
  id: string;
  status: string;
  amount: number;
}

export interface RuleResult {
  success: boolean;
  message?: string;
  output?: unknown;
}
