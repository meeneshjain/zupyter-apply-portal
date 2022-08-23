import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filterItem'
})
export class FilterItemPipe implements PipeTransform {
	transform(items: any[], searchText: string): any[] {
		if (!items) return [];
		if (!searchText) return items;
		searchText = searchText.toLowerCase();
		return items.filter(it => {
			if (it.ItemCode != undefined || it.ItemName || it.PaymentAmount){
				return (it.ItemCode.toString().toLowerCase().includes(searchText)) || it.ItemName.toString().toLowerCase().includes(searchText);
			} else {
				return it.toString().toLowerCase().includes(searchText);
			}
		});
	}
	
}