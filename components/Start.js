import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, ImageBackground, TouchableOpacity, } from 'react-native';

// Defines colors for background color in Chat screen
const backgroundColors = {
  peach: '#FAC8CD',
  lavender: '#D7BCC8',
  teal: '#98B6B1',
  olive: '#629677',
  peacock: '#495D63',
};

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', color: '' };
  }

  render() {
    return (
      // Renders bg-image
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/background_image.png')}
          style={styles.image}
        >
          <Text style={styles.title}>CHAT APP</Text>
          {/* Find a way to add icon.svg in TextInput later */}
          <View style={styles.startWrapper}>
            <TextInput
              style={styles.input}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder="Your Name"
            />
            <View style={styles.colorWrapper}>
              <Text style={styles.colorText}>Choose Background Color:</Text>
              <View style={styles.colors}>
                {/* Choose colors established above */}
                <TouchableOpacity
                  style={[
                    styles.color,
                    { backgroundColor: backgroundColors.peach },
                  ]}
                  onPress={() =>
                    this.setState({ color: backgroundColors.peach })
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.color,
                    { backgroundColor: backgroundColors.lavender },
                  ]}
                  onPress={() =>
                    this.setState({ color: backgroundColors.lavender })
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.color,
                    { backgroundColor: backgroundColors.teal },
                  ]}
                  onPress={() =>
                    this.setState({ color: backgroundColors.teal })
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.color,
                    { backgroundColor: backgroundColors.olive },
                  ]}
                  onPress={() =>
                    this.setState({ color: backgroundColors.olive })
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.color,
                    { backgroundColor: backgroundColors.peacock },
                  ]}
                  onPress={() =>
                    this.setState({ color: backgroundColors.peacock })
                  }
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                this.props.navigation.navigate('Chat', {
                  name: this.state.name,
                  color: this.state.color,
                })
              }
            >
              {/* Button switches to Chat */}
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

// StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },

  image: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    resizeMode: 'cover',
    paddingVertical: '6%',
  },

  title: {
    alignItems: 'flex-start',
    fontSize: 45,
    fontWeight: '800',
    color: '#FFFFFF',
    paddingVertical: '15%',
  },

  startWrapper: {
    backgroundColor: 'white',
    height: '44%',
    width: '88%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: '6%',
  },

  input: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 50,
    height: 60,
    width: '88%',
    borderColor: 'lightgrey',
    borderWidth: 2,
    borderRadius: 2,
    padding: '5%',
  },


  colorWrapper: {
    width: '88%',
    justifyContent: 'center',
  },

  colorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 100,
  },

  colors: {
    flexDirection: 'row',
  },

  color: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginTop: 10,
    marginRight: 25,
  },

  button: {
    height: 60,
    width: '88%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#757083',
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});