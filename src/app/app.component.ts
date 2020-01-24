import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';



const URL = 'http://localhost:8080/api/upload';


export interface Upload {
  download_url: string;
  type: string;
  size: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'demo';
  items: Observable<any[]>;
  collectionRef: AngularFirestoreCollection<Upload[]>;

  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: 'image'
  });

  constructor(private toastr: ToastrService, private db: AngularFirestore, private http:HttpClient) {
    this.collectionRef = db.collection('purpose_build');
    this.items = this.collectionRef.valueChanges();
  }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, status: any) => {
      let docId = Date.now() + Math.random().toString(16).substr(2, 9)
      let newItem = this.collectionRef.doc(docId);
      let http = this.http;
      newItem.set({
        download_url: item.file.name,
        size: item.file.size,
        type: item.file.type
      }).then(function(){
        http.post('https://jsonplaceholder.typicode.com/posts/1/comments', {}).subscribe(function(response){
          newItem.update({post_status: JSON.stringify(response)});
          console.log("GET request made :", arguments)
        }, function(error) {
          newItem.update({post_status: JSON.stringify(error)});
        });
      })
      .then(function() {
          console.log("Document successfully written!");
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
      this.toastr.success('File successfully uploaded!');
    };
  }

}