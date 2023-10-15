export class message{
    public name: string = '';
    public time: number | string = '';
    public message: string[] = [];
    public thread: string[] = []
    public image : string = '';

    public toJson(){
        return {
            name: this.name,
            time: this.time,
            message: this.message,
            thread: this.thread,
            image : this.image,
        }
    }
}

// import { Firestore, doc, getDoc, addDoc, collection, collectionData, onSnapshot, updateDoc, deleteDoc} from '@angular/fire/firestore';

// Add Message : 

// async addGameToDatabase() {
//       try {
//         const docRef = await addDoc(this.getGameCollection(), this.game.toJson());
//         console.log(docRef)
//       } catch (err) {
//         console.error(err);
//       }
//     }

// getgamecollection =

//   getGameCollection(){
//     return collection(this.firestore, 'games');
//   }

// edit :

// async updateGame(){
//         let docRef = this.getCurrentGame();
//         await updateDoc(docRef, this.game.toJson()).catch(
//           (err) => {console.log(err); }
//         );
//     }

// delete:

// async deleteGameFromDatabase(){
//       await deleteDoc(this.getCurrentGame());
//     }

// getCurrentGame(){ {
//         return doc(collection(this.firestore, 'games'), this.currentGameId);
//       }
//     }

// read:

// subGameList(){
//       return onSnapshot(this.getGameCollection(), (list) => {
//         list.forEach((element) => {

//           if (element.id == this.currentGameId){
//             const gameData = element.data();
//             this.game.currentPlayer = gameData['currentPlayer'];
//             this.game.players = gameData['players'];
//             this.game.player_images = gameData['player_images'];
//             this.game.playedCards = gameData['playedCards'];
//             this.game.stack = gameData['stack'];
//             this.game.pickCardAnimation = gameData['pickCardAnimation'];
//             this.game.currentCard = gameData['currentCard'];

//             if(this.game.players.length >= 2){
//               this.startGame = true;
//             }
//           }
//         });
//       });
//     }