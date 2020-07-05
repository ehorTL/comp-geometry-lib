import { Directive, Output, OnInit, EventEmitter } from '@angular/core';
// import { EventEmitter } from 'protractor';

@Directive({
  selector: '[appElementCreated]'
})
export class ElementCreatedDirective implements OnInit{

  @Output() onCreateEvent = new EventEmitter<any>();
  
  constructor() {
    this.onCreateEvent.emit();
  }

  ngOnInit(){
    this.onCreateEvent.emit();
    console.log("onCreateEvent must be emitted");
  }
}
