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
import {AsyncStorage, Image} from 'react-native';

import RNFetchBlob from 'rn-fetch-blob';

let dirs = RNFetchBlob.fs.dirs;

export default class NativeSample extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      keyfile: '',
      hostAddress: '',
    };
  }

  componentDidMount() {
    this._retrieveData('keyfile');
  }

  render() {
    return (
      <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <Layout style={styles.container}>
            <Image
              style={{width: '100%', height: 400, resizeMode: 'contain'}}
              source={require('../Images/logo_banner_transparent.png')}
            />
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
                  value={this.state.hostAddress}
                  onChangeText={(nextValue) =>
                    this.setState({hostAddress: nextValue})
                  }
                />
                <Button
                  style={styles.likeButton}
                  onPress={() => {
                    RNFetchBlob.config({
                      path: dirs.DocumentDir + '/auth-file',
                    })
                      .fetch('GET', 'http://' + this.state.hostAddress, {})
                      .then((res) => {
                        // the conversion is done in native code
                        res.text().then((result) => {
                          this._storeData('keyfile', result);
                          this._storeData(
                            'host_address',
                            this.state.hostAddress,
                          );
                        });
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
                  value={this.state.hostAddress}
                  onChangeText={(nextValue) =>
                    this.setState({hostAddress: nextValue})
                  }
                />
                <Button
                  style={styles.likeButton}
                  onPress={() => {
                    //console.log(this.state.keyfile);
                    fetch('http://' + this.state.hostAddress, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'text/plain',
                      },
                      body: this.state.keyfile,
                    }).then((info) => console.log(info));
                  }}>
                  DECRYPT
                </Button>
                <Button
                  style={styles.likeButton}
                  onPress={() => AsyncStorage.removeItem('keyfile')}
                  appearance="outline"
                  status="danger">
                  Forget Device
                </Button>
              </>
            )}
          </Layout>
        </ApplicationProvider>
      </>
    );
  }

  // Async Storage Start
  _storeData = async (key, value) => {
    try {
      this.setState({loading: true});
      await AsyncStorage.setItem(key, value);
      this.setState({
        loading: false,
        keyfile: value,
        hostAddress: this.state.hostAddress,
      });
    } catch (error) {
      // Error saving data
    }
  };

  _retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (key === 'keyfile') {
        if (value !== null) {
          this.setState({loading: false, keyfile: value});
        } else {
          this.setState({loading: false, keyfile: 'keyfile_does_not_exist'});
        }
      } else if (key === 'host_address') {
        if (value !== null) {
          this.setState({loading: false, hostAddress: value});
        }
      }
    } catch (error) {
      this.setState({
        loading: false,
        keyfile: 'keyfile_does_not_exist',
        hostAddress: '',
      });
    }
  };
  // Async Storage Finish
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
