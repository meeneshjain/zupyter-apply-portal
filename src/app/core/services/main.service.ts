import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { CommonFunctions } from "../helpers/common.functions";
import { map } from 'rxjs/operators';
@Injectable({
	providedIn: 'root'
})

export class MainService {
	public config_file_data: any;
	public common_params = new CommonFunctions();
	public sys_id = 1;
	public mod_id = 2;
	public module_list = [];
	public module_name = "Customer Portal";

	constructor(private httpclient: HttpClient) { }

	async get_config(callback) {
		let config_call = await fetch(this.common_params.get_current_url() + "/assets/config.json");
		let config_data = await config_call.json();
		if (callback != undefined && callback !== "") {
			let obj_str = JSON.stringify(config_data);
			sessionStorage.setItem('system_config', obj_str);
			callback(obj_str);
		}
	}

	async get_contry_list(callback) {
		let config_call = await fetch(this.common_params.get_current_url() + "/assets/country.json");
		let country_data = await config_call.json();
		if (callback != undefined && callback !== "") {
			callback(country_data);
		}
	}

	check_login(username, password): Observable<any> {
		this.config_file_data = JSON.parse(sessionStorage.getItem('system_config'));
		let data_object = {
			EmailID: username,
			Password: password,
		};
		return this.httpclient.post(this.config_file_data.service_url + "/mod/user/validateuser", data_object); // this.common_params.httpOptions
	}

	validate_user_access(email, password): Observable<any> {
		this.config_file_data = JSON.parse(sessionStorage.getItem('system_config'));
		this.mod_id = this.common_params.get_module_id(this.module_name);
		let data_object = {
			"ModID": this.mod_id,
			"SysID": this.sys_id,
			"EmailID": email,
			'Password': password
		};
		return this.httpclient.post(this.config_file_data.service_url + "/cp/ValidateUser", data_object); // this.common_params.httpOptions
	}

	get_mod_list(): Observable<any> {
		this.config_file_data = JSON.parse(sessionStorage.getItem('system_config'));
		return this.httpclient.get(this.config_file_data.service_url + "/mod/modlist/"); // this.common_params.httpOptions
	}

	get_user_details(user_id, mod_id): Observable<any> {
		this.config_file_data = JSON.parse(sessionStorage.getItem('system_config'));
		return this.httpclient.get(this.config_file_data.service_url + "/mod/user/" + user_id); // this.common_params.httpOptions
	}


