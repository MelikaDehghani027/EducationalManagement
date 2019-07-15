import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IEducationalInstitute } from 'app/shared/model/EducationalManagement/educational-institute.model';
import { EducationalInstituteService } from './educational-institute.service';

@Component({
    selector: 'jhi-educational-institute-delete-dialog',
    templateUrl: './educational-institute-delete-dialog.component.html'
})
export class EducationalInstituteDeleteDialogComponent {
    educationalInstitute: IEducationalInstitute;

    constructor(
        private educationalInstituteService: EducationalInstituteService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.educationalInstituteService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'educationalInstituteListModification',
                content: 'Deleted an educationalInstitute'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-educational-institute-delete-popup',
    template: ''
})
export class EducationalInstituteDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ educationalInstitute }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(EducationalInstituteDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.educationalInstitute = educationalInstitute;
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
