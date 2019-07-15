import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IEmployeeMembership } from 'app/shared/model/EducationalManagement/employee-membership.model';
import { EmployeeMembershipService } from './employee-membership.service';

@Component({
    selector: 'jhi-employee-membership-delete-dialog',
    templateUrl: './employee-membership-delete-dialog.component.html'
})
export class EmployeeMembershipDeleteDialogComponent {
    employeeMembership: IEmployeeMembership;

    constructor(
        private employeeMembershipService: EmployeeMembershipService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.employeeMembershipService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'employeeMembershipListModification',
                content: 'Deleted an employeeMembership'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-employee-membership-delete-popup',
    template: ''
})
export class EmployeeMembershipDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ employeeMembership }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(EmployeeMembershipDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.employeeMembership = employeeMembership;
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
