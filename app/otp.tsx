import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Linking,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import Colors from '@constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaskInput from 'react-native-mask-input';
import {
    isClerkAPIResponseError,
    useSignIn,
    useSignUp,
} from '@clerk/clerk-expo';

const InternationalPhoneInput = [
    '+',
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
];

const otp = () => {
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const router = useRouter();
    const { bottom } = useSafeAreaInsets();
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 90 : 0;

    const { signUp, setActive } = useSignUp();
    const { signIn } = useSignIn();

    const openLink = () => {
        Linking.openURL('https://www.github.com/juliovillalvazo');
    };

    const sendOTP = async () => {
        setLoading(true);
        try {
            await signUp!.create({
                phoneNumber,
            });

            signUp!.preparePhoneNumberVerification();
            router.push(`/verify/${phoneNumber}`);
        } catch (err) {
            console.log(err);
            if (isClerkAPIResponseError(err)) {
                if (err.errors[0].code === 'form_identifier_exists') {
                    console.log('user already exists');
                    await trySignIn();
                } else {
                    setLoading(false);
                }
            }
        }
    };

    const trySignIn = async () => {
        const { supportedFirstFactors } = await signIn!.create({
            identifier: phoneNumber,
        });
        const firstPhoneFactor = supportedFirstFactors.find((factor) => {
            return factor.strategy === 'phone_code';
        }) as { phoneNumberId: string };

        const { phoneNumberId } = firstPhoneFactor;

        await signIn!.prepareFirstFactor({
            strategy: 'phone_code',
            phoneNumberId,
        });

        router.push(`/verify/${phoneNumber}?signin=true`);
        setLoading(false);
    };

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={keyboardVerticalOffset}
            style={styles.flex}
        >
            <View style={styles.container}>
                {loading ? (
                    <View style={styles.loading}>
                        <ActivityIndicator
                            size='large'
                            color={Colors.primary}
                        />
                        <Text style={styles.loadingText}>Sending Code...</Text>
                    </View>
                ) : null}
                <Text style={styles.description}>
                    WhatsApp will need to verify your account. Carrier charges
                    may apply.
                </Text>
                <View style={styles.list}>
                    <View style={styles.listItem}>
                        <Text style={styles.listItemText}>Mexico</Text>
                        <Ionicons
                            name='chevron-forward'
                            size={20}
                            color={Colors.gray}
                        />
                    </View>
                    <View style={styles.separator} />
                    <MaskInput
                        style={styles.input}
                        value={phoneNumber}
                        autoFocus
                        placeholder='+52 XXX XXX XXXX'
                        keyboardType='numeric'
                        onChangeText={(masked) => {
                            setPhoneNumber(masked);
                        }}
                        mask={InternationalPhoneInput}
                    />
                </View>
                <Text style={styles.legal}>
                    You must be{'\n'}
                    <Text style={styles.link} onPress={openLink}>
                        at least 16 years old
                    </Text>{' '}
                    to register. Learn how WhatsApp works with the{' '}
                    <Text style={styles.link} onPress={openLink}>
                        Meta Companies
                    </Text>
                    .
                </Text>
                <View style={{ flex: 1 }} />

                <TouchableOpacity
                    style={[
                        styles.button,
                        phoneNumber !== '' ? styles.enabled : null,
                        { marginBottom: bottom },
                    ]}
                    onPress={sendOTP}
                    disabled={phoneNumber === ''}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            phoneNumber !== '' ? styles.enabled : null,
                        ]}
                    >
                        Next
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    loadingText: {
        fontSize: 18,
        padding: 10,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.background,
        gap: 20,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 80,
        color: Colors.gray,
    },
    list: {
        backgroundColor: '#fff',
        width: '100%',
        borderRadius: 10,
        padding: 10,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 6,
        marginBottom: 10,
    },
    listItemText: {
        fontSize: 18,
        color: Colors.primary,
    },
    separator: {
        width: '100%',
        height: StyleSheet.hairlineWidth,
        backgroundColor: Colors.gray,
        opacity: 0.3,
    },
    legal: {
        fontSize: 12,
        textAlign: 'center',
        color: '#000',
    },
    link: {
        color: Colors.primary,
    },
    button: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: Colors.lightGray,
        padding: 10,
        borderRadius: 10,
    },
    enabled: {
        backgroundColor: Colors.primary,
        color: '#fff',
    },
    buttonText: {
        color: Colors.gray,
        fontSize: 22,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#fff',
        width: '100%',
        fontSize: 16,
        padding: 6,
        marginTop: 10,
    },
    loading: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default otp;
