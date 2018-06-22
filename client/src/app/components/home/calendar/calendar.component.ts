import { Component, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy, ViewChild, TemplateRef, Input } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { colors } from './calendar-utils/colors';

import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

import { Property, Analysis } from '../../../models/property';

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnChanges {

  @Input() analyses: Array<Analysis>;
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: string = 'month';

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    // {
    //   start: subDays(startOfDay(new Date()), 1),
    //   title: 'Indice de biomassa',
    //   color: colors.red,
    //   actions: this.actions
    // },
    // {
    //   start: startOfDay(new Date()),
    //   title: 'Previsão de produtividade',
    //   color: colors.green,
    //   actions: this.actions
    // },
    // {
    //   start: subDays(endOfMonth(new Date()), 3),
    //   title: 'Mapa de produção',
    //   color: colors.blue
    // },
    // {
    //   start: addHours(startOfDay(new Date()), 2),
    //   title: 'Mapa de produção',
    //   color: colors.blue,
    //   actions: this.actions,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   },
    //   draggable: true
    // }
  ];

  activeDayIsOpen: boolean = true;

  constructor(private modal: NgbModal) { }

  ngOnInit() {
    // Get
    console.log("analyses:", this.analyses);

    if (this.analyses) {
      this.addCalendarEvents(this.analyses);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("changes:", changes);
    if (changes['analyses']) {
      let varChange = changes['analyses'];
      this.analyses = varChange.currentValue;
      this.addCalendarEvents(this.analyses);
    }
  }

  /************************************ Functions ************************************/

  addCalendarEvents(analyses: Array<Analysis>) {
    var title;
    var color;

    for (let analysis of analyses) {
      if (analysis.Type == '1') {
        title = "Mapa de Produção"; color = colors.blue;
      } else if (analysis.Type == '2') {
        title = "Indice de Biomassa"; color = colors.red;
      } else {
        title = "Previsão de Produtividade"; color = colors.green;
      }
      console.log("Add: ", title);

      this.addEvent(title, color, analysis.Date)
    }
  }

  /********************************* Calendar Events *********************************/
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    console.log("analyses:", this.analyses);
    if (this.modalData.action != "Deleted") {
      this.modal.open(this.modalContent, { size: 'lg' });
    }
  }

  addEvent(title:string, color, date ): void {
    console.log(new Date());
    console.log(new Date(date));
    this.events.push({
      title: title,
      start: startOfDay(new Date(date)),
      // end: endOfDay(new Date()),
      color: color,
      actions: this.actions,
      // draggable: true,
      // resizable: {
      //   beforeStart: true,
      //   afterEnd: true
      // }
    });
    this.refresh.next();
  }

}
