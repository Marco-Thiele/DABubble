import { Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ProfilComponent } from './profil/profil.component';


@Injectable({
  providedIn: 'root'
})
export class DialogService {
  overlayRef: any;
  overlayRefEdidt: any;
  profil: boolean = false;
  editProfil: boolean = false;
  constructor(private overlay: Overlay) { }

  openDialog(Component: any) {
    // Erstellen Sie ein Overlay-Ref
    if (this.profil == false) {
      this.overlayRef = this.overlay.create({
        positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
        hasBackdrop: true,
      });
      this.profil = true;
      console.log('profil', this.profil)
      // Erstellen Sie ein Portal für Ihre Dialogkomponente
      const portal = new ComponentPortal(Component);

      // Attachieren Sie das Portal an das Overlay-Ref
      const componentRef = this.overlayRef.attach(portal);

    } else {
      this.overlayRefEdidt = this.overlay.create({
        positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
        hasBackdrop: true,
      });
      this.editProfil = true;
      // Erstellen Sie ein Portal für Ihre Dialogkomponente
      const portal = new ComponentPortal(Component);

      // Attachieren Sie das Portal an das Overlay-Ref
      const componentRef = this.overlayRefEdidt.attach(portal);

    }

    if (this.profil == true){
      this.overlayRef.backdropClick().subscribe(() => {
        if (this.profil == true && this.editProfil == false){
        this.overlayRef.detach(); // Schließen Sie den Dialog, wenn auf den Hintergrund geklickt wird
        this.profil = false;
        }
      });
    }
    
    if (this.editProfil == true) {
      this.overlayRefEdidt.backdropClick().subscribe(() => {
        if (this.editProfil == true) {
        this.overlayRefEdidt.detach(); // Schließen Sie den Dialog, wenn auf den Hintergrund geklickt wird
        this.editProfil = false;
      }
      });
    }
    
  }


  closeDialog() {
    // Schließen Sie das Overlay-Ref, um das Dialogfeld zu entfernen
    if (this.profil == true ) {
      this.overlayRef.detach();
      this.profil = false;
      console.log('profil', this.profil)
    }
    if (this.editProfil == true) {
      this.overlayRefEdidt.detach();
      this.editProfil = false;
    }

  }


}
