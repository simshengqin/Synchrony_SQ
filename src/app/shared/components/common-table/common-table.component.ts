import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmModalComponent} from '../confirm-modal/confirm-modal.component';
import {Assignment} from '../../../core/models/assignment';
import {Wage} from '../../../core/models/wage';
import {Account} from '../../../core/models/account';
import {AssignmentSubmission} from '../../../core/models/assignment-submission';
import {TableAction} from '../../../core/models/TableAction';
import {TableColumn} from '../../../core/models/TableColumn';
import {Freelancer} from '../../../core/models/freelancer';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {AssignmentService} from '../../../core/services/assignment.service';
import {InstructorService} from '../../../core/services/instructor.service';
import {DateHelper} from '../../helpers/date-helper';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {AssignmentSubmissionService} from '../../../core/services/assignment-submission.service';
import {AccountService} from '../../../core/services/account.service';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];

/**
 * @title Styling columns using their auto-generated column names
 */
@Component({
  selector: 'app-common-table',
  templateUrl: './common-table.component.html',
  styleUrls: ['./common-table.component.scss']
})
export class CommonTableComponent implements OnInit {
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = new MatTableDataSource(ELEMENT_DATA);
  dataSource;
  @Input() assignments: Array<Assignment> = [];
  displayedColumns: string[];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  TableColumn = TableColumn;
  TableAction = TableAction;
  @Input() tableActions?: Array<TableAction>;
  @Input() tableColumns?: Array<TableColumn>;
  @ViewChild(ConfirmModalComponent) confirmModalComponent: ConfirmModalComponent;
  @Input() assignmentSubmissions: Array<AssignmentSubmission> = [];
  @Input() freelancers: Array<Freelancer> = [];
  @Input() wages: Array<Wage> = [];
  @Input() accounts: Array<Account> = [];
  monthDayYearFormat: string;
  fullMonthDayYearFormat: string;
  dateTimeFormat: string;
  monthYearFormat: string;
  dateNow = Date.now();
  constructor(
    private assignmentService: AssignmentService,
    private instructorService: InstructorService,
    private assignmentSubmissionService: AssignmentSubmissionService,
    private accountService: AccountService,
    private dateHelper: DateHelper,
    private router: Router,
  ) {}
  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.dateHelper.getFormat('monthDayYear'),
      this.dateHelper.getFormat('fullMonthDayYear'),
      this.dateHelper.getFormat('dateTime'),
      this.dateHelper.getFormat('monthYear'),
    ]).then((results) => {
      this.monthDayYearFormat = results[0];
      this.fullMonthDayYearFormat = results[1];
      this.dateTimeFormat = results[2];
      this.monthYearFormat = results[3];
    });


  }
  loadTableData(data: Array<any>) {
    // console.log(ELEMENT_DATA);
    // const dataSource2 = new MatTableDataSource(ELEMENT_DATA);
    // console.log(dataSource2);
    // this.displayedColumns = ['position', 'name', 'dueDatetime', 'school', 'group'];
    console.log(data);
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    console.log(this.dataSource);
  }
  onCloseModal(response: string) {
    console.log(response);
  }

  onDeleteClick(name: string, assignmentDocId: string) {
    this.confirmModalComponent.open('Delete Assignment', 'Are you sure you want to delete '
      + name + '?', ['close', 'delete'], null, null, null, assignmentDocId);
  }

  onEditClick(assignmentDocId: string) {
    this.router.navigate(['assignment/edit'], { queryParams: { assignmentDocId : assignmentDocId }});
  }

  onSubmitClick(assignmentDocId: string) {
    this.router.navigate(['assignment/submit'], { queryParams: { assignmentDocId : assignmentDocId }});
  }
  onMarkClick(assignmentSubmissionDocId: string) {
    this.router.navigate(['assignment/mark'], { queryParams: { assignmentSubmissionDocId : assignmentSubmissionDocId }});
  }

  onRemarkClick(assignmentSubmission: AssignmentSubmission) {
    this.router.navigate(['assignment/mark'], { queryParams: { assignmentSubmissionDocId : assignmentSubmission.docId }});
  }

  async onFeedbackInstructorClick(assignmentSubmissionDocId: string) {
    const assignmentSubmission = await this.assignmentSubmissionService.getAssignmentSubmission(assignmentSubmissionDocId)
      .pipe(first())
      .toPromise();
    this.confirmModalComponent.open('View Feedback', assignmentSubmission.feedback, ['ok']);
  }
  onFeedbackStudentClick(assignmentSubmissionDocId: string) {
    this.router.navigate(['assignment/feedback'], { queryParams: { assignmentSubmissionDocId : assignmentSubmissionDocId }});
  }

  onViewHours(freelancerDocId: string) {
    this.router.navigate(['wages/view'], { queryParams: { freelancerDocId : freelancerDocId }});
  }

  async onDeleteClickAccount(accountDocId: string) {
    const account = await this.accountService.getAccount(accountDocId)
      .pipe(first())
      .toPromise();
    this.confirmModalComponent.open('Delete Account', 'Are you sure you want to delete '
      + account.username + '?', ['close', 'delete'], null, null, account);
  }

}

