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
			if(it.value != undefined){
				return it.value.toString().toLowerCase().includes(searchText);
			} else {
				return it.toString().toLowerCase().includes(searchText);
			}
		});
	}
	
}