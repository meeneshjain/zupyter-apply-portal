import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '../layout/layout.module';

// pipes
import { ToFixedPipe } from 'src/app/core/pipe/to-fixed.pipe';
import { FilterPipe } from 'src/app/core/pipe/filter.pipe';
import { FilterItemPipe } from 'src/app/core/pipe/filterItem.pipe';
import { BlankhandlerPipe } from 'src/app/core/pipe/blankhandler.pipe';
// import { SafeURLPipe } from 'src/app/core/pipe/safe-url.pipe';
import { NoSanitizePipe } from 'src/app/core/pipe/no-sanatize-html';
@NgModule({
	declarations: [
	ToFixedPipe,
	FilterPipe,
	FilterItemPipe,
	BlankhandlerPipe,
	// SafeURLPipe,
	NoSanitizePipe,
	],
	imports: [
	FormsModule,
	CommonModule,
	LayoutModule,
	],
	exports: [FormsModule, LayoutModule, ToFixedPipe, FilterPipe, FilterItemPipe, BlankhandlerPipe, /* SafeURLPipe, */ NoSanitizePipe],
	providers: [],
	bootstrap: []
})

export class SharedModules { }