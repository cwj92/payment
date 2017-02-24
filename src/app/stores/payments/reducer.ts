import { Actions } from './action';

export interface State {
  amountLimit: number;
};

export const initState: State = {
  amountLimit: 500
};

export function reducer(state = initState, action: Actions): State {
  switch (action.type) {
    default:
      return state;
  }
}

export const getAmountLimit = (state: State) => state.amountLimit;
