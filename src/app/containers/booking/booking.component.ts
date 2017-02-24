import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../stores/';
import { Payment } from '../../stores/payments/model';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/last';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingComponent implements OnInit {

  amountLimit$: Observable<number>;

  constructor(private store: Store<fromRoot.State>) {
    this.amountLimit$ = this.store.select(fromRoot.getPaymentAmountLimit)
      .take(1);
  }

  ngOnInit() {
  }
}
