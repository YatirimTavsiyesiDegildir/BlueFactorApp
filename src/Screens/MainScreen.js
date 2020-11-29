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

const HeartIcon = (props) => <Icon {...props} name="heart" />;

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
  }

  /*
    getMoviesFromApi = async (address) => {
        return fetch(address)
            .then((response) => {
                console.warn(response);
                response.json();
            })
            .then((json) => {
                let blob = await fetch(`file://${local_uri}`).blob();
                console.log(json);
            })
            .catch((error) => {
                console.error(error);
            });
    };
     */

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
                      fileCache: true,
                    })
                      .fetch('GET', 'http://' + this.state.ipAndPort, {})
                      .then((res) => {
                        // the temp file path
                        this._storeData(res.path());
                        console.log('The file saved to ', res.path());
                      });
                  }}>
                  CONFIGURE
                </Button>
              </>
            ) : (
              <>
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
                  onPress={() => {}}>
                  LIKE
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
