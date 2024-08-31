import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import {ScreenName} from '../utils/constants';
import {colors} from '../styles/Colors';
import LinearGradient from 'react-native-linear-gradient';
import {ListItem} from '@rneui/themed';
import {useAuth} from '../Context/Auth';
import axios from 'axios';
import {BASE_URL} from '../api';

export const CustomDrawerContent = (props: any) => {
  const [expanded, setExpanded] = useState<{[key: number]: boolean}>({});
  const [expandedChild, setExpandedChild] = useState<{[key: number]: boolean}>(
    {},
  );

  const handleExpand = (index: number) => {
    setExpanded(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleChildExpand = (indexAll: number) => {
    setExpandedChild(prevState => ({
      ...prevState,
      [indexAll]: !prevState[indexAll],
    }));
  };
  const [drawerData, setDrawerData] = useState<any>([]);
  const {logout} = useAuth();
  const drawerMenuApi = async () => {
    await axios
      .get(`${BASE_URL}AppMenus/myMenus.json?city_id=1`)
      .then(response => {
        if (response.status == 200 && response.data.success == true) {
          console.log(response.data.dynamic, 'Drawer success');
          setDrawerData(response.data);
        }
      })
      .catch(error => {
        console.log(error, 'Drawer menu Api error');
      });
  };

  React.useEffect(() => {
    drawerMenuApi();
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView>
        <LinearGradient
          start={{x: 0.3, y: 0}}
          end={{x: 1.5, y: 0}}
          colors={[colors.red, '#6b6a6a']}
          style={{paddingBottom: 10, paddingTop: StatusBar.currentHeight}}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome</Text>
            <StatusBar
              backgroundColor="transparent"
              barStyle="light-content"
              {...props}
            />
          </View>
        </LinearGradient>

        {drawerData?.dynamic?.map((elem: any, index: number) => {
          if (elem.header_name == 'Menu') {
            return elem.title.map((subElem: any, subIndex: number) => {
              if (subElem.name === 'Shop By Category') {
                return (
                  <ListItem.Accordion
                    key={subElem.id}
                    content={
                      <ListItem.Content>
                        <ListItem.Title style={styles.accordionTitle}>
                          <Text style={styles.menuItem}>{subElem.name}</Text>
                        </ListItem.Title>
                      </ListItem.Content>
                    }
                    isExpanded={expanded[index]}
                    onPress={() => handleExpand(index)}
                    icon={{
                      name: expanded[index] ? 'chevron-down' : 'chevron-right',
                      type: 'font-awesome',
                      size: 16,
                      color: 'black',
                    }}>
                    {drawerData.Allcategories.map(
                      (allElem: any, indexAll: number) => {
                        return (
                          <ListItem.Accordion
                            key={indexAll}
                            content={
                              <ListItem.Content>
                                <ListItem.Title style={styles.subMenuItem}>
                                  <Text style={styles.menuItem}>
                                    {allElem.name}
                                  </Text>
                                </ListItem.Title>
                              </ListItem.Content>
                            }
                            isExpanded={expandedChild[indexAll]}
                            onPress={() => handleChildExpand(indexAll)}
                            icon={{
                              name: expandedChild[indexAll]
                                ? 'chevron-down'
                                : 'chevron-right',
                              type: 'font-awesome',
                              size: 14,
                              color: 'black',
                            }}>
                            {allElem.child_categories.map(
                              (childCat: any, childIndex: number) => (
                                <TouchableOpacity
                                  key={childIndex}
                                  onPress={() =>
                                    props.navigation.navigate(
                                      ScreenName.HOME_SCREEN,
                                    )
                                  }>
                                  <ListItem
                                    containerStyle={{paddingVertical: 8}}>
                                    <ListItem.Content>
                                      <ListItem.Title
                                        style={styles.sub2MenuItem}>
                                        <Text style={styles.menuItem}>
                                          {childCat.name}
                                        </Text>
                                      </ListItem.Title>
                                    </ListItem.Content>
                                  </ListItem>
                                </TouchableOpacity>
                              ),
                            )}
                          </ListItem.Accordion>
                        );
                      },
                    )}
                  </ListItem.Accordion>
                );
              } else {
                return (
                  <TouchableOpacity
                    key={subElem.id}
                    style={{paddingVertical: 1, marginVertical: 0}}
                    onPress={() =>
                      props.navigation.navigate(ScreenName.HOME_SCREEN)
                    }>
                    <Text style={styles.menuItem}>{subElem.name}</Text>
                  </TouchableOpacity>
                );
              }
            });
          } else if (elem.header_name == 'My Information') {
            return (
              <View key={index}>
                <View style={styles.myIformationContainer}>
                  <Text style={styles.graytextColor}>My Information</Text>
                </View>
                <View>
                  {elem?.title?.map((myInfo: any, indexInfo: number) => (
                    <View key={indexInfo}>
                      <Text style={styles.myIformationTxt}>{myInfo.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          } else {
            return (
              <View key={index}>
                <View style={styles.myIformationContainer}>
                  <Text style={styles.graytextColor}>Other</Text>
                </View>
                <View>
                  {elem?.title?.map(
                    (otherInfo: any, indexOtherInfo: number) => (
                      <View key={indexOtherInfo}>
                        <Text style={styles.myIformationTxt}>
                          {otherInfo.name}
                        </Text>
                      </View>
                    ),
                  )}
                </View>
              </View>
            );
          }
        })}
        <View>
          <TouchableOpacity onPress={logout}>
            <Text style={styles.myIformationTxt}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  welcomeText: {
    color: 'white',
    fontSize: 20,
  },
  menuItem: {
    padding: 15,
    fontSize: 15,
    color: colors.black,
    fontWeight: '400',
  },
  accordionTitle: {
    fontSize: 15,
    color: 'black',
    fontWeight: '400',
  },
  subMenuItem: {
    paddingLeft: 16,
    fontSize: 15,
    fontWeight: '400',
    color: colors.black,
  },
  sub2MenuItem: {
    paddingLeft: 30,
  },
  graytextColor: {
    color: colors.gray,
    fontSize: 16,
    paddingVertical: 10,
  },
  myIformationContainer: {paddingHorizontal: 10},
  myIformationTxt: {
    padding: 16,
    color: colors.black,
    fontSize: 15,
    fontWeight: '400',
    paddingLeft: 16,
  },
});
