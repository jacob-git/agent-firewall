export type ActionName =
  | "delete_database"
  | "deploy_code"
  | "restart_service"
  | "rotate_logs"
  | (string & {});

export type IntentCategory = "destructive" | "operational" | "change_management" | "unknown";

export interface RawAction {
  action: ActionName;
  confidence: number;
  params?: Record<string, unknown>;
}

export interface Intent {
  action: ActionName;
  confidence: number;
  category: IntentCategory;
  summary: string;
  params?: Record<string, unknown>;
  source: "ai";
  createdAt: string;
}
