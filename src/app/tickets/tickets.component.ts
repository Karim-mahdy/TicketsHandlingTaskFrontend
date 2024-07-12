
  import { Component, OnInit } from '@angular/core';
  import { FormGroup, FormBuilder, Validators } from '@angular/forms';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { TicketService } from '../services/ticket.service';
import { SignalRService } from '../services/signalr.service';
  
  @Component({
    selector: 'app-tickets',
    templateUrl: './tickets.component.html',
    styleUrls: ['./tickets.component.css']
  })
  export class TicketsComponent implements OnInit {
    allTickets: any[] = [];
    ticketForm!: FormGroup;
    labelForm: string = '';
    loadingForm: boolean = false;
    page: number = 1;
    pageSize: number = 5;
    totalItems: number = 0;
    allGovernment: any[] = [];
    allCities: any[] = [];
    allDist: any[] = [];
    selectedTicketId: number | null = null;
  
    constructor(
      private _formBuilder: FormBuilder,
      private modalService: NgbModal,
      private ticketService: TicketService,
      public signalRService: SignalRService  
    ) {
      this.ticketForm = this.initTicketForm();
    }
  
    ngOnInit() {
      this.getAllTickets();
      this.getAllGovernment();
      this.signalRService.startConnection();
      this.signalRService.addTicketUpdateListener(this.updateTicket.bind(this));
      this.signalRService.addHandleTicketListener(this.handleTicket.bind(this));
    }
  
    initTicketForm(): FormGroup {
      return this._formBuilder.group({
        district: [null, Validators.required],
        phoneNumber: [null, Validators.required],
        government: [null, Validators.required],
        city: [null, Validators.required]
      });
    }
  
    openModal(content: any): void {
      this.labelForm = 'ADD';
      this.selectedTicketId = null;
      this.ticketForm.reset();
      this.modalService.open(content, {
        size: 'lg',
        centered: true
      });
    }
  
    editModal(content: any, ticket: any): void {
      this.labelForm = 'EDIT';
      this.selectedTicketId = ticket.id;
      this.ticketForm.patchValue({
        phoneNumber: ticket.phoneNumber,
        government: ticket.governorateId,
        city: ticket.cityId,
        district: ticket.districtId
      });
      this.getAllCities();  // Populate cities dropdown based on selected governorate
      this.getAllDisticts();  // Populate districts dropdown based on selected city
      this.modalService.open(content, {
        size: 'lg',
        centered: true
      });
    }
  
    onSubmit() {
      if (this.ticketForm.invalid) {
        return;
      }
  
      let payload: any;
  
      if (this.labelForm === 'ADD') {
        payload = {
          phoneNumber: this.ticketForm.controls['phoneNumber'].value,
          governorate: +this.ticketForm.controls['government'].value,
          city: +this.ticketForm.controls['city'].value,
          district: +this.ticketForm.controls['district'].value
        };
        this.ticketService.createTicket(payload).subscribe(res => {
          console.log(res);
          this.getAllTickets();  // Refresh the list after adding a new ticket
          this.modalService.dismissAll();
        });
      } else if (this.labelForm === 'EDIT') {
        payload = {
          ticket: {
            id: this.selectedTicketId,
            phoneNumber: this.ticketForm.controls['phoneNumber'].value,
            governorate: +this.ticketForm.controls['government'].value,
            city: +this.ticketForm.controls['city'].value,
            district: +this.ticketForm.controls['district'].value
          }
        };
        this.ticketService.updateTicket(payload).subscribe(res => {
          console.log(res);
          this.getAllTickets();  // Refresh the list after editing the ticket
          this.modalService.dismissAll();
        });
      }
    }
    handleTicket(id: number): void {
      this.ticketService.handleTicket(id).subscribe(
        res => {
          console.log(res);
          this.getAllTickets();  // Refresh the list after handling the ticket
        },
        err => console.error('Error handling ticket: ', err)
      );
    }
  
    updateTicket(ticketId: number, color: string) {
      let ticket = this.allTickets.find(t => t.id === ticketId);
      if (ticket) {
        ticket.statusColor = color;
      }
    }
    handleTicketRealTime(ticketId: number) {
      let ticket = this.allTickets.find(t => t.id === ticketId);
      if (ticket) {
        ticket.isHandled = true;
      }
    }
    delete(id: number) {
      this.ticketService.deleteTicket(id).subscribe(
        res => {
          this.getAllTickets();
        },
        err => console.error('Error deleting ticket: ', err)
      );
    }

  get form() {
    return this.ticketForm.controls;
  }

  getAllGovernment() {
    this.ticketService.getGovernorates().subscribe(res => {
      this.allGovernment = [...res.data];    
    });
  }

  getAllCities() {
    const governmentId = this.ticketForm.controls['government'].value;
    this.ticketService.getCities(governmentId).subscribe(res => {
      this.allCities = [...res.data];
    });
  }

  getAllDisticts() {
    const cityId = this.ticketForm.controls['city'].value;
    this.ticketService.getDistricts(cityId).subscribe(res => {
      this.allDist = [...res.data];
    
    });
  }
  getAllTickets(): void {
    this.ticketService.getAllTickets(this.pageSize, this.page).subscribe(res => {
      this.allTickets = res.data.data;
      this.totalItems = res.data.totalCount;
      console.log(this.allTickets);
    });
  }

  onPageChange(page: number) {
    this.page = page;
    this.getAllTickets();
  }
}


