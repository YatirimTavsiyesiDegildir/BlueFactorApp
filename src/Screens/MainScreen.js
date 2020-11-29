import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';
import {
  ApplicationProvider,
  Button,
  IconRegistry,
  Layout,
  Icon,
} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';

const HeartIcon = (props) => <Icon {...props} name="heart" />;

export default class NativeSample extends Component {
  constructor() {
    super();
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
              onPress={() => return}>
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
