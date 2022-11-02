import React from 'react';
import { View, Platform, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';

import MapView from "react-native-maps";

import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import CustomActions from "./CustomActions";

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      // from CF video tutorial 
      //loggedInText: "Please wait, you are getting logged in",
      isConnected: false,
      image: null,
      location: null,
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

  // messages stored locally on the user's device
  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    // Sets the name to be included in the nav bar
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    // Checks if User is online or offline
    NetInfo.fetch().then((connection) => {
      // If User is online
      if (connection.isConnected) {
        console.log("online");

        this.setState({
          isConnected: true,
        });

        console.log(this.state.isConnected);

        // Listen to autentication events
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            firebase.auth().signInAnonymously();
          }
          this.setState({
            uid: user.uid,
            messages: [],
            //loggedInText: "",
          });

          // Creating a reference to ChatMessages collection
          this.referenceChatMessages = firebase
            .firestore()
            .collection("messages");
          // Listen for collection changes
          this.chatSubscription = this.referenceChatMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
        });

        // If User is offline
      } else {
        console.log("offline");

        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    if (this.isConnected) {
      this.authUnsubscribe();
      this.chatSubscription();
    }
  }

  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        // Calls addMessage with last message
        this.addMessages();
        this.saveMessages();
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

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
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
        user: data.user,
        image: data.image || null,
        location: data.location || null,
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
      text: message.text || " ",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    // Sets color value as background color for the chat screen
    let color = this.props.route.params.color;
    return (
      <ActionSheetProvider>
        <View style={[styles.container, { backgroundColor: color }]}>
          <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            messages={this.state.messages}
            renderInputToolbar={this.renderInputToolbar.bind(this)}
            onSend={(messages) => this.onSend(messages)}
            user={{
              _id: this.state.uid,
            }}
            renderActions={this.renderCustomActions.bind(this)}
            renderCustomView={this.renderCustomView}
          />
          {Platform.OS === 'android' ? (
            <KeyboardAvoidingView behavior="height" />
          ) : null}
        </View>
      </ActionSheetProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});