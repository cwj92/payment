import { type } from '../util';
import { Action } from '@ngrx/store';
import { PaymentSetting } from './model';

export const ActionTypes = {
  LOAD_PAYMENT_SETTING: type('[Payment] Load Setting')
};

export class LoadPaymentSettingAction implements Action {
  type = ActionTypes.LOAD_PAYMENT_SETTING;
  constructor(public payload: PaymentSetting) {}
}

export type Actions = LoadPaymentSettingAction;
