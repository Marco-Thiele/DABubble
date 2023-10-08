import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-new-channel-members',
  templateUrl: './new-channel-members.component.html',
  styleUrls: ['./new-channel-members.component.scss'],
  standalone: true,
  imports: [
    MatRadioModule,
    FormsModule,
    MatCheckboxModule,
    MatCardModule,
    CommonModule,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class NewChannelMembersComponent implements OnInit {
  membersAdded = false;
  checked: boolean = false;
  showCheckbox: boolean = false;
  disabled = false;
  labelPosition: string;
  indeterminate = false;
  isButtonDisabled: boolean = false;
  buttonColor: string = '#444df2';
  channel: any;
  memberName: string = '';
  memberMatches: any[] = [];
  selectedMembers: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<NewChannelMembersComponent>,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.labelPosition = 'after';
    this.channel = data.channel;
  }

  ngOnInit(): void {}

  /**
   * Close the dialog
   */
  closeAddNewChannelMembers() {
    this.dialogRef.close();
  }

  // addMembers() {
  //   this.channel.members.push(member)
  // }

  searchMembers() {
    this.memberMatches = []; // Restablecer la lista de coincidencias

    // Obtener el nombre ingresado por el usuario desde el input
    const memberName = this.memberName.trim(); // Obtén el nombre ingresado

    // Validar que el nombre no esté vacío
    if (memberName === '') {
      // Mostrar una alerta o manejar el caso de nombre vacío
      return;
    }

    // Obtener la lista de miembros del localStorage
    const members = this.sharedService.getMembers();

    // Buscar miembros que coincidan parcialmente con el nombre ingresado
    this.memberMatches = members.filter((member) =>
      member.name.toLowerCase().includes(memberName.toLowerCase())
    );

    // Actualizar el estado del botón según si se encontraron coincidencias
    this.isButtonDisabled = this.memberMatches.length === 0;
    this.buttonColor = this.isButtonDisabled ? '#686868' : '#444df2';
  }

  addMemberToChannel(member: any) {
    this.channel.members.push(member);

    // Guardar el canal actualizado en el localStorage
    this.sharedService.addChannel(this.channel);

    // Limpiar el input y restablecer el estado del botón
    this.memberName = '';
    this.isButtonDisabled = true;
    this.buttonColor = '#686868';

    // Limpiar las coincidencias
    this.memberMatches = [];
  }

  /**
   * Add members to the channel
   */
  addNewChannelMembers() {
    if (this.labelPosition === 'after') {
      // Opción 1: Agregar miembros de 'Office-team'

      // Obtener la lista de miembros del localStorage
      const members = this.sharedService.getMembers();

      // Filtrar los miembros que tienen 'channels' igual a ['Office-team']
      const officeTeamMembers = members.filter((member) =>
        member.channels.includes('Office-team')
      );

      // Agregar los miembros filtrados al canal
      this.channel.members.push(...officeTeamMembers);
    } else {
      const selectedMembers = this.memberMatches.filter(
        (match) => match.selected
      );

      // Agregar los miembros seleccionados al canal
      this.channel.members.push(...selectedMembers);

      // Limpiar la lista de coincidencias y los miembros seleccionados
      this.memberMatches = [];
      this.selectedMembers = [];
    }

    // Guardar el canal actualizado en el localStorage
    this.sharedService.addChannel(this.channel);

    // Cerrar el diálogo
    this.dialogRef.close(true);
  }

  /**
   * Change the color of the button and enable or disable it
   * @param value
   */
  onChangeRadioButton(value: string) {
    this.labelPosition = value;

    if (value === 'before') {
      this.showCheckbox = true;
      this.isButtonDisabled = true;
      this.buttonColor = '#686868';
    } else {
      this.showCheckbox = false;
      this.isButtonDisabled = false;
      this.buttonColor = '#444df2';
    }
  }

  /**
   * Disable the button if the user finds a member
   */
  lookForMember() {
    this.isButtonDisabled = false;
    this.buttonColor = '#444df2';
  }
}
