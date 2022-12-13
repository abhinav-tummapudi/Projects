import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TemplatedataService } from '../../services/templatedata.service';
import { element } from 'protractor';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})

export class TemplateComponent implements OnInit {

  public templatedata: any
  thisIsMyForm: FormGroup;
  public expanded: any = [];
  templateFiles: any;
  // templateselected : any;
  //public toggleEdit = 0;

 

  data: any = [
    // { name: "ANGULAR_EDIT1", type: "ANGULAR_EDIT1", label:"name" , heading : "module->lb->project" },
    // { name: "angular4", type: "angular4", label:"memory" },
  ];
  variable: number = 0;
  card: boolean = false;
  instanceCard: boolean = false;



  constructor(private formBuilder: FormBuilder, private templatedataservice: TemplatedataService) {
    this.templatedataservice.get_dictionary_values().subscribe((data: any) => {
      this.templatedata = data
      this.convertDataFromTemplate(this.templatedata)
      console.log(this.templatedata.type)
      this.buildForm();
    }, err => { })

    this.templatedataservice.get_files().subscribe((data: any) => {
      this.templateFiles = Object.values(data)
      console.log(this.templateFiles)
    }
    )

    this.thisIsMyForm = new FormGroup({
      formArrayName: this.formBuilder.array([])
    })
  }

  form = new FormGroup({
    file: new FormControl('', Validators.required)
  });

  submit() {
    if (!this.card) {
      this.card = !this.card
    }
    //this.card = !this.card
    this.data = []
    //console.log(this.form.value);
    // this.templateselected = this.form.value
    // console.log(this.templateselected)
    console.log(this.form.value)
    this.variable = 1
    this.templatedataservice.selected_file(this.form.value).subscribe((data: any) => {
      this.templatedata = data
      console.log(data)
      this.convertDataFromTemplate(this.templatedata)
      console.log(this.templatedata)
      this.buildForm();
    }, err => { })
    // this.templatedataservice.selected_file(this.form.value)
  }

  ngOnInit(): void {
   
  }
  convertDataFromTemplate(data: any) {
    for (var i in data) {
      let z: any = {}
      if (Array.isArray(data[i])) {
        var s = ""
        var data2 = data[i]
        z['name'] = i
        z['type'] = i
        z['label'] = data2[data2.length - 1]
        for (var j in data2) {

          // if(data2[j].length == data2.length -2){ break }

          s += data2[j] + " ?: "
        }
        z['heading'] = s
        console.log(z)
        this.data.push(z)
      }
    }
  }

  // convertDataFromTemplate(data: any) {
  //   // console.log(Object.keys(data).length)
  //   for (var key in data) {
  //     let x: any = {}
  //     if (data.hasOwnProperty(key)) {
  //       console.log(key + ": " + data[key]);
  //       x['label'] = key
  //       x['name'] = data[key]
  //       x['type'] = data[key]
  //       this.data.push(x)
  //     }
  //   }
  // }


  buildForm() {
    
    const controlArray = this.thisIsMyForm.get('formArrayName') as FormArray;
    for(let i = controlArray.length-1; i>=0; i--){
      controlArray.removeAt(i)
    }
    // controlArray = <FormArray>this.thisIsMyForm.controls['invoiceparticulars'];
    //     for(let i = controlArray.length-1; i >= 0; i--) {
    //         controlArray.removeAt(i)
    // }
    // Only push if it is unique (do not push same again)
    Object.keys(this.data).forEach((i: any) => {
      controlArray.push(
        this.formBuilder.group({
          name: new FormControl({ value: this.data[i].name, disabled: true }),
          type: new FormControl({ value: this.data[i].type, disabled: true })
        })
      )
    })
    //controlArray.reset(0)
    // for(let i =controlArray.length-1; i>=0;i--){
    //   controlArray.removeAt(i)
    // }
    console.log(controlArray.controls)
  }

  toggleEdit(i: any) {
    const controlArray = this.thisIsMyForm.get('formArrayName') as FormArray;
    if (controlArray.controls[i].status === 'DISABLED') {
      controlArray.controls[i].enable()
    } else {
      controlArray.controls[i].disable()
    }
    this.expanded[i] = !this.expanded[i];
  }
  fomrControlState(i: any) {
    const controlArray = this.thisIsMyForm.get('formArrayName') as FormArray;
    return controlArray.controls[i].disabled
  }

 
  onSubmit() {
    // var formdata: any  = new FormData();
    //formdata.app
    //console.log(this.thisIsMyForm.value);
    if(!this.instanceCard){
      this.instanceCard = !this.instanceCard
    }
    var temp = []
    // console.log(this.templateselected);
    // temp.push(this.templateselected) 
    // console.log(temp)
    temp = this.thisIsMyForm.value
    
    // console.log(Object.values(temp));
    this.templatedataservice.data_for_replace(Object.values(temp))

  }

  createInstance()
  { 
    var temp = {'type':'create'}
    this.templatedataservice.create_instance(temp)
  }
}