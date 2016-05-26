/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Realm from 'realm';

class realmBugTest extends Component {
  constructor(props) {
    super(props);
    const IdentitySchema = {
      name: 'Identity',
      properties: {
        name: 'string',
        birthday: 'date',
        address: 'string',
      }
    };

    const PersonSchema = {
      name: 'Person',
      properties: {
        identity: 'Identity',
        hasCar: 'bool',
      }
    }

    const realm = new Realm({schema: [IdentitySchema, PersonSchema]});

    realm.write(() => {
      realm.deleteAll();
      const identityOne = realm.create('Identity', {
        name: 'Bob',
        birthday: new Date(),
        address: '123 Somewhere Land',
      });

      const identityTwo = realm.create('Identity', {
        name: 'glob',
        birthday: new Date(),
        address: '9000 Somewhere Land',
      })

      realm.create('Person', {
        identity: identityOne,
        hasCar: true,
      });

      realm.create('Person', {
        identity: identityTwo,
        hasCar: false,
      });
    });

    const people = realm.objects('Person');
    const filterTest = people.filtered('identity.name == "Bob"'); // Works fine
    const sortedTest1 = people.sorted('hasCar'); // Works fine
    const sortedTest2 = people.sorted('identity.name'); // Red screen of death
    this.state = {
      person: sortedTest2[0],
      people: people,
    }
  }

  render() {
    console.log('is name: ' + this.state.person);
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native! Mah name is: {this.state.person.identity.name}
        </Text>
        <Text style={styles.instructions}>
          Realm size: {this.state.people.length}
        </Text>
        <Text style={styles.instructions}>
          Shake or press menu button for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('realmBugTest', () => realmBugTest);
