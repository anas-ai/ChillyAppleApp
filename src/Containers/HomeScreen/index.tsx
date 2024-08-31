import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {colors} from '../../styles/Colors';
import {ICONS} from '../../utils/constants';
import axios from 'axios';
import {BASE_URL} from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {Dialog, Divider} from '@rneui/themed';
import MenuIcon from '../../assets/svg/MenuIcon';
import NotificationsIcon from '../../assets/svg/NotificationsIcon';
import CartIcon from '../../assets/svg/CartIcon';
import ChatIcon from '../../assets/svg/ChatIcon';
import SearchIcon from '../../assets/svg/SearchIcon';

const HomeScreen = (props: any) => {
  const [homeData, setHomeData] = useState<any>([]);
  const [search, setSearch] = useState<string>('');
  const [visible1, setVisible1] = useState<boolean>(false);

  const homeApi = async (id: any) => {
    try {
      const response = await axios.get(
        `${BASE_URL}HomeScreens/homescreen.json?city_id=1&customer_id=${id}`,
      );
      if (response.status === 200 && response.data.success) {
        setHomeData(response.data);
        console.log(response.data.settings.home_message, 'HomeScreendata');
      }
    } catch (error) {
      console.log(error, 'Home screen Api failed to load');
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const dialogShown = await AsyncStorage.getItem('dialogShown');

        if (userId !== null) {
          const id = JSON.parse(userId);

          if (id) {
            await homeApi(id);

            if (dialogShown !== 'true') {
              setVisible1(true);
              await AsyncStorage.setItem('dialogShown', 'true');
            }
          } else {
            console.log('userId is null after parsing');
          }
        } else {
          console.log('No userId found in AsyncStorage');
        }
      } catch (error) {
        console.error('Failed to retrieve the token from AsyncStorage', error);
      }
    };

    checkToken();
  }, []);

  const toggleDialog1 = () => {
    setVisible1(!visible1);
  };

  const handleDrawerOpen = () => {
    props.navigation.openDrawer();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <LinearGradient
        start={{x: 0.3, y: 0}}
        end={{x: 1.5, y: 0}}
        colors={[colors.red, '#6b6a6a']}
        style={{padding: 10, paddingTop: StatusBar.currentHeight}}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent
          {...props}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={handleDrawerOpen} activeOpacity={0.5}>
              <MenuIcon width={30} height={30} color={colors.white} />
            </TouchableOpacity>
            <View>
              <Text style={{fontSize: 18, marginLeft: 12, color: colors.white}}>
                Home
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', columnGap: 8}}>
            <NotificationsIcon width={26} height={26} color={colors.white} />
           
            <CartIcon width={26} height={26} color={colors.white}/>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors.white,
            alignItems: 'center',
            paddingHorizontal: 8,
            borderRadius: 5,
            marginTop: 10,
          }}>
          {/* <Image
            source={ICONS.SEARCH}
            style={{width: 24, height: 24, tintColor: colors.black}}
            resizeMode="contain"
          /> */}
          <SearchIcon width={24} height={24} color={colors.black}/>
          <View style={{flex: 1}}>
            <TextInput
              placeholder="Search for Products"
              onChangeText={e => setSearch(e)}
              value={search}
              style={styles.textInput}
              placeholderTextColor={colors.black}
            />
          </View>
        </View>
      </LinearGradient>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {homeData?.data?.dynamic.map((elem: any, index: number) => {
            if (elem.title == 'Brand Store') {
              return (
                <View key={index} style={{marginTop: 16}}>
                  <View>
                    <Text style={styles.headingText}>Brand Store</Text>
                  </View>
                  <View style={styles.categoryItem}>
                    <View style={styles.imageContainer}>
                      <Image
                        source={ICONS.APPLE}
                        style={styles.image}
                        resizeMode="contain"
                      />
                    </View>
                    <View>
                      <Text style={styles.subHeading}>CHILLY APPLE</Text>
                    </View>
                  </View>
                </View>
              );
            } else if (elem.title == 'Shop By Category') {
              return (
                <View key={elem.title}>
                  <View style={{marginVertical: 16}}>
                    <Text style={styles.headingText}>Shop By Category</Text>
                  </View>
                  <View style={styles.rowContainer}>
                    {elem.HomeScreens.map((subelm: any, index: number) => {
                      return (
                        <View style={styles.categoryItem} key={index}>
                          <View style={styles.imageContainer}>
                            <Image
                              source={ICONS.APPLE}
                              style={styles.image}
                              resizeMode="contain"
                            />
                          </View>
                          <View>
                            <Text style={styles.subHeading}>{subelm.name}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            } else {
              return (
                <View style={styles.referContainer} key={elem.title}>
                  <View style={{flex: 1}}>
                    <Text style={styles.referHead}>Refer & Earn</Text>
                    <Text style={styles.referText}>
                      Refer a friend or family for discounts on all groceries.
                    </Text>
                  </View>
                  <View style={styles.imageContainer}>
                    <Image
                      source={ICONS.LOGO_IMG}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              );
            }
          })}
        </ScrollView>
      </View>
      <Dialog
        isVisible={visible1}
        onBackdropPress={toggleDialog1}
        overlayStyle={{width: '85%', height: '85%'}}>
        <ScrollView>
          <View style={{alignItems: 'center'}}>
            <Image
              source={ICONS.LOGO_IMG}
              style={{width: 150, height: 150}}
              resizeMode="contain"
            />
          </View>
          <Divider />
          <View>
            <Text style={styles.dialogtext}>
              {homeData?.settings?.home_message}
            </Text>
          </View>
        </ScrollView>
      </Dialog>
      <View
        style={{
          backgroundColor: 'green',
          position: 'absolute',
          borderRadius: 100,
          padding: 15,
          bottom: 60,
          right: 25,
        }}>
        {/* <Image
          source={ICONS.CHAT}
          style={{width: 40, height: 40, tintColor: 'white'}}
          resizeMode="contain"
        /> */}
        <ChatIcon width={40} height={40} color={colors.white}/>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  textInput: {
    color: colors.black,
  },
  headingText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  subHeading: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dialogtext: {
    color: colors.black,
    fontSize: 14,
  },
  categoryItem: {
    width: '33.3333%',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: colors.borderGrey,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  referContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor: colors.bgYellow1,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    columnGap: 10,
    marginBottom: 15,
  },
  referHead: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
  },
  referText: {
    fontSize: 14,
    color: colors.greyColor,
  },
});
