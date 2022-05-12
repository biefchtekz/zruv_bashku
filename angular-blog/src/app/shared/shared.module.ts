import {NgModule} from "@angular/core";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {QuillModule} from "ngx-quill";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    HttpClientModule,
    QuillModule.forRoot(),
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    HttpClientModule,
    QuillModule,
  ],
  declarations: []
})

export class SharedModule {}
