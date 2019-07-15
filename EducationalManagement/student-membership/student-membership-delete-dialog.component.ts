import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IStudentMembership } from 'app/shared/model/EducationalManagement/student-membership.model';
import { StudentMembershipService } from './student-membership.service';

@Component({
    selector: 'jhi-student-membership-delete-dialog',
    templateUrl: './student-membership-delete-dialog.component.html'
})
export class StudentMembershipDeleteDialogComponent {
    studentMembership: IStudentMembership;

    constructor(
        private studentMembershipService: StudentMembershipService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.studentMembershipService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'studentMembershipListModification',
                content: 'Deleted an studentMembership'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-student-membership-delete-popup',
    template: ''
})
export class StudentMembershipDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ studentMembership }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(StudentMembershipDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.studentMembership = studentMembership;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
