import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Student } from '../models/api-models/student.model';
import { StudentService } from './student.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  students: Student[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'gender', 'dateOfBirth', 'email', 'mobile'];
  dataSource: MatTableDataSource<Student> = new MatTableDataSource<Student>();
  @ViewChild(MatPaginator) matPaginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  filterString: string = "";

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    // Fetch the students
    this.studentService.getStudent()
    .subscribe(
      {
        next: successResponse => {
            this.handleSuccessResponse(successResponse);
        },
        error: (errorResponse) => this.handleError
      }

    );
  }

  handleSuccessResponse(successResponse: Student[])
  {
    this.students = successResponse;
    this.dataSource = new MatTableDataSource<Student>(this.students);

    if (this.matPaginator) {
      this.dataSource.paginator = this.matPaginator;
    }

    if (this.matSort) {
      this.dataSource.sort = this.matSort;
    }
  }

  handleError(errorResponse: string)
  {
    console.log(errorResponse);
  }

  filterStudents() {
    this.dataSource.filter = this.filterString.trim().toLowerCase();
  }

}