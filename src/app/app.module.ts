// core
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

// store
import { connectToStore, StoreConnectedToRouter } from './stores/store-router-connector';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './stores';
import { RouterModule } from '@angular/router';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './containers/app.component';
import { ComponentsModule } from './components';
import { BookingComponent } from './containers/booking/booking.component';

@NgModule({
  declarations: [
    AppComponent,
    BookingComponent,
  ],
  imports: [
    BrowserModule,
    ComponentsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpModule,
    StoreConnectedToRouter.provideStore(reducer),
    RouterModule.forRoot(connectToStore([
      { path: 'booking', component: BookingComponent }
    ]), {enableTracing: false}),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
