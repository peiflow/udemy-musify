import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.services";
import { User } from "../models/user";
import { GLOBAL } from "../services/global";

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})

export class UserEditComponent implements OnInit {
    public title: string;
    public user: User;
    public identity;
    public token;
    public alertMsg;
    public url: string;

    constructor(private _userService: UserService) {
        this.title = "Update profile";

        //Localstorage
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity;
        this.url = GLOBAL.url;
    }

    ngOnInit(): void {

    }

    onSubmit(): void {
        this._userService.updateUser(this.user).subscribe(
            (response) => {
                if (!response.user) {
                    this.alertMsg = 'User has been not updated';
                } else {
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    document.getElementById("identity_name").innerHTML = this.user.name;

                    if (!this.filesToUpload) {
                        console.log("no file");
                    } else {
                        this.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload).
                            then(
                                (result: any) => {
                                    this.user.image = result.image;
                                    localStorage.setItem('identity', JSON.stringify(this.user));
                                    console.log(this.user);
                                }
                            );
                    }
                    this.alertMsg = 'User updated';
                }
            },
            (error) => {
                var errorMsg = <any>error;

                if (errorMsg != null) {
                    var body = JSON.parse(error._body);
                    this.alertMsg = body.message;
                    console.log(error);
                }
            }
        );
    }

    public filesToUpload: Array<File>;

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
        //console.log(this.filesToUpload);
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
        var token = this.token;

        return new Promise(function (resolve, reject) {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();

            for (var i = 0; i < files.length; i++) {
                formData.append('image', files[i], files[i].name);
                console.log(files[i]);
            }

            xhr.onreadystatechange = function () {
                console.log({"xhr.readyState":xhr.readyState});
                if (xhr.readyState == 4) {
                    console.log({"xhr.status:":xhr.status});
                    console.log({"xhr.response":xhr.response});
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    }
                } else {
                    reject(xhr.response);
                }
            }
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
}