	new_validate_user_access(email, password): Observable<any> {
		this.config_file_data = JSON.parse(sessionStorage.getItem('system_config'));
		this.mod_id = this.common_params.get_module_id(this.module_name);
		let data_object = {
			"ModID": this.mod_id,
			"SysID": this.sys_id,
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

	get_payment_profile(CardCode): Observable<any> {
		this.config_file_data = JSON.parse(sessionStorage.getItem('system_config'));
		this.mod_id = this.common_params.get_module_id("CRM");
		let data_object = {
			"SysID": this.sys_id,
			"ModID": this.mod_id,
			"UserID": parseInt(sessionStorage.user_id),
			"Mode": "F",
			"CardCode": CardCode,
		};
		return this.httpclient.post(this.config_file_data.service_url + "/pp/payprofile", data_object); // this.common_params.httpOptions
	}


	create_payment_profile(mode, dataset, card_bank_data): Observable<any> {
		let user_details = JSON.parse(sessionStorage.user_details);
		let data_object = {
			"SysID": this.sys_id,
			"UserID": parseInt(sessionStorage.user_id),
			"ModID": this.mod_id,
			"Mode": mode,
			"Custid": dataset.Custid,
			"CardCode": user_details.CardCode,
			"CardName": user_details.CardName,
			"Email_ID": user_details.EmailID,
			"customerProfileId": dataset.customerProfileId,
			"PaymentProfiles": [
				{
					"Mode": mode,
					"CardCode": user_details.CardCode,
					"UserID": parseInt(sessionStorage.user_id),
					"PayProfileID": card_bank_data.PayProfileID,
					"Custid": dataset.Custid,
					"CustomerType": card_bank_data.CustomerType,
					"FirstName": card_bank_data.FirstName,
					"LastName": card_bank_data.LastName,
					"Company": card_bank_data.Company,
					"Address": card_bank_data.Address,
					"City": card_bank_data.City,
					"State": card_bank_data.State,
					"Zip": card_bank_data.Zip,
					"Country": card_bank_data.Country,
					"Phone": card_bank_data.Phone,
					"Fax": card_bank_data.Fax,
					"PayType": card_bank_data.PayType,
					"CardType": card_bank_data.CardType,
					"CardNumber": card_bank_data.CardNumber,
					"CardExpiry": card_bank_data.CardExpiry,
					"CVV": card_bank_data.CVV,
					"ACName": card_bank_data.ACName,
					"ACTypeID": card_bank_data.ACTypeID,
					"ACTypeName": card_bank_data.ACTypeName,
					"ACABRouteNo": card_bank_data.ACABRouteNo,
					"ACNumber": card_bank_data.ACNumber,
					"ACBank": card_bank_data.ACBank,
					"Active": card_bank_data.Active,
					"DefltPayProfile": card_bank_data.DefltPayProfile,
					"customerPaymentProfileId": card_bank_data.customerPaymentProfileId
				}
			]
		};

		console.log('object ', data_object)
		if (mode == "A") {
			return this.httpclient.post(this.config_file_data.service_url + "/pp/payprofile/add", data_object); // this.common_params.httpOptions
		} else if (mode == "M") {
			return this.httpclient.post(this.config_file_data.service_url + "/pp/payprofile/edit", data_object); // this.common_params.httpOptions
		}
	}


	get_invoices_transactions(ReportType, Detailed, search_string, page_no, record_in_page, from_date, to_date): Observable<any> {
		this.config_file_data = JSON.parse(sessionStorage.getItem('system_config'));
		let user_details = JSON.parse(sessionStorage.user_details);
		this.mod_id = this.common_params.get_module_id(this.module_name);
		let data_object = {
			"Mode": "F",
			"Detailed": Detailed,
			"ModID": this.mod_id,
			"SysID": this.sys_id,
			"UserID": parseInt(sessionStorage.user_id),
			"SearchString": search_string,
			"PageNumber": page_no,
			"RecordInPage": record_in_page,
			"CardCode": user_details.CardCode,
			"CardName": user_details.CardName,
			"From_RefDat": from_date,
			"To_RefDat": to_date,
			"ReportType": ReportType
		};
		return this.httpclient.post(this.config_file_data.service_url + "/crm/rpts/acdetails", data_object); // this.common_params.httpOptions
	}

	change_password(password): Observable<any> {
		this.config_file_data = JSON.parse(sessionStorage.getItem('system_config'));
		this.mod_id = this.common_params.get_module_id(this.module_name);
		let data_object = {
			"SysID": this.sys_id,
			"ModID": this.mod_id,
			"NewPassword": password,
			"UserId": parseInt(sessionStorage.user_id)
		}
		return this.httpclient.post(this.config_file_data.service_url + "/mod/user/change_password/", data_object); // this.common_params.httpOptions
	}

	delete_payment_profile(customerProfileId, PayProfileID, customerPaymentProfileId): Observable<any> {
		let user_details = JSON.parse(sessionStorage.user_details);
		this.mod_id = this.common_params.get_module_id(this.module_name);
		let data_object = {
			"SysID": this.sys_id,
			"ModID": this.mod_id,
			"UserID": parseInt(sessionStorage.user_id),
			"Mode": "R",
			"customerProfileId": customerProfileId,
			"PaymentProfiles": [{
				"Mode": "R",
				"PayProfileID": PayProfileID,
				"customerPaymentProfileId": customerPaymentProfileId
			}
			]
		};

		return this.httpclient.post(this.config_file_data.service_url + "/pp/payprofile/del", data_object); // this.common_params.httpOptions
	}

	add_transaction(customerProfileId, customerPaymentProfileId, PayProfileID, PaidAmt, line_data): Observable<any> {
		let user_details = JSON.parse(sessionStorage.user_details);
		this.mod_id = this.common_params.get_module_id(this.module_name);
		let data_object = {
			"SysID": this.sys_id,
			"ModID": this.mod_id,
			"UserID": parseInt(sessionStorage.user_id),
			"Mode": "A",
			"DataType": "", //"H" if need header information "D" if details needed
			"pp_TransID": -1,
			"pp_TransNum": -1,
			"CardCode": user_details.CardCode,
			"CardName": user_details.CardName,
			"SearchString": "",
			"PageNumber": 1,
			"RecordInPage": 1,
			"PaidAmt": PaidAmt,
			"DiscAmt": 0,
			"PayProfileID": PayProfileID,
			"customerProfileId": customerProfileId,
			"customerPaymentProfileId": customerPaymentProfileId,
			"MarkupType": "A",
			"MarkupValue": 20,
			"PayOnAcct": "N",
			"Comments": "",
			"transid": "",
			"authCode": "",
			"networkTransId": "",
			"Lines": line_data
		};

		return this.httpclient.post(this.config_file_data.service_url + "/pp/trans/add", data_object); // this.common_params.httpOptions
	}


	get_completed_transaction(pp_TransID, pp_TransNum, DataType, RecordInPage): Observable<any> {
		this.mod_id = this.common_params.get_module_id(this.module_name);
		let data_object = {
			"SysID": this.sys_id,
			"ModID": this.mod_id,
			"UserID": parseInt(sessionStorage.user_id),
			"PageNumber": 1,
			"RecordInPage": RecordInPage,
			"pp_TransID": pp_TransID,
			"pp_TransNum": pp_TransNum,
			"erp_sync": false,
			"DataType": DataType,
			"CardCode": "",
			"SearchString": ""
		};

		return this.httpclient.post(this.config_file_data.service_url + "/pp/trans/", data_object); // this.common_params.httpOptions
	}

	get_fleet_settings(): Observable<any> {
		this.config_file_data = JSON.parse(sessionStorage.getItem('system_config'));
		let mod_id = this.common_params.get_module_id("Fleet Management");
		let data_object = {
			"SysID": this.sys_id,
			"ModID": mod_id,
			"UserID": parseInt(sessionStorage.user_id),
			"Mode": "F",
		};
		return this.httpclient.post(this.config_file_data.service_url + "/fleet", data_object); // this.common_params.httpOptions
	}

	get_delivery_app_data(DocNum): Observable<any> {
		this.config_file_data = JSON.parse(sessionStorage.getItem('system_config'));
		let mod_id = this.common_params.get_module_id("Fleet Management");
		let data_object = {
			"SysID": this.sys_id,
			"ModID": mod_id,
			"UserID": parseInt(sessionStorage.user_id),
			"Mode": "F",
			"DocNum": DocNum,
			"DocEntry": -1
			// "DocEntry": DocEntry
		};
		return this.httpclient.post(this.config_file_data.service_url + "/fleet/delv", data_object); // this.common_params.httpOptions
	}

	update_delivery(fleet_settings, dataset, signature): Observable<any> {
		this.config_file_data = JSON.parse(sessionStorage.getItem('system_config'));
		let mod_id = this.common_params.get_module_id('Fleet Management');
		dataset.ArrivalTime = dataset.ArrivalTime.split(":").join("");
		dataset.DeliveryStartTime = dataset.DeliveryStartTime.split(":").join("");
		dataset.DeliveryEndTime = dataset.DeliveryEndTime.split(":").join("");
		let data_object = {
			"SysID": 1,
			"ModID": mod_id,
			"UserID": parseInt(sessionStorage.user_id),
			"ConfigcrmID": parseFloat(fleet_settings.ConfigcrmID).toString(),
			"DocEntry": dataset.DocEntry,
			"DocNum": dataset.DocNum,
			"DocDate": dataset.DocDate,
			"DocDueDate": dataset.DocDueDate,
			"CardCode": dataset.CardCode,
			"CardName": dataset.CardName,
			"RouteName": dataset.RouteName,
			"StopNo": dataset.StopNo,
			"DeliveryStatus": 'D',
			"ArrivalTime": dataset.ArrivalTime,
			"DeliveryStartTime": dataset.DeliveryStartTime,
			"DeliveryEndTime": dataset.DeliveryEndTime,
			"ItemsReturned": dataset.ItemsReturned,
			"CheckNo": dataset.CheckNo,
			"ReturnItems": dataset.ReturnItems,
			"PaymentReceived": dataset.PaymentReceived,
			"Comments": dataset.Comments,
			"PaymentMethod": dataset.PaymentMethod,
			"PaymentAmount": parseInt(dataset.PaymentAmount),
			"Signature": signature,
			"SignatureDate": dataset.SignatureDate,
			"PalletReturn": dataset.PalletReturn
		};
		return this.httpclient.post(this.config_file_data.service_url + "/fleet/delv/upd", data_object); // this.common_params.httpOptions
	}

	add_application(mode, lead_id, row_data): Observable<any> {
		this.config_file_data = JSON.parse(sessionStorage.getItem('system_config'));
		this.mod_id = this.common_params.get_module_id(this.module_name);
		let userid = (sessionStorage.user_id != undefined) ? parseInt(sessionStorage.user_id) : -1;
		let weekday_text = ''; 
		if (row_data.opening_hours!= undefined){
			for (let index in row_data.opening_hours.weekday_text){
				let formated_date = row_data.opening_hours.weekday_text[index].replace("???", 'to').replace(":", " - ");
				weekday_text += " " + formated_date + ',';
			}
			weekday_text= weekday_text.slice(0, -1)
		}
		
		if (row_data.Hours != ''){
			weekday_text = row_data.Hours;
		}
	
		let data_object = {
			"SysID": this.sys_id,
			"ModID": this.mod_id,
			"UserID": userid,
			"Lead_id": lead_id,
			"Mode": mode,
			"BusinessName": row_data.BusinessName,
			"LegalName": row_data.LegalName,
			"EntityType": row_data.EntityType,
			"IsPremisesLeased": row_data.IsPremisesLeased,
			"LandloadName": row_data.LandloadName,
			"ShipToAddress": row_data.ship_to_address,
			"ShipToCity": row_data.ship_to_address_City,
			"ShipToState": row_data.ship_to_address_State,
			"ShipToZip": row_data.ship_to_address_ZipCode,
			"ShipToCountry": row_data.ship_to_address_Country,
			"Email": row_data.email,
			"Phone": row_data.businessphone,
			"BillToAddress": row_data.bill_to_address,
			"BillToCity": row_data.bill_to_address_City,
			"BillToState": row_data.bill_to_address_State,
			"BillToZip": row_data.bill_to_address_ZipCode,
			"BillToCountry": row_data.bill_to_address_Country,
			"Website": row_data.website,
			"BusinessStatus": row_data.business_status,
			"Hours": weekday_text,
			"Location": row_data.vicinity,
			
			"Rating" : row_data.Rating,
			"RatingTotal" : row_data.RatingTotal,
			"Vicinity" : row_data.Vicinity,
			"MapUrl" : row_data.MapUrl,
			"PlaceId" : row_data.PlaceId,
			
			"UploadedForm": row_data.UploadedForm,
			"SalesTaxPermit": row_data.SalesTaxPermit,
			"ExecutedDocuments": row_data.ExecutedDocuments,
			
			"Approve1": row_data.Approve1,
			"Apprv1Date": row_data.Apprv1Date,
			"Approve2": row_data.Approve2,
			"Apprv2Date": row_data.Apprv2Date,
			"Contacts": []
		};
		
		if (row_data.nameCorpOfficer1 != undefined && row_data.nameCorpOfficer1!= ''){
			data_object.Contacts.push({
					"LeadCnt_id": -1,
				"Lead_id": lead_id,
					"CorpOfficer": row_data.nameCorpOfficer1,
					"Tel": row_data.telephone1,
					"SSNo": row_data.SSNo1,
					"Fax": row_data.fax1,
					"PrintedName": row_data.signature_name1,
					"Signature": row_data.generated_sign_base64_1,
					"SignatureDate": row_data.SignatureDate1,
					"Title": row_data.title1 || null,
					"Email": row_data.Email1 || row_data.email,
				});
		}
		
		if (row_data.nameCorpOfficer2 != undefined && row_data.nameCorpOfficer2 != '') {
			data_object.Contacts.push({
				"LeadCnt_id": -1,
				"Lead_id": lead_id,
				"CorpOfficer": row_data.nameCorpOfficer2,
				"Tel": row_data.telephone2,
				"SSNo": row_data.SSNo2,
				"Fax": row_data.fax2,
				"PrintedName": row_data.signature_name2,
				"Signature": row_data.generated_sign_base64_2,
				"SignatureDate": row_data.SignatureDate2,
				"Title": row_data.title2 || row_data.title1,
				"Email": row_data.Email2 || row_data.email,
			});
		}
		
		
		if (mode == "A") {
			return this.httpclient.post(this.config_file_data.service_url + "/cp/leads/add", data_object); // this.common_params.httpOptions
		} else if (mode == "M") {
			return this.httpclient.post(this.config_file_data.service_url + "/cp/leads/edit", data_object); // this.common_params.httpOptions
		}
	}
	
	get_application(lead_id, name, email, phone): Observable<any> {
		this.config_file_data = JSON.parse(sessionStorage.getItem('system_config'));
		let mod_id = this.common_params.get_module_id("Fleet Management");
		let data_object = {
			"SysID": this.sys_id,
			"ModID": mod_id,
			"UserID": -1,
			"Lead_id": lead_id,
			"Mode": "F",
			"BusinessName": name,
			"Email": email,
			"Phone": phone,
		};
		return this.httpclient.post(this.config_file_data.service_url + "/cp/leads", data_object); // this.common_params.httpOptions
	}
	
	upload_file(formData): Observable<any> {
		this.config_file_data = JSON.parse(sessionStorage.getItem('system_config'));

		return this.httpclient.post<any>(this.config_file_data.service_url + "/cp/leads/uploadfile", formData, {
		//	reportProgress: true,
		//	observe: 'events'
		});
	}
	



}