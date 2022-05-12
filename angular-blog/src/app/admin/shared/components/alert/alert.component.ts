import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from "../../services/alert.service";
import {Subscription} from "rxjs";
// @ts-ignore
import {transition, trigger, useAnimation} from "@angular/animations";
import {bounceInRight, bounceOutLeft, bounceOutRight, slideInRight, slideOutRight} from "ng-animate";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  animations:[
    trigger('slideInAlert', [
      transition('void => *', useAnimation(bounceInRight)),
      transition('* => void', useAnimation(bounceOutRight))
    ])
  ]
})
export class AlertComponent implements OnInit, OnDestroy {

  @Input() delay = 5000
  //@ts-ignore
  public text: string
  public type = 'success'
  //@ts-ignore
  aSub: Subscription
  visible = false

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.aSub = this.alertService.alert$.subscribe( alert => {
      this.text = alert.text
      this.type = alert.type
      this.visible = true
      const timeout = setTimeout(() => {
        clearTimeout(timeout)
        this.text = ''
        this.visible = false
      }, this.delay)
    })
  }

  ngOnDestroy(): void {
    if (this.aSub) this.aSub.unsubscribe()
  }

}
