import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { TemplatedataService } from 'src/app/services/templatedata.service';

@Component({
  selector: 'app-select-template',
  templateUrl: './select-template.component.html',
  styleUrls: ['./select-template.component.css']
})
export class SelectTemplateComponent implements OnInit {
  templateFiles: any;

  constructor(private templatedataservice : TemplatedataService) { 
    // this.templatedataservice.get_files().subscribe((data: any) => {
    //   this.templateFiles = Object.values(data)
    //   console.log(this.templateFiles)
    // }
    //)
  }

  
  form = new FormGroup({
    file: new FormControl('', Validators.required)
  });
  
  submit(){
    console.log(this.form.value);
    this.templatedataservice.selected_file(this.form.value)
  }
  
  ngOnInit(): void {
  }


}
