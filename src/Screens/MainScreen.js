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
  BluetoothDeviceEvent,
} from 'react-native-bluetooth-classic';

const HeartIcon = (props) => <Icon {...props} name="heart" />;

export default class NativeSample extends Component {
  constructor() {
    super();
    this.state = {
      bEnabled: false,
      paired: [],
      accepting: false,
    };
  }

  async getIntoAcceptanceMode() {
    console.warn('Accepting connections');
    let acceptConnections = async () => {
      this.setState({accepting: true});
      try {
        let device = await RNBluetoothClassic.accept({});
        this.setState({device});
      } catch (error) {
        console.warn("Can't accept.");
      } finally {
        this.setState({accepting: false});
      }
    };
  }

  async getPairedDevices() {
    try {
      let paired = await RNBluetoothClassic.getBondedDevices();
      console.warn('Paired:' + paired[0].address);
      this.connect(paired[0]);
      this.setState({paired: paired});
    } catch (err) {
      console.warn('No paired devices.');
    }
  }

  async onDeviceConnected(event) {
    console.warn('Device got connected');
    this.setState({device: event.device});
    try {
      let message = await this.props.device.read();
      console.warn(message.data);
      this.setState({data: message.data});
    } catch (error) {
      console.warn("Can't read.");
    }
  }

  async getConnectedDevices() {
    try {
      let connected = await RNBluetoothClassic.getConnectedDevices();
      console.warn('Connected: ' + connected);
      this.setState({connected});
    } catch (err) {
      console.warn("Can't get connected.");
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove(); // don't forget!
    }
  }

  async checkBluetoothEnabled() {
    try {
      let bEnabled = await RNBluetoothClassic.isBluetoothEnabled();
      this.setState({bEnabled: bEnabled});
      if (bEnabled) {
        this.subscription = RNBluetoothClassic.onDeviceConnected(
          this.onDeviceConnected,
        );
        this.getPairedDevices();
        this.getIntoAcceptanceMode();
        this.getConnectedDevices();
      }
    } catch (err) {
      console.warn('Bluetooth not enabled');
    }
  }

  async componentDidMount() {}

  async connect(targetDevice) {
    console.warn(targetDevice.address);
    try {
      let connection = await targetDevice.isConnected();
      if (!connection) {
        connection = targetDevice.connect();
        if (connection) {
          console.warn('Connected!');
          this.sendMessage(targetDevice);
        }
      } else {
        console.warn('Connected!');
        this.sendMessage(targetDevice);
      }

      this.setState({connection});
    } catch (error) {
      console.warn("Couldn't connect");
    }
  }

  async sendMessage(device) {
    try {
      let message = await device.write('Hey');
      console.warn('Sent message' + message);
    } catch (error) {
      console.warn(error);
    }
  }

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
