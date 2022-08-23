import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filter'
})
export class FilterPipe implements PipeTransform {
	transform(items: any[], searchText: string): any[] {
		if (!items) return [];
		if (!searchText) return items;
		searchText = searchText.toLowerCase();
		return items.filter(it => {
			if (it.DocEntry != undefined || it.DocNum || it.PaymentAmount || it.RouteName || it.CardName ){
				return (it.DocEntry.toString().toLowerCase().includes(searchText)) || it.DocNum.toString().toLowerCase().includes(searchText) || it.PaymentAmount.toString().toLowerCase().includes(searchText) || it.RouteName.toString().toLowerCase().includes(searchText) || it.CardName.toString().toLowerCase().includes(searchText);
			} else {
				return it.toString().toLowerCase().includes(searchText);
			}
		});
	}
	
}