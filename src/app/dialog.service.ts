import { Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ProfilComponent } from './profil/profil.component';


@Injectable({
  providedIn: 'root'
})
export class DialogService {
overlayRef:any;
  constructor(private overlay: Overlay) {}

  openDialog(Component:any) {
    // Erstellen Sie ein Overlay-Ref
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true,
    });

    // Erstellen Sie ein Portal für Ihre Dialogkomponente
    const portal = new ComponentPortal(Component);

    // Attachieren Sie das Portal an das Overlay-Ref
    const componentRef = this.overlayRef.attach(portal);

    // Optional: Fügen Sie weitere Konfigurationen für das Overlay-Ref hinzu
    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef.detach(); // Schließen Sie den Dialog, wenn auf den Hintergrund geklickt wird
    });
  }


  closeDialog() {
    // Schließen Sie das Overlay-Ref, um das Dialogfeld zu entfernen
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
  }


}
