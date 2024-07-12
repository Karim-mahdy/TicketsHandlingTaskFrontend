import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private baseUrl = 'https://localhost:7173';

  constructor(private http: HttpClient) { }

  getAllTickets(PageSize: number, PageNumber: number) {
    let params = new HttpParams()
      .append('PageSize', PageSize)
      .append('PageNumber', PageNumber);
    return this.http.get<any>(`${this.baseUrl}/api/Tickets/GetAllTickets`, { params });
  }

  getTicketById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/api/Tickets/GetTicketById/${id}`);
  }

  getGovernorates() {
    return this.http.get<any>(`${this.baseUrl}/api/LookupsData/governorates`);
  }

  getCities(governorateId: number) {
    let params = new HttpParams().append('governorateId', governorateId);
    return this.http.get<any>(`${this.baseUrl}/api/LookupsData/cities`, { params });
  }

  getDistricts(cityId: number) {
    let params = new HttpParams().append('cityId', cityId);
    return this.http.get<any>(`${this.baseUrl}/api/LookupsData/districts`, { params });
  }

  createTicket(data: any) {
    return this.http.post(`${this.baseUrl}/api/Tickets/CreateTicket`, data);
  }

  updateTicket(data: any) {
    return this.http.put(`${this.baseUrl}/api/Tickets/UpdateTicket`, data);
  }

  handleTicket(id: any) {
    return this.http.put(`${this.baseUrl}/api/Tickets/handle/${id}`, null);
  }
 
  deleteTicket(id: any) {
    return this.http.delete(`${this.baseUrl}/api/Tickets/DeleteTicket/${id}`);
  }
}
