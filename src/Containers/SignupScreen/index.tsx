import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../../styles/Colors';
import {ICONS, ScreenName} from '../../utils/constants';
import {Controller, useForm} from 'react-hook-form';
import {Button} from '@rneui/themed';
import axios from 'axios';
import {BASE_URL} from '../../api';
import uuid from 'react-native-uuid';
import {useToast} from 'react-native-toast-notifications';
const SignUpScreen = (props: any) => {
  const [otp, setOtp] = useState(false);
  const toast = useToast();
  const [timer, setTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const id: any = uuid.v4();
  const {
    control,
    handleSubmit,
    trigger,
    formState: {errors, isSubmitting},
    watch,
  } = useForm({
    defaultValues: {
      username: '',
      name: '',
      email: '',
      otp: '',
      password: '',
      confirmPass: '',
      received_referral_code: '',
      device_id: id,
    },
  });

  const onSubmit = async (data: any) => {
    await axios
      .post(`${BASE_URL}verify-otp`, {
        mobile: data.username,
        otp: data.otp,
      })
      .then(async response => {
        if (response.status == 200 && response.data.success == true) {
          const formData = {
            username: data.username,
            password: data.password,
            name: data.name,
            device_id: data.device_id,
            device_token: data.name,
            received_referral_code: data.received_referral_code,
            email: data.email,
            otp: data.otp,
          };
          await axios
            .post(`${BASE_URL}sign-up-customer`, formData)
            .then(response => {
              if (response.status == 200 && response.data.success == true) {
                console.log(response.data.success, 'SignUp Response');
                toast.show('Account Successfully Created ', {type: 'success'});
                props.navigation.navigate(ScreenName.LOGIN_SCREEN);
              } else {
                console.log(response, 'errror');
              }
            })
            .catch(error => {
              toast.show(response.data.message, {type: 'danger'});
              console.log(error, 'Signup error');
            });
        }
      })
      .catch(error => {
        console.log(error, 'OTP verification Error');
      });
  };

  const sendOtp = async () => {
    if (await trigger('username')) {
      await axios
        .get(`${BASE_URL}send-signup-otp?mobile=${watch('username')}`)
        .then(response => {
          if (response.status == 200 && response.data.success == true) {
            setOtp(true);
            setTimer(60);
            setTimerActive(true);
            toast.show(response.data.message, {type: 'success'});
          } else {
            toast.show(response.data.message, {type: 'danger'});
          }
        })
        .catch(error => {
          console.log(error, 'Error in sending OTP');
        });
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            setTimerActive(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } else if (timer <= 0) {
      setTimerActive(false);
    }

    return () => clearInterval(interval);
  }, [timerActive, timer]);
  useEffect(() => {
    let num = watch('username');
    if (num) {
      trigger('username');
    }
  }, [watch('username')]);
  return (
    <View style={styles.container}>
      <ImageBackground
        source={ICONS.BACKGROUND_IMG2}
        style={styles.backgroundImg}
        resizeMode="cover">
        <View style={styles.innerContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            automaticallyAdjustKeyboardInsets>
            <View style={styles.headerContainer}>
              <Text style={styles.heading}>SIGN UP</Text>
              <View style={styles.line} />
              <Text style={styles.subHeading}>
                Give us some Valuable information
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Controller
                name="name"
                control={control}
                rules={{required: 'Name field is required'}}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    placeholder="Name"
                    onChangeText={onChange}
                    value={value}
                    style={styles.textInput}
                    placeholderTextColor={colors.black}
                  />
                )}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name?.message}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: false,
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                }}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    placeholder="Email (Optional)"
                    onChangeText={onChange}
                    value={value}
                    style={styles.textInput}
                    placeholderTextColor={colors.black}
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email?.message}</Text>
              )}
            </View>

            <View style={styles.sendOtpContainer}>
              <Controller
                name="username"
                control={control}
                rules={{
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: '10 digit Required',
                  },
                }}
                render={({field: {onChange, value}}) => (
                  <View style={styles.otpContainer}>
                    <TextInput
                      placeholder="Mobile"
                      onChangeText={onChange}
                      value={value}
                      keyboardType="phone-pad"
                      style={{
                        flex: 1,
                        paddingVertical: 16,
                        color: colors.black,
                      }}
                      placeholderTextColor={colors.black}
                    />
                    {timerActive ? (
                      <Text style={styles.otpButtonText}>
                        Resend in {timer}s
                      </Text>
                    ) : (
                      <TouchableOpacity onPress={() => sendOtp()}>
                        <Text style={styles.otpButtonText}>SEND OTP</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              />
              {errors.username && (
                <Text style={styles.errorText}>{errors.username?.message}</Text>
              )}
            </View>

            {otp && (
              <>
                <View style={styles.inputContainer}>
                  <Controller
                    name="otp"
                    control={control}
                    rules={{required: 'OTP is required'}}
                    render={({field: {onChange, value}}) => (
                      <TextInput
                        placeholder="Enter OTP"
                        onChangeText={onChange}
                        keyboardType="number-pad"
                        value={value}
                        style={styles.textInput}
                        placeholderTextColor={colors.black}
                      />
                    )}
                  />
                  {errors.otp && (
                    <Text style={styles.errorText}>{errors.otp?.message}</Text>
                  )}
                </View>
                <View style={styles.inputContainer}>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required:
                        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                    }}
                    render={({field: {onChange, value}}) => (
                      <TextInput
                        placeholder="Password"
                        secureTextEntry
                        onChangeText={onChange}
                        value={value}
                        style={styles.textInput}
                        placeholderTextColor={colors.black}
                      />
                    )}
                  />
                  {errors.password && (
                    <Text style={styles.errorText}>
                      {errors.password?.message}
                    </Text>
                  )}
                </View>
                <View style={styles.inputContainer}>
                  <Controller
                    name="confirmPass"
                    control={control}
                    rules={{
                      required: 'Confirm Password is required',
                      validate: value =>
                        value === control._formValues.password ||
                        'Passwords does not match',
                    }}
                    render={({field: {onChange, value}}) => (
                      <TextInput
                        placeholder="Confirm Password"
                        secureTextEntry
                        onChangeText={onChange}
                        value={value}
                        style={styles.textInput}
                        placeholderTextColor={colors.black}
                      />
                    )}
                  />
                  {errors.confirmPass && (
                    <Text style={styles.errorText}>
                      {errors.confirmPass?.message}
                    </Text>
                  )}
                </View>
                <View style={styles.inputContainer}>
                  <Controller
                    name="received_referral_code"
                    control={control}
                    rules={{required: false}}
                    render={({field: {onChange, value}}) => (
                      <TextInput
                        placeholder="Referral Code (Optional)"
                        onChangeText={onChange}
                        value={value}
                        style={styles.textInput}
                        placeholderTextColor={colors.black}
                      />
                    )}
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <Button
                    title="SIGN UP"
                    color={colors.secondary}
                    size="lg"
                    loading={isSubmitting}
                    titleStyle={styles.buttonTitle}
                    onPress={handleSubmit(onSubmit)}
                    containerStyle={styles.button}
                  />
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImg: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
  },
  heading: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: '600',
  },
  line: {
    backgroundColor: colors.primary,
    height: 3,
    width: 70,
    marginTop: 4,
  },
  subHeading: {
    color: colors.graytextColor,
    marginLeft: 20,
    fontWeight: '400',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputContainer: {
    width: '100%',
    marginVertical: 10,
  },
  textInput: {
    backgroundColor: colors.textFieldbg,
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 16,
    borderRadius: 50,
    color: colors.black,
  },
  errorText: {
    color: colors.red,
    marginLeft: 16,
  },
  sendOtpContainer: {
    marginVertical: 10,
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.textFieldbg,
    borderRadius: 50,
    paddingHorizontal: 12,
    width: '100%',
  },
  otpButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpButtonText: {
    color: colors.black,
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 12,
  },
  button: {
    width: '100%',
    borderRadius: 50,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '400',
  },
});
