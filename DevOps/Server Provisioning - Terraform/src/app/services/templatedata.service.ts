import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class TemplatedataService {

  
  private BASE_URL = "http://localhost:5000"
  constructor(private http: HttpClient ) { }

  public get_dictionary_values(){
    return this.http
      .get(`${this.BASE_URL}/get-dictionary-values`)
      ;
  }

  public get_files(){
    return this.http
      .get(`${this.BASE_URL}/get-files`)
      ;
  }

  public data_for_replace(data : any){
    this.http.post("http://localhost:5000/find-and-replace",JSON.parse(JSON.stringify(data))).subscribe(
      (response) => alert(response),
      (error) => alert(error)
      )
  }

  public create_instance(data : any){
    this.http.post("http://localhost:5000/create-instance",JSON.parse(JSON.stringify(data))).subscribe(
      (response) => alert(response),
      (error) => alert(error)
      )
  }

  public selected_file(data : any){
    return this.http.post("http://localhost:5000/selected-file",JSON.parse(JSON.stringify(data)))
  }

}
