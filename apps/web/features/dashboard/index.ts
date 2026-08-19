/* Public API of the dashboard slice. Nothing outside this file may be imported
   from another slice — see docs/ARCHITECTURE.md. */

/* CRM dashboard */
export { StatCards } from "./components/stat-cards";
export { RevenueChart } from "./components/revenue-chart";
export { ActivityFeed } from "./components/activity-feed";
export { TopDeals } from "./components/top-deals";
export { TasksPanel } from "./components/tasks-panel";
export { AiAskPanel } from "./components/ai-ask-panel";
export { SalesPipeline } from "./components/sales-pipeline";
export { IntegrationsRow } from "./components/integrations-row";
export { AiInsights } from "./components/ai-insights";

/* Productivity widgets — retained for the workspace view */
export { WidgetTasks } from "./components/widget-tasks";
export { WidgetCalendar } from "./components/widget-calendar";
export { WidgetEmails } from "./components/widget-emails";
export { WidgetProductivity } from "./components/widget-productivity";
export { WidgetFocusTimer } from "./components/widget-focus-timer";
export { WidgetAI } from "./components/widget-ai";
export { WidgetQuickActions } from "./components/widget-quick-actions";
