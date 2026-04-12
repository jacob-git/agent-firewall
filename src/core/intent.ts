export type ActionName =
  | "delete_database"
  | "deploy_code"
  | "export_customer_data"
  | "grant_admin_access"
  | "restart_service"
  | "rotate_logs"
  | (string & {});

export type IntentCategory =
  | "change_management"
  | "data_access"
  | "destructive"
  | "identity"
  | "operational"
  | "unknown";

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
