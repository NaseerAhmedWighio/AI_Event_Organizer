import event from "./schemaTypes/event";
import aiPlan from "../src/schemas/aiPlan";
import review from "../src/schemas/review";
import user from "./schemaTypes/user";
import analyticsSnapshot from "./schemaTypes/analyticsSnapshot";
import notification from "./schemaTypes/notification";

export const schemaTypes = [event, aiPlan, review, user, analyticsSnapshot, notification];
