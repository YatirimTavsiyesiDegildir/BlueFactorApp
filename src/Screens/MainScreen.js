import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';
import {
  ApplicationProvider,
  Button,
  IconRegistry,
  Layout,
  Icon,
  Spinner,
  Input,
} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import {AsyncStorage} from 'react-native';

import RNFetchBlob from 'rn-fetch-blob';
let dirs = RNFetchBlob.fs.dirs;

export default class NativeSample extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      keyfile: '',
      ipAndPort: '',
    };
  }

  componentDidMount() {
    this._retrieveData();
    AsyncStorage.removeItem('keyfile');
  }

  _storeData = async (key) => {
    try {
      this.setState({loading: true});
      await AsyncStorage.setItem('keyfile', key);
      this.setState({loading: false, keyfile: key});
    } catch (error) {
      // Error saving data
    }
  };

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('keyfile');
      console.warn('Keyfile: ' + value);
      if (value !== null) {
        this.setState({loading: false, keyfile: value});
      } else {
        this.setState({loading: false, keyfile: 'keyfile_does_not_exist'});
      }
    } catch (error) {
      this.setState({loading: false, keyfile: 'keyfile_does_not_exist'});
    }
  };

  render() {
    return (
      <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <Layout style={styles.container}>
            {this.state.loading ? (
              <Spinner size="giant" />
            ) : this.state.keyfile === 'keyfile_does_not_exist' ? (
              <>
                <Text style={styles.text} category="h1">
                  First you need to configure the app to work with the
                  application. Start encryption on your computer and follow the
                  instructions.
                </Text>
                <Input
                  placeholder="127.0.0.1:0000"
                  value={this.state.ipAndPort}
                  onChangeText={(nextValue) =>
                    this.setState({ipAndPort: nextValue})
                  }
                />
                <Button
                  style={styles.likeButton}
                  onPress={() => {
                    RNFetchBlob.config({
                      path: dirs.DocumentDir + '/auth-file',
                    })
                      .fetch('GET', 'http://' + this.state.ipAndPort, {})
                      .then((res) => {
                        // the conversion is done in native code
                        res.text().then((result) => this._storeData(result));
                        // the following conversions are done in js, it's SYNC
                      });
                  }}>
                  CONFIGURE
                </Button>
              </>
            ) : (
              <>
                <Text style={styles.text} category="h1">
                  Start decryption on your computer and after setting the ip
                  value below press decrypt.
                </Text>
                <Input
                  placeholder="127.0.0.1:0000"
                  value={this.state.ipAndPort}
                  onChangeText={(nextValue) =>
                    this.setState({ipAndPort: nextValue})
                  }
                />
                <Button
                  style={styles.likeButton}
                  onPress={() => {
                    console.warn(this.state.keyfile);
                    fetch('http://' + this.state.ipAndPort, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'text/plain',
                      },
                      body: this.state.keyfile,
                    }).then((info) => console.warn(info));
                  }}>
                  DECRYPT
                </Button>
              </>
            )}
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
    padding: 20,
  },
  text: {
    textAlign: 'center',
  },
  likeButton: {
    marginVertical: 16,
  },
});
