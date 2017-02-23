import {
  Injectable,
  ModuleWithProviders,
  NgModule,
  Optional
} from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  ExtraOptions,
  RouterModule,
  RouterStateSnapshot,
  Routes,
  Router,
  NavigationCancel,
  RoutesRecognized,
  NavigationError
} from "@angular/router";
import {
    Store,
    StoreModule,
    provideStore,
    Action
} from "@ngrx/store";
import { type } from './util';

export const ActionTypes = {
  ROUTER_NAVIGATION: type('[Router] ROUTER_NAVIGATION'),
  ROUTER_CANCEL: type('[Router] ROUTER_CANCEL'),
  ROUTER_ERROR: type('[Router] ROUTER_ERROR')
};

/**
 * Payload of ROUTER_NAVIGATION.
 */
export type RouterNavigationPayload = {
  routerState: RouterStateSnapshot,
  event: RoutesRecognized
}
/**
 * An action dispatched when the router navigates.
 */
export class RouterNavigationAction implements Action {
  type = ActionTypes.ROUTER_NAVIGATION;
  constructor(public payload: RouterNavigationPayload) {}
}

/**
 * Payload of ROUTER_CANCEL.
 */
export type RouterCancelPayload = {
  routerState: RouterStateSnapshot,
  storeState: any,
  event: NavigationCancel
};
/**
 * An action dispatched when the router cancel navigation.
 */
export class RouterCancelAction implements Action {
  type = ActionTypes.ROUTER_CANCEL;
  constructor(public payload: RouterCancelPayload) {}
}

/**
 * Payload of ROUTER_ERROR.
 */
export type RouterErrorPayload = {
  routerState: RouterStateSnapshot,
  storeState: any,
  event: NavigationError
};
/**
 * An action dispatched when the router errors.
 */
export class RouterErrorAction implements Action {
  type = ActionTypes.ROUTER_ERROR;
  constructor(public payload: RouterErrorPayload) {}
}

export type Actions = RouterNavigationAction | RouterCancelAction | RouterErrorAction;

/**
 * Used to intercept all navigations to dispatch actions.
 *
 * @internal
 */
@Injectable()
export class CanActivateChild_Interceptor implements CanActivateChild {
  private routerState: RouterStateSnapshot = null;
  private storeState: any;
  private lastRoutesRecognized: RoutesRecognized;

  constructor(@Optional() private store: Store<any>, private router: Router) {
    if (!store) {
      throw new Error("RouterConnectedToStoreModule can only be used in combination with StoreModule");
    }
    this.setUpStateRollbackEvents();
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    
    if (this.routerState !== state) {
      this.routerState = state;

      const payload = {routerState: state, event: this.lastRoutesRecognized};
      this.store.dispatch(new RouterNavigationAction(payload));
    }
    return true;
  }

  private setUpStateRollbackEvents(): void {
    this.store.subscribe(s => {
      this.storeState = s;
    });

    this.router.events.subscribe(e => {
      if (e instanceof RoutesRecognized) {
        this.lastRoutesRecognized = e;
      } else if (e instanceof NavigationCancel) {
        this.dispatchRouterCancel(e);
      } else if (e instanceof NavigationError) {
        this.dispatchRouterError(e);
      }
    });
  }

  private dispatchRouterCancel(event: NavigationCancel): void  {
    const payload = {routerState: this.routerState, storeState: this.storeState, event};
    this.store.dispatch(new RouterCancelAction(payload));
  }

  private dispatchRouterError(event: NavigationError): void  {
    const payload = {routerState: this.routerState, storeState: this.storeState, event};
    this.store.dispatch(new RouterErrorAction(payload));
  }
}

/**
 * Wraps the router configuration to make StoreConnectedToRouter work.
 *
 * See StoreConnectedToRouter for more information.
 */
export function connectToStore(routes: Routes): Routes {
  return [{path: '', canActivateChild: [CanActivateChild_Interceptor], children: routes}];
}

/**
 * Sets up StoreModule and wires it up to the router.
 *
 * It has to be used in combination with connectToStore.
 *
 * Usage:
 *
 * ```typescript
 * @NgModule({
 *   declarations: [AppCmp, SimpleCmp],
 *   imports: [
 *     BrowserModule,
 *     RouterModule.forRoot(connectToStore([
 *       { path: '', component: SimpleCmp },
 *       { path: 'next', component: SimpleCmp }
 *     ])),
 *     StoreConnectedToRouter.provideStore(mapOfReducers)
 *   ],
 *   bootstrap: [AppCmp]
 * })
 * export class AppModule {
 * }
 * ```
 */
@NgModule({})
export class StoreConnectedToRouter {
  static provideStore(_reducer: any, _initialState?:any): ModuleWithProviders {
    return {
      ngModule: StoreModule,
      providers: [...provideStore(_reducer, _initialState), CanActivateChild_Interceptor]
    };
  }
}
