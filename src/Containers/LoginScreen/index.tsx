import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {Button} from '@rneui/themed';
import {colors} from '../../styles/Colors';
import {ICONS, ScreenName} from '../../utils/constants';
import {useAuth} from '../../Context/Auth';
import axios from 'axios';
import {BASE_URL} from '../../api';
import {useToast} from 'react-native-toast-notifications';

const LoginScreen = (props: any) => {
  const toast = useToast();
  const {login, setUserId} = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: any) => {
    await axios
      .post(`${BASE_URL}login`, data)
      .then(async response => {
        if (response.status == 200 && response.data.success == true) {
          await login(response.data.customerMaster.token);
          await setUserId(response.data.customerMaster.id);
          toast.show('Logged In Succesfully', {type: 'success'});
        } else {
          toast.show('Wrong Credentials', {type: 'danger'});
        }
      })
      .catch(error => {
        console.log(error, 'Login error');
      });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={ICONS.BACKGROUND_IMG}
        resizeMode="cover"
        style={styles.backgroundImg}>
        <Image source={ICONS.LOGO_IMG} style={styles.logo} />
        <View style={{alignItems: 'center'}}>
          <Text style={styles.heading}>LOGIN</Text>
          <View style={styles.line} />
        </View>
        <View style={{width: '100%', marginVertical: 20, gap: 4}}>
          <Controller
            name="username"
            control={control}
            rules={{
              required: 'Mobile number is required',
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: '10 digits required',
              },
            }}
            render={({field: {onChange, value}}) => (
              <TextInput
                placeholder="Mobile"
                onChangeText={onChange}
                keyboardType="number-pad"
                value={value}
                style={[styles.textInput, {width: '100%'}]}
                placeholderTextColor={colors.black}
              />
            )}
          />

          {errors.username && (
            <Text style={styles.errorText}>{errors.username?.message}</Text>
          )}

          <View style={[styles.passwordContainer, {width: '100%'}]}>
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required',
                pattern: {
                  value:
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                  message:
                    'Password must contain at least one uppercase & one lowercase letter, one number, and one special character.',
                },
              }}
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <View
                  style={{
                    backgroundColor: colors.textFieldbg,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                    borderRadius: 50,
                  }}>
                  <TextInput
                    placeholder="Password"
                    onChangeText={onChange}
                    value={value}
                    style={{flex: 1, paddingVertical: 16, color: colors.black}}
                    placeholderTextColor={colors.black}
                    secureTextEntry={!isPasswordVisible}
                    maxLength={10}
                  />
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    <Image
                      source={
                        isPasswordVisible ? ICONS.EYE_OPEN : ICONS.EYE_CLOSED
                      }
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
          {errors.password ? (
            <Text style={styles.errorText}>{errors?.password?.message}</Text>
          ) : (
            <Text style={{color: colors.graytextColor, marginLeft: 16}}>
              Password should not be less than 8 characters
            </Text>
          )}
        </View>

        <View style={{width: '100%'}}>
          <Button
            title="LOGIN"
            color={colors.secondary}
            size="lg"
            titleStyle={styles.buttonTitle}
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            containerStyle={{width: '100%', borderRadius: 50}}
          />
        </View>

        <Text style={styles.forgotPassword}>Forgot Password?</Text>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>New to Chily Apple?</Text>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate(ScreenName.SING_UP_SCREEN)
            }>
            <Text style={{color: colors.primary}}>Signup Now</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    height: 130,
    width: 150,
    resizeMode: 'contain',
  },
  heading: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: '600',
    marginVertical: 2,
  },
  line: {
    backgroundColor: colors.primary,
    height: 2,
    width: 50,
  },
  textInput: {
    backgroundColor: colors.textFieldbg,
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 16,
    borderRadius: 50,
    color: colors.black,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fcebe9',
    borderRadius: 50,
    width: '100%',
    marginTop: 10,
  },
  // passwordInput: {
  //   flex: 1,
  //   // paddingRight: 10,
  // },
  // iconContainer: {
  //   padding: 5,
  // },
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: colors.red,
  },
  errorText: {
    color: colors.red,
    marginLeft: 16,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: 400,
  },
  forgotPassword: {
    color: colors.black,
    marginTop: 10,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  signupText: {
    color: colors.black,
    marginRight: 5,
  },
  signupButtonTitle: {
    color: colors.primary,
  },
});

export default LoginScreen;
