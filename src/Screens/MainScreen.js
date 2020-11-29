import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View} from 'react-native';
import {
  ApplicationProvider,
  Button,
  IconRegistry,
  Layout,
  Icon,
} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';

import RNBluetoothClassic, {
  BluetoothEventType,
} from 'react-native-bluetooth-classic';

const HeartIcon = (props) => <Icon {...props} name="heart" />;

export default class NativeSample extends Component {
  constructor() {
    super();
    this.state = {
      bEnabled: false,
    };
  }
  async checkBluetoothEnabled() {
    console.warn('Checking Bluetooth');
    try {
      let bEnabled = await RNBluetoothClassic.isBluetoothEnabled();
      this.setState({bEnabled: bEnabled});
    } catch (err) {
      console.warn('Bluetooth not enabled');
    }
  }

  async componentDidMount() {}

  render() {
    return (
      <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <Layout style={styles.container}>
            <Text style={styles.text} category="h1">
              Welcome to UI Kitten 😻
            </Text>
            <Text style={styles.text} category="s1">
              Start with editing App.js to configure your App
            </Text>
            <Text style={styles.text} appearance="hint">
              For example, try changing theme to Dark by using eva.dark
            </Text>
            <Button
              style={styles.likeButton}
              accessoryLeft={HeartIcon}
              onPress={() => this.checkBluetoothEnabled()}>
              LIKE
            </Button>
          </Layout>
        </ApplicationProvider>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  likeButton: {
    marginVertical: 16,
  },
});
