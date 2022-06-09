import React, { Component } from 'react';
import App from './App';
// import Board from './Board';
// import PubNubReact from 'pubnub-react';
import PubNub from 'pubnub';
import  PubNubReact from 'pubnub-react';
import Swal from "sweetalert2";  
import shortid  from 'shortid';
export default class Front extends Component {
  constructor(props) {  
    super(props);
    // credentials enter when you call constructor..
    const API_PUBLISH_KEY = process.env.REACT_APP_PUBLISHKEY  
    const API_SUBSCRIBE_KEY=process.env.REACT_APP_SUBSCRIBEKEY
    this.pubnub = new PubNubReact({
      publishKey: API_PUBLISH_KEY, // Put your own publish key here after creating account on pubnub
      subscribeKey: API_SUBSCRIBE_KEY,  // Put your own subscribe key here after creating account on pubnub  
      uuid:"CREATED_REACT_CHESS_GAME" 
    });
    this.state = {
      piece: '',
      isPlaying: false,
      isRoomCreator: false,
      isDisabled: false,
      myTurn: false,
    };

    this.lobbyChannel = null;
    this.gameChannel = null;
    this.roomId = null;    
    this.pubnub.init(this);
  }  
  
  componentWillUnmount() {
    this.pubnub.unsubscribe({
      channels : [this.lobbyChannel, this.gameChannel]
    });
  }
  
  componentDidUpdate() {
    // Check that the player is connected to a channel
    if(this.lobbyChannel != null){
      this.pubnub.getMessage(this.lobbyChannel, (msg) => {
        // Start the game once an opponent joins the channel
        if(msg.message.notRoomCreator){
          // Create a different channel for the game
          this.gameChannel = 'reactchessgame--' + this.roomId;

          this.pubnub.subscribe({
            channels: [this.gameChannel]
          });

          this.setState({
            isPlaying: true
          });  

          // Close the modals if they are opened
          Swal.close();
        }
      }); 
    }
  }

  // Create a room channel
  onPressCreate = (e) => {
    // Create a random name for the channel
    this.roomId = shortid.generate().substring(0,5);
    this.lobbyChannel = 'reactchesslobby--' + this.roomId;

    this.pubnub.subscribe({
      channels: [this.lobbyChannel],
      withPresence: true,
      includeState: true
    });

  // Open the modal
  Swal.fire({
    position: 'top',
    allowOutsideClick: false,
    title: 'Share this room ID with your friend',
    text: this.roomId,
    width: 275,
    padding: '0.7em',
    // Custom CSS
    customClass: {
        heightAuto: false,
        title: 'title-class',
        popup: 'popup-class',
        confirmButton: 'button-class'
    }
  })

    this.setState({
      piece: 'A', // white pieces in chess.
      isRoomCreator: true,
      isDisabled: true, // Disable the 'Create' button
      myTurn: true, // Room creator makes the 1st move
    });   
  }
  
  // The 'Join' button was pressed
  onPressJoin = (e) => {
    // open modal;
    Swal.fire({
      position: 'top',
      input: 'text',
      allowOutsideClick: false,
      inputPlaceholder: 'Enter the room id',
      showCancelButton: true,
      confirmButtonColor: 'rgb(208,33,41)',
      confirmButtonText: 'OK',
      width: 275,
      padding: '0.7em',
      customClass: {
        heightAuto: false,
        // popup: 'popup-class',
        // confirmButton: 'join-button-class ',
        // cancelButton: 'join-button-class'
      } 
    }).then((result) => {
      // Check if the user typed a value in the input field
      if(result.value){
        this.joinRoom(result.value);
      }
    })
  }

  // Join a room channel
  joinRoom = (value) => {
    this.roomId = value;
    this.lobbyChannel = 'reactchesslobby--' + this.roomId;

    // Check the number of people in the channel
    this.pubnub.hereNow({
      channels: [this.lobbyChannel], 
    }).then((response) => { 
      console.log(response.totalOccupancy);
        if(response.totalOccupancy < 2){
          this.pubnub.subscribe({
            channels: [this.lobbyChannel],
            withPresence: true,
            includeState: true
          });
          
          this.setState({
            piece: 'B', // Black piece in chess..
          });  
          
          this.pubnub.publish({
            message: {
              notRoomCreator: true,
            },
            channel: this.lobbyChannel
          });
        } 
        else{
          // Game in progress
          Swal.fire({
            position: 'top',
            allowOutsideClick: false,
            title: 'Error',
            text: 'Game in progress. Try another room.',
            width: 275,
            height: 300,
            padding: '0.7em',
            customClass: {
                heightAuto: false,
                title: 'title-class',
                popup: 'popup-class',
                confirmButton: 'button-class'
            }
          })
        }
    }).catch((error) => { 
      console.log(error);
    });
  }

  // Reset everything
  endGame = () => {
    this.setState({
      piece: '',
      isPlaying: false,
      isRoomCreator: false,
      isDisabled: false,
      myTurn: false,
    });

    this.lobbyChannel = null;
    this.gameChannel = null;
    this.roomId = null;  

    this.pubnub.unsubscribe({
      channels : [this.lobbyChannel, this.gameChannel]
    });
  }
  
  render() {  
    return (  
        <div> 
          {/* <div className="title">
          </div> */}
           
          {
            !this.state.isPlaying &&
            <div className="game">
            
              <div> 
              <div>
       <h1> Chess Game </h1>
       <h1> """When you see a good move look for a better one""" </h1>
       <h1> Game Instructions: </h1>
       <h2>⦿ Creator Goes First </h2>
       <h2>
         {" "}
        ⦿ Whenever you hover over a piece of chess it shows you suggested moves.{" "}
       </h2>       <h2>
         {" "}
         ⦿ To move a piece first you have to click on a piece which you want to
         move and then place where you want to place that piece.{" "}
       </h2>
       <h2> ⦿ There is also a button for On/Off suggested moves. </h2> 
     </div>
                <div className="button-container">
                  <button 
                    className="create-button "
                    disabled={this.state.isDisabled}
                    onClick={(e) => this.onPressCreate()}
                    > Create 🧐
                  </button>
                  <button 
                    className="join-button"
                    onClick={(e) => this.onPressJoin()}
                    > Join 🧐
                  </button>
                </div>  
                <div className='button-container'>
                <button><a href='/computer' alt='Broken Link'className='remove-line' >Against Computer</a></button>
                  </div>                      
                <h3> Made with ♥ by Tushar Garg </h3>
              </div>
            </div>
          }

          {
            this.state.isPlaying &&
            <App 
              pubnub={this.pubnub}
              gameChannel={this.gameChannel} 
              piece={this.state.piece}
              isRoomCreator={this.state.isRoomCreator}
              myTurn={this.state.myTurn}
              currTurn="A"
              xUsername={this.state.xUsername}
              oUsername={this.state.oUsername}
              endGame={this.endGame}
            />
          }
        </div>
    );  
  } 
}
