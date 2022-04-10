import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,  Subject, BehaviorSubject } from 'rxjs';
import { CommonFunctions } from "../helpers/common.functions";

@Injectable({
	providedIn: 'root'
})

export class MainService {
	public config_file_data:any;
	public common_params = new CommonFunctions();
	public sys_id = 1;
	public mod_id = 2;
	public module_list  = [];
	public module_name = "Customer Portal";
	
	constructor(private httpclient: HttpClient) {}
	
	async get_config(callback) {
		let config_call = await fetch( this.common_params.get_current_url() +  "/assets/config.json");
		let config_data = await config_call.json();
		if(callback != undefined && callback !== ""){
			let obj_str =  JSON.stringify(config_data);
			sessionStorage.setItem('system_config',obj_str);
			callback(obj_str);
		}
	}
	
	check_login(username, password) : Observable<any> {
		this.config_file_data =  JSON.parse(sessionStorage.getItem('system_config'));
		let data_object = {
			EmailID: username,
			Password: password,
		};
		return this.httpclient.post(this.config_file_data.service_url + "/mod/user/validateuser", data_object); // this.common_params.httpOptions
	}
	
	validate_user_access(email, password)  : Observable<any> {
		this.config_file_data =  JSON.parse(sessionStorage.getItem('system_config'));
		this.mod_id = this.common_params.get_module_id(this.module_name);
		let data_object = {
			"ModID":this.mod_id,
			"SysID":this.sys_id,
			"EmailID": email,
			'Password': password
		};
		return this.httpclient.post(this.config_file_data.service_url + "/cp/ValidateUser", data_object); // this.common_params.httpOptions
	}
	
	get_mod_list() : Observable<any>{
		this.config_file_data =  JSON.parse(sessionStorage.getItem('system_config'));
		return this.httpclient.get(this.config_file_data.service_url + "/mod/modlist/" ); // this.common_params.httpOptions
	}
	
	get_user_details(user_id, mod_id) : Observable<any>{
		this.config_file_data =  JSON.parse(sessionStorage.getItem('system_config'));
		return this.httpclient.get(this.config_file_data.service_url + "/mod/user/" + user_id); // this.common_params.httpOptions
	}
	 
	
	new_validate_user_access(email, password)  : Observable<any> {
		this.config_file_data =  JSON.parse(sessionStorage.getItem('system_config'));
		this.mod_id = this.common_params.get_module_id(this.module_name);
		let data_object = {
			"ModID":this.mod_id,
			"SysID":this.sys_id,
			"EmailID": email,
			'Password': password
		};
		return this.httpclient.post(this.config_file_data.service_url + "/ex/user/ValidateUser", data_object); // this.common_params.httpOptions
	}
	 

	get_all_users(module_id): Observable<any> {
		this.config_file_data = JSON.parse(sessionStorage.getItem('system_config'));
		return this.httpclient.get(this.config_file_data.service_url + "/mod/user/"); // this.common_params.httpOptions
	}

	add_update_user(method, form_data, user_id, mod_id): Observable<any> {
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }) };
		let new_data = form_data;
		new_data.Active = !!+form_data.Active;
		new_data.Admin = !!+form_data.Admin;
		new_data.SendInvite = !!+form_data.SendInvite;
		new_data.ChangePass = !!+form_data.ChangePass;
		if (method == "1") {
			new_data = this.common_params.json_to_query_string(new_data);
			return this.httpclient.post(this.config_file_data.service_url + "/mod/user", (new_data), httpOptions); // this.common_params.httpOptions
		} else if (method == "2") {
			delete new_data.Password;
			new_data = this.common_params.json_to_query_string(new_data);
			return this.httpclient.put(this.config_file_data.service_url + "/mod/user/" + user_id, (new_data), httpOptions); // this.common_params.httpOptions
		}
	}

	 
	
	forgot_password(email_id): Observable<any> {
		this.config_file_data = JSON.parse(sessionStorage.getItem('system_config'));
		this.mod_id = this.common_params.get_module_id('CRM');

		let data_object = {
			"SysID": this.sys_id,
			"ModID": this.mod_id,
			"UserEmail": email_id
		};
		return this.httpclient.post(this.config_file_data.service_url + "/eml/fpass", data_object); // this.common_params.httpOptions
	}
	
	validate_otp(email_id, fp_otp, called_from): Observable<any> {
		this.config_file_data = JSON.parse(sessionStorage.getItem('system_config'));
		this.mod_id = this.common_params.get_module_id('CRM');

		let data_object = {
			"SysID": this.sys_id,
			"ModID": this.mod_id,
			"UserEmail": email_id,
			"FP_OTP": fp_otp,
			"CallFrom": called_from
		};
		return this.httpclient.post(this.config_file_data.service_url + "/eml/fpvotp", data_object); // this.common_params.httpOptions
	}
	
	change_new_password(called_from, fp_otp, email_id, new_password, temp_password): Observable<any> {
		this.config_file_data = JSON.parse(sessionStorage.getItem('system_config'));
		this.mod_id = this.common_params.get_module_id('CRM');

		let data_object = {
			"SysID": this.sys_id,
			"ModID": this.mod_id,
			"UserEmail": email_id,
			"FP_OTP": fp_otp,
			"NewPassword": new_password,
			"CallFrom": called_from,
			"OldPassword": temp_password
		};
		return this.httpclient.post(this.config_file_data.service_url + "/eml/npass", data_object); // this.common_params.httpOptions
	}
	
	get_general_settings(): Observable<any> {
		this.config_file_data = JSON.parse(sessionStorage.getItem('system_config'));
		let ModID = this.common_params.get_module_id('Admin') || 4;
		let data_object = {
			"ModID": ModID,
			"SysID": this.sys_id,
			"Mode": "F",
			"CompanyID": -1,
			"USerID": (sessionStorage.user_id != undefined && sessionStorage.user_id != null) ? parseInt(sessionStorage.user_id) : -1,
		};
		return this.httpclient.post(this.config_file_data.service_url + "/generalsettings/", data_object);
	}
	
	
	get_payment_portal(): Observable<any> {
		this.config_file_data = JSON.parse(sessionStorage.getItem('system_config'));
		let ModID = this.common_params.get_module_id('Payment Portal') || 4;
		let data_object = {
			"Mode": "F",
			"ModID": ModID,
			"SysID": this.sys_id,
			"Pay_id": -1,
			"UserID": (sessionStorage.user_id != undefined && sessionStorage.user_id != null) ? parseInt(sessionStorage.user_id) : -1,
		};
		return this.httpclient.post(this.config_file_data.service_url + "/pp", data_object);
	}
	
	get_accounts(Custid, SearchString, page_no, record_in_page): Observable<any> {
		this.config_file_data = JSON.parse(sessionStorage.getItem('system_config'));
		this.mod_id = this.common_params.get_module_id("CRM");
		let data_object = {
			"SysID": this.sys_id,
			"ModID": this.mod_id,
			"UserID": parseInt(sessionStorage.user_id),
			"Mode": "F",
			"Custid": Custid,
			"SearchString": SearchString,
			"PageNumber": page_no,
			"RecordInPage": record_in_page

		};
		return this.httpclient.post(this.config_file_data.service_url + "/crm/account", data_object); // this.common_params.httpOptions
	}	

}