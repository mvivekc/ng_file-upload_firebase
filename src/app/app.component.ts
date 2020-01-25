import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';



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

export class AppComponent {
  title = 'demo';
  items: Observable<any[]>;
  collectionRef: AngularFirestoreCollection<Upload[]>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;

  constructor(private toastr: ToastrService, private db: AngularFirestore, private http:HttpClient, private afStorage: AngularFireStorage) {
    this.collectionRef = db.collection('purpose_build');
    this.afStorage = afStorage;
    this.items = this.collectionRef.valueChanges();
  }
  uploadFile(event) {
    const id = Math.random().toString(36).substring(2);
    let ref = this.afStorage.ref(id);
    let file:File = event.target.files[0];
    let task = ref.put(file);
    let fileAsEncodedString;
    var myReader:FileReader = new FileReader();

    myReader.onloadend = (e) => {
      fileAsEncodedString = myReader.result;
    }
    myReader.readAsDataURL(file);

    let docId = Date.now() + Math.random().toString(16).substr(2, 9)
    let newItem = this.collectionRef.doc(docId);
    let http = this.http;
    newItem.set({
      download_url: file.name,
      size: file.size,
      type: file.type
    }).then(function(){
      http.post('https://jsonplaceholder.typicode.com/posts/1/comments', {fileAsEncodedString: fileAsEncodedString}).subscribe(function(response){
        newItem.update({post_status: JSON.stringify(response)});
        console.log("GET request made :", arguments)
      }, function(error) {
        newItem.update({post_status: JSON.stringify(error)});
      });
    });
  }
}