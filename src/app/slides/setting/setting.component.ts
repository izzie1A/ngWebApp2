import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Component, Renderer2, ElementRef, OnInit } from '@angular/core';


@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
})
export class SettingComponent {
  constructor(private renderer: Renderer2, private el: ElementRef) { }

  onChangeColor(input: any) {
    console.log(this.renderer)
    const hostElem = this.el.nativeElement;
    this.renderer.setStyle(hostElem, '--main', 'blue');
    console.log(this.renderer)
  }
  
}
