import { Intent, RawAction, type ActionName, type IntentCategory } from "../core/intent.js";

interface IntentTemplate {
  category: IntentCategory;
  summary: string;
}

const INTENT_TEMPLATES: Record<string, IntentTemplate> = {
  delete_database: {
    category: "destructive",
    summary: "destructive action against production data"
  },
  deploy_code: {
    category: "change_management",
    summary: "production code deployment"
  },
  restart_service: {
    category: "operational",
    summary: "operational restart of a production service"
  },
  rotate_logs: {
    category: "operational",
    summary: "routine log rotation operation"
  }
};

export class Interceptor {
  toIntent(rawAction: RawAction): Intent {
    const template = this.resolveTemplate(rawAction.action);

    return {
      action: rawAction.action,
      confidence: rawAction.confidence,
      category: template.category,
      summary: template.summary,
      params: rawAction.params,
      source: "ai",
      createdAt: new Date().toISOString()
    };
  }

  private resolveTemplate(action: ActionName): IntentTemplate {
    return (
      INTENT_TEMPLATES[action] ?? {
        category: "unknown",
        summary: `unclassified action "${action}"`
      }
    );
  }
}
