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
  showUserProfil: boolean = false;

  constructor(private overlay: Overlay) { }


  /**
   * Opens a new Component 
   * 
   * @param Component is the Component that will be opend
   */
  openDialog(Component: any) {
    if (this.showUserProfil == true)
      this.openDialogComponent(Component, this.overlayRef)
    if (this.profil == false)
      this.openDialogProfilComponent(Component)
    else
      this.openDialogEdidtComponent(Component);
    if (this.profil == true)
      this.profilBackDrop()
    if (this.editProfil == true)
      this.edidtBackDrop()
  }


  /**
   * Opens the User-profil-component
   * 
   * @param Component The new component 
   * @param overlayRef The variable this.overlayRef
   */
  openDialogComponent(Component: any, overlayRef: any) {
    overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true,
    });
    this.profil = true;
    const portal = new ComponentPortal(Component);
    const componentRef = overlayRef.attach(portal);
  }


  /**
   * Opens the Profil-component
   * 
   * @param Component The new component 
   */
  openDialogProfilComponent(Component: any) {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true,
    });
    this.profil = true;
    const portal = new ComponentPortal(Component);
    const componentRef = this.overlayRef.attach(portal);
  }


  /**
   * Opens the Profil-edidt-component
   * 
   * @param Component The new component 
   */
  openDialogEdidtComponent(Component: any) {
    this.overlayRefEdidt = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true,
    });
    this.editProfil = true;
    const portal = new ComponentPortal(Component);
    const componentRef = this.overlayRefEdidt.attach(portal);
  }


  /**
   * Close the Profil-Component by backdropClick
   * 
   */
  profilBackDrop() {
    this.overlayRef.backdropClick().subscribe(() => {
      if (this.profil == true && this.editProfil == false) {
        this.overlayRef.detach(); // Schließen Sie den Dialog, wenn auf den Hintergrund geklickt wird
        this.profil = false;
      }
    });
  }


  /**
   * Close the Profil-Edidt-Component by backdropClick
   * 
   */
  edidtBackDrop() {
    this.overlayRefEdidt.backdropClick().subscribe(() => {
      if (this.editProfil == true) {
        this.overlayRefEdidt.detach(); // Schließen Sie den Dialog, wenn auf den Hintergrund geklickt wird
        this.editProfil = false;
      }
    });
  }


  /**
   * Close the current Component
   * 
   */
  closeDialog() {
    if (this.profil == true) {
      this.overlayRef.detach();
      this.profil = false;
    }
    if (this.editProfil == true) {
      this.overlayRefEdidt.detach();
      this.editProfil = false;
    }
  }


}
