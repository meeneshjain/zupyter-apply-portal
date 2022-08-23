import { Injectable, TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable,  Subject, BehaviorSubject } from 'rxjs';
import { CommonFunctions } from "../helpers/common.functions";
import Swal from 'sweetalert2/dist/sweetalert2';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { SharedService } from "src/app/core/services/shared.service";


@Injectable({
	providedIn: 'root'
})

export class CommonService {
	public common_params        = new CommonFunctions();
	public error_message        = "We have encountered a technical problem, Please try again later or contact us for assistance.";
	public default_snack_time   = 4000;
	public long_snack_time      = 6000;
	public default_loading_time = 2000;
	public modalRef: BsModalRef;
	
	public delivery_status = [
		{ "key": "L", "value": "Loaded on Truck", "class": "badge badge-warning" },
		{ "key": "I", "value": "In Transit", "class": "badge badge-primary" },
		{ "key": "D", "value": "Delivered", "class": "badge badge-danger" },
		{ "key": "N", "value": "Not Delivered", "class": "badge badge-success" },
	];
	
	constructor(
		private ActivatedRouter: ActivatedRoute,
		private route: Router,
		private httpclient: HttpClient,
		public shared_service: SharedService,
    private modalService: BsModalService

		) { }
		
	get_delivery_status(status, field){
		let index = this.delivery_status.findIndex((obj)=>{
			return obj['key'] == status
		});
		
		return (this.delivery_status[index] != undefined && this.delivery_status[index][field] != undefined) ? this.delivery_status[index][field] : '';
		return (this.delivery_status[index] != undefined && this.delivery_status[index][field] != undefined) ? this.delivery_status[index][field] : '';
	}	
	
	change_route(router_link){
		this.route.navigate([router_link])
	}
	
	openModal(modal_id: TemplateRef<any>, classname) {
		this.modalRef = this.modalService.show(modal_id, { class: classname });
	}

	closeModal(value) {
		this.modalRef.hide();
	}
	
	show_sweet_confirm_box(msg, sub_msg, callback, error_callback){
		Swal.fire({
			title: msg,
			text: sub_msg,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: '<i class="fa fa-trash"></i> Yes',
			cancelButtonText: '<i class="fa fa-times"></i> No'
		}).then((result) => {
			if (result.value) {
				callback()
			} else if (result.dismiss === Swal.DismissReason.cancel) {
				if(error_callback != undefined && error_callback!= ""){
					error_callback()
				}
			}
		})
	}
	
	show_sweet_alert(type, heading, text ){
		let stype = "";
		if(type == "s"){
			stype = 'success';
		} else if(type == "w"){
			stype = 'warning';
		} else if(type == "i"){
			stype = 'info';
		} else if(type == "q"){
			stype = 'question';
		} else if(type == "d" || type == "e"){
			stype = 'error'
		}

		Swal.fire(heading, text, stype);
	}
	
	show_sweet_alert_adv(type, heading, text, success_callback, error_callback ){
		let stype = "";
		if(type == "s"){
			stype = 'success';
		} else if(type == "w"){
			stype = 'warning';
		} else if(type == "i"){
			stype = 'info';
		} else if(type == "q"){
			stype = 'question';
		} else if(type == "d" || type == "e"){
			stype = 'error'
		}
		
		Swal.fire({
			title: heading,
			text: text,
			icon: stype,
			showCancelButton: true,
			confirmButtonText: '<i class="fa fa-phone-square"></i> Call Us',
			confirmButtonColor: '#F6693F',
			cancelButtonText: '<i class="fa fa-times"></i> Okay'
		}).then((result) => {
			if (result.value) {
				if(success_callback != undefined && success_callback!=""){
					success_callback()
				}
			} else if (result.dismiss === Swal.DismissReason.cancel) {
				if(error_callback != undefined && error_callback!=""){
					error_callback()
				}
			}
		})
	}
	
	async show_sweet_input_box(type, title, placeholder, callback){
		const { value: email } = await Swal.fire({
			title: title,
			input: type,
			inputPlaceholder: placeholder,
			showCloseButton: true,
			showCancelButton: true,
			confirmButtonText: '<i class="fa fa-send"></i> Send',
			cancelButtonText: '<i class="fa fa-times"></i> Close',
		})

		if (email) {
			Swal.fire(`Entered email: ${email}`)
			callback(email)
		}
	}
	
	 
	
	check_session_on(){
		let check_session = this.common_params.check_session();
		if (check_session != false /* || this._authService._authenticated == false */){
			// this.openSnackBar('i', "Your session has expired, Please re-login!", "Ok");
			this.signout();
			console.log("check_session " , check_session);
			/* if (check_session == false){
				check_session = this.common_params.login_paqge_link	
			} */
			this.change_route(check_session);
		}
	}
	
	signout(){
	 	sessionStorage.removeItem("is_logged_in");
		sessionStorage.removeItem("user_id");
		sessionStorage.removeItem("AccessType");
		sessionStorage.removeItem("user_details");
		
		sessionStorage.removeItem("password_change_email");
		this.shared_service.loginValue(false);

		// this.openSnackBar('s', "You have been logged out successfully.", "");
		setTimeout(()=>{
			this.change_route(this.common_params.login_page_link);
		}, 100);
	}
}