import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class SharedService {

   private user_data = new BehaviorSubject(false);
   private general_data = new BehaviorSubject(false);
   private payment_portal_data = new BehaviorSubject(false);
   // private loader = new BehaviorSubject(false);

   loginValueData = this.user_data.asObservable();
   generalValueData = this.general_data.asObservable();
   payPortalValueData = this.payment_portal_data.asObservable();

   constructor() { }

   loginValue(flag) {
      this.user_data.next(flag);
   }
   
   GeneralValue(flag) {
      this.general_data.next(flag);
   }
   
   PayPortalValue(flag) {
      this.payment_portal_data.next(flag);
   }

   
}