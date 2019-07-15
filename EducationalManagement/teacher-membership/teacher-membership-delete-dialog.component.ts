import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITeacherMembership } from 'app/shared/model/EducationalManagement/teacher-membership.model';
import { TeacherMembershipService } from './teacher-membership.service';

@Component({
    selector: 'jhi-teacher-membership-delete-dialog',
    templateUrl: './teacher-membership-delete-dialog.component.html'
})
export class TeacherMembershipDeleteDialogComponent {
    teacherMembership: ITeacherMembership;

    constructor(
        private teacherMembershipService: TeacherMembershipService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.teacherMembershipService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'teacherMembershipListModification',
                content: 'Deleted an teacherMembership'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-teacher-membership-delete-popup',
    template: ''
})
export class TeacherMembershipDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ teacherMembership }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(TeacherMembershipDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.teacherMembership = teacherMembership;
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
