import { AuthState } from "./auth/auth.reducer";
import { ErrorState } from "./error/error.reducer";

export interface AppState {
  auth: AuthState;
//   todo: TodoState;
  error: ErrorState;
}
