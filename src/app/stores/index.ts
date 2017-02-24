import { createSelector } from 'reselect';
import { ActionReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { compose } from '@ngrx/core/compose';
import { storeFreeze } from 'ngrx-store-freeze';
import { combineReducers } from '@ngrx/store';

import * as fromPayment from './payments/reducer';

export interface State {
  payment: fromPayment.State;
}

const reducers = {
  payment: fromPayment.reducer
};

const developmentReducer: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: any, action: any) {
  return productionReducer(state, action);
}

export const getPaymentState = (state: State) => state.payment;
export const getPaymentAmountLimit = createSelector(getPaymentState, fromPayment.getAmountLimit);
