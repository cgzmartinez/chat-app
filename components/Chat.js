import React from 'react';
import { View, } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
    };

    // My web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyDGtdqzror0YAZRjK_bCZChtewWjYGJ1ZM",
      authDomain: "chat-app-9d25a.firebaseapp.com",
      projectId: "chat-app-9d25a",
      storageBucket: "chat-app-9d25a.appspot.com",
      messagingSenderId: "48862416269",
      appId: "1:48862416269:web:153be7dd55d0ca776d81c4"
    };

    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Reference to Firestore collection
    this.referenceChatMessages = firebase.firestore().collection('messages');
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // Go through each document
    querySnapshot.forEach((doc) => {
      // Get the QueryDocumentsSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
        }
      });
    });
    this.setState({
      messages,
    });
  };

  // Adds message to Firestore
  addMessages() {
    const message = this.state.messages[0];

    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  }

  componentDidMount() {
    // Sets the name to be included in the nav bar
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    // Authenticate user anonymously
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
      });
      // Creating a reference to ChatMessages collection
      this.referenceChatMessages = firebase.firestore().collection("messages");
      // Listen for collection changes
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  }

  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        // Calls addMessage with last message
        this.addMessages(this.state.messages[0]);
      }
    );
  }


  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#32353b',
          },
          left: {
            backgroundColor: '#ffffff',
          },
        }}
      />
    );
  }

  render() {
    // Sets color value as background color for the chat screen
    let color = this.props.route.params.color;
    return (
      <View style={[styles.container, { backgroundColor: color }]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.uid,
          }}
        />
        {Platform.OS === 'android' ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});