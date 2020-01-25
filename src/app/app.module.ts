import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import {CommonModule} from '@angular/common'
import { AppComponent } from './app.component';
import { FileSelectDirective } from 'ng2-file-upload';
import { FormsModule } from '@angular/forms';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http'; 
import { AngularFireStorageModule } from 'angularfire2/storage';




@NgModule({
  declarations: [
    AppComponent,
    FileSelectDirective
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule, 
    AngularFireModule.initializeApp(environment.firebaseConfig), 
    AngularFireStorageModule,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot() // ToastrModule added
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }