import { HttpHeaders } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';  

export class CommonFunctions {
	public href: any          = window.location.href;
	public application_path   = this.get_current_url();
	public email_valid_regex  = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	public login_page_link   = '/auth/sign-in';
	public number = "+1 (214) 233-3500";
	public pagination_options  = [5, 10, 25, 50, 100];
	public default_page_size = 10;
	public default_limit = 30;
	public default_preview_image = window.location.origin + "/assets/images/no-image.png";
	public default_login_image = window.location.origin + "/assets/images/logo.png";
	public default_header_image = window.location.origin + "/assets/images/app_logo.png";
	
	public days_list = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	public expense_status = [
	{"key":"D", "value":"Draft", "color1":"yellow-200", "color2":"bg-yellow" },
	{"key":"S", "value":"Submitted", "color1":"blue-200", "color2":"bg-blue" },
	{"key":"P", "value":"Partially Approved", "color1":"gray-200", "color2":"bg-gray" },
	{"key":"U", "value":"Under Processing", "color1":"red-200", "color2":"bg-red" },
	{"key":"A", "value":"Approved", "color1":"green-200", "color2":"bg-green" },
	{"key":"Y", "value":"Pending Payment", "color1":"accent-200", "color2":"bg-accent" },
	{"key":"I", "value":"Reimbursed", "color1":"green-200", "color2":"bg-green" },
	{"key":"J", "value":"Rejected", "color1":"orange-200", "color2":"bg-orange" },
	{"key":"E", "value":"Expired", "color1":"purple-200", "color2":"bg-purple" },
	]
	
	public get_current_url() {
		let temp: any = this.href.substring(0, this.href.lastIndexOf('/'));
		if (temp.lastIndexOf('#') != '-1') {
			temp = temp.substring(0, temp.lastIndexOf('#'));
		}
		
		let preg_match_replace:any = "";
		if(location.protocol == "http:"){
			preg_match_replace = /^http\:\/\//;
		} else if(location.protocol == "https:"){
			preg_match_replace= /^https\:\/\//;
		}
		
		let sanitized = temp.replace(preg_match_replace, '').replace(/\/+/g, '/').replace(/\/+$/, '');
		temp = (window.location.protocol + '//' + sanitized);

		return temp;
	}
	
	public get_random_no(){
		return Math.floor(Math.random()*100) + 1
	}
	
	public save_page_size($event:any){
		sessionStorage.setItem("page_size", $event.pageSize);
	}
	
	public check_session(){
		if(sessionStorage.getItem("is_logged_in") == null || sessionStorage.getItem("is_logged_in") == '0'){
			return this.login_page_link;
		} else {
			if(sessionStorage.getItem('system_config') == null || sessionStorage.getItem('system_config') == undefined){
				return this.login_page_link;
			} else {
				return false;
			}
		}
	}
	
	public get_session_data(parameter_name = null, do_deserilze){
		let data:any;
		if(sessionStorage !=  null  || sessionStorage.getItem('system_config') != undefined){
			if(do_deserilze == 1){
				if(sessionStorage[parameter_name] != undefined) {
					data = JSON.parse(sessionStorage[parameter_name]);
				}
			} else {
				data = sessionStorage[parameter_name];
			}
		} 
		return data;
	}
	
	public get_module_id(module_name){
		if(sessionStorage.module_list != undefined && sessionStorage.module_list != ""){
			let module_list:any = JSON.parse(sessionStorage.module_list); 
			if(module_list!= undefined && module_list.length > 0){
				let customer_portal_module = module_list.filter((obj)=>{
					return obj.ModuleName == module_name
				});
				
				if(customer_portal_module.length > 0){
					return customer_portal_module[0]['ModuleID'];
				} else {
					return 0;
				}
			} else {
				return 0;
			}
		} else {
			return 0;
		}
	}
	
	public get_module_win_service(mod_id) {
		if (sessionStorage.module_list != undefined && sessionStorage.module_list != "") {
			let module_list: any = JSON.parse(sessionStorage.module_list);
			if (module_list != undefined && module_list.length > 0) {
				let modules = module_list.filter((obj) => {
					return obj.ModuleID == mod_id
				});

				if (modules.length > 0) {
					return modules[0]['WinServiceInstalledServer'];
				} else {
					return '';
				}
			} else {
				return '';
			}
		} else {
			return '';
		}
	}
	
	
	public get_module_service(mod_id) {
		if (sessionStorage.module_list != undefined && sessionStorage.module_list != "") {
			let module_list: any = JSON.parse(sessionStorage.module_list);
			if (module_list != undefined && module_list.length > 0) {
				let modules = module_list.filter((obj) => {
					return obj.ModuleID == mod_id
				});

				if (modules.length > 0) {
					return modules[0]['WinServiceName'];
				} else {
					return '';
				}
			} else {
				return '';
			}
		} else {
			return '';
		}
	}
	
	public json_to_query_string(data){
		let new_data = Object.keys(data).map(function(k) {
			return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
		}).join('&')
		return new_data; 
	}
	
	public prepare_form_data(data){
		let body = new FormData();
		for(let key in data){
			body.append(key, data[key]);
		}
		return body;
	}
	
	public deepcopy(o) {
		var output, v, key;
		output = Array.isArray(o) ? [] : {};
		for (key in o) {
			v = o[key];
			output[key] = (typeof v === "object") ? this.deepcopy(v) : v;
		}
		return output;
	}
	
	encrypt(string:any) {
		string = string.toString();
		console.log('string ', string )
		let ciphertext = CryptoJS.AES.encrypt(string, '12345672323').toString();
		ciphertext = ciphertext.toString().replace('+', 'xMl3Jk').replace('/', 'Por21Ld').replace('=', 'Ml32');
		return ciphertext;
	}
	
	decrypt(encryted_string:any){
		let dataString = encryted_string.toString().replace('xMl3Jk', '+').replace('Por21Ld', '/').replace('Ml32', '=');
		dataString = CryptoJS.AES.decrypt(dataString, '12345672323').toString(CryptoJS.enc.Utf8);
		return dataString 
	}
	
 
}