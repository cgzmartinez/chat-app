import React from 'react';
import { View, Text } from 'react-native';

export default class Chat extends React.Component {
  componentDidMount() {
    // Sets the name to be included in the nav bar
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
  }

  render() {
    // Sets color value as background color for the chat screen
    let color = this.props.route.params.color;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: color,
        }}
      >
        <Text>This is the Chat screen!</Text>
      </View>
    );
  }
}