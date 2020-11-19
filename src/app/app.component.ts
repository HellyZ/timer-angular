import { Component, ElementRef, ViewChild } from "@angular/core";
import * as moment from "moment";
import { fromEvent, interval, Subscription } from "rxjs";
import { buffer, filter, map } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  timer: any;
  seconds: number = 0;
  @ViewChild("waitBtn", { static: true }) waitBtn: ElementRef;
  btnWait: Subscription;
  isEnable: boolean = false;
  display: number = 0;
  ngAfterViewInit() {
    this.btnWait = fromEvent(this.waitBtn.nativeElement, "click")
      .pipe(
        buffer(interval(300)),
        filter((clicks) => clicks.length === 2)
      )
      .subscribe(() => {
        this.timer.unsubscribe();
        this.isEnable = false;
      });
  }

  ngOnDestroy() {
    this.btnWait.unsubscribe();
    this.timer.unsubscribe();
  }

  handleStart() {
    this.isEnable = true;
    this.timer = interval(1000)
      .pipe(
        map(() => {
          this.seconds++;
        })
      )
      .subscribe(() => (this.display = this.seconds));
  }

  handleStop() {
    if (this.timer) {
      this.timer.unsubscribe();
      this.resetCounter();
      this.isEnable = false;
    }
  }

  resetCounter() {
    this.seconds = 0;
  }

  handleReset() {
    this.timer.unsubscribe();
    this.resetCounter();
    this.handleStart();
  }

  formatTime(value: number): string {
    return moment().startOf("day").seconds(value).format("HH:mm:ss");
  }
}
