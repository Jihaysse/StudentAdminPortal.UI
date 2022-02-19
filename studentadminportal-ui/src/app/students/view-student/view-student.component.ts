import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {

  studentId: string | null | undefined;
  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: 0,
    genderID: '',
    profileImageURL: '',
    gender:  {
      id: '',
      description: '',
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: ''
    }
  }

  isNewStudent: boolean = true;
  header = '';
  displayProfileImageURL: string = '';

  genderList: Gender[] = [];

  @ViewChild('studentDetailsForm') studentDetailsForm?: NgForm;


  constructor(
    private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GenderService,
    private snackbar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        this.studentId = params.get('id');

        if (this.studentId) {
          // Check if the route contains keyword "add"
          // -> new student
          if (this.studentId.toLowerCase() == "add")
          {
            this.isNewStudent = true;
            this.header = "Add New Student";
            this.setImage();
          }
          else // existing student
          {
            this.isNewStudent = false;
            this.header = "Edit Student";

            this.studentService.getStudent(this.studentId)
            .subscribe(
              {
                next: (successResponse) => {
                  this.student = successResponse;
                  this.setImage();
                },
                error: (error) => {
                  this.setImage();
                }
              }


            );
          }



          this.genderService.getGenderList()
          .subscribe(
            (successResponse) => {
              this.genderList = successResponse;
            }
          )
        }
      }
    );
  }

  onUpdate(): void {

    if (!this.studentDetailsForm?.form.valid) return;

    // Call student service to update the student
    this.studentService.updateStudent(this.student.id, this.student)
    .subscribe(
      {
        next: () => {
          // Show notification
          this.snackbar.open('Student updated successfully', undefined, {
            duration: 3000
          });
        },
        error: (error) => {
          console.log(error);
        }
      });
  }

  onDelete(): void {
    // Call student service to delete the student
    this.studentService.deleteStudent(this.student.id)
    .subscribe(
      {
      next: (successResponse) => {
        // Notification
        this.snackbar.open('Student deleted successfully', undefined, {
          duration: 2000
        });

        // Wait until notification is gone
        setTimeout(() => {
          // Go back to students table
          this.router.navigateByUrl('students');
        }, 2000);
      },
      error: (errorResponse) => {
        console.log(errorResponse);
      }
    })
  };

  onAdd(): void {

    if (!this.studentDetailsForm?.form.valid) return;

    this.studentService.addStudent(this.student)
    .subscribe(
      {
        next: (successResponse) => {
          this.snackbar.open('Student added successfully', undefined, {
            duration: 2000
          });

          // Wait until notification is gone
          setTimeout(() => {
            // Go back to students table
            this.router.navigateByUrl('students');
          }, 2000);
        },
        error: (errorResponse) => {
          console.log(errorResponse);
        }
      }
    );
  }

  uploadImage(event: any): void {
    if (this.studentId) {
      const file: File = event.target.files[0];
      this.studentService.uploadImage(this.student.id, file)
      .subscribe( {
        next: (successResponse) => {
          this.student.profileImageURL = successResponse;
          this.setImage();

          // Notification
          this.snackbar.open('Profile image updated sucessfully', undefined, {
            duration: 2000
          });
        },
        error: (error) => {

        }
      });
    }
  }

  setImage(): void {
    if (this.student.profileImageURL) {
      // Fetch the image by URL
      this.displayProfileImageURL = this.studentService.getImagePath(this.student.profileImageURL);
    }
    else {
      // Display default image
      this.displayProfileImageURL = 'assets/user.png';
    }
  }

}
